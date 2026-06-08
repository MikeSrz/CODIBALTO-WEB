import type {PassCard, UserData} from "@/types";
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { INFO_AUTH, INFO_ENCRYPT } from '../constants'

export const useAuthStore = defineStore('auth', () => {
    //Estados de sesión.
    const isAuthenticated = ref(false)
    const token = ref<string | null>(null) 
    const salt = ref<Uint8Array | null>(null)
    const saltCard = ref<Uint8Array | null>(null)
    const user = ref<UserData>({
        username : null as string | null,
        email: null as string | null,
        nombre: null as string | null,
        apellido: null as string | null,
        passCards: [] as PassCard[]
    });

    function setAuthenticated(value: boolean) {
            isAuthenticated.value = value
        }
    function setToken(newToken: string) {
        token.value = newToken
        sessionStorage.setItem('token', newToken)
        isAuthenticated.value = true
    }
    function setUserData(data: Partial<UserData>) {
        if (data.username) user.value.username = data.username
        if (data.email)     user.value.email = data.email
        if (data.nombre)   user.value.nombre = data.nombre
        if (data.apellido) user.value.apellido = data.apellido
        if (data.passCards) user.value.passCards = data.passCards
    }

    function setSalt(newSalt: Uint8Array) {
        salt.value = newSalt
    }
    function setSaltCard(newSaltCard: Uint8Array) {
        saltCard.value = newSaltCard
    }
    function clearAuth() {
            token.value = null
            isAuthenticated.value = false
        }
    //para actualizar estados POR SESION:
    return { token, isAuthenticated, user, salt, saltCard, setSalt, setSaltCard, setUserData, setToken, setAuthenticated, clearAuth };
});