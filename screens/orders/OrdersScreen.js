import React from 'react';
import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import OrderItem from '../items/OrderItem';
import {connect} from 'react-redux';
import MainButton from '../extensions/MainButton';
import {setOrders, setLoading} from '../../redux/Reducers';
import axios from 'axios';
import Api from '../extensions/Api';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
    orders: state.ordersReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setOrders: orders => dispatch(setOrders(orders)),
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

function OrdersScreen({orders, setOrders, setLoading, user}) {
  async function handleUpdate() {
    setLoading(true, false);
    try {
      const response = await axios.get(Api.orders.get_orders_for_restaurant, {
        headers: {'x-auth-token': user.authToken},
      });

      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(true, true);
  }

  return (
    <View style={styles.orderScreen}>
      <ScrollView scrollEventThrottle={16}>
        <View style={styles.orderScreen__topSpace} />
        <View style={styles.orderScreen__ordersBox}>
          {orders.map((order, i) => (
            <OrderItem order={order} key={i} />
          ))}
        </View>

        <View style={styles.orderScreen__bottomSpace} />
      </ScrollView>
      <View style={styles.orderScreen__button}>
        <MainButton title="Обновить" handlePress={handleUpdate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderScreen: {
    width: '100%',
    height: '100%',
  },
  orderScreen__ordersBox: {
    marginTop: 30,
    borderTopWidth: 0.2,
    backgroundColor: 'white',
  },

  orderScreen__button: {
    position: 'absolute',
    bottom: -30,
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: '100%',
    borderRadius: 30,
    height: 110,
  },

  orderScreen__topSpace: {
    width: '100%',
    height: 50,
  },

  orderScreen__bottomSpace: {
    width: '100%',
    height: 100,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen);
