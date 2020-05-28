import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { PrimaryColor } from '../config/color'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ListItem } from 'react-native-elements'
import { formatCurrency } from '../utils'

class OrderHistoryDetail extends Component {
  constructor(props) {
    super(props)
    const { navigation } = props
    this.state = {
      orderInfo: navigation.getParam('orderInfo')
    }
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
        <View style={{ marginLeft: 10, marginTop: 5, flex: 5 }}>
          <Text style={{ fontSize: 17 }}>Thông tin đơn hàng</Text>
          <ScrollView
            style={{
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
                          {`Topping: ${this._renderToppingText(
                            order.toppings
                          )}`}
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
        </View>
        <View style={{ marginLeft: 10, marginTop: 5, flex: 5 }}>
          <Text style={{ fontSize: 17 }}>Thông tin giao hàng</Text>
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
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcon
            name="keyboard-arrow-left"
            size={35}
            color="#fff"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.headerText}>Lịch sử đơn hàng</Text>
        </View>
        {this._renderOrderDetails()}
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
  shippingDetailHeader: {
    marginLeft: 20,
    fontSize: 12,
    marginTop: 5
  }
})

export default OrderHistoryDetail
