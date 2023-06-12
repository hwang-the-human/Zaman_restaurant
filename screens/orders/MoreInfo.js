import React from "react";
import { StyleSheet, Text, View, Dimensions, Linking } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import colors from "../extensions/Colors";
import CustomButton from "../extensions/CustomButton";

const windowWidth = Dimensions.get("window").width;

export default function MoreInfo({ order }) {
  function handleCall(phone) {
    Linking.openURL(`tel:${phone}`);
  }

  return (
    <View style={styles.moreInfo}>
      <View style={styles.moreInfo__container}>
        <Text style={styles.moreInfo__title}>Дополнительная информация</Text>

        <View style={styles.moreInfo__option}>
          <MaterialIcons name="person" size={30} color="grey" />
          <View style={styles.moreInfo__buttonBox}>
            <View style={styles.moreInfo__titleBox}>
              <Text style={styles.moreInfo__text}>Клиент</Text>
              <Text style={styles.moreInfo__subText}>
                {order.client.name} {order.client.surname}
              </Text>
            </View>
            <CustomButton handleButton={() => handleCall(order.client.phone)}>
              <View style={styles.moreInfo__callButton}>
                <Text style={styles.moreInfo__textButton}>Позвонить</Text>
              </View>
            </CustomButton>
          </View>
        </View>

        <View style={styles.moreInfo__option}>
          <MaterialIcons name="delivery-dining" size={30} color="grey" />
          <View style={styles.moreInfo__buttonBox}>
            <View style={styles.moreInfo__titleBox}>
              <Text style={styles.moreInfo__text}>Курьер</Text>
              <Text style={styles.moreInfo__subText}>
                {order.courier
                  ? order.courier.name + " " + order.courier.surname
                  : "Не указан"}
              </Text>
            </View>
            <CustomButton
              handleButton={() => handleCall(order.courier.phone)}
              disabled={order.courier ? false : true}
            >
              <View style={styles.moreInfo__callButton}>
                <Text style={styles.moreInfo__textButton}>Позвонить</Text>
              </View>
            </CustomButton>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  moreInfo: {
    alignItems: "center",
    marginTop: 30,
  },

  moreInfo__container: {
    width: windowWidth - 30,
  },

  moreInfo__title: {
    marginBottom: 15,
    fontSize: 25,
    fontWeight: "600",
  },

  moreInfo__option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  moreInfo__buttonBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 0.2,
    marginLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },

  moreInfo__titleBox: {
    flex: 1,
    justifyContent: "center",
  },

  moreInfo__text: {
    fontSize: 16,
  },

  moreInfo__subText: {
    color: "grey",
  },

  moreInfo__callButton: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 30,
  },

  moreInfo__textButton: {
    color: "white",
    fontWeight: "500",
  },
});
