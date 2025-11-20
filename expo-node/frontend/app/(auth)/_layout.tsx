import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function AuthLayout() {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
                initialRouteName="Home"
            />
        </View>
    );
}
