/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Token
 */

import { Basics, IBrontosaurusBody, IBrontosaurusHeader } from "@brontosaurus/definition";
import { ParsedToken } from "./declare";
import { parseToken } from "./util";

export class Token {

    public static create(raw: string): Token {

        return new Token(raw);
    }

    private readonly _raw: string;

    private readonly _header: IBrontosaurusHeader;
    private readonly _body: IBrontosaurusBody;
    private readonly _signature: string;

    private constructor(
        raw: string,
    ) {

        this._raw = raw;
        const parsed: ParsedToken = parseToken(this._raw);

        this._header = parsed.header;
        this._body = parsed.body;
        this._signature = parsed.signature;
    }

    public get raw(): string {
        return this._raw;
    }
    public get groups(): string[] {
        return this._body.groups;
    }
    public get mint(): string {
        return this._body.mint;
    }
    public get infos(): Record<string, Basics> {
        return this._body.infos;
    }
    public get beacons(): Record<string, Basics> {
        return this._body.beacons;
    }
    public get username(): string {
        return this._body.username;
    }
    public get displayName(): string | undefined {
        const displayName: string | undefined = this._body.displayName;
        return displayName;
    }
    public get name(): string {
        if (this._body.displayName) {
            return this._body.displayName;
        }
        return this._body.username;
    }
    public get signature(): string {
        return this._signature;
    }
    public get organization(): string | undefined {
        return this._body.organization;
    }
    public get tags(): string[] {
        return this._body.tags;
    }
    public get organizationTags(): string[] | undefined {
        return this._body.organizationTags;
    }
    public get combineTags(): string[] {
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
}
