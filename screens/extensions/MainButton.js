import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import colors from "./Colors";
import CustomButton from "./CustomButton";

const windowWidth = Dimensions.get("window").width;

export default function MainButton({
  title,
  handlePress,
  color,
  disabled,
  marginTop,
  marginBottom,
}) {
  return (
    <CustomButton handleButton={handlePress} disabled={disabled}>
      <View
        style={[
          styles.mainButton,
          {
            backgroundColor: color ?? colors.green,
            marginTop: marginTop ?? 0,
            marginBottom: marginBottom ?? 0,
          },
        ]}
      >
        <Text style={styles.mainButton__buttonText}>{title}</Text>
      </View>
    </CustomButton>
  );
}

const styles = StyleSheet.create({
  mainButton: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth - 30,
    height: 50,
    borderRadius: 50,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  mainButton__buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
});
