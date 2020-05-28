import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import AuthWrapper from './screen/AuthWrapper'
import OrderHistory from './screen/OrderHistory'
import OrderHistoryDetail from './screen/OrderHistoryDetail'
import UserVoucher from './screen/UserVoucher'
import Home from './screen/Home'
import Detail from './screen/Detail'
import DeliveryInfo from './screen/DeliveryInfo'
import Checkout from './screen/Checkout'
import { PrimaryColor } from './config/color'
import Icon from 'react-native-vector-icons/Feather'
import IconWithVoucherLength from './components/IconWithVoucherLength'

const AuthStack = createStackNavigator({
  AuthWrapper: {
    screen: AuthWrapper,
    navigationOptions: {
      header: null
    }
  },
  OrderHistory: {
    screen: OrderHistory,
    navigationOptions: {
      header: null
    }
  },
  OrderHistoryDetail: {
    screen: OrderHistoryDetail,
    navigationOptions: {
      header: null
    }
  },
  UserVoucher: {
    screen: UserVoucher,
    navigationOptions: {
      header: null
    }
  }
})

const AppStack = createStackNavigator({
  Home: { screen: Home, navigationOptions: { header: null } },
  Detail: { screen: Detail, navigationOptions: { header: null } },
  DeliveryInfo: { screen: DeliveryInfo, navigationOptions: { header: null } },
  Checkout: { screen: Checkout, navigationOptions: { header: null } }
})

const App = createMaterialBottomTabNavigator(
  {
    Auth: {
      screen: AuthStack,
      navigationOptions: {
        tabBarLabel: 'Account',
        tabBarIcon: ({ tintColor }) => (
          <IconWithVoucherLength>
            <Icon name="home" color={tintColor} size={24} />
          </IconWithVoucherLength>
        ),
        tabBarTintColor: '#fff'
      }
    },
    App: {
      screen: AppStack,
      navigationOptions: {
        tabBarLabel: 'Menu',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" color={tintColor} size={24} />
        ),
        tabBarTintColor: '#fff'
      }
    }
  },
  {
    initialRouteName: 'App',
    order: ['App', 'Auth'],
    shifting: false,
    activeTintColor: PrimaryColor,
    barStyle: {
      backgroundColor: '#fff',
      marginTop: 1,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowColor: '#000'
    }
  }
)

export default createAppContainer(App)
