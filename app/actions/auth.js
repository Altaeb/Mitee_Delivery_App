import { BASE_URL } from '../config/URL'
import { setStorageItem, removeStorageItem } from '../utils'

const authPromise = (url, body) =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .catch(err => {
      throw err
    })

export const signIn = phone => async dispatch => {
  const loginBody = {
    identifier: phone,
    password: phone
  }
  const registerBody = {
    phone
  }

  dispatch({
    type: 'LOGIN'
  })
  let user = await authPromise(`${BASE_URL}/auth/local/register`, registerBody)

  if (
    user.message === 'This miteedbs,users,permissions is already taken' ||
    user.error
  ) {
    user = await authPromise(`${BASE_URL}/auth/local`, loginBody)
  }

  if (user.error) {
    throw user.error
  }
  const token = user.jwt
  await setStorageItem('userToken', token)
  dispatch({
    type: 'LOGIN_SUCCESS',
    token,
    user: user.user
  })
}

export const logout = () => async dispatch => {
  dispatch({
    type: 'LOGOUT'
  })
  await removeStorageItem('userToken')
  return dispatch({
    type: 'LOGOUT_SUCCESS'
  })
}

export const getUserInfo = token => async dispatch => {
  dispatch({
    type: 'GET_USER'
  })
  const userInfo = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .catch(err => {
      throw err
    })

  if (userInfo) {
    //invalid token
    if (userInfo.error) {
      return dispatch(logout())
    }
    dispatch({
      type: 'GET_USER_SUCCESS',
      user: userInfo
    })
  } else {
    //invalid token
    dispatch(logout())
  }
}

export const updateUserInfo = body => async (dispatch, getState) => {
  const state = getState()
  const token = state.auth.token
  const updateStatus = await fetch(`${BASE_URL}/users/me/update`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    method: 'PUT',
    body: JSON.stringify(body)
  }).then(res => res.json())

  if (updateStatus.error) throw updateStatus.error
  dispatch({
    type: 'GET_USER_SUCCESS',
    user: updateStatus
  })
  return updateStatus
}

export const getOrderByUser = () => async (dispatch, getState) => {
  const state = getState()
  const token = state.auth.token
  const orders = await fetch(`${BASE_URL}/ordersByUser`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .catch(err => {
      throw err
    })

  if (orders.error) throw orders.message

  dispatch({
    type: 'GET_ORDER_HISTORY_SUCCESS',
    orders
  })
  return orders
}

export const getVoucherForUser = () => async (dispatch, getState) => {
  const state = getState()
  const token = state.auth.token
  const vouchers = await fetch(`${BASE_URL}/vouchersForUser`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .catch(err => {
      throw err
    })

  if (vouchers.error) throw vouchers.error

  dispatch({
    type: 'GET_VOUCHER_SUCCESS',
    vouchers
  })
  return vouchers
}

export const createBirthDayVoucher = () => async (dispatch, getState) => {
  const state = getState()
  const token = state.auth.token
  const vouchers = await fetch(`${BASE_URL}/vouchers/birthday`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: 'POST'
  })
    .then(res => res.json())
    .catch(err => {
      throw err
    })

  if (vouchers.error) throw vouchers.error

  dispatch({
    type: 'GET_VOUCHER_SUCCESS',
    vouchers
  })
  return vouchers
}
