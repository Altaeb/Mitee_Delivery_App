import React from 'react'
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback
} from 'react-native'
import { Badge } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import { PrimaryColor } from '../config/color'

const FAB_SIZE = 50
const ICON_SIZE = 24

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback
const background =
  Platform.OS === 'ios' ? null : TouchableNativeFeedback.Ripple('#fff', true) // set borderLess true to make the ripple border less

const CartButton = props => {
  const { onClick } = props
  return (
    <View style={styles.fab}>
      <Touchable background={background} onPress={() => onClick && onClick()}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="shopping-cart" size={ICON_SIZE} color="#fff" />
          <Badge
            value={props.orderItem}
            status="success"
            textStyle={{ color: 'white' }}
            containerStyle={styles.badgeContainer}
          />
        </View>
      </Touchable>
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: PrimaryColor,
    elevation: 6,
    position: 'absolute',
    bottom: 30,
    left: 30
  },
  iconContainer: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5
  }
})

export default CartButton
