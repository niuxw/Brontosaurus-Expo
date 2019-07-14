/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Config
 */

export class Brontosaurus {

    public static hydrate(server: string, applicationKey: string) {

        return new Brontosaurus(server, applicationKey);
    }

    private readonly _server: string;
    private readonly _applicationKey: string;

    private constructor(server: string, applicationKey: string) {

        this._server = server;
        this._applicationKey = applicationKey;
    }

    public get server(): string {

        return this._server;
    }

    public get applicationKey(): string {

        return this._applicationKey;
    }
}
