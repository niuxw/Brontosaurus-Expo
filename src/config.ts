import { Token } from "./token";
import { storeToken, removeToken } from "./util";

/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Config
 */

export class Brontosaurus {

    public static hydrate(server: string, applicationKey: string) {

        return new Brontosaurus(server, applicationKey);
    }

    private static _instance: Brontosaurus | undefined;

    private readonly _server: string;
    private readonly _applicationKey: string;

    private constructor(server: string, applicationKey: string) {

        this._server = server;
        this._applicationKey = applicationKey;
    }

    public static get instance(): Brontosaurus {

        if (!this._instance) {
            throw new Error('[Brontosaurus-Web] Need Register');
        }

        return this._instance;
    }

    public get server(): string {

        return this._server;
    }

    public get applicationKey(): string {

        return this._applicationKey;
    }

    public static logout(relogin?: boolean): Brontosaurus {

        return this.instance.logout(relogin);
    }

    public static hard(callbackPath?: string, beforeRedirect?: () => void | Promise<void>): Token {

        return this.instance.hard(callbackPath, beforeRedirect);
    }

    public static redirect(callbackPath?: string, beforeRedirect?: () => void | Promise<void>): Brontosaurus {

        return this.instance.redirect(callbackPath, beforeRedirect);
    }

    public static soft(): Token | null {

        return this.instance.soft();
    }

    public hard(callbackPath?: string, beforeRedirect?: () => void | Promise<void>): Token {

        const token: Token | null = this._token();

        if (!token) {
            this.redirect(callbackPath, beforeRedirect);
            return null as any;
        }
        return token as Token;
    }

    public soft(): Token | null {

        const token: Token | null = this._token();
        return token;
    }

    public logout(redirect?: boolean): Brontosaurus {

        removeToken();
        if (redirect) {
            this.redirect();
        }
        return this;
    }

    private _token(callbackPath?: string): Token | null {

        const onInvalid: (() => void) | null = callbackPath ? this._getOnInvalid(callbackPath) : null;
        return Token.getToken(onInvalid, this._applicationKey);
    }

    private _getOnInvalid(callbackPath: string): () => void {

        return () => window.location.href = callbackPath;
    }
}
