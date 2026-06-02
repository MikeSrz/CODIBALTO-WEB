import type {EncryptedData, PassCard, NewPassCard, UserData} from '../types'
import { useAuthStore} from "@/stores/auth";
import {getUserData} from '@/services/authService'
import {encodeBase64} from '@/services/encodeService'
import api from '@/services/api'
import { encryptData, decryptData} from "@/services/cryptoService";


const BASE_URL = import.meta.env.VITE_API_URL
const API_STORE_CARD = `${BASE_URL}/api/card/store/`;

export async function storeCard(newData: NewPassCard) { //Encriptar password e email y almacenar. => necesito tener la encKey
    const auth = useAuthStore()
    if (!auth.encKey) {
        console.error("No hay clave de cifrado")
        return
    }
    const encryptedPassword: EncryptedData =   await encryptData(newData.password, auth.encKey)
    const encryptedEmail: EncryptedData  = await encryptData(newData.email_card, auth.encKey)
    const payload = {
        domain: newData.domain,
        email_card: await encodeBase64(encryptedEmail.cyphertext),
        cipher_password: await encodeBase64(encryptedPassword.cyphertext),
        notes: newData.notes,
        iv_ps: await encodeBase64(encryptedPassword.iv),
        iv_em: await encodeBase64(encryptedEmail.iv)
    }
    api.post(API_STORE_CARD, payload)
    .then(async (response) => {
            const userData = await getUserData()
            auth.setUserData(userData)
            return response.data
        }
    ).catch(
        () => {
            console.log("[ERROR] No se pudo guardar correctamente")
        }
    );
}

export async function modifyCard(newData: NewPassCard) {

}

export async function deleteCard(cardId: number) {
    
}

export type { PassCard }