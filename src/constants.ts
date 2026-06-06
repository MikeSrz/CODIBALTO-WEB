const INFO_ENCRYPT: string= "info";
const INFO_AUTH: string= "auth";
const KEY_TYPES = {
                    private: 'pkcs8',
                    public: 'spki',
                    secret:'raw'
                    } as const;

const SECURITY_LEVEL = {
    high: 'high',
    mid: 'mid',
    low: 'low'
} as const;

const MIN_LENGTH_SEQUENCE = 4

export {INFO_ENCRYPT, INFO_AUTH, KEY_TYPES,MIN_LENGTH_SEQUENCE, SECURITY_LEVEL};

