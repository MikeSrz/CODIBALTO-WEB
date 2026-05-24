import { describe, it, expect } from 'vitest'
import { generateSalt, derivateMasterPassword, derivateMKey, encryptData, decryptData, generateAuthKeyPair, signChallengeECDSA } from '../services/cryptoService'; 
import { encodeBase64 } from '../services/encodeService';
import { INFO_ENCRYPT } from '@/constants';
import type { EncryptedData } from '@/types';

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
    it('Debe derivar una clave de cifrado(enc_key) a partir de la clave maestra(Mkey)', async () => {
        const password = 'testpassword';
        const salt = generateSalt();
        const iterations = 100000;
        const masterKey = await derivateMasterPassword(password, salt, iterations);
        const encKey = await derivateMKey(masterKey, 'info');
        expect(encKey).toBeInstanceOf(CryptoKey);
    });
});

describe('encryptData and decryptData V1', () => {
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
        console.log("El tipado es: " + typeof(decryptedData));
        expect(decryptedData).toBeTypeOf('string');
        expect(decryptedData).toBe('Datos ultra secretos!');
    });
}); 

describe('Probando flujo de registro', () => {
    it('Tiene que comprobar firmas', async () => {
        const password : string = "caracola";
        //Obteniendo par de llaves pub, salt, enc key, priv cifrado. 
        const asymethricKeys : CryptoKeyPair = await generateAuthKeyPair();
        const salt : Uint8Array = generateSalt();
        const Mkey : CryptoKey = await derivateMasterPassword(password,salt);
        const encKey : CryptoKey = await derivateMKey(Mkey, INFO_ENCRYPT);
        
        //Fase de encriptacion de privKey:
        const encriptedPrivKey : EncryptedData = await encryptData(asymethricKeys.privateKey, encKey);
        console.log('IV : ' + encriptedPrivKey.iv )
        console.log('Llave privada: ' + asymethricKeys.privateKey + '\nLlave Pública: ' + asymethricKeys.publicKey);
        console.log('Llave cifrada: ' + encriptedPrivKey);
        
        //Formatos de salida POST por axios:
        const base64PrivKey =  await encodeBase64(encriptedPrivKey.cyphertext);
        const base64IV = await encodeBase64(encriptedPrivKey.iv)
        const base64PubKey = await encodeBase64(asymethricKeys.publicKey);
        const base64Salt = await encodeBase64(salt);

        console.log('LLave Priv en base 64: ' + base64PrivKey + '\n' + 'Llave Pub en base 64: ' + base64PubKey + '\nIv Base 64: ' + base64IV + '\nSalt en base 64: ' + base64Salt);

    });
}); 