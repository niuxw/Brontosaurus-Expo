/**
 * @author WMXPY
 * @namespace Root
 * @description App
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LoginView } from './src';

export default function App() {

  return (
    <View style={styles.container}>
      <LoginView />
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
