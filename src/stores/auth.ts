import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as cryptoService from '../services/cryptoService'

import { INFO_AUTH, INFO_ENCRYPT } from '../constants'

export const useAuthStore = defineStore('auth', () => {
    //Estados de sesión.
    const isAuthenticated = ref(false)
    const encKey = ref<CryptoKey | null>(null)
    const authKey = ref<CryptoKey | null>(null) 
    function setAuthenticated(value: boolean) {
            isAuthenticated.value = value
        }

    function clearAuth() {
            encKey.value = null
            authKey.value = null
            isAuthenticated.value = false
        }
    //para actualizar estados POR SESION:
    async function saveLoginState(genEncKey: CryptoKey, genAuthKey: CryptoKey) {
        //A lo mejor cambio algo aquí.
       encKey.value = genEncKey;
       authKey.value = genAuthKey;
    }
    return { encKey, authKey, isAuthenticated, saveLoginState, setAuthenticated, clearAuth };
});