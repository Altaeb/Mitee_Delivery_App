import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { PrimaryColor, blueWhite } from '../config/color'
import ListMenu from '../containers/ListItem'
import CartButton from '../containers/CartButton'
import { connect } from 'react-redux'
import navigationService from '../../app/navigationService'
import Input from '../components/Input'
import Fuse from 'fuse.js'
import { getMenu } from '../actions/menu'
import MyStatusBar from '../components/StatusBar'
import Loading from '../components/Loading'

const filterByKeyword = (menus, keyword) => {
  let fuseOpt = {
    findAllMatches: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name']
  }
  let fuse = new Fuse(menus, fuseOpt)
  return fuse.search(keyword)
}

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentMenu: [],
      refreshing: false
    }
  }

  componentDidMount = async () => {
    this.props.getMenu()
  }

  componentDidUpdate(prevProps) {
    const prevMenuData = prevProps.menu.menuData
    const menuData = this.props.menu.menuData

    if (prevMenuData.length === 0 && menuData.length > 0) {
      this.setState(() => ({
        currentMenu: menuData
      }))
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
    this.props.getMenu().then(() => {
      this.setState({ refreshing: false })
    })
  }

  _handleClickCartButton = () => {
    navigationService.navigate('DeliveryInfo')
  }

  onChangeText = text => {
    const { menuData } = this.props.menu
    return this.setState(() => ({
      currentMenu: text.length > 0 ? filterByKeyword(menuData, text) : menuData
    }))
  }

  render() {
    const { order, menu } = this.props
    const { menuData } = menu
    const { currentMenu } = this.state
    const { orderList } = order
    const isHaveOrder = orderList && orderList.length > 0

    return (
      <View style={{ flex: 1, backgroundColor: blueWhite }}>
        <MyStatusBar backgroundColor={PrimaryColor} barStyle="light-content" />
        <Input
          placeHolder="Trà sữa, Machiato..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={styles.inputStyle}
          iconName={'search'}
          iconSize={33}
          iconStyle={styles.searchIcon}
          onChangeText={this.onChangeText}
          onIconClick={this.onSearch}
          containerStyle={styles.inputContainer}
        />
        {menuData.length > 0 ? (
          <ListMenu
            datas={currentMenu}
            onRefresh={this._onRefresh}
            refreshing={this.state.refreshing}
          />
        ) : (
          <Loading />
        )}
        {isHaveOrder && (
          <CartButton
            orderItem={orderList.length}
            onClick={this._handleClickCartButton}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 60,
    backgroundColor: PrimaryColor,
    justifyContent: 'center',
    position: 'relative'
  },
  inputStyle: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: '#fff',
    paddingHorizontal: 20,
    fontSize: 17,
    borderRadius: 5,
    fontFamily: 'SF-Regular'
  },
  searchIcon: {
    position: 'absolute',
    right: 25,
    top: 16
  }
})

export default connect(
  state => ({
    order: state.order,
    auth: state.auth,
    menu: state.menu
  }),
  dispatch => ({
    getMenu: () => dispatch(getMenu())
  })
)(HomeScreen)
