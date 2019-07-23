/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Config
 */

import { Token } from "./token";
import { removeToken } from "./util";

export class Brontosaurus {

    public static hydrate(server: string, applicationKey: string, onRedirect: () => void) {

        this.register(server, applicationKey, onRedirect);
        return new Brontosaurus(server, applicationKey, onRedirect);
    }

    public static register(server: string, applicationKey: string, onRedirect: () => void): Brontosaurus {

        if (this._instance) {
            throw new Error('[Brontosaurus-Expo] Registered');
        }

        this._instance = new Brontosaurus(server, applicationKey, onRedirect);
        return this._instance;
    }

    private static _instance: Brontosaurus | undefined;

    private readonly _server: string;
    private readonly _applicationKey: string;
    private readonly _onRedirect: () => void;

    private constructor(server: string, applicationKey: string, onRedirect: () => void) {

        this._server = server;
        this._applicationKey = applicationKey;
        this._onRedirect = onRedirect;
    }

    public static get instance(): Brontosaurus {

        if (!this._instance) {
            throw new Error('[Brontosaurus-Expo] Need Register');
        }

        return this._instance;
    }

    public get server(): string {

        return this._server;
    }

    public get applicationKey(): string {

        return this._applicationKey;
    }

    public static async logout(relogin?: boolean): Promise<Brontosaurus> {

        return await this.instance.logout(relogin);
    }

    public static async hard(beforeRedirect?: () => void | Promise<void>): Promise<Token> {

        return await this.instance.hard(beforeRedirect);
    }

    public static async redirect(beforeRedirect?: () => void | Promise<void>): Promise<Brontosaurus> {

        return await this.instance.redirect(beforeRedirect);
    }

    public static async soft(): Promise<Token | null> {

        return await this.instance.soft();
    }

    public async redirect(beforeRedirect?: () => void | Promise<void>): Promise<this> {

        if (beforeRedirect) {

            await Promise.resolve(beforeRedirect());
        }
        this._onRedirect();
        return this;
    }

    public async validate(): Promise<this> {

        const token: Token | null = await this._token();

        if (!token) {
            this.redirect();
            return this;
        }

        if (!token.validate()) {
            this.redirect();
            return this;
        }

        return this;
    }

    public async hard(beforeRedirect?: () => void | Promise<void>): Promise<Token> {

        const token: Token | null = await this._token();

        if (!token) {
            this.redirect(beforeRedirect);
            return null as any;
        }
        return token as Token;
    }

    public async soft(): Promise<Token | null> {

        const token: Token | null = await this._token();
        return token;
    }

    public async logout(redirect?: boolean): Promise<Brontosaurus> {

        await removeToken();
        if (redirect) {
            this.redirect();
        }
        return this;
    }

    private async _token(): Promise<Token | null> {

        return await Token.getToken(this._onRedirect, this._applicationKey);
    }
}
