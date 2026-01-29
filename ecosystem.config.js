module.exports = {
    apps: [
        {
            name: "NetPersonelMobile",
            script: "npx",
            args: "expo start --no-dev --minify",
            interpreter: "none",
            env: {
                NODE_ENV: "development",
                REACT_NATIVE_PACKAGER_HOSTNAME: "BURAYA_SUNUCU_IP_ADRESINIZI_YAZIN", // Örn: 185.123.45.67
                EXPO_DEVTOOLS_LISTEN_ADDRESS: "0.0.0.0"
            },
        },
    ],
};
