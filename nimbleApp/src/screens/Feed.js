import React from 'react';
import { View, Text } from 'react-native';
import PostImages from '../components/PostImages.js';
import { StatusBar } from 'expo-status-bar';

export default function Feed({ navigation }) {
    return (
        <View style={{
            flex: 1, justifyContent: 'center', alignItems:
                'center'
        }}>
            <StatusBar></StatusBar>
            <Text>Feed</Text>
            <PostImages
                postId='euAmoRoblox'
            />
            <PostImages postId='euAmoMuitoMaisRoblox' />
        </View>
    );
}