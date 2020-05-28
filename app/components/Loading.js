import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { BarIndicator } from 'react-native-indicators'
import { PrimaryColor } from '../config/color'

class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BarIndicator size={24} color={PrimaryColor} count={5} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Loading
