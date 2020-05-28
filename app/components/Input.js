import React, { Component } from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'

class Input extends Component {
  render() {
    const {
      containerStyle,
      iconStyle,
      iconName,
      iconSize,
      style,
      placeHolder,
      onIconClick
    } = this.props
    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          style={style}
          placeholder={placeHolder}
          placeholderTextColor="#fff"
          underlineColorAndroid="rgba(0,0,0,0)"
          {...this.props}
        />
        <Icon
          style={[styles.icon, iconStyle]}
          name={iconName}
          size={iconSize}
          color="#fff"
          onPress={() => onIconClick && onIconClick()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  }
})

export default Input
