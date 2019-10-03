/**
 * @author WMXPY
 * @namespace Root
 * @description App
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { LoginView, Brontosaurus } from './src';

const config = Brontosaurus.hydrate('', '', () => console.log('redirect'));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {

  const [view, setView] = React.useState('Login');

  useEffect(() => {

    Brontosaurus.setRedirect(() => setView('Login'));
  }, []);

  if (view === 'Login') {
    return (<LoginView
      config={config}
      onSucceed={() => setView('View')}
      onFailed={console.log}
    />);
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>
          Logged in: {Brontosaurus.hard().username}
        </Text>
        <Button title="Logout" onPress={() => Brontosaurus.logout(true)}></Button>
      </View>
    </View>
  );
}
