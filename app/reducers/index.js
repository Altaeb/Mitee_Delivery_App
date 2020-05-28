import { combineReducers } from 'redux'
import menu from './menu'
import detail from './detail'
import order from './order'
import auth from './auth'

const rootReducers = combineReducers({
  menu,
  detail,
  order,
  auth
})

export default rootReducers
