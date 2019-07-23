/**
 * @author WMXPY
 * @namespace Brontosaurus_Web
 * @description Util
 */

import { LOCAL_STORAGE_KEY, ParsedToken } from "./declare";
import { AsyncStorage } from 'react-native';

export const getToken = async (): Promise<string | null> => await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
export const storeToken = async (token: string): Promise<void> => await AsyncStorage.setItem(LOCAL_STORAGE_KEY, token);
export const removeToken = async (): Promise<void> => await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);

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
