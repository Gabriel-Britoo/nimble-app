import { Dimensions, ScrollView, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebaseConfig.js";
import ProfileLogo from "../components/ProfileLogo.js";
import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const { width, height } = Dimensions.get("window");

function PostImage({  }) {
    return (<View>

    </View>);
}

export default function CriarPost() {
    const userAuth = auth.currentUser;

    const [ postText, setPostText ] = useState("");
    const [ images, setImages ] = useState([]);

    return (<View>
        <View style={{ flex: 1, flexDirection: "row" }}>
            <ProfileLogo userId={userAuth.uid} />
            <Text></Text>
        </View>
        <TextInput onChangeText={setPostText} />
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
                width: width - 16,
                height: images.length !== 0 ? height - 16 : 0,
                padding: 8,
                borderRadius: 8
            }}
        >

        </ScrollView>
    </View>);
}