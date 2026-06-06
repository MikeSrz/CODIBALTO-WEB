//Tipo para return de datos encirptados
export type EncryptedData = {
    cyphertext: ArrayBuffer
    iv: Uint8Array
};


//Passcards interfaces
export interface PassCard {
    id: number | null
    tagname: string
    email_card: string
    cipher_password: string //cifrado y en base64
    notes: string | null
    iv_ps: string
    iv_em: string
    card_site: Cardsite
}

export interface NewPassCard {
    tagname: string 
    email_card: string  
    password: string   //sin cifrar
    notes: string | null
    card_site: Cardsite
}

export interface Cardsite {
    id : number | null
    id_card : number
    domain : string
    site: string
}
//Usuario interfaces:
export interface UserData {
    username: string | null
    email: string | null
    nombre: string | null
    apellido: string | null
    passCards: PassCard[]
}

//
export interface AuditResults {
    length: string
    diversity: string
    entropy: string
    patterns: string
    breaches:  number
}

// booleanos de comprobaciones de diversidad.
export interface PasswordDiversity {
    hasUpper: boolean 
    hasLower: boolean
    hasNum: boolean 
    hasSym: boolean  
}