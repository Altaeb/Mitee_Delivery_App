import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import MultiSelect from 'react-native-multiple-select'
import { PrimaryColor } from '../config/color'
import Icon from 'react-native-vector-icons/Entypo'
class MultiSelectForm extends Component {
  state = {
    selectedItems: []
  }

  _onSelectedItemsChange = selectedItems => {
    const { onGetMultiValue } = this.props
    this.setState(
      () => ({ selectedItems }),
      () => onGetMultiValue && onGetMultiValue(selectedItems)
    )
  }

  _clearItem = () => {
    const { onRemoveValue } = this.props
    const { selectedItems } = this.state
    this.setState(
      () => ({
        selectedItems: []
      }),
      () => onRemoveValue && onRemoveValue(selectedItems)
    )
  }

  render() {
    const { selectedItems } = this.state
    const { items, single, showSelected = true } = this.props
    return (
      <View style={styles.container}>
        <MultiSelect
          hideTags
          hideSubmitButton
          items={items}
          uniqueKey="id"
          ref={node => {
            this.multiSelect = node
          }}
          onSelectedItemsChange={this._onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Topping.."
          tagRemoveIconColor="#CCC"
          tagBorderColor={PrimaryColor}
          tagTextColor="#000"
          selectedItemTextColor={PrimaryColor}
          selectedItemIconColor={PrimaryColor}
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          itemFontSize={14}
          single={single}
          styleMainWrapper={{ width: 200 }}
          styleItemsContainer={{ width: 200 }}
          searchInputStyle={{ color: PrimaryColor }}
          textInputProps={{ editable: false }}
        />
        {!!selectedItems.length && showSelected && (
          <View>{this.multiSelect.getSelectedItemsExt(selectedItems)}</View>
        )}

        {!!selectedItems.length && (
          <View style={styles.clear}>
            <Icon
              name="erase"
              size={25}
              color={PrimaryColor}
              onPress={this._clearItem}
            />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 40,
    marginLeft: 20,
    flexDirection: 'row'
  },
  clear: {
    marginTop: 8,
    marginLeft: 5
  }
})

export default MultiSelectForm
