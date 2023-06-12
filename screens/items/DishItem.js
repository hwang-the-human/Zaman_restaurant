import React, { useState } from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import colors from "../extensions/Colors";
import _ from "lodash";

export default function DishItem({ dish, setDishes_id, dishes_id }) {
  const [isEnabled, setIsEnabled] = useState(dish.in_stock);

  function handleSwitchDish() {
    if (dish.in_stock) {
      if (isEnabled) {
        push_dish_id();
        setIsEnabled(false);
      } else {
        remove_dish_id();
        setIsEnabled(true);
      }
    } else {
      if (isEnabled) {
        remove_dish_id();
        setIsEnabled(false);
      } else {
        push_dish_id();
        setIsEnabled(true);
      }
    }
  }

  function push_dish_id() {
    setDishes_id([...dishes_id, dish._id]);
  }

  function remove_dish_id() {
    setDishes_id(
      dishes_id.filter((a) => {
        return a !== dish._id;
      })
    );
  }

  return (
    <View style={styles.dishItem}>
      <Text
        style={{
          textDecorationLine: isEnabled ? "none" : "line-through",
          textDecorationStyle: "solid",
        }}
      >
        {dish.title}
      </Text>
      <Switch
        trackColor={{ false: "#767577" }}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleSwitchDish}
        value={isEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dishItem: {
    width: "100%",
    minHeight: 70,
    padding: 15,
    borderBottomWidth: 0.2,
    borderColor: colors.grey,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dishItem__title: {
    fontSize: 16,
  },
});
