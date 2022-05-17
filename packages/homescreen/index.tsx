import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function greeting() {
  return (
    <View style={styles.container}>
      <Text>Hello, World!</Text>
      <Text>Hello, World 2!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
