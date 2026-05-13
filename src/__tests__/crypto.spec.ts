import { describe, it, expect } from 'vitest'
import { generateSalt } from '../services/crypto'; 

describe('generateSalt', () => {
    it('should generate a salt of the correct length', () => {
        const salt = generateSalt();
        console.log(salt);
        expect(salt).toBeInstanceOf(Uint8Array);
        expect(salt.length).toBe(16);
    });
});