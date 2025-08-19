// React Native Token Storage Test Component
// This component can be used to test token storage in your React Native app
// Add it temporarily to any screen to test storage functionality

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token.here";

export const TokenStorageTester: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testSecureStore = async () => {
    try {
      addResult('📱 Testing SecureStore...');
      
      // Test storing
      await SecureStore.setItemAsync('test_token', testToken);
      addResult('✅ Token stored in SecureStore');
      
      // Test retrieving
      const retrievedToken = await SecureStore.getItemAsync('test_token');
      if (retrievedToken === testToken) {
        addResult('✅ Token retrieved from SecureStore successfully');
      } else {
        addResult('❌ Token retrieval failed - mismatch');
      }
      
      // Test deleting
      await SecureStore.deleteItemAsync('test_token');
      addResult('✅ Token deleted from SecureStore');
      
      return true;
    } catch (error) {
      addResult(`❌ SecureStore test failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  };

  const testAsyncStorage = async () => {
    try {
      addResult('💾 Testing AsyncStorage...');
      
      // Test storing
      await AsyncStorage.setItem('test_token', testToken);
      addResult('✅ Token stored in AsyncStorage');
      
      // Test retrieving
      const retrievedToken = await AsyncStorage.getItem('test_token');
      if (retrievedToken === testToken) {
        addResult('✅ Token retrieved from AsyncStorage successfully');
      } else {
        addResult('❌ Token retrieval failed - mismatch');
      }
      
      // Test deleting
      await AsyncStorage.removeItem('test_token');
      addResult('✅ Token deleted from AsyncStorage');
      
      return true;
    } catch (error) {
      addResult(`❌ AsyncStorage test failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    addResult('🚀 Starting token storage tests...');
    
    const secureStoreWorks = await testSecureStore();
    const asyncStorageWorks = await testAsyncStorage();
    
    addResult('');
    addResult('📊 Test Results:');
    addResult(`SecureStore: ${secureStoreWorks ? '✅ Working' : '❌ Failed'}`);
    addResult(`AsyncStorage: ${asyncStorageWorks ? '✅ Working' : '❌ Failed'}`);
    
    if (secureStoreWorks && asyncStorageWorks) {
      addResult('🎉 Both storage methods are working correctly!');
    } else if (asyncStorageWorks) {
      addResult('⚠️  Only AsyncStorage is working. This is fine for development.');
    } else {
      addResult('🚨 Both storage methods failed. Check your setup.');
    }
    
    setIsRunning(false);
  };

  const testCurrentStorage = async () => {
    try {
      addResult('🔍 Checking current storage status...');
      
      // Check SecureStore
      const secureToken = await SecureStore.getItemAsync('auth_token');
      addResult(`SecureStore auth_token: ${secureToken ? 'Present' : 'Missing'}`);
      
      // Check AsyncStorage
      const asyncToken = await AsyncStorage.getItem('auth_token');
      addResult(`AsyncStorage auth_token: ${asyncToken ? 'Present' : 'Missing'}`);
      
      if (secureToken || asyncToken) {
        addResult('✅ Found stored auth token');
      } else {
        addResult('❌ No auth token found in storage');
      }
    } catch (error) {
      addResult(`❌ Error checking storage: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Token Storage Tester</Text>
      
      <View style={styles.buttonSection}>
        <TouchableOpacity 
          style={[styles.button, isRunning && styles.buttonDisabled]} 
          onPress={runAllTests}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testCurrentStorage}>
          <Text style={styles.buttonText}>Check Current Storage</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={clearResults}>
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsSection}>
        <Text style={styles.label}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultEntry}>
            {result}
          </Text>
        ))}
        {testResults.length === 0 && (
          <Text style={styles.noResults}>
            No test results yet. Press &quot;Run All Tests&quot; to start.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  buttonSection: {
    gap: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  resultsSection: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    maxHeight: 300,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  resultEntry: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  noResults: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TokenStorageTester;
