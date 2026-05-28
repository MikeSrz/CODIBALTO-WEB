import { INFO_AUTH, INFO_ENCRYPT } from '../constants'
import type {EncryptedData} from '../types'
import { useAuthStore } from '../stores/auth'
import * as cryptoService from './cryptoService'
import * as encodeService from './encodeService'
import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL 
const ENDPOINT_API_CHALLENGE = `${BASE_URL}/api/auth/challenge/`; 
const ENDPOINT_API_KEYRECORD = `${BASE_URL}/api/auth/keyrecords/`
const ENDPOINT_API_STORE = `${BASE_URL}/api/auth/register-user/` 

export async function register(username: string, email: string, password: string, nombre: string, apellido: string) {
    const salt : Uint8Array= cryptoService.generateSalt();
    const Mkey : CryptoKey= await cryptoService.derivateMasterPassword(password, salt);
    const encKey : CryptoKey = await cryptoService.derivateMKey(Mkey, INFO_ENCRYPT);
    const ECDSAkeys : CryptoKeyPair = await cryptoService.generateAuthKeyPair();
    const pubKey = await crypto.subtle.exportKey("spki", ECDSAkeys.publicKey)
    const cypherData : EncryptedData = await cryptoService.encryptData(ECDSAkeys.privateKey, encKey);
    await storeUser(salt, pubKey, cypherData, email, username,nombre, apellido)
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
/////////////////////////////////////////////////
///             LLAMADAS a API              /////
/////////////////////////////////////////////////


async function challenge(challengeRes: ArrayBuffer, email: string): Promise<boolean>{ //con la firma generada probaremos si la api nos confirma que es correct.
    const authStore = useAuthStore() //pinia
    const base64ChallengeRes = encodeService.encodeBase64(challengeRes) //pasando a base64
    return axios.post(`${ENDPOINT_API_CHALLENGE}`, {signed_nonce: base64ChallengeRes, email: email})
    .then( response => {
        const token = response.data.access_token
        if(token) {
            authStore.setToken(token)
            console.log("Autenticación exitosa");
            return true;
        } else {
            console.log("Autenticación fallida");
            return false;
        }
    })
    .catch(() => {
        authStore.setAuthenticated(false)
        return false
    })
}

async function storeUser(pass_salt: Uint8Array, pubKey: ArrayBuffer, cypherData: EncryptedData, mail:string, usr: string, nom: string, apell: string) {
    const encoded_salt      = await encodeService.encodeBase64(pass_salt);
    const encoded_pubKey    = await encodeService.encodeBase64(pubKey);
    const encoded_iv        = await encodeService.encodeBase64(cypherData.iv);
    const encoded_cypherKey = await encodeService.encodeBase64(cypherData.cyphertext);

    await axios.post(`${ENDPOINT_API_STORE}`, {
        security: {
            salt:      encoded_salt,
            public_key: encoded_pubKey,
            iv:        encoded_iv,
            cypher_key: encoded_cypherKey,
        },
        user: {
            email: mail,
            username: usr,
            nombre: nom,
            apellido: apell
        }
    });
}

async function getKeyRecord(username: string) { //obtenesmo todo lo necesario para autenticarnos: nonce(Para challenge), salt, cypherprivk, iv, pubkey
    return axios.get(`${ENDPOINT_API_KEYRECORD}${username}`)
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