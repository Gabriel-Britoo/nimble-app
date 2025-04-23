import { useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import ProfileLogo from "./ProfileLogo.js";

/**
 * @param {{
*      style: import("react-native").StyleProp<import("react-native").ViewStyle>,
*      postId: string
* }} param0 
*/
export default function PostImages({ postId }) {
    const [ loading, setLoading ] = useState(true);

    return (<View>
        {
            loading ?
            <ActivityIndicator/> :
            <Image
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />
        }
    </View>);
}