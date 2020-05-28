import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers'
import thunk from 'redux-thunk'

export default function configureStore(initialState, reducer = rootReducer) {
  const middlewares = [thunk]

  const finalCreateStore = applyMiddleware(...middlewares)(createStore)
  const store = finalCreateStore(
    reducer,
    initialState,
    __DEV__
      ? global.__REDUX_DEVTOOLS_EXTENSION__ &&
        global.__REDUX_DEVTOOLS_EXTENSION__()
      : compose
  )
  return store
}
