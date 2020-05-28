import { BASE_URL } from '../config/URL.js'
import { MENU_ACTIONS } from '../config/actionType'

export const getMenu = () => async dispatch => {
  dispatch({ type: MENU_ACTIONS.GET_MENU })
  const response = await fetch(`${BASE_URL}/products`).catch(err => {
    return dispatch({ type: MENU_ACTIONS.GET_MENU_FAILURE })
  })

  const data = await response.json()
  if (data) {
    return dispatch({ type: MENU_ACTIONS.GET_MENU_SUCCESS, menuData: data })
  }
  return dispatch({ type: MENU_ACTIONS.GET_MENU_FAILURE })
}
