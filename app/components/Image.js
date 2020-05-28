import React, { Component } from 'react'
import { Image, Dimensions, View } from 'react-native'

class FullWidthImage extends Component {
  state = {
    isLoaded: false
  }

  _offSet = this.props.parentPadding * 2

  _onLoad = () => {
    this.setState(() => ({ isLoaded: true }))
  }

  _renderPlaceHolder = () => {
    return (
      <View
        style={{
          borderRadius: this.props.border || 5,
          width: Dimensions.get('window').width - this._offSet,
          height: ((Dimensions.get('window').width - this._offSet) * 1) / 2,
          backgroundColor: '#EFEFEF',
          position: 'absolute'
        }}
      />
    )
  }

  render() {
    const { isLoaded } = this.state

    return (
      <View
        style={{
          position: 'relative',
          width: Dimensions.get('window').width - this._offSet,
          height: ((Dimensions.get('window').width - this._offSet) * 1) / 2
        }}
      >
        <Image
          source={{ uri: this.props.src }}
          style={{
            width: Dimensions.get('window').width - this._offSet,
            height: ((Dimensions.get('window').width - this._offSet) * 1) / 2,
            borderRadius: 5,
            position: 'absolute'
          }}
          resizeMode="cover"
          onLoad={this._onLoad}
        />
        {!isLoaded && this._renderPlaceHolder()}
      </View>
    )
  }
}

export default FullWidthImage
