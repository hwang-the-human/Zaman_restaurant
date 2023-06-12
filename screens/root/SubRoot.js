import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import colors from '../extensions/Colors';
import CafeScreen from '../cafe/CafeScreen';
import OrdersScreen from '../orders/OrdersScreen';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../extensions/Api';
import axios from 'axios';
import {setOrders, setLoading} from '../../redux/Reducers';

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

function SubRoot({user, orders, setOrders, setLoading}) {
  const Tab = createBottomTabNavigator();

  async function updateDeviceToken(token) {
    const deviceToken = await AsyncStorage.getItem('deviceToken');

    if (!deviceToken || deviceToken !== token) {
      try {
        await axios.patch(
          Api.restaurants.save_device_token,
          {
            platform: Platform.OS === 'ios' ? 'ios' : 'android',
            deviceToken: token,
          },
          {
            headers: {'x-auth-token': user.authToken},
          },
        );
        await AsyncStorage.setItem('deviceToken', token);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function updateOrders() {
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

  useEffect(() => {
    PushNotification.configure({
      onRegister: function (tokenData) {
        const {token} = tokenData;
        updateDeviceToken(token);
      },
      onNotification: function (notification) {
        updateOrders();
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: 'black',
        headerStyle: {backgroundColor: colors.grey},
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          if (route.name === 'Заказы') {
            return (
              <MaterialIcons
                name="menu-book"
                size={25}
                color={focused ? colors.blue : 'black'}
              />
            );
          }
          if (route.name === 'Кафе') {
            return (
              <MaterialIcons
                name="restaurant"
                size={25}
                color={focused ? colors.blue : 'black'}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.blue,
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Заказы"
        component={OrdersScreen}
        options={{tabBarBadge: orders.length > 0 ? orders.length : null}}
      />

      <Tab.Screen name="Кафе" component={CafeScreen} />
    </Tab.Navigator>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SubRoot);
