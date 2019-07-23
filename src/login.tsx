/**
 * @author WMXPY
 * @namespace Brontosaurus
 * @description Login
 */

import * as React from 'react';
import { Dimensions, View, WebView, ViewStyle, NativeSyntheticEvent, WebViewMessageEventData } from 'react-native';
import { Brontosaurus } from './config';
import { PostMessage } from './declare';
import { storeToken } from './util';

export type LoginViewProps = {

    readonly config: Brontosaurus;
    readonly height?: number;
    readonly width?: number;

    readonly onSucceed: () => void;
    readonly onFailed: (reason: any) => void;
};

export class LoginView extends React.Component<LoginViewProps> {

    public constructor(props: LoginViewProps) {

        super(props);

        this._handleMessage = this._handleMessage.bind(this);
    }

    public render() {

        return (<View>
            <WebView
                scrollEnabled={false}
                style={this._getStyle()}
                onMessage={this._handleMessage}
                source={{ uri: this._getURI() }}
            />
        </View>);
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
