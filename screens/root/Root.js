import React, {useEffect} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import {setOrders, setLoading, setUser} from '../../redux/Reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import SignIn from '../authorization/SignIn';
import SubRoot from './SubRoot';
import Api from '../extensions/Api';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setOrders: orders => dispatch(setOrders(orders)),
    setUser: user => dispatch(setUser(user)),
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

function Root({user, setUser, setLoading, setOrders}) {
  useEffect(() => {
    async function getUser() {
      setLoading(true, false);
      try {
        const authToken = await AsyncStorage.getItem('authToken');

        if (authToken) {
          const response = await axios.get(Api.restaurants.me, {
            headers: {'x-auth-token': authToken},
          });

          setUser({
            ...response.data.restaurant,
            authToken: authToken,
          });
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(true, true);
    }

    getUser();
  }, []);

  return (
    <View style={styles.app}>
      <StatusBar animated={true} barStyle="dark-content" />
      {user.authToken ? <SubRoot /> : <SignIn />}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    width: '100%',
    height: '100%',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
