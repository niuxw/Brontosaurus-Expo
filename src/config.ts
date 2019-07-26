/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Config
 */

import { Token } from "./token";
import { removeToken, getToken } from "./util";

export class Brontosaurus {

    public static hydrate(server: string, applicationKey: string, onRedirect?: () => void) {

        this.register(server, applicationKey, onRedirect);
        return new Brontosaurus(server, applicationKey, onRedirect);
    }

    public static register(server: string, applicationKey: string, onRedirect?: () => void): Brontosaurus {

        if (this._instance) {
            throw new Error('[Brontosaurus-Expo] Registered');
        }

        this._instance = new Brontosaurus(server, applicationKey, onRedirect);
        return this._instance;
    }

    private static _instance: Brontosaurus | undefined;

    private readonly _server: string;
    private readonly _applicationKey: string;

    private _onRedirect: (() => void) | null;

    private constructor(server: string, applicationKey: string, onRedirect?: () => void) {

        this._server = server;
        this._applicationKey = applicationKey;
        this._onRedirect = onRedirect || null;
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

    public static logout(relogin: boolean = true): Brontosaurus {

        return this.instance.logout(relogin);
    }

    public static hard(beforeRedirect?: () => void | Promise<void>): Token {

        return this.instance.hard(beforeRedirect);
    }

    public static setRedirect(onRedirect: () => void): Brontosaurus {

        return this.instance.setRedirect(onRedirect);
    }

    public static redirect(beforeRedirect?: () => void | Promise<void>): Brontosaurus {

        return this.instance.redirect(beforeRedirect);
    }

    public static soft(): Token | null {

        return this.instance.soft();
    }

    public setRedirect(onRedirect: () => void): this {

        this._onRedirect = onRedirect;
        return this;
    }

    public redirect(beforeRedirect?: () => void | Promise<void>): this {

        if (beforeRedirect) {
            Promise.resolve(beforeRedirect()).then(() => {
                if (this._onRedirect) {
                    this._onRedirect()
                }
            });
        } else {
            if (this._onRedirect) {
                this._onRedirect();
            }
        }
        return this;
    }

    public validate(): this {

        const token: Token | null = this._token();

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

    public hard(beforeRedirect?: () => void | Promise<void>): Token {

        const token: Token | null = this._token();

        if (!token) {
            this.redirect(beforeRedirect);
            return null as any;
        }
        return token as Token;
    }

    public soft(): Token | null {

        const token: Token | null = this._token();
        return token;
    }

    public logout(redirect?: boolean): Brontosaurus {

        removeToken().then(() => {
            if (redirect) {
                this.redirect();
            }
        });
        return this;
    }

    private _token(): Token | null {

        const raw: string | null = getToken();

        if (!raw) {
            return null;
        }
        return Token.create(raw);
    }
}
