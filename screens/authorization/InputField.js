import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import PhoneInput from '../extensions/PhoneInput';

export default function InputField({
  inputRef,
  input,
  setInput,
  placeholder,
  icon,
  returnKey,
  autoFocus,
  nextRef,
  maxLength,
  submit,
  keyboardType,
  forPhone,
  secureTextEntry,
}) {
  function handleSubmit() {
    if (nextRef) {
      nextRef.current.focus();
    } else {
      submit();
    }
  }

  return (
    <View style={styles.inputField}>
      <View style={styles.inputField__icon}>{icon}</View>

      <View style={styles.inputField__textInputBox}>
        {forPhone ? (
          <View style={styles.inputField__phoneBox}>
            <Text style={styles.inputField__phoneText}>+7 </Text>
            <PhoneInput
              style={styles.inputField__textInput}
              autoFocus={autoFocus}
              value={input}
              onChange={setInput}
            />
          </View>
        ) : (
          <TextInput
            style={styles.inputField__textInput}
            ref={inputRef}
            value={input}
            onChangeText={setInput}
            autoFocus={autoFocus}
            maxLength={maxLength}
            placeholder={placeholder}
            returnKeyType={returnKey}
            keyboardType={keyboardType}
            onSubmitEditing={handleSubmit}
            secureTextEntry={secureTextEntry}
            placeholderTextColor="grey"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },

  inputField__icon: {
    marginLeft: 15,
    marginRight: 15,
  },

  inputField__textInputBox: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
  },

  inputField__textInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },

  inputField__phoneBox: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputField__phoneText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
