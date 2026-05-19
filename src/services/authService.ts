import { INFO_AUTH, INFO_ENCRYPT } from '../constants'
import { useAuthStore } from '../stores/auth'
import * as cryptoService from './cryptoService'
import * as encodeService from './encodeService'
import axios from 'axios'


const authStore = useAuthStore();

export async function login(username: string, password: string) { //Aquí se despliega la lógica del login.
    //parametros necesarios para challenge
    const [salt, nonce] = await Promise.all([
        getSaltFromServer(username),
        getNonceFromServer(username)
    ]);
    
    const master = await cryptoService.derivateMasterPassword(password, salt)
    const encKey = await cryptoService.derivateMKey(master, INFO_ENCRYPT)
    const authKey = await cryptoService.derivateMKey(master, INFO_AUTH)

    //Generando hash para el challenge:
    const challengeResponse = await cryptoService.signChallenge(authKey, nonce); 
    const isAuth:boolean = await challenge(challengeResponse, username);
    if (isAuth) {
        console.log("Login con exito");
        await authStore.saveLoginState(encKey, authKey);
    } else {
        console.log("Login fallido");
    }
}
function challenge(challengeRes: ArrayBuffer, username: string): Promise<boolean>{ //con la authKey generada probaremos si la api nos confirma que es correct.
    const base64ChallengeRes = encodeService.encodeBase64(challengeRes) //pasando a base64
    return axios.post('/auth/salt', {authKey: base64ChallengeRes, username: username})
    .then( response => {    
        if(response.data.authenticated) {
            console.log("Autenticación exitosa");
            authStore.setAuthenticated(true);
            return true;
        } else {
            console.log("Autenticación fallida");
            authStore.setAuthenticated(false);
            return false;
        }
    })
}

async function getNonceFromServer(username: string): Promise<Uint8Array> {
    return axios.get(`/api/getNonce?username=${username}`)
    .then( response => {
        const nonce : Uint8Array = new Uint8Array(response.data.nonce);
        return nonce;
    }).catch( error => { 
        console.error("Error al obtener el nonce del servidor: ", error);
        throw error;
    });
}
function getSaltFromServer(username: string): Promise<Uint8Array> { //Según el username introducido 
    return axios.get(`/api/salt/${username}`)
    .then( response => {
        const salt : Uint8Array = new Uint8Array(response.data.salt);
        return salt;
    })
    .catch( error => {
        console.error("Error al obtener el salt del servidor: ", error);
        throw error;
    });
}