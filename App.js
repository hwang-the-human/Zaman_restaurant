import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Root from './screens/root/Root';
import {connect} from 'react-redux';
import Loading from './screens/extensions/Loading';
import Menu from './screens/cafe/Menu';
import OrderHistory from './screens/cafe/OrderHistory';
import Order from './screens/orders/Order';

function mapStateToProps(state) {
  return {
    loading: state.loadingReducer,
  };
}

const Stack = createStackNavigator();

function App({loading}) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Root"
          component={Root}
        />

        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{title: 'Изменить меню', headerBackTitle: 'Назад'}}
        />
        <Stack.Screen
          name="История заказов"
          component={OrderHistory}
          options={{title: 'История заказов', headerBackTitle: 'Назад'}}
        />
        <Stack.Screen
          name="Order"
          component={Order}
          options={{headerBackTitle: 'Назад'}}
        />
      </Stack.Navigator>
      {loading.opened && <Loading />}
    </NavigationContainer>
  );
}

export default connect(mapStateToProps, null)(App);
