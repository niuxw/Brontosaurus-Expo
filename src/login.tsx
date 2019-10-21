/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Login
 */

import * as React from 'react';
import { Dimensions, NativeSyntheticEvent, ViewStyle, WebViewMessageEventData, Keyboard, EmitterSubscription } from 'react-native';
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

    readonly onSucceed: (token: Token) => void;
    readonly onFailed: (reason: any) => void;
    readonly onError: (error: Error) => void;
};

export type LoginViewStates = {

    readonly ready: boolean;
    readonly keyboard: boolean;
};

export class LoginView extends React.Component<LoginViewProps, LoginViewStates> {

    public readonly state: LoginViewStates = {

        ready: false,
        keyboard: false,
    };

    private keyboardWillShowSub: EmitterSubscription | null = null;
    private keyboardWillHideSub: EmitterSubscription | null = null;

    public constructor(props: LoginViewProps) {

        super(props);

        this._handlerKeyboardWillShow = this._handlerKeyboardWillShow.bind(this);
        this._handlerKeyboardWillHide = this._handlerKeyboardWillHide.bind(this);
        this._handleMessage = this._handleMessage.bind(this);
        this._handleStartLoadWithRequest = this._handleStartLoadWithRequest.bind(this);
    }

    public async componentDidMount() {

        await initStorage();

        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._handlerKeyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._handlerKeyboardWillHide);

        const raw: string | null = getToken();

        if (raw) {

            const token: Token = Token.create(raw);
            if (token.validate()) {
                this.props.onSucceed(token);
                return;
            }

            await removeToken();
            this.setState({ ready: true });
        } else {
            this.setState({ ready: true });
        }
    }

    public componentWillUnmount() {

        if (this.keyboardWillShowSub) {
            this.keyboardWillShowSub.remove();
        }
        if (this.keyboardWillHideSub) {
            this.keyboardWillHideSub.remove();
        }
    }

    public render() {

        if (!this.state.ready) {
            return null;
        }

        return (<WebView
            style={this._getStyle()}
            source={{ uri: this._getURI() }}
            scrollEnabled={this.state.keyboard}
            scalesPageToFit={true}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}

            onMessage={this._handleMessage}
            onShouldStartLoadWithRequest={this._handleStartLoadWithRequest}
            injectedJavaScript="window.postMessage = (message) => window.ReactNativeWebView.postMessage(message);"
        />);
    }

    private _handlerKeyboardWillShow() {

        this.setState({
            keyboard: true,
        });
    }

    private _handlerKeyboardWillHide() {

        this.setState({
            keyboard: false,
        });
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
            const raw: string = message.token;

            if (!raw) {
                this.props.onError(new Error('Invalid Message'));
                return;
            }

            await storeToken(raw);

            const token: Token = Token.create(raw);
            this.props.onSucceed(token);
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
