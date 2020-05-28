import { MENU_ACTIONS } from '../config/actionType'

const INITIAL_STATE = {
  isLoading: false,
  menuData: []
}

export default function menuReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MENU_ACTIONS.GET_MENU:
      return { ...state, isLoading: true }

    case MENU_ACTIONS.GET_MENU_SUCCESS:
      return {
        ...state,
        isLoading: false,
        menuData: action.menuData
      }

    case MENU_ACTIONS.GET_MENU_FAILURE:
      return {
        ...state,
        isLoading: false,
        menuData: []
      }

    default:
      return state
  }
}
