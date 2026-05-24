import { INFO_AUTH, INFO_ENCRYPT } from "../constants";
import type { EncryptedData } from "@/types";
/*
 Este servicio se encarga de manejar operaciones criptográficas con Web Crypto API.
    - Generar sal aleatoria ~Listo
    - Derivar Contraseña a MasterKey usando PBKDF2 ~Listo
    - Derivar MasterKey a Clave de cifrado `EncKey` usando HKDF ~Listo
    - Derivar MasterKey a Clave de autenticación `AuthKey` usando HKDF ~Listo
    - Cifrar y Descifrar datos usando AES-GCM ~Pendiente ~Listo
*/


export function generateSalt(length: number = 16): Uint8Array { //Se genera un salt por usuario, en cada registro.
    return crypto.getRandomValues(new Uint8Array(length));
}

export async function derivateMasterPassword(password: string, salt: Uint8Array, iterations: number = 600000) : Promise<CryptoKey> { // esta función deriva la contraseña maestra usando PBKDF2
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    const baseKey = await crypto.subtle.importKey(
        'raw',
        passwordBytes,
        'PBKDF2',
        false,
        ['deriveBits']
    ); // hemos importado la contraseña para obtenerla en formato CryptoKey
    const masterKeyArray = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt as BufferSource,
            iterations: iterations,
            hash: 'SHA-256'
        },
        baseKey,
        256
        );

    const masterKey = await crypto.subtle.importKey(
        'raw',
        masterKeyArray,
        'HKDF',
        false,
        ['deriveKey', 'deriveBits']
    )
    return masterKey;
}

export async function derivateMKey(masterKey: CryptoKey, info: string): Promise<CryptoKey> { // esta función deriva una clave de cifrado o un auth_hash a partir de la clave maestra usando HKDF2
    const infoCoded = new TextEncoder().encode(info);
    const key = await crypto.subtle.deriveBits(
         {
            name: 'HKDF',
            hash: 'SHA-256',
            salt: new Uint8Array(32), //ya tiene suficiente entropia en este punto. salt de ceros y ya. 
            info: infoCoded as BufferSource,
         },
            masterKey,
            256
    );
    //controlamos segun el parámetro que se le pase si se trata de la clave de cifrado o de la clave de autenticación, para importarla con el algoritmo correcto
    let keyResult : CryptoKey;
    switch(info) {
        case INFO_ENCRYPT:
            keyResult = await crypto.subtle.importKey(
                'raw',
                key,
                'AES-GCM',
                false,
                ['encrypt', 'decrypt']
            );
            break;
        case INFO_AUTH: //llegué a la conclusión de que no me haría falta por un cambio en el algoritmo... Pero dejaré su código.
            keyResult = await crypto.subtle.importKey(
                'raw',
                key,
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign', 'verify']
            );
            break;
        default:
            throw new Error('Invalid info parameter');

    }
    return keyResult;
}




export async function encryptData(data: string | CryptoKey , encKey: CryptoKey) : Promise<EncryptedData> { //retorna un objetco con el texto cifrado y el IV utilizado para el cifrado. Iv es vital para descrifrado.
    const encoder = new TextEncoder();
    const dataBytes = (typeof data == "string") ? encoder.encode(data.toString()) : await crypto.subtle.exportKey("pkcs8", data) ;
    const iv : Uint8Array = crypto.getRandomValues(new Uint8Array(12)); //AES-GCM recomienda un iv de 12 bytes

    const cypherData = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv.buffer as ArrayBuffer
        },
        encKey,
        dataBytes as ArrayBuffer
    );
   
    return {cyphertext: cypherData, iv: iv};
}



export async function decryptData(cyphertext: Uint8Array, iv: Uint8Array, encKey: CryptoKey) : Promise<ArrayBuffer> { // esta función descifra los datos cifrados usando AES-GCM y el IV utilizado para el cifrado
    // Mejor lo hago fuera si lo necesito. const decoder = new TextDecoder(); //Para decodificar el resultado.
    const decryptedBytes = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv.buffer as ArrayBuffer
        },
        encKey,
        cyphertext.buffer as ArrayBuffer
    );
    return decryptedBytes;
}

export async function signChallengeECDSA(privateKey: CryptoKey, nonce: Uint8Array): Promise<ArrayBuffer> { //firma del nonce con nuestra clave privada descifrada
    return await crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" }
        },
        privateKey,
        nonce as BufferSource
    );
}

//CryptoKeyPair es un diccionario de CryptoKey primero es public y el segundo
export async function generateAuthKeyPair(): Promise<CryptoKeyPair> {
    return await crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256" 
        },
        true, //Debe ser extraíble(true) para poder exportarla y cifrarla
        ["sign", "verify"]
    );
}