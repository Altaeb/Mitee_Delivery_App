import { BASE_URL } from '../config/URL.js'

export const addOrderDetail = orderDetails => ({
  type: 'ADD_ORDER_DETAIL_SUCCESS',
  payload: orderDetails
})

export const previewOrderDetailWithUserInfo = (
  userInfo,
  distance = 0
) => async (dispatch, getState) => {
  const state = getState()
  const order = state.order
  const orderDetails = order.orderList

  const token = state.auth.token
  const body = {
    phone: userInfo.phone,
    address: userInfo.address,
    voucher: userInfo.voucher,
    //note: userInfo.note,
    distance: distance,
    orderdetails: orderDetails
  }

  const headers = token
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    : {
        'Content-Type': 'application/json'
      }

  const orderInfo = await fetch(`${BASE_URL}/orders/preview`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .catch(err => err)

  if (orderInfo.error) throw orderInfo.message
  return orderInfo
}

export const confirmOrder = () => ({
  type: 'CONFIRM_ORDER'
})

export const confirmOrderPromise = body => async (dispatch, getState) => {
  const token = getState().auth.token
  const headers = token
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    : {
        'Content-Type': 'application/json'
      }

  const orderStatus = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .catch(err => err)

  if (orderStatus.error) throw orderStatus.message
  return orderStatus
}

export const cancelOrderById = id => async (dispatch, getState) => {
  const token = getState().auth.token
  const cancelOrderStatus = await fetch(`${BASE_URL}/orders/${id}/cancel`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .catch(err => err)

  if (cancelOrderStatus.error) throw cancelOrderStatus.message
  return cancelOrderStatus
}
