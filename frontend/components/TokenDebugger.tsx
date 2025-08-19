import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { debugTokenStatus } from '../app/services/workoutService';
import { useAuth } from '../app/context/AuthContext';

export const TokenDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { token, user } = useAuth();

  const addLog = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testTokenStorage = async () => {
    addLog('🔍 Testing token storage...');
    await debugTokenStatus();
    addLog('✅ Token storage test completed');
  };

  const clearLogs = () => {
    setDebugInfo([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Token Debugger</Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Current Token State:</Text>
        <Text style={styles.value}>
          {token ? `Present (${token.length} chars)` : 'Missing'}
        </Text>
        
        <Text style={styles.label}>User State:</Text>
        <Text style={styles.value}>
          {user ? `${user.name} (${user.email})` : 'Not logged in'}
        </Text>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.button} onPress={testTokenStorage}>
          <Text style={styles.buttonText}>Test Token Storage</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={clearLogs}>
          <Text style={styles.buttonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.logSection}>
        <Text style={styles.label}>Debug Logs:</Text>
        {debugInfo.map((log, index) => (
          <Text key={index} style={styles.logEntry}>
            {log}
          </Text>
        ))}
        {debugInfo.length === 0 && (
          <Text style={styles.noLogs}>No logs yet. Press Test Token Storage to start.</Text>
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
  infoSection: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  logSection: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    maxHeight: 200,
  },
  logEntry: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  noLogs: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
