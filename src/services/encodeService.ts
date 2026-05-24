//funcion para codificar en base64 claves generadas.
export async function encodeBase64(buffer: ArrayBuffer | Uint8Array | CryptoKey): Promise<string> {
    let bytes: Uint8Array;

    if (buffer instanceof CryptoKey) {
        const format = KEY_TYPES[buffer.type as keyof typeof KEY_TYPES]; //usamos el tipo de la llave que ha entrado como clave de nuestro objeto constante. 
        const exported = await crypto.subtle.exportKey(format, buffer);
        bytes = new Uint8Array(exported as ArrayBuffer);
    } else {
        bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    }

    const binary = Array.from(bytes)
        .map(byte => String.fromCharCode(byte))
        .join('');
        
    return btoa(binary);
}


export function decodeBase64ToUintArray(data: string,bits:number = 8) {
    //de momento para arrays de bytes.
    const bString = atob(data);
    const uint8Array = new Uint8Array(bString.length); //Le emtemos un buffer del tamaño del binario anterior
    for (let i = 0; i < bString.length; i++) {
        uint8Array[i] = bString.charCodeAt(i);
    }
    return uint8Array;
}