/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Login
 */

import * as React from 'react';
import { Dimensions, NativeSyntheticEvent, ViewStyle, WebViewMessageEventData } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { Brontosaurus } from './config';
import { PostMessage } from './declare';
import { Token } from './token';
import { getToken, initStorage, removeToken, storeToken } from './util';

export type LoginViewProps = {

    readonly config: Brontosaurus;
    readonly height?: number;
    readonly width?: number;

    readonly onSucceed: () => void;
    readonly onFailed: (reason: any) => void;
};

export type LoginViewStates = {

    readonly ready: boolean;
};

export class LoginView extends React.Component<LoginViewProps, LoginViewStates> {

    public readonly state: LoginViewStates = {

        ready: false,
    };

    public constructor(props: LoginViewProps) {

        super(props);

        this._handleMessage = this._handleMessage.bind(this);
        this._handleStartLoadWithRequest = this._handleStartLoadWithRequest.bind(this);
    }

    public async componentDidMount() {

        await initStorage();

        const raw: string | null = getToken();

        if (raw) {
            const token: Token = Token.create(raw);
            if (token.validate()) {
                this.props.onSucceed();
                return;
            }

            await removeToken();
            this.setState({ ready: true });
        } else {
            this.setState({ ready: true });
        }
    }

    public render() {

        if (!this.state.ready) {
            return null;
        }

        return (<WebView
            style={this._getStyle()}
            source={{ uri: this._getURI() }}
            scrollEnabled={false}
            scalesPageToFit={true}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}

            onMessage={this._handleMessage}
            onShouldStartLoadWithRequest={this._handleStartLoadWithRequest}
            injectedJavaScript="window.postMessage = (message) => window.ReactNativeWebView.postMessage(message);"
        />);
    }

    private _handleStartLoadWithRequest(event: WebViewNavigation): boolean {

        if (event.url.includes(this.props.config.server)) {
            return true;
        }
        return false;
    }

    private async _handleMessage(event: NativeSyntheticEvent<WebViewMessageEventData>): Promise<void> {

        const data: string = decodeURIComponent(event.nativeEvent.data);

        try {

            const message: PostMessage = JSON.parse(decodeURIComponent(data));
            await storeToken(message.token);
            this.props.onSucceed();
        } catch (err) {

            this.props.onFailed(err);
        }
    }

    private _getStyle(): ViewStyle {

        const style: ViewStyle = {
            width: this.props.width || Dimensions.get('window').width,
        }

        if (this.props.height) {
            return {
                ...style,
                height: this.props.height,
            };
        }
        return {
            ...style,
            flex: 1,
        }
    }

    private _getURI(): string {

        const server: string = this.props.config.server;
        const key: string = this.props.config.applicationKey;
        return `${server}?key=${key}&cb=POST`;
    }
}
