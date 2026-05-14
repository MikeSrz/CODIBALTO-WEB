import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as cryptoService from '../services/crypto'

import { INFO_AUTH, INFO_ENCRYPT } from '../constants'

export const useAuthStore = defineStore('auth', () => {
    //Estados de sesión.
    const isAuthenticated = ref(false)
    const encKey = ref<CryptoKey | null>(null)
    const authKey = ref<CryptoKey | null>(null) 
    
    //para actualizar estados POR SESION:
    async function login(password: string, salt: Uint8Array, iterations: number) {
        //A lo mejor cambio algo aquí.
        const master = await cryptoService.derivateMasterPassword(password, salt, iterations)
        encKey.value = await cryptoService.derivateMKey(master, INFO_ENCRYPT)
        authKey.value = await cryptoService.derivateMKey(master, INFO_AUTH)
            
        isAuthenticated.value = true

    function clearAuth() {
        encKey.value = null
        authKey.value = null
        isAuthenticated.value = false
    }
    return { encKey, authKey, isAuthenticated, clearAuth };
});