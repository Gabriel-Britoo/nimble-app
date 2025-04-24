import { Dimensions, ScrollView, Text, TextInput, View, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { auth, db } from "../../firebaseConfig.js";
import ProfileLogo from "../components/ProfileLogo.js";
import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import S3 from "../../awsConfig.js";
import { format } from "date-fns";

const { width, height } = Dimensions.get("window");

function PostImage({ uri, removeImage }) {
    return (<View style={{
        width: width - 16,
        height: 260,
        position: "relative"
    }}>
        <TouchableOpacity
            style={{
                borderRadius: 4,
                padding: 4,
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "#000000",
                zIndex: 2,
                width: 32,
                height: 32,
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
            }}
            onPress={() => removeImage(uri)}
        >
            <Icon name="remove" size={24} color={"#FFFFFF"} />
        </TouchableOpacity>
        <Image
            style={{
                width: width - 16,
                height: 260
            }}
            resizeMode="cover"
            source={{ uri }}
        />
    </View>);
}

function ProfileName({ userAuth }) {
    const [ loading, setLoading ] = useState(true);
    const [ username, setUsername ] = useState("");

    useEffect(() => {
        (async () => {
            const userDoc = await getDoc(doc(db, "users", userAuth.uid))
            
            setUsername(userDoc.data().nome);
            setLoading(false);
        })();
    }, []);
    
    if (loading) return <ActivityIndicator />
    else return <Text>{username}</Text>
}

export default function CriarPost() {
    const userAuth = auth.currentUser;

    const [ postText, setPostText ] = useState("");
    const [ images, setImages ] = useState([]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            selectionLimit: 5 - images.length
        });

        if (!result.canceled) {
            setImages([ ...images, ...result.assets.map(asset => asset.uri) ]);
        }
    };

    const removeImage = (uri) => {
        setImages(images.filter(img => img !== uri));
    }

    const postar = async () => {
        if (images.length === 0 && postText === "") {
            Alert.alert("Nada a ser postado", "Insira mais informações para publicar uma postagem.");
            alert("Informações insuficientes para publicar uma postagem.");
            return;
        }

        const postDoc = await addDoc(collection(db, "posts"), {
            user: doc(db, "users", userAuth.uid),
            text: postText,
            time: Timestamp.fromDate(new Date())
        });

        for (let i = 0; i < images.length; i++) {
            const response = await fetch(images[i]);
            const blob = await response.blob();
            
            const uploadResult = await S3.upload({
                Bucket: "nimble-app-storage",
                Key: `post-images/${postDoc.id}/${i}.jpg`,
                Body: blob,
                ContentType: "image/jpeg"
            }).promise();
        }
    }

    return (<View style={{
        backgroundColor: "#1e1e1e", height: Dimensions.get("window").height,
    }}>
        <View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    height: 64,
                    marginVertical: 32,
                    alignItems: "center",
                    padding: 8,
                    gap: 12,
                    marginBottom: 6
                }}
            >
                <ProfileLogo userId={userAuth.uid} />
                <View>
                    <ProfileName userAuth={userAuth} />
                    <Text style={{ color: "#ccc" }}>{format(new Date(), "dd/MMM/yyyy - HH:mm")}</Text>
                </View>
            </View>
            <View>
                <TextInput
                    onChangeText={setPostText}
                    value={postText}
                    multiline={true}
                    numberOfLines={6}
                    style={{
                        width: width - 16,
                        marginHorizontal: 8
                    }}
                />
            </View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                style={{
                    width: width - 16,
                    height: images.length !== 0 ? 260 : 0,
                    padding: 8,
                    margin: 8,
                    borderRadius: 8,
                }}
                >
                {images.map(img => <PostImage key={img} uri={img} removeImage={removeImage} />)}
            </ScrollView>
            {
                images.length < 5 ?
                <TouchableOpacity
                    style={{}}
                    onPress={pickImage}
                >
                    <Text>Adicionar imagens</Text>
                </TouchableOpacity> :
                null
            }
            <TouchableOpacity
                style={{
                    margin: 12
                }}
                onPress={postar}
            >
                <Text>Publicar</Text>
            </TouchableOpacity>
        </View>
    </View>);
}