import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'

class IntroScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Intro Screen!</Text>
        <Button
          title="Go To Next Screen"
          onPress={() => this.props.navigation.navigate('SignIn')}
        />
      </View>
    )
  }
}

export default IntroScreen
