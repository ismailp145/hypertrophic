import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { workoutService, WorkoutSession } from '../services/workoutService';
import { useAuth } from '../context/AuthContext';

export default function WorkoutsScreen() {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      loadWorkoutSessions();
    }
  }, [token]);

  const loadWorkoutSessions = async () => {
    try {
      setIsLoading(true);
      const sessions = await workoutService.getWorkoutSessions(20, 0);
      setWorkoutSessions(sessions);
    } catch (error) {
      console.error('Error loading workout sessions:', error);
      Alert.alert('Error', 'Failed to load workout sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkoutSession = async () => {
    try {
      setIsCreating(true);
      
      // For now, create a simple workout session
      // In the future, you could add a modal to input name and notes
      const newSession = await workoutService.createWorkoutSession({
        name: `Workout ${new Date().toLocaleDateString()}`,
        notes: 'Started a new workout session'
      });

      // Add the new session to the list
      setWorkoutSessions(prev => [newSession, ...prev]);
      
      Alert.alert(
        'Success!', 
        'Workout session created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Here you could navigate to the workout session detail page
              // or show a modal to add exercises
              
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating workout session:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create workout session');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionStatus = (session: WorkoutSession) => {
    if (session.completedAt) {
      return { text: 'Completed', color: '#4CAF50' };
    }
    return { text: 'In Progress', color: '#FF9800' };
  };

  if (!token) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.subtitle}>Please log in to view your workouts</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <TouchableOpacity
            style={[styles.createButton, isCreating && styles.createButtonDisabled]}
            onPress={createWorkoutSession}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.createButtonText}>Start Workout</Text>
            )}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading workouts...</Text>
          </View>
        ) : workoutSessions.length > 0 ? (
          <View style={styles.sessionsContainer}>
            <Text style={styles.sectionTitle}>Recent Workouts</Text>
            {workoutSessions.map((session) => {
              const status = getSessionStatus(session);
              return (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionName}>{session.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                      <Text style={styles.statusText}>{status.text}</Text>
                    </View>
                  </View>
                  <Text style={styles.sessionDate}>
                    {formatDate(session.startedAt)}
                  </Text>
                  {session.notes && (
                    <Text style={styles.sessionNotes}>{session.notes}</Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No workouts yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Tap &quot;Start Workout&quot; to begin your first workout session
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  sessionsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  sessionCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sessionDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  sessionNotes: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
}); 