import React, {useState} from 'react';
import {StyleSheet, Text, View, Platform, SafeAreaView} from 'react-native';
import colors from '../extensions/Colors';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import axios from 'axios';
import MainButton from '../extensions/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {clearStore, setLoading, setUser} from '../../redux/Reducers';
import Api from '../extensions/Api';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearStore: () => dispatch(clearStore()),
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
    setUser: user => dispatch(setUser(user)),
  };
}

function CafeScreen({user, setLoading, clearStore, setUser}) {
  const [statusWindow, setStatusWindow] = useState(false);
  const [exitWindow, setExitWindow] = useState(false);
  const [opened, setOpened] = useState(false);
  const navigation = useNavigation();

  async function handleSaveStatus() {
    setLoading(true, false);
    setStatusWindow(false);
    try {
      await axios.patch(
        Api.restaurants.change_status,
        {
          opened: opened,
        },
        {
          headers: {'x-auth-token': user.authToken},
        },
      );
      setUser({
        ...user,
        status: {...user.status, opened: opened},
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(true, true);
  }

  function handleCancelStatus() {
    setStatusWindow(false);
  }

  function handleOpenStatusWindow() {
    setStatusWindow(true);
  }

  function handleChangeMenu() {
    navigation.push('Menu');
  }

  function handleOrdersHistory() {
    navigation.push('История заказов');
  }

  function handleExit() {
    setLoading(true, false);
    setExitWindow(false);
    try {
      AsyncStorage.clear();
      clearStore();
    } catch (error) {
      console.log(error);
    }
    setLoading(true, true);
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.cafeScreen}>
        <View style={{width: '100%', height: 100}} />
        <Text style={styles.cafeScreen__title}>{user.title}</Text>
        <View style={styles.cafeScreen__statusContainer}>
          <Text style={styles.cafeScreen__statusSubText}>Статус: </Text>
          <View style={styles.cafeScreen__statusBox}>
            <Text
              style={[
                styles.cafeScreen__statusText,
                {
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'solid',
                },
              ]}>
              {user.status.opened ? 'Открыто ' : 'Закрыто '}
            </Text>
            <View
              style={{
                backgroundColor: user.status.opened ? colors.green : colors.red,
                width: 14,
                height: 14,
                borderRadius: 14,
              }}
            />
          </View>
        </View>

        <MainButton
          title="Изменить статус"
          handlePress={handleOpenStatusWindow}
          marginTop={30}
        />
        <MainButton
          title="Изменить меню"
          handlePress={handleChangeMenu}
          marginTop={30}
        />
        <MainButton
          title="История заказов"
          handlePress={handleOrdersHistory}
          marginTop={30}
        />

        <MainButton
          title="Выйти"
          handlePress={() => setExitWindow(true)}
          marginTop={30}
        />

        <Dialog.Container visible={statusWindow}>
          <Dialog.Title>Изменить статус</Dialog.Title>
          <Dialog.Switch
            label={opened ? 'Открыто' : 'Закрыто'}
            trackColor={{false: '#767577'}}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setOpened(opened ? false : true)}
            value={opened}
          />
          <Dialog.Button label="Отмена" onPress={handleCancelStatus} />
          <Dialog.Button
            label="Сохранить"
            color={
              opened === user.status.opened
                ? colors.grey
                : Platform.OS === 'ios'
                ? '#007AFF'
                : '#2196F3'
            }
            disabled={opened === user.status.opened ? true : false}
            onPress={handleSaveStatus}
          />
        </Dialog.Container>

        <Dialog.Container visible={exitWindow}>
          <Dialog.Title>Выйти</Dialog.Title>
          <Dialog.Description>
            Вы действительно хотите выйти?
          </Dialog.Description>
          <Dialog.Button label="Отмена" onPress={() => setExitWindow(false)} />
          <Dialog.Button label="Выйти" onPress={handleExit} />
        </Dialog.Container>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cafeScreen: {
    height: '100%',
    width: '100%',
  },

  cafeScreen__title: {
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },

  cafeScreen__statusContainer: {
    marginTop: 6,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cafeScreen__statusBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  cafeScreen__statusText: {
    fontSize: 18,
    fontWeight: '500',
  },

  cafeScreen__statusSubText: {
    fontSize: 18,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CafeScreen);
