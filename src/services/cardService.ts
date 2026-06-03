import {INFO_ENCRYPT} from "@/constants";
import type {EncryptedData, PassCard, NewPassCard, UserData} from '../types'
import { useAuthStore} from "@/stores/auth";
import {getUserData} from '@/services/authService'
import {encodeBase64, decodeBase64ToUintArray} from '@/services/encodeService'
import api from '@/services/api'
import { encryptData, decryptData, derivateMasterPassword, derivateMKey} from "@/services/cryptoService";


const BASE_URL = import.meta.env.VITE_API_URL
const API_STORE_CARD = `${BASE_URL}/api/card/store/`;

export async function storeCard(newData: NewPassCard, masterPassword: string) { //Encriptar password e email y almacenar. => necesito tener la encKey
    const auth = useAuthStore()
    const encKeyCard: CryptoKey = await generateEncKeyCard(masterPassword);
    if (!encKeyCard) {
        console.error("No hay clave de cifrado")
        return
    }
    const encryptedData: EncryptedData =   await encryptData(newData.password, encKeyCard)
    const encryptedDataEmail: EncryptedData  = await encryptData(newData.email_card, encKeyCard)
    const payload = {
        domain: newData.domain,
        email_card: await encodeBase64(encryptedDataEmail.cyphertext),
        cipher_password: await encodeBase64(encryptedData.cyphertext),
        notes: newData.notes,
        iv_ps: await encodeBase64(encryptedData.iv),
        iv_em: await encodeBase64(encryptedDataEmail.iv)
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
export async function decryptCard(iv_ps:string , iv_em: string, ciph_mail:string, ciph_password:string, masterPassword: string){
    const decoder = new TextDecoder();
    const encKeyCard: CryptoKey = await generateEncKeyCard(masterPassword);
    const ciph_ps = decodeBase64ToUintArray(ciph_password)
    const ciph_email = decodeBase64ToUintArray(ciph_mail)
    const iv_pass = decodeBase64ToUintArray(iv_ps)
    const iv_email = decodeBase64ToUintArray(iv_em)

    const decryptedPasswordBytes = await decryptData(ciph_ps, iv_pass, encKeyCard)
    const decryptedMailBytes = await decryptData(ciph_email, iv_email, encKeyCard)

    const decryptedPassword = decoder.decode(decryptedPasswordBytes);
    const decryptedMail = decoder.decode(decryptedMailBytes);
    return {
        password: decryptedPassword,
        email: decryptedMail
    }
}

async function generateEncKeyCard(password: string){
    const auth = useAuthStore();
    const saltCard = auth.saltCard;
    console.log(auth.saltCard);
    //obtenemos la enckeycard derivando
    const MKeyCard = await derivateMasterPassword(password, saltCard as Uint8Array)
    const encKeyCard = await derivateMKey(MKeyCard, INFO_ENCRYPT)
    return encKeyCard
}

export async function modifyCard(newData: NewPassCard) {

}

export async function deleteCard(cardId: number) {
    
}
