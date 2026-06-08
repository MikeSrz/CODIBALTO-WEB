import { INFO_AUTH, INFO_ENCRYPT } from '../constants'
import type {EncryptedData} from '../types'
import { useAuthStore } from '../stores/auth'
import * as cryptoService from './cryptoService'
import * as encodeService from './encodeService'
import apis from '@/services/api'

const ENDPOINT_API_USER_DATA = 'auth/user-data/'
const ENDPOINT_API_CHALLENGE = 'auth/challenge/'
const ENDPOINT_API_KEYRECORD = 'auth/key-records/'
const ENDPOINT_API_STORE     = 'auth/register-user/'

export async function quickAuth(password: string): Promise<boolean> {
    try {
        const authStore = useAuthStore()
        const salt = authStore.salt
        const Mkey: CryptoKey = await cryptoService.derivateMasterPassword(password, salt as Uint8Array);
        const encKey: CryptoKey = await cryptoService.derivateMKey(Mkey, INFO_ENCRYPT);

        const keyRecord = await getKeyRecord(authStore.user.username);
        await cryptoService.decryptData(keyRecord.cypherprivk, keyRecord.iv, encKey);
        return true; 
    } catch {
        return false;
    }
}

export async function register(username: string, email: string, password: string, nombre: string, apellido: string) {
    const salt : Uint8Array= cryptoService.generateSalt();
    const salt_card :  Uint8Array = cryptoService.generateSalt();
    
    //derivando claves 
    const Mkey : CryptoKey= await cryptoService.derivateMasterPassword(password, salt);
    //const mKeyCard : CryptoKey = await cryptoService.derivateMasterPassword(password, salt_card);

    const encKey : CryptoKey = await cryptoService.derivateMKey(Mkey, INFO_ENCRYPT);
    //const encKeyCard : CryptoKey = await cryptoService.derivateMKey(mKeyCard, INFO_ENCRYPT); esto debo hacerlo cuando quiera encriptar un PassCard

    //obteniendo llave privada y publica
    const ECDSAkeys : CryptoKeyPair = await cryptoService.generateAuthKeyPair();
    const pubKey = await crypto.subtle.exportKey("spki", ECDSAkeys.publicKey)
    
    const cypherData : EncryptedData = await cryptoService.encryptData(ECDSAkeys.privateKey, encKey);
    await storeUser(salt, salt_card, pubKey, cypherData, email, username, nombre, apellido)

}

export async function login(username: string | null, mail: string | null, password: string) { //Aquí se despliega la lógica del login.
    const authStore = useAuthStore()
    //Obteniendo llaves y guardando datos en el store
    const keyRecord = await getKeyRecord(username, mail);
    
    //derivando contraseña para obtener llave de encriptacion
    const master = await cryptoService.derivateMasterPassword(password, keyRecord.salt)
    const encKey = await cryptoService.derivateMKey(master, INFO_ENCRYPT)
    
    //guardando en el store salts
    authStore.setSalt(keyRecord.salt)
    authStore.setSaltCard(keyRecord.salt_card)
    //const authKey = await cryptoService.derivateMKey(master, INFO_AUTH) Ya no es necesario
    
    //descifrnado clave privada:
    const privKeyBuffer :ArrayBuffer = await cryptoService.decryptData(keyRecord.cypherprivk, keyRecord.iv, encKey);
    const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        privKeyBuffer,
        {
            name: "ECDSA",
             namedCurve: "P-256"
        },
        true,
        ["sign"]
    )
    //Generando hash para el challenge:
    const challengeResponse = await cryptoService.signChallengeECDSA(privateKey, keyRecord.nonce); 
    const isAuth :boolean = await challenge(challengeResponse, username, mail);

    if (isAuth) {
        const userData = await getUserData()
        authStore.setUserData(userData)
        //await authStore.saveLoginState(encKey, authKey); Esto ya veré como funciona...
    } else {
        throw new Error('Credenciales incorrectas')
    }
}

/*
Ya no lo uso
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
export async function getUserData() {
    return apis.api.post(`${ENDPOINT_API_USER_DATA}`)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.error("[ERROR] no se pudo obtener datos del usuario")
            throw error
        })
}
async function challenge(challengeRes: ArrayBuffer, username:string | null , email: string | null): Promise<boolean>{ //con la firma generada probaremos si la api nos confirma que es correct.
    const authStore = useAuthStore() //pinia
    const base64ChallengeRes = await encodeService.encodeBase64(challengeRes) //pasando a base64
    return apis.publicApi.post(`${ENDPOINT_API_CHALLENGE}`, {signed_nonce: base64ChallengeRes, username: username, email: email})
    .then( response => {
        const token = response.data.access_token
        if(token) {
            authStore.setToken(token)
            return true;
        } else {
            return false;
        }
    })
    .catch((error) => {
        authStore.setAuthenticated(false)
        throw error
    })
}

async function storeUser(pass_salt: Uint8Array,card_salt: Uint8Array, pubKey: ArrayBuffer, cypherData: EncryptedData, mail:string, usr: string, nom: string, apell: string) {
    const encoded_salt      = await encodeService.encodeBase64(pass_salt);
    const encoded_card_salt = await encodeService.encodeBase64(card_salt);
    const encoded_pubKey    = await encodeService.encodeBase64(pubKey);
    const encoded_iv        = await encodeService.encodeBase64(cypherData.iv);
    const encoded_cypherKey = await encodeService.encodeBase64(cypherData.cyphertext);
    console.log("hola")
    await apis.publicApi.post(`${ENDPOINT_API_STORE}`, {
        security: {
            salt:      encoded_salt,
            salt_card: encoded_card_salt,
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
    }).then(()=>{
        return true
    }).catch(error =>{
        console.error("[ERROR]")
        throw error
    });
}

async function getKeyRecord(username:string | null, mail:string | null = null ) { //Te descodifica tambien los datos y te da sus bytes
    return apis.publicApi.post(`${ENDPOINT_API_KEYRECORD}`, { username: username, email: mail })
        .then(({ data }) => ({
            salt:        encodeService.decodeBase64ToUintArray(data.salt),
            cypherprivk: encodeService.decodeBase64ToUintArray(data.cypherprivk),
            iv:          encodeService.decodeBase64ToUintArray(data.iv),
            nonce:       encodeService.decodeBase64ToUintArray(data.nonce),
            salt_card:    encodeService.decodeBase64ToUintArray(data.salt_card)
        }))
        .catch(error => {
            console.error("Error al obtener el keyRecord del servidor: ", error)
            throw error
        })
}