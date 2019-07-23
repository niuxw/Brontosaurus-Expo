/**
 * @author WMXPY
 * @namespace Brontosaurus_Web
 * @description Util
 */

import { LOCAL_STORAGE_KEY, ParsedToken } from "./declare";

export const getToken = (): string | null => localStorage.getItem(LOCAL_STORAGE_KEY);
export const storeToken = (token: string): void => localStorage.setItem(LOCAL_STORAGE_KEY, token);
export const removeToken = (): void => localStorage.removeItem(LOCAL_STORAGE_KEY);

const decodeSlice = (encoded: string): any => JSON.parse(atob(encoded));

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
