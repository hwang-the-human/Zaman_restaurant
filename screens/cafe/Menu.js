import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import DishItem from '../items/DishItem';
import {connect} from 'react-redux';
import _ from 'lodash';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {setLoading} from '../../redux/Reducers';
import MainButton from '../extensions/MainButton';
import Api from '../extensions/Api';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

function Menu({user, setLoading}) {
  const navigation = useNavigation();
  const [dishes_id, setDishes_id] = useState([]);

  async function handleSave() {
    setLoading(true, false);
    try {
      await axios.patch(
        Api.restaurants.change_orders_status,
        {
          dishes: dishes_id,
        },
        {
          headers: {'x-auth-token': user.authToken},
        },
      );
      user.dishes = user.dishes.map(a =>
        dishes_id.includes(a._id) ? (a = {...a, in_stock: !a.in_stock}) : a,
      );
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
    setLoading(true, true);
  }

  return (
    <View>
      <ScrollView>
        {user.dishes.map((dish, index) => (
          <DishItem
            dish={dish}
            dishes_id={dishes_id}
            setDishes_id={setDishes_id}
            key={index}
          />
        ))}
        <View style={styles.menu__space} />
      </ScrollView>
      <View style={styles.menu__button}>
        <MainButton
          title="Изменить меню"
          handlePress={handleSave}
          disabled={dishes_id.length > 0 ? false : true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menu__space: {
    width: '100%',
    height: 150,
  },

  menu__button: {
    alignSelf: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
    bottom: 0,
    height: 100,
    width: '100%',
    borderRadius: 100,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
