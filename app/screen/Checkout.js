import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { PrimaryColor } from '../config/color'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import { confirmOrder, confirmOrderPromise } from '../actions/order'
import { signIn } from '../actions/auth'
import navigationService from '../../app/navigationService'
import PopupDialog, {
  FadeAnimation,
  DialogTitle,
  DialogButton
} from 'react-native-popup-dialog'
import Loading from '../components/Loading'
import { formatCurrency } from '../utils'
import Toast from 'react-native-easy-toast'

const fadeAnimation = new FadeAnimation({
  toValue: 0, // optional
  animationDuration: 500, // optional
  useNativeDriver: true // optional
})

class CheckoutScreen extends Component {
  constructor(props) {
    super(props)
    const { navigation } = props
    this.state = {
      orderInfo: navigation.getParam('orderInfo'),
      isLoading: false,
      actionPopup: 'ordered'
    }
  }

  _handleClickConfirmOrder = () => {
    const { orderInfo } = this.state
    const { phone, address, voucher, distance, orderdetails } = orderInfo
    const { confirmOrderPromise, confirmOrder, auth } = this.props

    const orderDetails = orderdetails.map(order => {
      return { ...order, product: order.product.id }
    })

    this.setState(() => ({
      isLoading: true
    }))
    confirmOrderPromise({
      phone,
      address,
      voucher: voucher.code,
      distance,
      orderdetails: orderDetails
    })
      .then(() => {
        this.setState(() => ({
          isLoading: false,
          actionPopup: 'ordered'
        }))
        confirmOrder()
        if (!auth.token) {
          this.props.signIn(phone)
        }
        this._handleShowDialog()
      })
      .catch(err => {
        this.setState(
          () => ({
            isLoading: false
          }),
          () =>
            this.toast.show('Đặt hàng không thành công. Vui lòng thử lại!', 500)
        )
      })
  }

  _handleClickCancelOrder = () => {
    this.setState(
      () => ({
        actionPopup: 'cancel'
      }),
      () => this._handleShowDialog()
    )
  }

  _handleShowDialog = () => {
    this._popupDialog.show()
  }

  _handleCloseDialog = () => {
    this._popupDialog.dismiss()
  }

  _renderToppingText = toppings => {
    return toppings.map((item, index) => {
      return index < toppings.length - 1
        ? item.name + `(${item.price})` + ' '
        : item.name + `(${item.price})`
    })
  }

  _renderOrderDetails = () => {
    const { orderInfo } = this.state

    const orderDetails = orderInfo && orderInfo.orderdetails
    const address = orderInfo && orderInfo.address
    const phone = orderInfo && orderInfo.phone
    const shippingPrice = orderInfo && orderInfo.shippingPrice
    const totalPrice = orderInfo && orderInfo.totalPrice
    const discount = orderInfo && orderInfo.discount

    return (
      <View style={styles.container}>
        <Text style={{ marginLeft: 10, fontSize: 17 }}>Thông tin đơn hàng</Text>
        <ScrollView
          style={{
            height: '50%',
            marginVertical: 10
          }}
          showsVerticalScrollIndicator={false}
        >
          {orderDetails.map((order, index) => {
            const productPrice = order.productPrice
            const size = `Size: ${order.size} (${productPrice})`
            const totalProductPrice = order.totalPrice

            return (
              <ListItem
                hideChevron={true}
                key={index}
                title={order.product.name}
                titleStyle={{ fontSize: 15 }}
                subtitle={
                  <View style={styles.subtitleView}>
                    <Text
                      style={styles.subtitleText}
                    >{`${size}x(${order.number || 1})`}</Text>
                    {order.toppings.length > 0 && (
                      <Text style={styles.subtitleText}>
                        {`Topping: ${this._renderToppingText(order.toppings)}`}
                      </Text>
                    )}
                    <Text style={styles.subtitleText}>
                      Tổng cộng: {formatCurrency(totalProductPrice)}
                    </Text>
                  </View>
                }
                contentContainerStyle={{ marginBottom: -10 }}
              />
            )
          })}
        </ScrollView>
        <View style={{ marginTop: 5 }}>
          <Text style={{ marginLeft: 10, fontSize: 17 }}>
            Thông tin giao hàng
          </Text>
          <Text
            style={styles.shippingDetailHeader}
          >{`Địa chỉ: ${address}`}</Text>
          <Text
            style={styles.shippingDetailHeader}
          >{`Số điện thoại: ${phone}`}</Text>
          <Text
            style={styles.shippingDetailHeader}
          >{`Phí giao hàng: ${formatCurrency(shippingPrice)}`}</Text>
          <View>
            <Text style={{ marginLeft: 10, fontSize: 15, marginTop: 15 }}>
              Tổng cộng:{' '}
              <Text style={{ color: PrimaryColor, textAlign: 'right' }}>
                {discount
                  ? `${formatCurrency(totalPrice)} (-${formatCurrency(
                      discount
                    )})`
                  : formatCurrency(totalPrice)}
              </Text>
            </Text>
          </View>
          <View style={styles.submitAction}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={this._handleClickConfirmOrder}
            >
              <Text style={styles.submitText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelOrderButton]}
              onPress={this._handleClickCancelOrder}
            >
              <Text style={styles.submitText}>Huỷ</Text>
            </TouchableOpacity>
            <Toast
              ref={node => {
                this.toast = node
              }}
              position="top"
              positionValue={0}
              fadeInDuration={750}
              fadeOutDuration={1000}
              opacity={0.8}
            />
          </View>
        </View>
      </View>
    )
  }

  _renderPopupAction = action => {
    return (
      <PopupDialog
        ref={popupDialog => {
          this._popupDialog = popupDialog
        }}
        dialogTitle={
          <DialogTitle
            title={action === 'ordered' ? 'Thành công' : 'Thông báo'}
          />
        }
        dialogAnimation={fadeAnimation}
        width={300}
        height={200}
        containerStyle={{ paddingTop: 10 }}
        dismissOnTouchOutside={false}
        dismissOnHardwareBackPress={false}
      >
        <View style={styles.popupContent}>
          <Text style={{ fontSize: 16 }}>
            {action === 'ordered'
              ? 'Đơn hàng của bạn đã được đặt thành công'
              : 'Bạn có chắc chắn muốn huỷ đơn hàng này không?'}
          </Text>
          {action === 'ordered' ? (
            <View style={styles.popupAction}>
              <DialogButton
                text="Dismiss"
                onPress={() => {
                  this._handleCloseDialog()
                  navigationService.navigate('Home')
                }}
                textStyle={styles.popupButtonText}
                buttonStyle={styles.popupButton}
                textContainerStyle={styles.popupTextContainer}
              />
            </View>
          ) : (
            <View style={styles.popupAction}>
              <DialogButton
                text="Không chắc chắn"
                onPress={() => {
                  this._handleCloseDialog()
                }}
                textStyle={styles.popupButtonText}
                buttonStyle={styles.popupButton}
                textContainerStyle={styles.popupTextContainer}
              />
              <DialogButton
                text="Chắc chắn"
                onPress={() => {
                  this.props.cancelOrder()
                  navigationService.navigate('Home')
                }}
                textStyle={styles.popupButtonText}
                buttonStyle={styles.popupButton}
                textContainerStyle={styles.popupTextContainer}
              />
            </View>
          )}
        </View>
      </PopupDialog>
    )
  }

  render() {
    const { isLoading, actionPopup } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcon
            name="keyboard-arrow-left"
            size={35}
            color="#fff"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.headerText}>Xác nhận đơn hàng</Text>
        </View>

        {isLoading ? <Loading /> : this._renderOrderDetails()}
        {this._renderPopupAction(actionPopup)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc'
  },
  header: {
    backgroundColor: PrimaryColor,
    height: 80,
    marginBottom: 25,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5
  },
  back: {
    position: 'absolute',
    top: 22,
    left: 20,
    width: 26,
    height: 26
  },
  subtitleView: {
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 5
  },
  subtitleText: {
    fontWeight: '400',
    fontSize: 12
  },
  submitAction: {
    margin: 25,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 5,
    width: 135
  },
  submitButton: {
    backgroundColor: PrimaryColor
  },
  cancelOrderButton: {
    backgroundColor: '#b40000'
  },
  submitText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  shippingDetailHeader: {
    marginLeft: 20,
    fontSize: 12,
    marginTop: 5
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
    auth: state.auth
  }),
  dispatch => ({
    confirmOrder: () => dispatch(confirmOrder()),
    confirmOrderPromise: orderInfo => dispatch(confirmOrderPromise(orderInfo)),
    cancelOrder: () => dispatch({ type: 'CANCEL_ORDER' }),
    signIn: phone => dispatch(signIn(phone))
  })
)(CheckoutScreen)
