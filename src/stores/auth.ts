import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { INFO_AUTH, INFO_ENCRYPT } from '../constants'

export const useAuthStore = defineStore('auth', () => {
    //Estados de sesión.
    const isAuthenticated = ref(false)
    const encKey = ref<CryptoKey | null>(null)
    const token = ref<string | null>(null) 
    function setAuthenticated(value: boolean) {
            isAuthenticated.value = value
        }
    function setToken(newToken: string) {
        token.value = newToken
        sessionStorage.setItem('token', newToken)
        isAuthenticated.value = true
    }
    function setEncKey(newEncKey: CryptoKey) {
        encKey.value = newEncKey
    }
    function clearAuth() {
            encKey.value = null
            token.value = null
            isAuthenticated.value = false
        }
    //para actualizar estados POR SESION:
    return { encKey, token, isAuthenticated,setEncKey, setToken, setAuthenticated, clearAuth };
});