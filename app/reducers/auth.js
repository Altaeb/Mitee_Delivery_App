import { AUTH_ACTIONS } from '../config/actionType'

const INITIAL_STATE = {
  token: null,
  user: {},
  loading: false,
  vouchers: []
}

export default function detailReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        loading: true
      }
    }

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.token,
        user: action.user,
        loading: false
      }

    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token
      }

    case 'GET_USER':
      return {
        ...state,
        loading: true
      }

    case AUTH_ACTIONS.GET_USER_SUCCESS:
      return {
        ...state,
        user: action.user,
        loading: false
      }

    case 'GET_ORDER_HISTORY_SUCCESS':
      return {
        ...state,
        user: { ...state.user, orders: action.orders }
      }

    case 'GET_VOUCHER_SUCCESS':
      return {
        ...state,
        vouchers: action.vouchers
      }

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        loading: true
      }

    case 'LOGOUT_SUCCESS':
      return INITIAL_STATE

    default:
      return state
  }
}
