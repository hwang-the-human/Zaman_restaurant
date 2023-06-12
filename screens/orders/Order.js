import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, Platform, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import Info from './Info';
import Orders from './Orders';
import Zigzag from '../extensions/Zigzag';
import Summary from './Summary';
import MoreInfo from './MoreInfo';
import {useNavigation} from '@react-navigation/native';
import MainButton from '../extensions/MainButton';
import Dialog from 'react-native-dialog';
import colors from '../extensions/Colors';
import axios from 'axios';
import Api from '../extensions/Api';
import {connect} from 'react-redux';
import {removeOrder, setLoading} from '../../redux/Reducers';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeOrder: _id => dispatch(removeOrder(_id)),
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

function Order({user, setLoading, removeOrder}) {
  const navigation = useNavigation();
  const {params} = useRoute();

  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  async function handleCancelOrder() {
    setOpenDialog(false);
    setLoading(true, false);
    try {
      await axios.patch(
        Api.orders.cancel_order,
        {
          client_id: params.order.client._id,
          order_id: params.order._id,
          message: {
            text: message,
            restaurant: user.title,
            order_number: params.order._id.substr(-4),
          },
        },
        {
          headers: {'x-auth-token': user.authToken},
        },
      );

      removeOrder(params.order._id);
      navigation.popToTop();
    } catch (error) {
      console.log(error);
    }

    setLoading(true, true);
  }

  function handleOpenDialog() {
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '#' + params.order._id.substr(-4),
    });
  }, []);

  return (
    <View>
      <ScrollView scrollEventThrottle={16}>
        <View style={styles.order__container}>
          <Orders order={params.order} />
          <Info order={params.order} />
          <MoreInfo order={params.order} />
          <Zigzag />
        </View>
        <Summary
          totalPrice={params.order.total_price}
          commission={params.order.total_price * 0.15}
        />

        <View style={styles.order__space} />
      </ScrollView>

      {!params.history && (
        <View style={styles.order__button}>
          <MainButton title="Отмена заказа" handlePress={handleOpenDialog} />
        </View>
      )}

      <Dialog.Container visible={openDialog} contentStyle={{marginTop: -220}}>
        <Dialog.Title>Отменить заказ?</Dialog.Title>
        <Dialog.Description>Укажите причину отмены заказа.</Dialog.Description>
        <Dialog.Input
          onChangeText={setMessage}
          value={message}
          autoFocus={true}
          placeholder="Сообщение будет отправлено Клиенту"
          height={150}
          maxLength={300}
          width="100%"
          multiline={true}
        />
        <Dialog.Button label="Нет" onPress={handleCloseDialog} />
        <Dialog.Button
          label="Да"
          onPress={handleCancelOrder}
          color={
            message.length < 5
              ? colors.grey
              : Platform.OS === 'ios'
              ? '#007AFF'
              : '#2196F3'
          }
          disabled={message.length < 5 ? true : false}
        />
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  order__container: {
    backgroundColor: 'white',
    paddingBottom: 30,
  },

  order__space: {
    width: '100%',
    height: 100,
  },

  order__button: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: '100%',
    borderRadius: 30,
    height: 110,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);
