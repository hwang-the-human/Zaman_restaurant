import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import declensions from "../extensions/Declensions";
import SingleOrderItem from "../items/SingleOrderItem";

const windowWidth = Dimensions.get("window").width;

export default function Orders({ order }) {
  return (
    <View style={styles.orders}>
      <View style={styles.orders__contianer}>
        <Text style={styles.orders__title}>Заказы</Text>
        <Text style={styles.orders__subTitle}>
          {declensions("заказ", order.orders.length)}
        </Text>
        {order.orders.map((order, i) => (
          <SingleOrderItem order={order} key={i} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orders: {
    alignItems: "center",
    marginTop: 30,
  },

  orders__contianer: {
    width: windowWidth - 30,
  },

  orders__title: {
    fontSize: 25,
    fontWeight: "600",
  },

  orders__subTitle: {
    color: "grey",
    marginBottom: 15,
  },
});
