/**
 * @author WMXPY
 * @namespace Root
 * @description App
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LoginView, Brontosaurus } from './src';

const config = Brontosaurus.hydrate('', '');

export default function App() {

  return (
    <View style={styles.container}>
      <LoginView config={config} />
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
