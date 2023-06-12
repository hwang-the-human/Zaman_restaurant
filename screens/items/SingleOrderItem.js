import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import currencyFormatter from 'currency-formatter';
import colors from '../extensions/Colors';

export default function SingleOrderItem({order}) {
  return (
    <View style={styles.singleOrderItem}>
      <View style={styles.singleOrderItem__titleBox}>
        <Text style={styles.singleOrderItem__title}>
          <Text style={styles.singleOrderItem__countText}>
            {order.quantity}x{'  '}
          </Text>
          {order.title}
          {'  '}
          <Text style={{color: colors.green}}>
            {currencyFormatter.format(order.price * order.quantity, {
              symbol: 'тг',
              thousand: ',',
              precision: 0,
              format: '%v %s',
            })}
          </Text>
        </Text>
        <View style={styles.singleOrderItem__prerequisitesBox}>
          {order.prerequisites &&
            order.prerequisites.map((prerequisite, i) => (
              <Text style={styles.singleOrderItem__prerequisitesText} key={i}>
                {prerequisite.title}
                {i + 1 < order.prerequisites.length && ', '}
              </Text>
            ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  singleOrderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0.2,
    borderColor: 'grey',
  },

  singleOrderItem__titleBox: {
    flex: 1,
  },

  singleOrderItem__title: {
    fontSize: 18,
  },

  singleOrderItem__countText: {
    fontWeight: 'bold',
  },

  singleOrderItem__prerequisitesBox: {
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
  },

  singleOrderItem__prerequisitesText: {
    color: 'grey',
  },
});
