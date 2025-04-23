import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Login({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Button
                title="Entrar"
                onPress={() => navigation.replace('Tabs')}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});