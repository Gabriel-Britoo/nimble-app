import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updateEmail, updatePassword } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import app from "../../firebaseConfig";
import S3 from "../../awsConfig";
import ProfileLogo from "../components/ProfileLogo";

const S3_BUCKET = "nimble-app-storage";

const EditarPerfil = ({ navigation }) => {
    const auth = getAuth();
    const db = getFirestore(app);
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);

    const [nome, setNome] = useState("");
    const [novoEmail, setNovoEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [fotoAtual, setFotoAtual] = useState(""); // URL atual da foto
    const [fotoSelecionada, setFotoSelecionada] = useState(null); // Armazena a foto temporária selecionada

    useEffect(() => {
        const fetchUserData = async () => {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setNome(userDoc.data().nome);
                setNovoEmail(user.email);
                setFotoAtual(userDoc.data().photoURL);
            }
        };
        fetchUserData();
    }, []);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setFotoSelecionada(result.assets[0].uri); // Salva a imagem temporariamente no estado
        }
    };

    const uploadImage = async (uri) => {
        try {
            const filePath = `profile-images/${user.uid}.jpg`;
            const response = await fetch(uri);
            const blob = await response.blob();

            const uploadParams = {
                Bucket: S3_BUCKET,
                Key: filePath,
                Body: blob,
                ContentType: "image/jpeg",
            };

            const uploadResult = await S3.upload(uploadParams).promise();
            const photoURL = uploadResult.Location;

            // Atualiza a URL no Firestore
            await updateDoc(userDocRef, { photoURL });
            setFotoAtual(photoURL); // Atualiza a imagem no estado

            Alert.alert("Sucesso", "Foto de perfil atualizada!");
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
            Alert.alert("Erro", "Não foi possível atualizar a foto.");
        }
    };

    const handleUpdateProfile = async () => {
        const credential = EmailAuthProvider.credential(user.email, senhaAtual);

        try {
            await reauthenticateWithCredential(user, credential);

            await updateDoc(userDocRef, { nome });

            if (novoEmail !== user.email) {
                await updateEmail(user, novoEmail);
            }

            if (novaSenha) {
                await updatePassword(user, novaSenha);
            }

            // Se uma nova imagem foi selecionada, faz o upload da nova imagem
            if (fotoSelecionada) {
                await uploadImage(fotoSelecionada);
            }

            Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao atualizar perfil: ", error);
            Alert.alert("Erro", "Ocorreu um erro ao atualizar o perfil.");
        }
    };

    return (
        <View style={styles.container}>
            <ProfileLogo style={styles.imgPerfil} userId={user.uid} />

            <Pressable style={styles.botao} onPress={handlePickImage}>
                <Text style={styles.textoBotao}>Alterar imagem de perfil</Text>
            </Pressable>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={novoEmail}
                onChangeText={setNovoEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha Atual"
                secureTextEntry
                value={senhaAtual}
                onChangeText={setSenhaAtual}
            />
            <TextInput
                style={styles.input}
                placeholder="Nova Senha"
                secureTextEntry
                value={novaSenha}
                onChangeText={setNovaSenha}
                autoComplete="new-password"
            />

            <Pressable style={styles.botao} onPress={handleUpdateProfile}>
                <Text style={styles.textoBotao}>Salvar Alterações</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#1e1e1e",
        alignItems: "center",
        justifyContent: "center",
    },
    imgPerfil: {
        width: 140,
        height: 140,
        marginBottom: 15,
    },
    input: {
        width: "100%",
        height: 40,
        backgroundColor: "#2a2a2a",
        borderRadius: 6,
        paddingHorizontal: 15,
        color: "#fff",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#444",
        fontSize: 16,
    },
    botao: {
        backgroundColor: "#22ADFF",
        padding: 10,
        borderRadius: 6,
        marginBottom: 15,
    },
    textoBotao: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default EditarPerfil;