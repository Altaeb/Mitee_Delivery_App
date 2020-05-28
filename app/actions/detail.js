import { BASE_URL } from '../config/URL.js'
import { DETAIL_ACTIONS } from '../config/actionType'

export const getDetail = id => async dispatch => {
  dispatch({ type: DETAIL_ACTIONS.GET_DETAIL })
  const response = await fetch(`${BASE_URL}/products/${id}`).catch(err => {
    return dispatch({ type: DETAIL_ACTIONS.GET_DETAIL_FAILURE })
  })

  const data = await response.json()
  if (data) {
    return dispatch({ type: DETAIL_ACTIONS.GET_DETAIL_SUCCESS, detail: data })
  }

  return dispatch({ type: DETAIL_ACTIONS.GET_DETAIL_FAILURE })
}
