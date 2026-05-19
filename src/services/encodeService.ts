//funcion para codificar en base64 claves generadas.
export function encodeBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const binary = Array.from(bytes)
        .map(byte => String.fromCharCode(byte))
        .join('');
        
    return btoa(binary);
}