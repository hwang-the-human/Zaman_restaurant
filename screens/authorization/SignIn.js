import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import 'text-encoding-polyfill';
import InputField from './InputField';
import Errors from './Errors';
import MainButton from '../extensions/MainButton';
import KeyboardView from '../extensions/KeyboardView';
import {connect} from 'react-redux';
import {setLoading, setUser, setOrders} from '../../redux/Reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from '../extensions/Api';

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
    setUser: user => dispatch(setUser(user)),
    setOrders: orders => dispatch(setOrders(orders)),
  };
}

const windowWidth = Dimensions.get('window').width;

function SignIn({setLoading, setUser, setOrders}) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef();

  const [errors, setErrors] = useState([]);

  async function handleEnter() {
    const cleanedPhone = '+7' + phone.replace(/[-() ]/g, '');
    Keyboard.dismiss();
    setLoading(true, false);
    setErrors([]);
    try {
      const response = await axios.post(api.restaurants.sign_in, {
        phone: cleanedPhone,
        password: password,
      });
      await AsyncStorage.setItem('authToken', response.headers['x-auth-token']);

      setUser({
        ...response.data.restaurant,
        authToken: response.headers['x-auth-token'],
      });

      setOrders(response.data.orders);
    } catch (error) {
      setErrors([
        {
          message: error.response ? error.response.data : error.message,
        },
      ]);
    }
    setLoading(true, true);
  }

  return (
    <KeyboardView>
      <SafeAreaView>
        <Text style={styles.signIn__title}>
          Введите номер телефона и пароль
        </Text>
        <View style={styles.signIn__inputFieldBox}>
          <InputField
            input={phone}
            setInput={setPhone}
            forPhone={true}
            icon={<Feather name="phone" size={30} color="grey" />}
          />

          <InputField
            inputRef={passwordRef}
            input={password}
            setInput={setPassword}
            placeholder={'Пароль'}
            returnKey={'go'}
            maxLength={50}
            secureTextEntry={true}
            submit={handleEnter}
            icon={
              <Ionicons name="lock-closed-outline" size={30} color="grey" />
            }
          />
        </View>

        <Errors errors={errors} />
        <MainButton
          title="Войти"
          handlePress={handleEnter}
          disabled={phone.length === 15 && password.length > 0 ? false : true}
          marginTop={30}
        />
      </SafeAreaView>
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  signIn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  signIn__title: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 25,
    width: windowWidth - 30,
    marginTop: 30,
    marginBottom: 30,
  },

  signIn__inputFieldBox: {
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
  },
});

export default connect(null, mapDispatchToProps)(SignIn);
