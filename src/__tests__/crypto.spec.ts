import { describe, it, expect } from 'vitest'
import { generateSalt, derivateMasterPassword, derivateMKey, encryptData, decryptData } from '../services/crypto'; 
import { INFO_ENCRYPT } from '@/constants';

describe('generateSalt', () => {
    it('should generate a salt of the correct length', () => {
        const salt = generateSalt();
        console.log("El salt es: " + salt);
        expect(salt).toBeInstanceOf(Uint8Array);
        expect(salt.length).toBe(16);
    });
});

describe('derivateMasterPassword', () => {
    it('Debe derivar una clave maestra a partir de una contraseña y un salt', async () => {
        const password = 'testpassword';
        const salt = generateSalt();
        const iterations = 100000;
        console.log("El salt es: " + salt);
        const masterKey = await derivateMasterPassword(password, salt, iterations);
        expect(masterKey).toBeInstanceOf(CryptoKey);
    });
});

describe('derivateMKey', () => {
    it('Debe derivar una clave de cifrado a partir de la clave maestra', async () => {
        const password = 'testpassword';
        const salt = generateSalt();
        const iterations = 100000;
        const masterKey = await derivateMasterPassword(password, salt, iterations);
        const encKey = await derivateMKey(masterKey, 'encryption');
        expect(encKey).toBeInstanceOf(CryptoKey);
    });
});

describe('encryptData and decryptData', () => {
    it('Tiene que cifrar y descifrar datos', async () => {
        const password = 'testeo';
        const salt = generateSalt();
        const iterations = 100000;
        const masterKey = await derivateMasterPassword(password, salt, iterations);
        const encKey = await derivateMKey(masterKey, INFO_ENCRYPT);

        const data = 'Datos ultra secretos!';
        const { cyphertext, iv } = await encryptData(data, encKey);
        console.log("El iv es: " + iv);
        console.log("El cyphertext es: " + cyphertext);
        
        const decryptedData = await decryptData(cyphertext, iv, encKey);
        expect(decryptedData).toBeInstanceOf(Uint8Array);
        expect(new TextDecoder().decode(cyphertext)).toBe('Datos ultra secretos!');
    });
}); 