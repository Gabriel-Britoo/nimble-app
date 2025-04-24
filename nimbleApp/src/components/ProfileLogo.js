import { useEffect, useState } from "react";
import { View, Image, ActivityIndicator, Dimensions } from "react-native";
import S3 from "../../awsConfig.js";

const BUCKET_NAME = "nimble-app-storage";
const FOLDER = "profile-images";
const IMAGE_REGEXP = /\.(jpg|jpeg|png)/i;

const WINDOW_DIMENSIONS = Dimensions.get("window")

/**
 * @param {{
 *      style: import("react-native").StyleProp<import("react-native").ViewStyle>,
 *      userId: string
 * }} param0 
 */
export default function ProfileLogo({ userId, style }) {
    const [ loading, setLoading ] = useState(true);
    const [ image, setImage ] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const response = await S3.listObjectsV2({
                    Bucket: BUCKET_NAME,
                    Prefix: `${FOLDER}/${userId}`,
                    MaxKeys: 1
                }).promise();
                
                const imageFile = response.Contents.filter(file => file.Key.match(IMAGE_REGEXP))[0];
                const imageURL = imageFile ?
                    {
                        name: imageFile.Key.split("/").pop(),
                        url: `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${imageFile.Key}`
                    } : {
                        name: "no-profile-picture",
                        source: require("../../assets/nimble-logo.png")
                    };

                setImage(imageURL);
            } catch(err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (<View style={{ width: 48, height: 48, ...style }}>
        {
            loading ?
            <ActivityIndicator /> :
            <Image
                style={{
                    width: style?.width ?? 48,
                    height: style?.height ?? 48
                }}
                resizeMode="cover"
                source={image.url ? { uri: image.url } : image.source}
            />
        }
    </View>);
}