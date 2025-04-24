import React, { useState, useEffect } from 'react';
import "react-native-gesture-handler";
import { Image } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

import Login from './src/screens/Login';
import Feed from './src/screens/Feed';
import CriarPost from './src/screens/CriarPost.js';
import Perfil from './src/screens/Perfil.js';
import Cadastrar from './src/screens/Cadastrar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabsNavigator() {

    const [photoURL, setPhotoURL] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const url = `https://nimble-app-storage.s3.amazonaws.com/profile-images/${user.uid}.jpg`;
            setPhotoURL(url);
        }
    }, []);

    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#1e1e1e' } }}>
            <Tab.Screen
                name="Feed"
                component={Feed}
                options={{
                    tabBarActiveTintColor: '#22ADFF',
                    tabBarInactiveTintColor: '#8e8e8f',
                    tabBarLabel: 'Início',
                    tabBarIcon: ({ focused }) => (
                        <Icon name="home" size={30} color={focused ? "#22ADFF" : "#8e8e8f"} />
                    ),
                }}
            />
            <Tab.Screen
                name="Postar"
                component={CriarPost}
                options={{
                    tabBarActiveTintColor: '#22ADFF',
                    tabBarInactiveTintColor: '#8e8e8f',
                    tabBarLabel: "Postar",
                    tabBarIcon: ({ focused }) => (
                        <Icon name="plus" size={30} color={focused ? "#22ADFF" : "#8e8e8f"} />
                    ),
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={Perfil}
                options={{
                    tabBarActiveTintColor: '#22ADFF',
                    tabBarInactiveTintColor: '#8e8e8f',
                    tabBarLabel: "Perfil",
                    tabBarIcon: ({ focused }) => photoURL ? (
                        <Image
                            source={{ uri: photoURL }}
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                borderWidth: focused ? 2 : 0,
                                borderColor: "#22ADFF",
                            }}
                        />
                    ) : (
                        <Image source={require('./src/assets/default-user.png')} />
                    ),
                }}
            />
            {/* Você pode adicionar mais telas aqui, tipo Perfil, Configurações etc */}
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Cadastrar" component={Cadastrar} />
                <Stack.Screen name="Tabs" component={TabsNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}