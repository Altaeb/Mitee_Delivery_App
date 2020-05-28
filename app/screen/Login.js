import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { PrimaryColor, blueWhite } from '../config/color'
import { signIn } from '../actions/auth'
import { connect } from 'react-redux'
import navigationService from '../navigationService'
import PopupDialog, {
  FadeAnimation,
  DialogTitle,
  DialogButton
} from 'react-native-popup-dialog'
import { validation } from '../utils'
import Loading from '../components/Loading'

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const fadeAnimation = new FadeAnimation({
  toValue: 0, // optional
  animationDuration: 500, // optional
  useNativeDriver: true // optional
})

class LoginScreen extends Component {
  state = {
    phoneSignIn: ''
  }

  _handleLogin = () => {
    const { phoneSignIn } = this.state
    if (!validation.isNumber(phoneSignIn)) return this._handleShowDialog()

    this.props
      .signin(phoneSignIn)
      .then(() => {
        navigationService.navigate('UserInfo')
      })
      .catch(() => {
        this._handleShowDialog()
      })
  }

  _handleShowDialog = () => {
    this._popupDialog.show()
  }

  _handleCloseDialog = () => {
    this._popupDialog.dismiss()
  }

  renderAlert = () => {
    return (
      <PopupDialog
        ref={popupDialog => {
          this._popupDialog = popupDialog
        }}
        dialogTitle={<DialogTitle title="Error" />}
        dialogAnimation={fadeAnimation}
        width={300}
        height={200}
        containerStyle={{ paddingTop: 10 }}
        dismissOnTouchOutside={false}
        dismissOnHardwareBackPress={false}
      >
        <View style={styles.popupContent}>
          <Text style={{ fontSize: 16 }}>Tài khoản của bạn không hợp lệ</Text>
          <View style={styles.popupAction}>
            <DialogButton
              text="Dismiss"
              onPress={() => {
                this._handleCloseDialog()
              }}
              textStyle={styles.popupButtonText}
              buttonStyle={styles.popupButton}
              textContainerStyle={styles.popupTextContainer}
            />
          </View>
        </View>
      </PopupDialog>
    )
  }

  render() {
    const { phoneSignIn } = this.state
    const { loading } = this.props.auth
    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Đăng nhập</Text>
          </View>

          {loading ? (
            <Loading />
          ) : (
            <View style={styles.contentWrapper}>
              <Input
                label={'Số điện thoại'}
                keyboardType="numeric"
                onChangeText={value =>
                  this.setState(() => ({ phoneSignIn: value }))
                }
                maxLength={11}
                inputStyle={styles.inputStyle}
                containerStyle={{ width: 350 }}
              />
              <Button
                title="Đăng nhập"
                disabled={!phoneSignIn || phoneSignIn.length < 10}
                onPress={this._handleLogin}
                containerStyle={styles.buttonContainer}
                buttonStyle={styles.buttonStyle}
                titleStyle={styles.titleButtonStyle}
              />
            </View>
          )}

          {this.renderAlert()}
        </View>
      </DismissKeyboard>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: blueWhite
  },
  header: {
    backgroundColor: '#068480',
    height: 80,
    marginBottom: 25,
    justifyContent: 'center'
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40
  },
  contentWrapper: {
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 60
  },
  buttonStyle: {
    width: 300,
    borderColor: PrimaryColor,
    backgroundColor: PrimaryColor
  },
  titleButtonStyle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  },
  inputStyle: {
    paddingHorizontal: 5
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
    signin: phone => dispatch(signIn(phone))
  })
)(LoginScreen)
