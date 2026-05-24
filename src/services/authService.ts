import { INFO_AUTH, INFO_ENCRYPT } from '../constants'
import type {EncryptedData} from '../types'
import { useAuthStore } from '../stores/auth'
import * as cryptoService from './cryptoService'
import * as encodeService from './encodeService'
import axios from 'axios'


export async function register(username: string, email: string, password: string) {
    const salt : Uint8Array= cryptoService.generateSalt();
    const Mkey : CryptoKey= await cryptoService.derivateMasterPassword(password, salt);
    const encKey : CryptoKey = await cryptoService.derivateMKey(Mkey, INFO_ENCRYPT);
    const ECDSAkeys : CryptoKeyPair = await cryptoService.generateAuthKeyPair();
    const cypherData : EncryptedData = await cryptoService.encryptData(ECDSAkeys.privateKey, encKey);
    await storeSecrets(salt, ECDSAkeys.publicKey, cypherData, email, username)
}
export async function login(username: string, password: string) { //Aquí se despliega la lógica del login.
    //pinia
    //queda oor construir ~
    const keyRecord = await getKeyRecord(username);
    const master = await cryptoService.derivateMasterPassword(password, keyRecord.salt)
    const encKey = await cryptoService.derivateMKey(master, INFO_ENCRYPT)
    //const authKey = await cryptoService.derivateMKey(master, INFO_AUTH) Ya no es necesario
    //Descifrnado clave privada:
    const privKeyBuffer :ArrayBuffer = await cryptoService.decryptData(keyRecord.cypherprivk, keyRecord.iv, encKey);
    const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        privKeyBuffer,
        {
            name: "ECDH",
             namedCurve: "P-256"
        },
        true,
        ["sign"]
    )
    //Generando hash para el challenge:
    const challengeResponse = await cryptoService.signChallengeECDSA(privateKey, keyRecord.nonce); 
    const isAuth :boolean = await challenge(challengeResponse, username);
    
    if (isAuth) {
        console.log("Login con exito");
        //await authStore.saveLoginState(encKey, authKey); Esto ya veré como funciona...
    } else {
        console.log("Login fallido");
    }
}
async function challenge(challengeRes: ArrayBuffer, username: string): Promise<boolean>{ //con la firma generada probaremos si la api nos confirma que es correct.
    const authStore = useAuthStore() //pinia
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

/*
Ya no se usa
 getNonceFromServer(username: string): Promise<Uint8Array> {
    return axios.get(`/api/getNonce?username=${username}`)
    .then( response => {
        const nonce : Uint8Array = new Uint8Array(response.data.nonce);
        return nonce;
    }).catch( error => { 
        console.error("Error al obtener el nonce del servidor: ", error);
        throw error;
    });
}
*/
async function storeSecrets(pass_salt: Uint8Array, pubKey: CryptoKey, cypherData: EncryptedData, mail:string, usr: string) {
    const encoded_salt      = await encodeService.encodeBase64(pass_salt);
    const encoded_pubKey    = await encodeService.encodeBase64(pubKey);
    const encoded_iv        = await encodeService.encodeBase64(cypherData.iv);
    const encoded_cypherKey = await encodeService.encodeBase64(cypherData.cyphertext);

    await axios.post('/api/register', {
        salt:      encoded_salt,
        publicKey: encoded_pubKey,
        iv:        encoded_iv,
        cypherKey: encoded_cypherKey,
        email: mail,
        username: usr,
    });
}

async function getKeyRecord(username: string) { //obtenesmo todo lo necesario para autenticarnos: nonce(Para challenge), salt, cypherprivk, iv, pubkey
    return axios.get(`/api/keyRecord/${username}`)
        .then(({ data }) => ({
            salt:        encodeService.decodeBase64ToUintArray(data.salt),
            nonce:       encodeService.decodeBase64ToUintArray(data.nonce),
            cypherprivk: encodeService.decodeBase64ToUintArray(data.cypherprivk),
            iv:          encodeService.decodeBase64ToUintArray(data.iv),
            pubkey:      encodeService.decodeBase64ToUintArray(data.pubkey),
        }))
        .catch(error => {
            console.error("Error al obtener el keyRecord del servidor: ", error);
            throw error;
        })
}