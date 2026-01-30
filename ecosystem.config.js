module.exports = {
    apps: [
        {
            name: "NetPersonelMobile",
            script: "npx",
            args: "expo start --tunnel --no-dev --minify", // --tunnel eklendi!
            interpreter: "none",
            env: {
                NODE_ENV: "development",
                EXPO_DEVTOOLS_LISTEN_ADDRESS: "0.0.0.0"
            },
        },
    ],
};
