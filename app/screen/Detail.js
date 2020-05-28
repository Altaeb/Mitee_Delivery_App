import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native'
import Image from '../components/Image'
import { PrimaryColor } from '../config/color'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { getDetail } from '../actions/detail'
import { addOrderDetail } from '../actions/order'
import { connect } from 'react-redux'
import OptionForm from '../components/OptionForm'
import MultiSelect from '../components/MultiSelect'
import PopupDialog, {
  FadeAnimation,
  DialogTitle,
  DialogButton
} from 'react-native-popup-dialog'
import navigationService from '../../app/navigationService'
import QuantitySelector from '../components/QuantitySelector'
import Loading from '../components/Loading'

const fadeAnimation = new FadeAnimation({
  toValue: 0, // optional
  animationDuration: 500, // optional
  useNativeDriver: true // optional
})

const sugarOptions = [
  {
    label: '40%',
    value: 40
  },
  {
    label: '70%',
    value: 70
  },
  {
    label: '100%',
    value: 100
  }
]

const iceOptions = sugarOptions

class DetailScreen extends Component {
  state = {
    isDialogOpen: false,
    size: 0,
    ice: 0,
    sugar: 0,
    topping: []
  }

  componentDidMount() {
    const { navigation } = this.props
    const itemId = navigation.getParam('itemId')
    this.props.getDetail(itemId)
  }

  _getOptionValue = (option, value) => {
    return this.setState(() => ({
      [option]: value
    }))
  }

  _getMultiValue = value => {
    return this.setState(({ topping }) => ({
      topping: topping.concat(value)
    }))
  }

  _removeValue = value => {
    return this.setState(({ topping }) => ({
      topping: topping.filter(item => item !== value[0])
    }))
  }

  _handleShowDialog = () => {
    this._popupDialog.show(() => {
      this._scrollView.scrollTo({ x: 0, y: 0, animated: true })
      this._scrollView.setNativeProps({
        scrollEnabled: false
      })
    })
  }

  _handleCloseDialog = () => {
    this._popupDialog.dismiss(() => {
      this._scrollView.setNativeProps({
        scrollEnabled: true
      })
    })
  }

  _handleClickSubmit = () => {
    const {
      detail: { detail: item },
      addOrderDetail
    } = this.props

    const { size, sugar, ice, topping } = this.state

    const selectedSize = item.prices[size]
    const selectedSugar = sugarOptions[sugar]
    const selectedIce = iceOptions[ice]
    const selectedTopping = topping.map(topping => {
      const selected = item.toppings.find(item => item.id === topping)
      return selected.id
    })

    this._handleShowDialog()

    const orderDetail = {
      ice: selectedIce.label,
      sugar: selectedSugar.label,
      product: item.id,
      toppings: selectedTopping,
      size: selectedSize.size,
      number: this._quantityRef._quantityValue
    }

    addOrderDetail(orderDetail)
  }

  renderSelectTopping = toppingItems => {
    const { size } = this.state
    const forms = []
    const limit = size === 0 ? 2 : 3
    for (let i = 0; i < limit; i++) {
      forms.push(
        <MultiSelect
          key={i}
          items={toppingItems}
          onGetMultiValue={this._getMultiValue}
          onRemoveValue={this._removeValue}
          single={true}
          showSelected={false}
        />
      )
    }
    return forms
  }

  render() {
    const {
      detail: { detail: item },
      navigation
    } = this.props

    const itemId = navigation.getParam('itemId')

    if (!item) return <Loading />
    if (item.id !== itemId) return null

    const sizeOptions = item.prices.map(item => ({
      label: item.size,
      value: item.price
    }))

    const toppingItems = item.toppings.map(item => ({
      id: item.id,
      name: item.name
    }))

    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={node => (this._scrollView = node)}
        >
          <Image src={item.picture[0].url} parentPadding={0} border={0} />
          <View style={styles.back}>
            <MaterialIcon
              name="keyboard-arrow-left"
              size={25}
              color="#fff"
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.categories}>
              {item.category && item.category.name}
            </Text>
            <View style={styles.costWrapper}>
              <Text style={styles.mainCost}>
                {item.preparingTime} - {parseInt(item.preparingTime) + 5}
              </Text>
              <Text style={styles.subCost}>mins</Text>
            </View>
          </View>

          <View style={styles.optionWrapper}>
            <View style={styles.lineGray} />
            <View style={styles.optionItemWrapper}>
              <Text style={styles.optionHeader}>Size</Text>
              <OptionForm
                options={sizeOptions}
                onGetValue={value => this._getOptionValue('size', value)}
              />
            </View>
            <View style={styles.optionItemWrapper}>
              <Text style={styles.optionHeader}>Sugar</Text>
              <OptionForm
                options={sugarOptions}
                onGetValue={value => this._getOptionValue('sugar', value)}
              />
            </View>
            <View style={styles.optionItemWrapper}>
              <Text style={styles.optionHeader}>Ice</Text>
              <OptionForm
                options={iceOptions}
                onGetValue={value => this._getOptionValue('ice', value)}
              />
            </View>
            <View style={styles.lineGray} />
            <Text style={styles.optionHeader}>Topping</Text>
            {toppingItems.length > 0 ? (
              this.renderSelectTopping(toppingItems)
            ) : (
              <Text style={{ textAlign: 'center' }}>
                Không có topping cho món này
              </Text>
            )}
            <View style={styles.lineGray} />
            <Text style={styles.optionHeader}>Số lượng</Text>
            <QuantitySelector
              minQuantity={1}
              ref={node => (this._quantityRef = node)}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={this._handleClickSubmit}
            >
              <Text style={styles.submitText}>Đặt hàng</Text>
            </TouchableOpacity>
          </View>

          <PopupDialog
            ref={popupDialog => {
              this._popupDialog = popupDialog
            }}
            dialogTitle={<DialogTitle title="Thành công" />}
            dialogAnimation={fadeAnimation}
            width={300}
            height={200}
            containerStyle={{ paddingTop: 10 }}
            dismissOnTouchOutside={false}
            dismissOnHardwareBackPress={false}
          >
            <View style={styles.popupContent}>
              <Text style={{ fontSize: 16 }}>
                Sản phẩm đã được thêm vào giỏ hàng
              </Text>
              <View style={styles.popupAction}>
                <DialogButton
                  text="Thanh toán"
                  onPress={() => {
                    this._handleCloseDialog()
                    navigationService.navigate('DeliveryInfo')
                  }}
                  textStyle={styles.popupButtonText}
                  buttonStyle={styles.popupButton}
                  textContainerStyle={styles.popupTextContainer}
                />
                <DialogButton
                  text="Tiếp tục order"
                  onPress={() => {
                    this._handleCloseDialog()
                    navigationService.navigate('Home')
                  }}
                  textStyle={styles.popupButtonText}
                  buttonStyle={styles.popupButton}
                  textContainerStyle={styles.popupTextContainer}
                />
              </View>
            </View>
          </PopupDialog>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 28,
    height: 28,
    borderRadius: 50,
    borderColor: 'rgba(0,0,0,0.25)',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingLeft: 1,
    paddingTop: 2
  },
  wrapper: {
    marginTop: 20,
    marginLeft: 10
  },
  title: {
    fontWeight: '600',
    fontSize: 19
  },
  categories: {
    fontSize: 14,
    marginTop: 5,
    color: 'grey'
  },
  percent: {
    fontWeight: '400',
    color: '#82f441',
    marginLeft: 5
  },
  costWrapper: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    width: 80,
    height: 50,
    borderRadius: 45,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainCost: {
    fontWeight: 'bold',
    fontSize: 16,
    color: PrimaryColor,
    width: '100%',
    textAlign: 'center'
  },
  subCost: {
    fontWeight: '100',
    fontSize: 14,
    color: PrimaryColor
  },
  lineGray: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15
  },
  optionWrapper: {
    marginLeft: 10
  },
  optionItemWrapper: {
    marginTop: 5
  },
  optionHeader: {
    fontSize: 15,
    marginBottom: 10
  },
  submitButton: {
    margin: 25,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: PrimaryColor,
    borderRadius: 5
  },
  submitText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  popupContent: {
    padding: 20
  },
  popupAction: {
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  popupButtonText: {
    fontSize: 16,
    color: '#fff'
  },
  popupButton: {
    marginTop: 15,
    backgroundColor: PrimaryColor,
    borderRadius: 5
  },
  popupTextContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10
  }
})

export default connect(
  state => ({
    detail: state.detail,
    order: state.order
  }),
  dispatch => ({
    getDetail: id => dispatch(getDetail(id)),
    addOrderDetail: orderDetail => dispatch(addOrderDetail(orderDetail))
  })
)(DetailScreen)
