import { StyleSheet, TextInput } from "react-native";

function MyTextInput({
  style,
  placeholder,
  textAlign,
  returnKeyType = "done",
  secureTextEntry,
  value,
  onChangeText,
  onSubmitEditing,
  keyboardType,
  placeholderTextColor,
}) {
  return (
    <TextInput
      style={{ ...styles.textInputStyle, ...style }}
      placeholder={placeholder}
      textAlign={textAlign}
      returnKeyType={returnKeyType}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      keyboardType={keyboardType}
      placeholderTextColor={placeholderTextColor}
    />
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    fontSize: 16,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export { MyTextInput };
