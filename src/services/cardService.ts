import {INFO_ENCRYPT} from "@/constants";
import type {EncryptedData, PassCard, NewPassCard, UserData} from '../types'
import { useAuthStore} from "@/stores/auth";
import {getUserData} from '@/services/authService'
import {encodeBase64, decodeBase64ToUintArray} from '@/services/encodeService'
import apis from '@/services/api'
import { encryptData, decryptData, derivateMasterPassword, derivateMKey} from "@/services/cryptoService";



const API_STORE_CARD = `card/store/`;
const API_MODIFY_CARD = `card/modify/`;
const API_DELETE_CARD = `card/delete/`;

export async function storeCard(newData: NewPassCard, masterPassword: string) {//Encriptar password e email y almacenar. => necesito tener la encKey
    const auth = useAuthStore()
    const encKeyCard: CryptoKey = await generateEncKeyCard(masterPassword);
    if (!encKeyCard) {
        console.error("No hay clave de cifrado")
        return
    }
    const encryptedData: EncryptedData =   await encryptData(newData.password, encKeyCard)
    const encryptedDataEmail: EncryptedData  = await encryptData(newData.email_card, encKeyCard)
    const payload = {
        tagname: newData.tagname,
        email_card: await encodeBase64(encryptedDataEmail.cyphertext),
        cipher_password: await encodeBase64(encryptedData.cyphertext),
        notes: newData.notes,
        iv_ps: await encodeBase64(encryptedData.iv),
        iv_em: await encodeBase64(encryptedDataEmail.iv),
        card_site: {
            domain: newData.card_site.domain,
            site: newData.card_site.site
        }
    }
    apis.api.post(API_STORE_CARD, payload)
    .then(async (response) => {
            const userData = await getUserData()
            auth.setUserData(userData)
            return response.data
        }
    )
}

export async function modifyCard(newData: PassCard, masterPassword: string) {
    //crear funcion para esto => solo se puede modificar las notas, el mail y el password
    const auth = useAuthStore();
    const encKeyCard = await generateEncKeyCard(masterPassword);
    if (!encKeyCard) {
        console.error("No hay clave de cifrado")
        return
    }
    const encryptedData: EncryptedData =   await encryptData(newData.cipher_password, encKeyCard)
    const encryptedDataEmail: EncryptedData  = await encryptData(newData.email_card, encKeyCard)

    const payload = {
        id:                 newData.id,
        tagname:            newData.tagname,
        email_card:         await encodeBase64(encryptedDataEmail.cyphertext),
        cipher_password:    await encodeBase64(encryptedData.cyphertext),
        notes:              newData.notes,
        iv_ps:              await encodeBase64(encryptedData.iv),
        iv_em:              await encodeBase64(encryptedDataEmail.iv),
        card_site:{
            domain: newData.card_site.domain,
            site: newData.card_site.site
        }
    }

    await apis.api.post(`${API_MODIFY_CARD}`, payload).
    then(async(response) => {
            const userData = await getUserData()
            auth.setUserData(userData)
            return response.data
    })

}



export async function decryptCard(iv_ps:string , iv_em: string, ciph_mail:string, ciph_password:string, masterPassword: string){ //viene todo en base64
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
    //obtenemos la enckeycard derivando
    const MKeyCard = await derivateMasterPassword(password, saltCard as Uint8Array)
    const encKeyCard = await derivateMKey(MKeyCard, INFO_ENCRYPT)
    return encKeyCard
}

export async function deleteCard(cardId: number) {
    const auth = useAuthStore();
    apis.api.delete(`${API_DELETE_CARD}${cardId}`)
    .then(async (response) => {
        const userData = await getUserData();
            auth.setUserData(userData);
    })
}
