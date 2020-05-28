import React from 'react'
import { AppState, Clipboard, View, Text, StyleSheet } from 'react-native'
import Navigator from './app/navigator.js'
import { Provider } from 'react-redux'
import configureStore from './app/store/configureStore'
import reducers from './app/reducers/index'
import navigationService from './app/navigationService'
import { Updates, Font } from 'expo-font'
import { getStorageItem } from './app/utils.js'
import {
  getUserInfo,
  createBirthDayVoucher,
  getVoucherForUser
} from './app/actions/auth.js'
import dateFnsFormat from 'date-fns/format'
import PopupDialog, {
  FadeAnimation,
  DialogTitle,
  DialogButton
} from 'react-native-popup-dialog'
import { PrimaryColor } from './app/config/color.js'
import Toast from 'react-native-easy-toast'

Text.defaultProps = Text.defaultProps || {}
Text.defaultProps.allowFontScaling = false
const fadeAnimation = new FadeAnimation({
  toValue: 0, // optional
  animationDuration: 500, // optional
  useNativeDriver: true // optional
})
const store = configureStore({}, reducers)
export default class App extends React.Component {
  state = {
    fontLoaded: false,
    checkBirthday: false,
    hasBirthdayVoucher: false,
    appState: AppState.currentState
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
    await this._handleGetUserInfo()
    await Font.loadAsync({
      'SF-Black': require('./assets/fonts/SFCompactDisplay-Black.otf'),
      'SF-Bold': require('./assets/fonts/SFCompactDisplay-Bold.otf'),
      'SF-Regular': require('./assets/fonts/SFCompactDisplay-Regular.otf'),
      'SF-Medium': require('./assets/fonts/SFCompactDisplay-Medium.otf'),
      'SF-Semibold': require('./assets/fonts/SFCompactDisplay-Semibold.otf')
    })

    try {
      const update = await Updates.checkForUpdateAsync()
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        // ... notify user of update ...
        // Alert.alert(
        //   'New Update Detected',
        //   'Restart the app to install the latest update',
        //   [
        //     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //     {text: 'OK', onPress: () => Updates.reloadFromCache()},
        //   ],
        //   { cancelable: false }
        // )
        Updates.reloadFromCache()
      }
    } catch (e) {
      // handle or log error
    }
    this.setState({ fontLoaded: true })
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = nextAppState => {
    const { appState } = this.state
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      this._handleGetUserInfo()
    }
    this.setState({ appState: nextAppState })
  }

  _handleGetUserInfo = async () => {
    const token = await getStorageItem('userToken')
    if (token) {
      store.dispatch({ type: 'SET_TOKEN', token })
      await store.dispatch(getUserInfo(token))

      const isBirthday =
        dateFnsFormat(new Date(), 'MM/DD') ===
        dateFnsFormat(new Date(store.getState().auth.user.birthday), 'MM/DD')

      if (isBirthday) {
        store
          .dispatch(createBirthDayVoucher())
          .then(data => {
            this.setState(
              () => ({
                checkBirthday: true,
                hasBirthdayVoucher: data
              }),
              () => this._handleShowDialog()
            )
          })
          .catch(() =>
            this.setState(() => ({
              checkBirthday: true
            }))
          )
      } else {
        this.setState(() => ({
          checkBirthday: true
        }))
      }
      store.dispatch(getVoucherForUser())
    }
    this.setState(() => ({
      checkBirthday: true
    }))
  }

  _handleShowDialog = () => {
    this._popupDialog.show()
  }

  _handleCloseDialog = () => {
    this._popupDialog.dismiss()
  }

  _copyToClipboard = async item => {
    await Clipboard.setString(item)
    this.toast.show('Mã ưu đãi đã được copy', 500)
  }

  render() {
    const { fontLoaded, checkBirthday, hasBirthdayVoucher } = this.state
    const birthdayCode = hasBirthdayVoucher && hasBirthdayVoucher.code

    return fontLoaded && checkBirthday ? (
      <Provider store={store}>
        <Navigator
          ref={navigatorRef => {
            navigationService.setTopLevelNavigator(navigatorRef)
          }}
        />
        <PopupDialog
          ref={popupDialog => {
            this._popupDialog = popupDialog
          }}
          dialogTitle={<DialogTitle title="Thông báo" />}
          dialogAnimation={fadeAnimation}
          width={300}
          height={250}
          containerStyle={{ paddingTop: 10 }}
          dismissOnTouchOutside={false}
          dismissOnHardwareBackPress={false}
        >
          <View style={styles.popupContent}>
            <View>
              <Text style={{ fontSize: 16, textAlign: 'center' }}>
                Chúc mừng sinh nhật bạn, Mitee xin tặng bạn mã giảm giá
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginVertical: 5,
                  textDecorationLine: 'underline'
                }}
                onPress={() => this._copyToClipboard(birthdayCode)}
              >
                {birthdayCode}
              </Text>
              <Text style={{ fontSize: 16, textAlign: 'center' }}>
                Hạn sử dụng tới hết ngày
              </Text>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                {dateFnsFormat(
                  new Date(hasBirthdayVoucher.expiredDate),
                  'YYYY/MM/DD'
                )}
              </Text>
            </View>
            <View style={styles.popupAction}>
              <DialogButton
                text="Order ngay"
                onPress={() => {
                  this._handleCloseDialog()
                  navigationService.navigate('Home')
                }}
                textStyle={styles.popupButtonText}
                buttonStyle={styles.popupButton}
                textContainerStyle={styles.popupTextContainer}
              />
              <DialogButton
                text="Để sau"
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
        <Toast
          ref={node => {
            this.toast = node
          }}
          position="bottom"
          positionValue={110}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </Provider>
    ) : null
  }
}

const styles = StyleSheet.create({
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
