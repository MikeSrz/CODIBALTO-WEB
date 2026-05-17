import { INFO_AUTH, INFO_ENCRYPT } from '../constants'
import { useAuthStore } from '../stores/auth'
import * as cryptoService from './cryptoService'
import axios from 'axios'

const authStore = useAuthStore();
export async function login(username: string, password: string) { //Aquí se despliega la lógica del login.
    const salt = await getSaltFromServer(username);
    const master = await cryptoService.derivateMasterPassword(password, salt)
    const encKey = await cryptoService.derivateMKey(master, INFO_ENCRYPT)
    const authKey = await cryptoService.derivateMKey(master, INFO_AUTH)
    //Generando hash para el challenge:
    const nonce = await getNonceFromServer(username);
    const hashAuth = await cryptoService.hashAuthKey(authKey, nonce); 
    const isAuth:boolean = await authenticate(hashAuth, username);
    if (isAuth) {
        console.log("Login con exito");
        await authStore.saveLoginState(encKey, authKey);
    } else {
        console.log("Login fallido");
    }
}
function authenticate(generatedAuthKey: ArrayBuffer, username: string, iterations: number = 100000): Promise<boolean>{ //con la authKey generada probaremos si la api nos confirma que es correct.
    //Mirar challenge algoritmo de autenticado. Intentar no enviar authKey directamente, sino un hash de esta o algo así.

    //1. Pedir Nonce al servidor
    //Hashear auth_key generado con el nonce y enviar el result al servidor.
    //El servidor hace lo mismo por su lado y compara los resultados
    //Si da true entonces es un auth exitoso.
    return axios.post('/api/authenticate', {authKey: generatedAuthKey, username: username, iterations: iterations})
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
async function getSaltFromServer(username: string): Promise<Uint8Array> { //Según el username introducido 
    return axios.get(`/api/getSalt?username=${username}`)
    .then( response => {
        const salt : Uint8Array = new Uint8Array(response.data.salt);
        return salt;
    })
    .catch( error => {
        console.error("Error al obtener el salt del servidor: ", error);
        throw error;
    });
}