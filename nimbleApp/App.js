// Gabriel Reis de Brito e Guilherme Ricardo
import React from 'react';
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import Login from './src/screens/Login';
import Feed from './src/screens/Feed';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
            <Stack.Navigator initialRouteName='Feed' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Feed" component={Feed} />
                <Stack.Screen name="Tabs" component={TabsNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}