import { INFO_AUTH, INFO_ENCRYPT } from "../constants";
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

export async function derivateMasterPassword(password: string, salt: Uint8Array, iterations: number = 100000) : Promise<CryptoKey> { // esta función deriva la contraseña maestra usando PBKDF2
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
        case INFO_AUTH:
            keyResult = await crypto.subtle.importKey(
                'raw',
                key,
                'HMAC',
                false,
                ['sign', 'verify']
            );
            break;
        default:
            throw new Error('Invalid info parameter');

    }
    return keyResult;
}




export async function encryptData(data: string, encKey: CryptoKey) : Promise<{cyphertext: ArrayBuffer, iv: Uint8Array}> { //retorna un objetco con el texto cifrado y el IV utilizado para el cifrado. Iv es vital para descrifrado.
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const iv : Uint8Array = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM recomienda un IV de 12 bytes

    const cyphertext = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv.buffer as ArrayBuffer
        },
        encKey,
        dataBytes
    );
   
    return {cyphertext: cyphertext, iv: iv};
}


export async function decryptData(cyphertext: ArrayBuffer, iv: Uint8Array, encKey: CryptoKey) : Promise<string> { // esta función descifra los datos cifrados usando AES-GCM y el IV utilizado para el cifrado
    const decoder = new TextDecoder(); //Para decodificar el resultado.
    const decryptedBytes = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv.buffer as ArrayBuffer
        },
        encKey,
        cyphertext
    );
    return decoder.decode(decryptedBytes);
}