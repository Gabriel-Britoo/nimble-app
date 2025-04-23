import AWS from "aws-sdk";

AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    sessionToken: "",
    region: "us-east-1"
});

const S3 = new AWS.S3();
export default S3;