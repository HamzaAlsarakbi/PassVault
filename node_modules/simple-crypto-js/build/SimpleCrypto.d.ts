import { WordArray, Encoder } from 'crypto-js';
export declare class SimpleCrypto {
    private _secret;
    private readonly _keySize;
    private readonly _iterations;
    private readonly _defaultEncoder;
    constructor(secret: string);
    static generateRandom(length?: number, expectsWordArray?: boolean): string | WordArray;
    encrypt(data: object | string | number | boolean): string;
    decrypt(ciphered: string, expectsObject?: boolean, encoder?: Encoder): string | object;
    encryptObject(object: object): string;
    decryptObject(string: string): object;
    setSecret(secret: string): void;
}
export default SimpleCrypto;
