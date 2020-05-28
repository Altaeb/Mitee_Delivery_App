import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { PrimaryColor } from '../config/color'
import { getOrderByUser } from '../actions/auth'
import { cancelOrderById } from '../actions/order'
import { connect } from 'react-redux'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ListItem } from 'react-native-elements'
import dateFnsFormat from 'date-fns/format'
import compareDesc from 'date-fns/compare_desc'
import navigationService from '../navigationService'
import Loading from '../components/Loading'
import PopupDialog, {
  FadeAnimation,
  DialogTitle,
  DialogButton
} from 'react-native-popup-dialog'

const fadeAnimation = new FadeAnimation({
  toValue: 0, // optional
  animationDuration: 500, // optional
  useNativeDriver: true // optional
})

class UserOrderHistory extends Component {
  selectedOrderId = null
  state = {
    loading: true
  }

  componentDidMount() {
    this.props.getOrderByUser().then(() => {
      this.setState({ loading: false })
    })
  }

  _refreshOrderHistory = () => {
    this.setState({ loading: true })
    this.props.getOrderByUser().then(() => {
      this.setState({ loading: false })
    })
  }

  _handleClickItemHistory = item => {
    navigationService.navigate('OrderHistoryDetail', { orderInfo: item })
  }

  _handleCancelOrder = id => {
    this.selectedOrderId = id
    this._popupDialog.show()
  }

  _renderPopupConfirm = () => (
    <PopupDialog
      ref={popupDialog => {
        this._popupDialog = popupDialog
      }}
      dialogTitle={<DialogTitle title={'Thông báo'} />}
      dialogAnimation={fadeAnimation}
      width={300}
      height={200}
      containerStyle={{ paddingTop: 10 }}
      dismissOnTouchOutside={false}
      dismissOnHardwareBackPress={false}
    >
      <View style={styles.popupContent}>
        <Text style={{ fontSize: 16 }}>
          Bạn có chắc chắn muốn huỷ đơn hàng này không?
        </Text>
        <View style={styles.popupAction}>
          <DialogButton
            text="Không"
            onPress={() => {
              this._popupDialog.dismiss()
            }}
            textStyle={styles.popupButtonText}
            buttonStyle={styles.popupButton}
            textContainerStyle={styles.popupTextContainer}
          />
          <DialogButton
            text="Chắc chắn"
            onPress={() => {
              this.props.cancelOrderById(this.selectedOrderId).then(() => {
                this._popupDialog.dismiss()
                this._refreshOrderHistory()
              })
            }}
            textStyle={styles.popupButtonText}
            buttonStyle={styles.popupButton}
            textContainerStyle={styles.popupTextContainer}
          />
        </View>
      </View>
    </PopupDialog>
  )

  _renderInfo = () => {
    const { user } = this.props.auth
    const orderHistory = user.orders
    const { loading } = this.state

    return loading ? (
      <View style={{ height: '80%' }}>
        <Loading />
      </View>
    ) : (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: '66.5%', marginBottom: 20 }}
      >
        <View>
          {orderHistory
            .sort((x, y) =>
              compareDesc(new Date(x.createdAt), new Date(y.createdAt))
            )
            .map((order, index) => {
              const orderDate = dateFnsFormat(
                new Date(order.createdAt),
                'DD/MM/YYYY'
              )

              const status = order.status
              const point = order.points

              return (
                <ListItem
                  hideChevron={true}
                  key={index}
                  title={orderDate}
                  titleStyle={{ fontWeight: 'bold' }}
                  rightTitle={
                    <View style={styles.rightTitleView}>
                      <Text
                        style={[
                          styles.statusColor(status),
                          { fontWeight: 'bold' }
                        ]}
                      >
                        {status}
                      </Text>
                      {~['New', 'Preparing'].indexOf(status) ? (
                        <TouchableOpacity
                          style={styles.cancelOrder}
                          onPress={() => this._handleCancelOrder(order.id)}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Huỷ
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  }
                  subtitle={
                    <View style={styles.subtitleView}>
                      <Text
                        style={styles.subtitleText}
                      >{`Điểm tích luỹ: ${point}`}</Text>
                    </View>
                  }
                  onPress={() => this._handleClickItemHistory(order)}
                  containerStyle={{
                    backgroundColor: '#fcfcfc',
                    paddingHorizontal: 30,
                    borderBottomWidth: 0.5,
                    borderColor: '#9b9b9b'
                  }}
                />
              )
            })}
        </View>
      </ScrollView>
    )
  }

  render() {
    const { auth } = this.props
    const { user } = auth
    const orderHistory = user.orders

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Orders</Text>
          <View style={styles.back}>
            <MaterialIcon
              name="keyboard-arrow-left"
              size={25}
              color="#fff"
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
        </View>
        {orderHistory && orderHistory.length > 0 ? (
          <View style={styles.content}>
            {this._renderInfo()}
            <View style={styles.updateWrapper}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={this._refreshOrderHistory}
              >
                <Text style={styles.updateText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              style={styles.orderNow}
              onPress={() => {
                this.props.navigation.pop()
                navigationService.navigate('Home')
              }}
            >
              <Text style={{ textAlign: 'center' }}>
                Bạn chưa có lịch sử order nào, order ngay
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {this._renderPopupConfirm()}
      </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc'
  },
  header: {
    backgroundColor: '#068480',
    height: 80,
    marginBottom: 25
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    marginTop: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitleView: {
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 5,
    width: 200
  },
  subtitleText: {
    fontWeight: '400',
    fontSize: 12
  },
  rightTitleView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cancelOrder: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: '#b40000',
    width: 65
  },
  statusColor: status => {
    const lowercaseStatus = status && status.toLowerCase()
    switch (lowercaseStatus) {
      case 'new':
        return { color: 'red' }
      case 'preparing':
        return { color: 'orange' }
      case 'delivering':
        return { color: 'green' }
      case 'finished':
        return { color: PrimaryColor }
      case 'cancelled':
        return { color: 'gray' }
      default:
        return { color: PrimaryColor }
    }
  },
  updateWrapper: {
    alignItems: 'center'
  },
  updateButton: {
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 5,
    width: '85%',
    backgroundColor: PrimaryColor
  },
  updateText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  orderNow: {
    borderWidth: 2,
    borderColor: '#9b9b9b',
    borderStyle: 'dashed',
    padding: 20,
    width: 250,
    height: 120,
    justifyContent: 'center'
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
    getOrderByUser: () => dispatch(getOrderByUser()),
    cancelOrderById: id => dispatch(cancelOrderById(id))
  })
)(UserOrderHistory)
