import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import { PrimaryColor } from '../config/color'
import { getVoucherForUser } from '../actions/auth'
import { connect } from 'react-redux'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ListItem } from 'react-native-elements'
import dateFnsFormat from 'date-fns/format'
import Loading from '../components/Loading'
import Toast from 'react-native-easy-toast'
import { ScrollView } from 'react-native-gesture-handler'
import { formatCurrency } from '../utils'

class UserVoucher extends Component {
  state = {
    loading: true
  }

  async componentDidMount() {
    const { getVoucherForUser } = this.props
    try {
      await getVoucherForUser()
      this.setState(() => ({
        loading: false
      }))
    } catch (err) {
      this.setState(() => ({
        loading: false
      }))
    }
  }

  _refreshVoucher = async () => {
    this.setState(() => ({
      loading: true
    }))
    try {
      await this.props.getVoucherForUser()
      this.setState(() => ({
        loading: false
      }))
    } catch (err) {
      this.setState(() => ({
        loading: false
      }))
    }
  }

  _copyToClipboard = async item => {
    await Clipboard.setString(item.code)
    this.toast.show('Mã ưu đãi đã được copy', 500)
  }

  render() {
    const { auth } = this.props
    const { loading } = this.state
    const { vouchers } = auth

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Vouchers</Text>
          <View style={styles.back}>
            <MaterialIcon
              name="keyboard-arrow-left"
              size={25}
              color="#fff"
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
        </View>
        {loading ? (
          <Loading />
        ) : vouchers && vouchers.length > 0 ? (
          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ height: '65%', marginBottom: 20 }}
            >
              {vouchers.map((voucher, index) => (
                <ListItem
                  hideChevron={true}
                  key={index}
                  title={voucher.code}
                  titleStyle={{ fontWeight: 'bold' }}
                  rightTitle={voucher.status}
                  rightTitleStyle={{ color: PrimaryColor, fontWeight: 'bold' }}
                  subtitle={
                    <View style={styles.subtitleView}>
                      <Text style={styles.subtitleText}>{`Giá trị: ${
                        voucher.type === 'Percent'
                          ? voucher.discount + '%'
                          : formatCurrency(voucher.discount)
                      }`}</Text>
                      {voucher.limit ? (
                        <Text
                          style={styles.subtitleText}
                        >{`Số lượng: ${voucher.limit -
                          voucher.orders.length}`}</Text>
                      ) : null}
                      {voucher.expiredDate ? (
                        <Text
                          style={styles.subtitleText}
                        >{`Ngày hết hạn: ${dateFnsFormat(
                          voucher.expiredDate,
                          'YYYY/MM/DD'
                        )}`}</Text>
                      ) : null}
                    </View>
                  }
                  onPress={() => this._copyToClipboard(voucher)}
                  containerStyle={{
                    backgroundColor: '#fcfcfc',
                    paddingHorizontal: 30,
                    borderBottomWidth: 0.5,
                    borderColor: '#9b9b9b'
                  }}
                />
              ))}
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
            </ScrollView>
            <View style={styles.updateWrapper}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={this._refreshVoucher}
              >
                <Text style={styles.updateText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity style={styles.orderNow}>
              <Text style={{ textAlign: 'center' }}>
                Tài khoản của bạn chưa có mã ưu đãi nào
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  }
})
export default connect(
  state => ({
    auth: state.auth
  }),
  dispatch => ({
    getVoucherForUser: () => dispatch(getVoucherForUser())
  })
)(UserVoucher)
