import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import declensions from '../extensions/Declensions';
import colors from '../extensions/Colors';
import {connect} from 'react-redux';
import {includesObj} from '../extensions/Algorithms';
import AsyncStorage from '@react-native-async-storage/async-storage';

function mapStateToProps(state) {
  return {
    orders: state.ordersReducer,
  };
}

const windowWidth = Dimensions.get('window').width;

function OrderItem({order, orders}) {
  const navigation = useNavigation();
  const [minutes, setMinutes] = useState(0);
  const [viewed, setViewed] = useState(false);

  async function getViewedOrders() {
    const viewedOrders = JSON.parse(await AsyncStorage.getItem('viewedOrders'));
    viewedOrders?.map(a => a === order._id && setViewed(true));
  }

  useEffect(() => {
    const now = moment(new Date());
    const late = moment(order.date);
    const minutes = now.diff(late, 'minutes');

    setMinutes(minutes);

    getViewedOrders();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMinutes(minutes + 1);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [minutes]);

  async function handleSelectOrder() {
    if (!viewed) {
      try {
        var viewedOrders =
          JSON.parse(await AsyncStorage.getItem('viewedOrders')) ?? [];

        var filteredOrders = [
          ...viewedOrders.filter(a => includesObj(orders, a)),
          order._id,
        ];
        await AsyncStorage.setItem(
          'viewedOrders',
          JSON.stringify(filteredOrders),
        );
        setViewed(true);
      } catch (error) {
        console.log(error);
      }
    }
    navigation.navigate('Order', {
      order: order,
    });
  }

  return (
    <TouchableOpacity onPress={handleSelectOrder}>
      <View style={styles.orderItem}>
        <View style={styles.orderItem__container}>
          {viewed ? (
            <Ionicons
              style={styles.errors__icon}
              name="eye"
              size={30}
              color={colors.green}
            />
          ) : (
            <Ionicons
              style={styles.errors__icon}
              name="eye-off"
              size={30}
              color={colors.red}
            />
          )}
          <View style={styles.orderItem__titleBox}>
            <Text style={styles.orderItem__title}>#{order._id.substr(-4)}</Text>
            <View style={styles.orderItem__subTitleBox}>
              <Text style={styles.orderItem__subTitle}>
                {declensions('заказ', order.orders.length)}
              </Text>
              <Text style={styles.orderItem__timeText}>{minutes} мин</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  orderItem: {
    alignItems: 'center',
    borderBottomWidth: 0.2,
  },

  orderItem__container: {
    width: windowWidth - 30,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },

  orderItem__circle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    borderWidth: 1,
    marginRight: 15,
  },
  orderItem__titleBox: {
    flex: 1,
    marginLeft: 15,
  },

  orderItem__title: {
    fontWeight: '600',
    fontSize: 16,
  },

  orderItem__subTitle: {},

  orderItem__subTitleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  orderItem__timeText: {
    color: 'grey',
  },
});

export default connect(mapStateToProps, null)(OrderItem);
