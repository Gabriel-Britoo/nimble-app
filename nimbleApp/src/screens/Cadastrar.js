import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "@firebase/firestore";
import { getApp } from "firebase/app";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import s3 from "../../awsConfig";

const registrarUsuario = async (email, password, nome, imagemUri) => {
    const auth = getAuth(getApp());
    const firestore = getFirestore(getApp());

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const filename = imagemUri.substring(imagemUri.lastIndexOf("/") + 1);
    const blob = await fetch(imagemUri).then((response) => response.blob());

    const uploadParams = {
        Bucket: "nimble-app-storage",
        Key: `profile-images/${user.uid}/${filename}`,
        Body: blob,
        ContentType: "image/jpeg",
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    const photoURL = uploadResult.Location;

    await setDoc(doc(firestore, "users", user.uid), {
        nome,
        email,
        photoURL,
    });
};

export default function Cadastro({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const [imagemUri, setImagemUri] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImagemUri(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        if (email && password && nome && imagemUri) {
            setLoading(true);
            try {
                await registrarUsuario(email, password, nome, imagemUri);
                Alert.alert("Sucesso", "Usuário registrado com sucesso!");
                navigation.navigate("Feed");
            } catch (error) {
                console.error("Erro ao registrar usuário:", error);
                Alert.alert("Erro", "Não foi possível registrar o usuário.");
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
        }
    };

    const login = () => {
        navigation.navigate("Login");
    };

    return (
        <View style={styles.container}>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', flex: 1, paddingHorizontal: 20 }}>
                {imagemUri && (
                    <Image
                    source={imagemUri ? { uri: imagemUri } : require('../assets/default-user.png')}
                    style={styles.imagePreview}
                  />
                )}

                <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                    <Text style={styles.imageBtnText}>
                        {imagemUri ? "Alterar imagem" : "Escolher Imagem de Perfil"}
                    </Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#ccc"
                    onChangeText={setNome}
                    value={nome}
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

                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    )}
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cadastrar} onPress={login}>
                <Text style={styles.signText}>Já possui uma conta?<Text style={styles.linkText}>Entrar</Text></Text>
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
    imagePreview: {
        width: 160,
        height: 160,
        borderRadius: 80,
        marginBottom: 10,
    },
    imageBtn: {
        backgroundColor: "rgba(0, 0, 0, 0)",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    imageBtnText: {
        color: "#fff",
        fontWeight: "bold",
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