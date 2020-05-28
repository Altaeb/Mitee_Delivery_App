import { DETAIL_ACTIONS } from '../config/actionType'

const INITIAL_STATE = {
  isLoading: false,
  detail: {}
}

export default function detailReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DETAIL_ACTIONS.GET_DETAIL:
      return { ...state, isLoading: true }

    case DETAIL_ACTIONS.GET_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        detail: action.detail
      }

    case DETAIL_ACTIONS.GET_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
        detail: {}
      }

    default:
      return state
  }
}
