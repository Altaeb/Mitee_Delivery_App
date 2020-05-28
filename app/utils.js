import { AsyncStorage } from 'react-native'

export const setStorageItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (error) {
    throw error
  }
}

export const getStorageItem = async key => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value
  } catch (error) {
    return null
  }
}

export const removeStorageItem = async key => {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch (exception) {
    return false
  }
}

export const validation = {
  isEmailAddress: function(str) {
    var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return pattern.test(str) // returns a boolean
  },
  isNotEmpty: function(str) {
    var pattern = /\S+/
    return pattern.test(str) // returns a boolean
  },
  isNumber: function(str) {
    var pattern = /^\d+$/
    return pattern.test(str) // returns a boolean
  }
}

export const formatCurrency = price => {
  return price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + ' VND'
}
