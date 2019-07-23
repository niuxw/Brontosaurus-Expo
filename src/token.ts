/**
 * @author WMXPY
 * @namespace Brontosaurus_Web
 * @description Token
 */

import { Basics, IBrontosaurusBody, IBrontosaurusHeader } from "@brontosaurus/definition";
import { ParsedToken } from "./declare";
import { getToken, parseToken } from "./util";

export class Token {

    public static async getToken(
        onInvalid: (() => void) | null,
        applicationKey: string,
        getTokenFunc: () => Promise<string | null> = getToken,
    ): Promise<Token | null> {

        const token: string | null = await getTokenFunc();

        if (token) {

            const clazz: Token = new Token(onInvalid, token);
            if (clazz.sameApplication(applicationKey)) {
                return clazz;
            }
        }

        return null;
    }

    private readonly _raw: string;

    private readonly _header: IBrontosaurusHeader;
    private readonly _body: IBrontosaurusBody;
    private readonly _signature: string;

    private readonly _onInvalid: (() => void) | null;

    private constructor(
        onInvalid: (() => void) | null,
        raw: string,
    ) {

        this._onInvalid = onInvalid;

        this._raw = raw;
        const parsed: ParsedToken = parseToken(this._raw);

        this._header = parsed.header;
        this._body = parsed.body;
        this._signature = parsed.signature;
    }

    public get raw(): string {
        this._validate();
        return this._raw;
    }
    public get groups(): string[] {
        this._validate();
        return this._body.groups;
    }
    public get mint(): string {
        this._validate();
        return this._body.mint;
    }
    public get infos(): Record<string, Basics> {
        this._validate();
        return this._body.infos;
    }
    public get beacons(): Record<string, Basics> {
        this._validate();
        return this._body.beacons;
    }
    public get username(): string {
        this._validate();
        const username: string = this._body.username;
        if (!username) {
            this._break();
        }
        return username;
    }
    public get displayName(): string | undefined {
        this._validate();
        const displayName: string | undefined = this._body.displayName;
        return displayName;
    }
    public get name(): string {
        this._validate();
        if (this._body.displayName) {
            return this._body.displayName;
        }
        return this._body.username;
    }
    public get signature(): string {
        this._validate();
        return this._signature;
    }
    public get organization(): string | undefined {
        this._validate();
        return this._body.organization;
    }
    public get tags(): string[] {
        this._validate();
        return this._body.tags;
    }
    public get organizationTags(): string[] | undefined {
        this._validate();
        return this._body.organizationTags;
    }
    public get combineTags(): string[] {
        this._validate();
        return [...this._body.tags, ...(this._body.organizationTags || [])];
    }

    public sameApplication(applicationKey: string): boolean {

        if (this._header && this._header.key) {
            return applicationKey === this._header.key;
        }
        return false;
    }

    public hasOneOfGroup(...groups: string[]): boolean {

        for (const group of groups) {
            if (this.groups.includes(group)) {
                return true;
            }
        }
        return false;
    }

    public hasGroups(...groups: string[]): boolean {

        for (const group of groups) {
            if (!this.groups.includes(group)) {
                return false;
            }
        }
        return true;
    }

    public accountHasOneOfTag(...tags: string[]): boolean {

        for (const tag of tags) {
            if (this.tags.includes(tag)) {
                return true;
            }
        }
        return false;
    }

    public accountHasTags(...tags: string[]): boolean {

        for (const tag of tags) {
            if (!this.tags.includes(tag)) {
                return false;
            }
        }
        return true;
    }

    public organizationHasOneOfTag(...tags: string[]): boolean {

        const organizationTags: string[] | undefined = this.organizationTags;
        if (!organizationTags) {
            return false;
        }

        for (const tag of tags) {
            if (organizationTags.includes(tag)) {
                return true;
            }
        }
        return false;
    }

    public organizationHasTags(...tags: string[]): boolean {

        const organizationTags: string[] | undefined = this.organizationTags;
        if (!organizationTags) {
            return false;
        }

        for (const tag of tags) {
            if (!organizationTags.includes(tag)) {
                return false;
            }
        }
        return true;
    }

    public combineHasOneOfTag(...tags: string[]): boolean {

        for (const tag of tags) {
            if (this.combineTags.includes(tag)) {
                return true;
            }
        }
        return false;
    }

    public combineHasTags(...tags: string[]): boolean {

        for (const tag of tags) {
            if (!this.combineTags.includes(tag)) {
                return false;
            }
        }
        return true;
    }

    public validate(): boolean {

        return Date.now() < this._header.expireAt;
    }

    private _validate(): true {

        if (Date.now() > this._header.expireAt) {
            this._break();
        }

        return true;
    }

    private _break(): void {

        if (this._onInvalid) {
            this._onInvalid();
        }
    }
}
