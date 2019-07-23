/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Declare
 */

import { IBrontosaurusBody, IBrontosaurusHeader } from "@brontosaurus/definition";

export type PostMessage = {

    readonly status: "SUCCEED";
    readonly token: string;
    readonly type: "BRONTOSAURUS";
};

export const LOCAL_STORAGE_KEY = 'BRONTOSAURUS-TOKEN';

export type ParsedToken = {

    header: IBrontosaurusHeader;
    body: IBrontosaurusBody;
    signature: string;
};
