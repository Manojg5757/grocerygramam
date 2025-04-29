import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirm, setConfirm] = useState(null); // Used to store the confirmation result after sending OTP
  const [error, setError] = useState(''); // Error state to store any error messages

  // Function to validate and format the phone number for India
  const formatPhoneNumber = (number) => {
    // Remove any non-numeric characters
    const cleanedNumber = number.replace(/\D/g, '');

    // If the number doesn't start with '91', add the '91' prefix (for India)
    if (cleanedNumber.length === 10 && !cleanedNumber.startsWith('91')) {
      return '+91' + cleanedNumber;
    } else if (cleanedNumber.length === 10) {
      return '+91' + cleanedNumber;
    }

    return null;  // Return null if the number is not valid
  };

  // Function to handle phone number submission and send OTP
  const sendVerification = async () => {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    console.log('Sending OTP to:', formattedNumber);


    if (!formattedNumber) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      // Send OTP to the provided phone number
      const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
      setConfirm(confirmation);  // Save the confirmation result
      console.log("OTP sent to your phone.");
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error("Error sending OTP: ", error);
      setError('Failed to send OTP. Please try again.'); // Set error message to display
    }
  };

  // Function to verify the OTP entered by the user
  const verifyCode = async () => {
    if (confirm) {
      try {
        await confirm.confirm(verificationCode); // Verify the OTP
        console.log("Phone number authenticated successfully.");
        setError(''); // Clear error on successful verification
      } catch (error) {
        console.error("Invalid code entered.", error);
        setError('Invalid OTP. Please check and try again.'); // Set error message if OTP is invalid
      }
    }
  };

  return (
    <SafeAreaView>
      {/* Input for phone number */}
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />
      <Button title="Send OTP" onPress={sendVerification} />
      
      {/* Show error message if there is an error */}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

      {/* OTP input when phone number is provided */}
      {confirm && (
        <View>
          <TextInput
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Enter OTP"
            keyboardType="number-pad"
          />
          <Button title="Verify OTP" onPress={verifyCode} />
        </View>
      )}
      
      {/* Display success message after authentication */}
      {confirm && !verificationCode && <Text>Verification sent! Please check your phone.</Text>}
    </SafeAreaView>
  );
};

export default PhoneAuth;
