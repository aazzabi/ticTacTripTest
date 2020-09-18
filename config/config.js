
module.exports = {
    env: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || "localhost"
    },
    db: {
        url: "mongodb://localhost:27017/tictactrip",
    },
    authentification: {
        secret: "nodeauthsecret",
        access_token: "ya29.GlviBsSxYrdvo41s1ptz_muNzVyX-B7YnAgme3UiiwXMlGu82dWIwjN4P9hso6FclLig2BKepnTJwv6DzOnyLpRAu6ffqKLFK49BaB18V3rFc5CBIGwpqErZaqQF",
        refreshTokenSecret: "1/uN9olQ172AHtwf1U3fp2GYRBK4KQUhaCSIeFknMgteg",
        tokenLife: 900,
        refreshTokenLife: 86400
    },
};
