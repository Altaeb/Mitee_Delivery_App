import React, { PureComponent } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { PrimaryColor } from '../config/color'

export default class QuantitySelector extends PureComponent {
  static defaultProps = {
    minQuantity: 0,
    baseColor: PrimaryColor
  }

  constructor(props) {
    super(props)

    this.state = {
      quantity: props.value || props.minQuantity
    }

    this._quantityValue = this.state.quantity

    if (props.onChange) {
      props.onChange(this.state.quantity)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.onChange) {
      this.props.onChange(nextState.quantity)
    }
  }

  _onIncreaseQuantity = () => {
    if (
      this.props.maxQuantity === undefined ||
      this.state.quantity < this.props.maxQuantity
    ) {
      this.setState(
        ({ quantity }) => ({ quantity: quantity + 1 }),
        () => {
          this._quantityValue = this.state.quantity
        }
      )
    }
  }

  _onDecreaseQuantity = () => {
    if (
      this.props.minQuantity === undefined ||
      this.state.quantity > this.props.minQuantity
    ) {
      this.setState(
        ({ quantity }) => ({ quantity: quantity - 1 }),
        () => (this._quantityValue = this.state.quantity)
      )
    }
  }

  _onUpdateQuantity = value => {
    const isNumber = !isNaN(parseInt(value))
    this.setState(
      () => ({
        quantity: isNumber ? parseInt(value) : 1
      }),
      () => (this._quantityValue = this.state.quantity)
    )
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Icon.Button
          size={25}
          backgroundColor="transparent"
          color={this.props.baseColor}
          underlayColor="transparent"
          style={styles.actionButton}
          iconStyle={styles.icon}
          onPress={this._onDecreaseQuantity}
          name="remove-circle-outline"
        />
        <TextInput
          keyboardType="numeric"
          onChangeText={this._onUpdateQuantity}
          onBlur={this._onLostFocus}
          style={[styles.quantityInput, { color: this.props.baseColor }]}
          editable={true}
          value={this.state.quantity.toString()}
          maxLength={3}
        />
        <Icon.Button
          size={25}
          color={this.props.baseColor}
          backgroundColor="transparent"
          underlayColor="transparent"
          style={styles.actionButton}
          iconStyle={styles.icon}
          onPress={this._onIncreaseQuantity}
          name="add-circle-outline"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 70,
    marginRight: 70,
    padding: 0
  },
  icon: {
    marginRight: 0,
    alignSelf: 'center'
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    height: 38
  }
})
