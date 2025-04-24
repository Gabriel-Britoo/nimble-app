import React from 'react';
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import Login from './src/screens/Login';
import Feed from './src/screens/Feed';
import Cadastrar from './src/screens/Cadastrar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabsNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Feed"
                component={Feed}
                options={{
                    tabBarLabel: 'Início',
                    tabBarIcon: ({ focused }) => (
                        <Icon name="home" size={30} color={focused ? "#383B43" : "#8e8e8f"} />
                    ),
                }}
            />
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