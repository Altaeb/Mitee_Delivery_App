import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import { Input, ListItem } from 'react-native-elements'
import {
  logout,
  getUserInfo,
  updateUserInfo,
  getVoucherForUser
} from '../actions/auth'
import { connect } from 'react-redux'
import navigationService from '../navigationService'
import Loading from '../components/Loading'
import Toast from 'react-native-easy-toast'
import format from 'date-fns/format'

const dateRegex = /^(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)
class UserInfoScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.auth.user.name,
      birthday: props.auth.user.birthday,
      birtdayError: '',
      nameError: '',
      enableUpdate: false,
      updateLoading: false
    }

    this.listAction = [
      {
        title: 'Lịch sử đơn hàng',
        action: () => this._handleClickOrderHistory()
      },
      {
        title: 'Danh sách mã ưu đãi',
        action: () => this._getVoucherByUser(),
        badge: true
      },
      {
        title: 'Đăng xuất',
        action: () => this._handleLogout()
      }
    ]
  }

  componentDidMount() {
    const { getUserInfo, getVoucherForUser } = this.props
    const { token } = this.props.auth

    getUserInfo(token).then(() => {
      getVoucherForUser()
    })
  }

  _handleLogout = () => {
    this.props.logout()
  }

  _handleClickOrderHistory = () => {
    navigationService.navigate('OrderHistory')
  }

  _getVoucherByUser = () => {
    navigationService.navigate('UserVoucher')
  }

  _onChangeText = (key, text) => {
    this.setState(() => ({
      enableUpdate: true,
      [key]: text
    }))
  }

  _updateInfo = data => {
    const { updateUserInfo, auth } = this.props

    this.setState(() => ({
      updateLoading: true
    }))

    return updateUserInfo(data)
      .then(() => {
        this.setState(() => ({
          updateLoading: false,
          birtdayError: '',
          nameError: '',
          enableUpdate: false
        }))
      })
      .catch(() => {
        this.setState(
          () => ({
            updateLoading: false,
            birtdayError: '',
            nameError: '',
            enableUpdate: false,
            name: auth.user.name,
            birthday: auth.user.birthday
          }),
          () =>
            this.toast.show('Cập nhật không thành công. Đã xảy ra lỗi!', 500)
        )
      })
  }

  _handleUpdateInfo = () => {
    const { birthday, name, enableUpdate } = this.state
    if (!enableUpdate) return null
    this.setState(() => ({
      nameError: '',
      birtdayError: ''
    }))

    if (name) {
      if (this.props.auth.user.birthday) {
        return this._updateInfo({ name })
      }
      //update birthday info and name
      if (!dateRegex.test(birthday)) {
        return this.setState(() => ({
          birtdayError: 'Ngày sinh không hợp lệ'
        }))
      }
      return this._updateInfo({ name, birthday })
    }
    return this.setState(() => ({
      nameError: 'Tên không hợp lệ'
    }))
  }

  _renderInfo = () => {
    const { auth } = this.props

    return (
      <View>
        <View style={styles.wrapperInfo}>
          <Input
            value={auth.user.phone}
            editable={false}
            label={'Số điện thoại'}
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
          />
          <Input
            value={auth.user.level}
            editable={false}
            label={'Loại tài khoản'}
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
          />
        </View>
        <Input
          value={auth.user.points.toString()}
          editable={false}
          label={'Điểm tích luỹ'}
          inputContainerStyle={styles.inputContainerStyle}
          containerStyle={styles.containerStyle}
          labelStyle={styles.labelStyle}
          inputStyle={styles.inputStyle}
        />
        <View style={styles.wrapperInfo}>
          <Input
            value={this.state.name}
            label={'Tên tài khoản'}
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            onChangeText={text => this._onChangeText('name', text)}
            errorStyle={{ color: 'red' }}
            errorMessage={this.state.nameError}
          />
          <Input
            value={
              auth.user.birthday
                ? format(auth.user.birthday, 'YYYY/MM/DD')
                : this.state.birthday
            }
            editable={!auth.user.birthday} //not allow update birthday if had
            label={'Ngày sinh'}
            placeholder={'YYYY/MM/DD'}
            maxLength={10}
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            onChangeText={text => this._onChangeText('birthday', text)}
            errorStyle={{ color: 'red' }}
            errorMessage={this.state.birtdayError}
          />
        </View>
        <Toast
          ref={node => {
            this.toast = node
          }}
          position="top"
          positionValue={80}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </View>
    )
  }

  render() {
    const { loading, vouchers } = this.props.auth
    const { enableUpdate, updateLoading } = this.state
    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Tài khoản</Text>
            <Text
              style={
                enableUpdate
                  ? [styles.headerAction, styles.enableHeaderAction]
                  : [styles.headerAction, styles.disableHeaderAction]
              }
              onPress={this._handleUpdateInfo}
            >
              Cập nhật
            </Text>
          </View>
          {loading || updateLoading ? (
            <Loading />
          ) : (
            <View style={styles.content}>
              <View style={styles.contentWrapper}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginBottom: 10
                  }}
                >
                  Thông tin tài khoản
                </Text>
                {this._renderInfo()}
              </View>

              <View style={styles.contentWrapper}>
                {this.listAction.map((l, i) => (
                  <ListItem
                    chevron
                    key={i}
                    title={l.title}
                    onPress={l.action}
                    bottomDivider
                    badge={
                      l.badge && vouchers.length
                        ? {
                            value: vouchers.length,
                            textStyle: { color: 'white' },
                            status: 'success'
                          }
                        : undefined
                    }
                  />
                ))}
              </View>
            </View>
          )}
        </View>
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
    backgroundColor: '#068480',
    height: 80
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    marginTop: 38,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  headerAction: {
    fontSize: 16,
    marginTop: -20,
    textAlign: 'right',
    marginRight: 20
  },
  disableHeaderAction: {
    color: 'rgba(255,255,255, 0.5)'
  },
  enableHeaderAction: {
    color: '#fff'
  },
  contentWrapper: {
    marginTop: 5,
    padding: 20,
    backgroundColor: '#fff'
  },
  inputContainerStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#9b9b9b',
    paddingVertical: 0
  },
  inputStyle: {
    fontSize: 16,
    marginTop: -3,
    marginBottom: -3
  },
  containerStyle: {
    marginTop: 8,
    width: 160
  },
  labelStyle: {
    fontWeight: 'normal'
  },
  wrapperInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default connect(
  state => ({
    auth: state.auth
  }),
  dispatch => ({
    logout: () => dispatch(logout()),
    getUserInfo: token => dispatch(getUserInfo(token)),
    getVoucherForUser: () => dispatch(getVoucherForUser()),
    updateUserInfo: data => dispatch(updateUserInfo(data))
  })
)(UserInfoScreen)
