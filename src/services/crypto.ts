import { INFO_AUTH, INFO_ENCRYPT } from "../constants";
/*
 Este servicio se encarga de manejar operaciones criptográficas.
    - Generar sal aleatoria
    - Derivar Contraseña a MasterKey usando PBKDF2
    - Derivar MasterKey a Clave de cifrado EncKey usando HKDF
    - Derivar MasterKey a Clave de autenticación AuthKey usando HKDF
    - Cifrar y Descifrar datos usando AES-GCM
*/


export function generateSalt(length: number = 16): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
}

export async function derivateMasterPassword(password: string, salt: Uint8Array, iterations: number) : Promise<CryptoKey> { // esta función deriva la contraseña maestra usando PBKDF2
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
        ['deriveKey']
    )
    return masterKey;
}

export async function derivateMKey(masterKey: CryptoKey, info: string): Promise<CryptoKey> { // esta función deriva una clave de cifrado a partir de la clave maestra usando HKDF2
    const infoCoded = new TextEncoder().encode(info);
    const key = await crypto.subtle.deriveBits(
         {
            name: 'HKDF',
            hash: 'SHA-256',
            info: infoCoded as BufferSource,
         },
            masterKey,
    );
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


export async function encryptData(data: string ) {
    return 0;
}
