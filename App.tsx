/**
 * @author WMXPY
 * @namespace Root
 * @description App
 */

import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { LoginView, Brontosaurus } from './src';

const config = Brontosaurus.hydrate('', '', () => console.log('redirect'));

export default function App() {

  const [view, setView] = React.useState('Login');

  return (
    <View style={styles.container}>
      {
        view === 'login' ?
          <LoginView
            config={config}
            onSucceed={() => setView('View')}
            onFailed={console.log}
          />
          : <View>
            <Text>
              Logged in
            </Text>
            <Button title="Logout" onPress={() => Brontosaurus.logout()}></Button>
          </View>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
