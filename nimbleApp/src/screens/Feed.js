import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Post from '../components/Post.js';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig.js';

export default function Feed({ navigation }) {
    const [ posts, setPosts ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        (async () => {
            const postsCollection = collection(db, "posts");
            const q = query(postsCollection, orderBy("time", "desc"), limit(100));

            setPosts((await getDocs(q)).docs);
            setLoading(false);
        })();
    }, []);

    return (
        <View style={{
            flex: 1, justifyContent: 'center', alignItems: 'center',
            backgroundColor: "#1e1e1e"
        }}>
            <StatusBar></StatusBar>
            <Text>Feed</Text>
            <ScrollView>
                {
                    loading ?
                    <ActivityIndicator /> :
                    posts.map(post => <Post postDoc={post} key={post.id} />)
                }
            </ScrollView>
        </View>
    );
}