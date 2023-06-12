import {combineReducers, createStore} from 'redux';
import _ from 'lodash';

//ACTIONS

export function setOrders(orders) {
  return {
    type: 'SET_ORDERS',
    payload: orders,
  };
}

export function pushOrder(order) {
  return {
    type: 'PUSH_ORDER',
    payload: order,
  };
}

export function updateOrder(order) {
  return {
    type: 'UPDATE_ORDER',
    payload: order,
  };
}

export function removeOrder(_id) {
  return {
    type: 'REMOVE_ORDER',
    payload: _id,
  };
}

export function setLoading(opened, done) {
  return {
    type: 'SET_LOADING',
    payload: {opened: opened, done: done},
  };
}

export function setUser(user) {
  return {
    type: 'SET_USER',
    payload: user,
  };
}

export function clearStore() {
  return {
    type: 'CLEAR_STORE',
  };
}

//REDUCERS

function userReducer(state = {}, action) {
  switch (action.type) {
    case 'SET_USER':
      state = action.payload;
    default:
      return state;
  }
}

function loadingReducer(state = {opened: false, done: false}, action) {
  switch (action.type) {
    case 'SET_LOADING':
      state = action.payload;
    default:
      return state;
  }
}

function ordersReducer(state = [], action) {
  switch (action.type) {
    case 'SET_ORDERS':
      return (state = _.filter(action.payload, a => {
        return a.deleted === undefined;
      }));
    case 'PUSH_ORDER':
      return (state = [...state, action.payload]);
    case 'UPDATE_ORDER':
      return (state = state.map(a => {
        return a._id === action.payload._id ? (a = action.payload) : (a = a);
      }));
    case 'REMOVE_ORDER':
      return (state = _.filter(state, a => {
        return a._id !== action.payload;
      }));
    default:
      return state;
  }
}

//STORE

const reducers = combineReducers({
  ordersReducer,
  loadingReducer,
  userReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_STORE') {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const store = createStore(rootReducer);

export default store;
