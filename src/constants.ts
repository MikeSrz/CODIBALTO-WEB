const INFO_ENCRYPT: string= "info";
const INFO_AUTH: string= "auth";
const KEY_TYPES = {
                    private: 'pkcs8',
                    public: 'spki',
                    secret:'raw'
                    } as const;

export {INFO_ENCRYPT, INFO_AUTH, KEY_TYPES};