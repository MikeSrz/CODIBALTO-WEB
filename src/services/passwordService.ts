import type { PasswordDiversity } from "@/types";
import { SECURITY_LEVEL, MIN_LENGTH_SEQUENCE } from "@/constants"; 
import axios from 'axios'

const MAYUS_CONJUNTO = 26;
const MINUS_CONJUNTO = 26;
const NUM_CONJUNTO = 10;
const SIMB_CONJUNTO = 32;
const SECUENCIA_KEYBOARD : String[] = [
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm"
    ];

const SECUENCIA_ALPHABET: String[] = [
    "abcdefghijklmnopqrstuvwxyz",
    "zyxwvutsrqponmlkjihgfedcba"
];

const SECUENCIA_NUMBERS = [
        "0123456789",
        "9876543210"
];

//Limitarmos las contraseñas a ASCII aunque puedo considerar usar UNICODE

//funcion para generar contraseña
export function generatePassword(len = 32){
    const caracteres ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+?";
    const valores = new Uint32Array(len);
    crypto.getRandomValues(valores); //introducimos valores aleatorios 
    let newPassword: string = '';
    for (const v of valores) {
        newPassword += caracteres[v % caracteres.length];
    }
    console.log(newPassword)
    return newPassword;
}

/*
Funciones de auditoria
[PASS] Length Test => Sí

[PASS] Character Diversity => si

[PASS] Entropy Analysis => si

[PASS] Common Password Check => aun no

[PASS] Pattern Detection => Sí 

[PASS] Repetition Analysis => aun no

[PASS] Dictionary Matching => aun no

[PASS] Breach Database Lookup => Sí
*/

export function checkDiversity(password: string):PasswordDiversity { 
    const hasUpper: boolean = /[A-Z]/.test(password);
    const hasLower: boolean = /[a-z]/.test(password);
    const hasNum: boolean = /[0-9]/.test(password);
    const hasSym: boolean = /[^a-zA-Z0-9]/.test(password);

    return {
        hasUpper: hasUpper,
        hasLower: hasLower,
        hasNum: hasNum,
        hasSym: hasSym
    }
}

export function rateDiversity(password:string){
    const checkResult :PasswordDiversity = checkDiversity(password)
    console.log(checkResult)
    const ac = Object.values(checkResult).filter(Boolean).length  
    const rating = ac/Object.keys(checkResult).length
    if (rating == 1)
        return SECURITY_LEVEL.high
    if (rating >= 0.5)
        return SECURITY_LEVEL.mid
    else (rating < 0.5)
        return SECURITY_LEVEL.low
}

export function rateLength(password: string){
    const midLength: boolean = password.length > 8;
    const strongLength: boolean = password.length >= 16;
    if (strongLength)
        return SECURITY_LEVEL.high
    else if (midLength)
        return SECURITY_LEVEL.mid
    else
        return SECURITY_LEVEL.low
}

export function calcEntropy(password: string){ //devuelve bits de entrpia
    const { hasUpper, hasLower, hasNum, hasSym } = checkDiversity(password);
    let ac = 0;
    if (hasLower) 
        ac += MINUS_CONJUNTO;
    if (hasUpper) 
        ac += MAYUS_CONJUNTO;
    if (hasNum)
        ac += NUM_CONJUNTO
    if (hasSym) 
        ac += SIMB_CONJUNTO;
    if (ac === 0)
         return 0;
        const result = password.length*Math.log2(ac);
        return result
}

export function rateEntropy(password: string){
    const entropy = calcEntropy(password)
    const highEntropy = entropy > 60
    const sufficentEntropy = entropy > 21
    if (highEntropy)
        return SECURITY_LEVEL.high
    else if(sufficentEntropy)
        return SECURITY_LEVEL.mid
    else 
        return SECURITY_LEVEL.low
}


function checkSequence(p: string, secuencias: String[]): boolean {
    const password = p.toLowerCase();

    for (let secuencia of secuencias) {
        for (let i = 0; i <= secuencia.length - MIN_LENGTH_SEQUENCE; i++) {
            if (password.includes(secuencia.slice(i, i + MIN_LENGTH_SEQUENCE))) {
                return true;
            }
        }
    }
    return false;
}

export function checkAllPatterns(p:string){
    const secuenciasDeVariosTipos = [SECUENCIA_ALPHABET, SECUENCIA_KEYBOARD, SECUENCIA_NUMBERS]
    let coincide = null
    for (let secuenciasDeUnTipo of secuenciasDeVariosTipos){
        coincide = checkSequence(p, secuenciasDeUnTipo)
        if (coincide)
            break
    }
    return coincide
}

export async function checkBreach(password: string) { //sufijo:encuentros
    const encoder = new TextEncoder();

    const hashBuffer = await crypto.subtle.digest("SHA-1", encoder.encode(password));
    const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    return axios.get( `https://api.pwnedpasswords.com/range/${prefix}`)
    .then((response) =>{
        const lines = response.data.split("\n");
        for (const line of lines) {
            const [hashSuffix, count] = line.trim().split(":");
            if (hashSuffix === suffix) {
                return parseInt(count, 10);
            }
        }

        return 0;
    }).catch(()=> {return 0})
}