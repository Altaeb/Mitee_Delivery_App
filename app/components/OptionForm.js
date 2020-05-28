import React, { Component } from 'react'
import { Text } from 'react-native'
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button'
import { PrimaryColor } from '../config/color'

class OptionForm extends Component {
  state = {
    selectedIndex: 0
  }

  _handleChangeOption = index => {
    const { onGetValue } = this.props
    this.setState(
      () => ({
        selectedIndex: index
      }),
      () => onGetValue(index)
    )
  }

  render() {
    const { options, isHorizontal = true } = this.props
    return (
      <RadioForm formHorizontal={isHorizontal} animation={true}>
        {options.map((option, index) => {
          return (
            <RadioButton labelHorizontal={true} key={index}>
              <RadioButtonInput
                obj={option}
                index={index}
                isSelected={this.state.selectedIndex === index}
                onPress={() => this._handleChangeOption(index)}
                borderWidth={1.5}
                buttonInnerColor={PrimaryColor}
                buttonOuterColor={'#000'}
                buttonSize={12}
                buttonWrapStyle={{
                  marginLeft: 15
                }}
              />
              <RadioButtonLabel
                obj={option}
                index={index}
                labelHorizontal={true}
                onPress={() => this._handleChangeOption(index)}
              />
            </RadioButton>
          )
        })}
      </RadioForm>
    )
  }
}

export default OptionForm
