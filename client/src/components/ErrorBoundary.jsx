import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as Updates from 'expo-updates';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    console.log('ErrorBoundary caught error in getDerivedStateFromError:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log detailed error information
    console.log('ErrorBoundary componentDidCatch - Error:', error);
    console.log('ErrorBoundary componentDidCatch - ErrorInfo:', errorInfo);
  }

  handleRestart = async () => {
    try {
      console.log('Attempting to reload app...');
      Alert.alert(
        'Restarting App',
        'The app will now restart to recover from the error.',
        [
          {
            text: 'OK',
            onPress: async () => {
              try {
                await Updates.reloadAsync();
              } catch (reloadError) {
                console.log('Failed to reload app:', reloadError);
                // If reload fails, try to force a refresh
                Alert.alert(
                  'Reload Failed',
                  'Please manually close and reopen the app.',
                  [{ text: 'OK' }]
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log('Error in handleRestart:', error);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
            The app encountered an error during update.
          </Text>
          <Text style={{ marginBottom: 20, color: 'red', textAlign: 'center' }}>
            {this.state.error?.toString()}
          </Text>
          <Button 
            title="Restart App" 
            onPress={this.handleRestart}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
