import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Dimensions, View } from "react-native";
import S3 from "../../awsConfig.js";

const BUCKET_NAME = "nimble-app-storage";
const BASE_FOLDER = "post-images";
const IMAGE_REGEXP = /\.(jpg|jpeg|png)/i;

const WINDOW_DIMENSIONS = Dimensions.get("window")

/**
 * @param {{
*      style: import("react-native").StyleProp<import("react-native").ViewStyle>,
*      postId: string
* }} param0 
*/
export default function PostImages({ postId }) {
    const [ loading, setLoading ] = useState(true);
    const [ images, setImages ] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await S3.listObjectsV2({
                    Bucket: BUCKET_NAME, Prefix: `${BASE_FOLDER}/${postId}`
                }).promise();

                const imageFiles = response.Contents.filter(file => file.Key.match(IMAGE_REGEXP));
                const imageURLs = imageFiles.map(file => ({
                    name: file.Key.split("/").pop(),
                    url: `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${file.Key}`
                }));
                
                setImages(imageURLs);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    console.log(images);

    return (<View style={{ width: WINDOW_DIMENSIONS.width }}>
        {
            loading ?
            <ActivityIndicator/> :
            <ScrollView
                horizontal={true}
                style={{ flexDirection: "row", width: WINDOW_DIMENSIONS.width, height: 240 }}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
            >
                {
                    images.map(image => <Image
                        style={{
                            width: WINDOW_DIMENSIONS.width,
                            height: WINDOW_DIMENSIONS.width
                        }}
                        source={{ uri: image.url }}
                        key={image.name}
                        resizeMode="cover"
                    />)
                }
            </ScrollView>
        }
    </View>);
}