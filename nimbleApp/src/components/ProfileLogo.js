import { useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

/**
 * @param {{
 *      style: import("react-native").StyleProp<import("react-native").ViewStyle>,
 *      userId: string
 * }} param0 
 */
export default function ProfileLogo({ userId, style }) {
    const [ loading, setLoading ] = useState(true);

    return (<View style={{ width: 48, height: 48, ...style }}>
        {
            loading ?
            <ActivityIndicator /> :
            <Image
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />
        }
    </View>);
}