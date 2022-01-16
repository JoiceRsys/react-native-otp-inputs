import React, { forwardRef, RefObject, useCallback, useEffect, useState } from 'react';
import {
  NativeSyntheticEvent, Platform,
  StyleProp,
  TextInput, TextInputKeyPressEventData, TextInputProps, TextStyle,
  View,
  ViewStyle
} from 'react-native';

type Props = TextInputProps & {
  inputContainerStyles?: StyleProp<ViewStyle>;
  firstInput: boolean;
  focusStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle&ViewStyle>;
  numberOfInputs: number;
  handleTextChange: (text: string) => void;
  inputValue: string;
  handleKeyPress: (
    keyPressEvent: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  index: number;
};

const majorVersionIOS: number = parseInt(`${Platform.Version}`, 10);
const isOTPSupported: boolean = Platform.OS === 'ios' && majorVersionIOS >= 12;

const OtpInput = forwardRef<TextInput, Props>(
  (
    {
      focusStyles,
      handleKeyPress,
      handleTextChange,
      inputContainerStyles,
      inputStyles,
      inputValue,
      placeholder,
      selectTextOnFocus,
      secureTextEntry,
      onFocus,
      onBlur,
      index,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    useEffect(() => {
      (ref[index] as unknown as RefObject<TextInput>)?.current?.setNativeProps({
        value: inputValue,
        text: inputValue,
      });
    }, [ref, inputValue, index]);

    const handleOnBlur = useCallback(() => {
      setFocused(false);
      const allFocused = ref.some(it => it.current.isFocused());
      
      if(!allFocused) {
        onBlur && onBlur()
      }
    },[index])

    return (
      <View style={[inputContainerStyles]}>
        <TextInput
          onChangeText={handleTextChange}
          onFocus={() => {
            setFocused(true)
            onFocus && onFocus()
          }}
          onBlur={handleOnBlur}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          ref={ref[index]}
          // https://github.com/facebook/react-native/issues/18339
          selectTextOnFocus={Platform.select({
            ios: selectTextOnFocus,
            android: true,
          })}
          style={[inputStyles,{
              borderColor: inputStyles.borderColor === '#E34444' ? inputStyles.borderColor : focused || !!inputValue ? inputStyles?.borderColorFilled ?? '#414141' :
                  inputStyles.borderColor
          }]}
          textContentType={isOTPSupported ? 'oneTimeCode' : 'none'}
          underlineColorAndroid="transparent"
          secureTextEntry={secureTextEntry}
          {...rest}
        />
      </View>
    );
  },
);

export default React.memo(OtpInput);
