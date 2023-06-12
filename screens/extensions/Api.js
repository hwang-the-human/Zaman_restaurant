// const server = 'https://infinite-eyrie-01907.herokuapp.com/';
const server = 'http://192.168.1.59:3000/';

const Api = {
  restaurants: {
    me: server + 'api/restaurants/me',
    sign_in: server + 'api/restaurants/sign_in',
    change_status: server + 'api/restaurants/change_status',
    change_orders_status: server + 'api/restaurants/change_orders_status',
    save_device_token: server + 'api/restaurants/save_device_token',
  },
  orders: {
    place_order: server + 'api/orders/place_order',
    get_orders_for_restaurant: server + 'api/orders/get_orders_for_restaurant',
    cancel_order: server + 'api/orders/cancel_order',
    get_order_history: server + 'api/orders/get_order_history',
  },
};

export default Api;
