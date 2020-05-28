import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native'
import { PrimaryColor } from '../config/color'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { Input, CheckBox } from 'react-native-elements'
import { connect } from 'react-redux'
import { previewOrderDetailWithUserInfo } from '../actions/order'
import { Location, Permissions } from 'expo'
import { getLatLongByAddress, getDistance } from '../actions/address'
import navigationService from '../navigationService'
import { setStorageItem, getStorageItem } from '../utils'
import Loading from '../components/Loading'
import Toast from 'react-native-easy-toast'

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class DeliveryInfo extends Component {
  state = {
    isGetLocationChecked: false,
    name: null,
    phone: null,
    address: null,
    voucher: '',
    nameError: '',
    phoneError: '',
    addressError: '',
    voucherError: '',
    isLoading: false
  }

  async componentDidMount() {
    const { user } = this.props.auth

    const name = user.name || (await getStorageItem('name'))
    const phone = user.phone || (await getStorageItem('phone'))
    const address = user.address || (await getStorageItem('address'))

    this.setState(() => ({
      name,
      phone,
      address
    }))
  }

  _onGetLocationChecked = () =>
    this.setState(() => ({ isGetLocationChecked: true }))

  _onAddLocationChecked = () =>
    this.setState(() => ({ isGetLocationChecked: false }))

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      return null
    }

    const location = await Location.getCurrentPositionAsync({})
    return location ? location : null
  }

  handlePreviewOrder = (userInfo, distance) => {
    const { previewOrderDetailWithUserInfo } = this.props
    const { name, phone } = this.state
    return previewOrderDetailWithUserInfo(userInfo, distance)
      .then(data => {
        if (data.orderdetails) {
          setStorageItem('name', name)
          setStorageItem('phone', phone)
          setStorageItem('address', userInfo.address)
          this.setState(() => ({
            isLoading: false
          }))
          navigationService.navigate('Checkout', {
            orderInfo: data
          })
        }
      })
      .catch(err => {
        if (err === 'Invalid Voucher!') {
          return this.setState(() => ({
            isLoading: false,
            voucherError: 'Mã ưu đãi không hợp lệ'
          }))
        }
        return this.setState(
          () => ({
            isLoading: false
          }),
          () => this.toast.show('Đã xảy ra lỗi! Vui lòng thử lại', 500)
        )
      })
  }

  _handleClickSubmit = async () => {
    const { isGetLocationChecked, name, phone, address, voucher } = this.state
    //clear error
    this.setState(() => ({
      nameError: '',
      phoneError: '',
      addressError: '',
      voucherError: ''
    }))

    //validate name and phone
    if (!name) {
      return this.setState(() => ({
        nameError: 'Vui lòng nhập tên'
      }))
    }

    if (!phone) {
      return this.setState(() => ({
        phoneError: 'Vui lòng nhập số điện thoại'
      }))
    }

    if (name.length && phone.length) {
      const userInfo = {
        name,
        phone
      }
      const srcLatLong = await getLatLongByAddress(
        '445 Huỳnh Tấn Phát, Nhà Bè, TPHCM'
      )
      if (isGetLocationChecked) {
        const currentLocation = await this._getLocationAsync()
        let distance = 0
        if (currentLocation) {
          const desLatLong = {
            lat: currentLocation.coords.latitude,
            lng: currentLocation.coords.longitude
          }

          const distanceObj = await getDistance(srcLatLong, desLatLong)
          if (distanceObj && distanceObj.value) {
            distance = parseInt(distanceObj.value) / 1000
            userInfo.address = distanceObj.destination_addresses
          }
        }
        userInfo.voucher = voucher
        this.setState(() => ({
          isLoading: true
        }))

        return this.handlePreviewOrder(userInfo, distance)
      }

      if (!address) {
        return this.setState(() => ({
          addressError: 'Vui lòng nhập địa chỉ nhận hàng'
        }))
      }

      if (address && address.length > 0) {
        userInfo.address = address
        const desLatLong = await getLatLongByAddress(address)
        let distance = 0
        if (desLatLong) {
          const distanceObj = await getDistance(srcLatLong, desLatLong)
          if (distanceObj && distanceObj.value) {
            distance = parseInt(distanceObj.value) / 1000
          }
        }
        userInfo.voucher = voucher
        this.setState(() => ({
          isLoading: true
        }))
        return this.handlePreviewOrder(userInfo, distance)
      }
    }
  }

  _renderInfo = () => {
    const { isGetLocationChecked, name, phone, address, voucher } = this.state
    const { auth } = this.props
    const token = auth.token
    return (
      <View>
        <Text
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 5
          }}
        >
          Thông tin chung
        </Text>
        <Input
          label="Name"
          inputStyle={styles.formInput}
          onChangeText={name => this.setState(() => ({ name }))}
          value={name}
          errorMessage={this.state.nameError}
          labelStyle={styles.label}
        />
        <Input
          label="Phone Number"
          labelStyle={[styles.label, { marginTop: 10 }]}
          inputStyle={styles.formInput}
          onChangeText={phone => this.setState(() => ({ phone }))}
          keyboardType="numeric"
          maxLength={11}
          value={phone}
          errorMessage={this.state.phoneError}
        />
        <Text
          style={{
            marginLeft: 10,
            marginTop: 20,
            fontSize: 16,
            fontWeight: '500'
          }}
        >
          Địa chỉ giao hàng
        </Text>
        <View style={{ marginTop: 5 }}>
          <CheckBox
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            title="Sử dụng địa chỉ hiện tại"
            checked={isGetLocationChecked}
            checkedColor={PrimaryColor}
            onPress={this._onGetLocationChecked}
          />

          <CheckBox
            containerStyle={styles.checkboxContainer}
            title="Nhập địa chỉ khác"
            textStyle={styles.checkboxText}
            checked={!isGetLocationChecked}
            checkedColor={PrimaryColor}
            onPress={this._onAddLocationChecked}
          />

          {!isGetLocationChecked && (
            <View style={{ marginTop: 5 }}>
              <Input
                inputStyle={styles.formInput}
                onChangeText={address => this.setState(() => ({ address }))}
                value={address}
                errorMessage={this.state.addressError}
              />
            </View>
          )}
        </View>
        {token && (
          <View style={{ marginTop: 5 }}>
            <Text
              style={{
                marginLeft: 10,
                marginTop: 20,
                fontSize: 16,
                fontWeight: '500'
              }}
            >
              Mã ưu đãi (nếu có)
            </Text>
            <View style={{ marginTop: 5 }}>
              <Input
                inputStyle={styles.formInput}
                onChangeText={voucher => this.setState(() => ({ voucher }))}
                value={voucher}
                errorMessage={this.state.voucherError}
              />
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={this._handleClickSubmit}
        >
          <Text style={styles.submitText}>Xác nhận</Text>
        </TouchableOpacity>
        <Toast
          ref={node => {
            this.toast = node
          }}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </View>
    )
  }

  render() {
    const { isLoading } = this.state
    return (
      <DismissKeyboard>
        {!isLoading ? (
          <View style={styles.container}>
            <View style={styles.header}>
              <MaterialIcon
                name="keyboard-arrow-left"
                size={35}
                color="#fff"
                onPress={() => this.props.navigation.goBack()}
              />
              <Text style={styles.headerText}>Thông Tin Giao Hàng</Text>
            </View>
            {this._renderInfo()}
          </View>
        ) : (
          <Loading />
        )}
      </DismissKeyboard>
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
    paddingTop: 5,
    width: 200
  },
  subtitleText: {
    fontWeight: '400',
    fontSize: 12
  },
  label: {
    fontSize: 14
  },
  formInput: {
    minHeight: 25,
    fontSize: 14
  },
  checkboxContainer: {
    backgroundColor: '#fcfcfc',
    borderWidth: 0,
    padding: 0,
    marginLeft: 20
  },
  checkboxText: {
    fontWeight: '400'
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
  }
})

export default connect(
  state => ({
    order: state.order,
    auth: state.auth
  }),
  dispatch => ({
    previewOrderDetailWithUserInfo: (userInfo, distance) =>
      dispatch(previewOrderDetailWithUserInfo(userInfo, distance))
  })
)(DeliveryInfo)
