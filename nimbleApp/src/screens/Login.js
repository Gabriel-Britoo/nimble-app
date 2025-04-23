import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../../firebaseConfig.js';

const RealizarLogin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const tentarLogar = () => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigation.navigate('Tabs'); // <- Vai para a tela de tabs
            })
            .catch(error => {
                alert('Email ou senha inválidos');
                console.error('Login failed:', error);
            });
    };

    const cadastrar = () => {
        console.log("Em desenvolvimento");
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../../assets/nimble-logo.png')}
            />
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#ccc"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#ccc"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <TouchableOpacity style={styles.button} onPress={tentarLogar}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cadastrar}>
                <Text style={styles.linkText}>Cadastrar-se</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 40,
        resizeMode: 'contain',
        borderRadius: 10,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        paddingHorizontal: 15,
        color: '#fff',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#444',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#22ADFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default RealizarLogin;