/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Util
 */

import { LOCAL_STORAGE_KEY, ParsedToken } from "./declare";
import { AsyncStorage } from 'react-native';

const cache: {
    token: string | null;
} = {
    token: null,
};

export const initStorage = async (): Promise<void> => {

    const token: string | null = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
    cache.token = token;
};

export const getToken = (): string | null => cache.token;

export const removeToken = async (): Promise<void> => {

    cache.token = null;
    await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
};

export const storeToken = async (token: string): Promise<void> => {

    cache.token = token;
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY, token);
};

const decodeSlice = (encoded: string): any => {

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    let str = encoded.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
        buffer = str.charAt(i++);

        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        buffer = chars.indexOf(buffer);
    }

    return JSON.parse(output);
};

export const parseToken = (token: string): ParsedToken => {

    const splited: string[] = token.split('.');

    if (splited.length !== 3) {
        throw new Error('Wrong');
    }

    const [header, body, signature] = splited;

    return {
        header: decodeSlice(header),
        body: decodeSlice(body),
        signature,
    };
};
