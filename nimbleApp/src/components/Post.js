import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig.js";
import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import ProfileLogo from "./ProfileLogo.js";
import PostImages from "./PostImages.js";
import { format } from "date-fns";

function ProfileName({ user }) {
    const [ loading, setLoading ] = useState(true);
    const [ username, setUsername ] = useState("");

    useEffect(() => {
        (async () => {
            const userDocRef = doc(db, "users", user.id);
            const userDoc = await getDoc(userDocRef);
            
            setUsername(userDoc.data().nome);
            setLoading(false);
        })();
    }, []);
    
    if (loading) return <ActivityIndicator />

    return <Text style={{ color: "#fff" }}>{username}</Text>;
}

/**
 * @param {{ postDoc: DocumentSnapshot }} param0 
 */
export default function Post({ postDoc }) {
    const postData = postDoc.data();

    return (<View style={{
        padding: 24
    }}>
        <View
            style={
                {
                    flex: 1,
                    flexDirection: "row",
                    height: 64,
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 6
                }
            }
        >
            <ProfileLogo userId={postData.user.id} />
            <View>
                <ProfileName user={postData.user} />
                <Text style={{ color: "#ccc" }}>{format(new Date(postData.time.seconds * 1000), "dd/MMM/yyyy - HH:mm")}</Text>
            </View>
        </View>
        <View style={{ padding: 4 }}>
            <Text style={{ color: "#fff" }}>{postData.text}</Text>
        </View>
        <PostImages postId={postDoc.id} style={{
            width: Dimensions.get("window").width - 16,
            borderRadius: 12,
        }} />
    </View>);
}