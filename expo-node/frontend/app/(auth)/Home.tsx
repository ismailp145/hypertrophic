import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Text style={styles.title}>Hypertrophic</Text>
                    <Text style={styles.subtitle}>Train together, grow together</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => router.push('/Login')}
                    >
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.secondaryButton]} 
                        onPress={() => router.push('/Signup')}
                    >
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Create Account</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.termsText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Changed from Discord Not Quite Black to White
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 16,
        borderRadius: 200, // Makes the image circular
        overflow: 'hidden',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000', // Changed from white to black for contrast on white background
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666', // Changed from Discord Grey to darker grey for contrast
        textAlign: 'center',
    },
    buttonContainer: {
        marginBottom: 20,
        width: '100%',
    },
    button: {
        backgroundColor: '#FF6B6B', // Changed to pastel red
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF', // Changed from Discord Dark Not Black to White
        borderWidth: 1,
        borderColor: '#FF6B6B', // Changed to pastel red
    },
    secondaryButtonText: {
        color: '#FF6B6B', // Changed to pastel red for contrast on white background
    },
    termsText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#666666', // Changed from Discord Grey to darker grey
    },
    linkText: {
        color: '#FF6B6B', // Changed to pastel red
        fontWeight: '500',
    },
});
