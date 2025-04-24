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
                navigation.navigate('Tabs');
            })
            .catch(error => {
                alert('Email ou senha inválidos');
                console.error('Login failed:', error);
            });
    };

    const cadastrar = () => {
        navigation.navigate("Cadastrar");
    };

    return (
        <View style={styles.container}>
            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', flex: 1, paddingHorizontal: 20}}>
                <Image
                    style={styles.logo}
                    source={require('../../src/assets/nimble-logo.png')}
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
            </View>
            <TouchableOpacity style={styles.cadastrar} onPress={cadastrar}>
                <Text style={styles.signText}>Não possui uma conta?<Text style={styles.linkText}>Cadastre-se</Text></Text>
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
        height: 40,
        backgroundColor: '#2a2a2a',
        borderRadius: 6,
        paddingHorizontal: 15,
        color: '#fff',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#444',
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#22ADFF',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cadastrar: {
        height: 60,
        borderTopWidth: 1.5,
        borderBottomWidth: 0,
        borderTopColor: 'rgba(255, 255, 255, 0.7)',
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    signText: {
        color: 'rgba(255, 255, 255, 0.84)',
        fontSize: 15,
        fontWeight: 'semibold',
        marginHorizontal: 'auto',
    },
    linkText: {
        color: 'rgb(0, 153, 255)',
        fontSize: 15,
        fontWeight: 'semibold',
        marginLeft: 5,
    },
});

export default RealizarLogin;