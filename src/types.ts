//Tipo para return de datos encirptados
export type EncryptedData = {
    cyphertext: ArrayBuffer
    iv: Uint8Array
};


//Passcards interfaces
export interface PassCard {
    id: number | null
    domain: string
    email_card: string
    cipher_password: string //cifrado y en base64
    notes: string | null
    iv_ps: string
    iv_em: string
}

export interface NewPassCard {
    domain: string
    email_card: string
    password: string  //sin cifrar
    notes: string | null
}


//Usuario interfaces:
export interface UserData {
    username: string | null
    email: string | null
    nombre: string | null
    apellido: string | null
    passCards: PassCard[]
}
