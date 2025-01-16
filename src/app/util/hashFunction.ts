import { sha512 } from 'crypto-hash';

export const hashFunction = async (toHash: string) => {
    return sha512(toHash);
};