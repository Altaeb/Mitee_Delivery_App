import { ORDER_ACTIONS } from '../config/actionType'

const INITIAL_STATE = {
  isLoading: false,
  orderList: []
}

export default function orderReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ORDER_ACTIONS.ADD_ORDER_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        orderList: [...state.orderList, action.payload]
      }

    case ORDER_ACTIONS.CONFIRM_ORDER:
      return {
        ...state,
        orderList: []
      }

    case 'CANCEL_ORDER':
      return {
        ...state,
        orderList: []
      }

    default:
      return state
  }
}
