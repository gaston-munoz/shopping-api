export const AppConfiguration = () => ({
    port: process.env.PORT || 3000,
    apiHost: process.env.API_HOST,
    jwtSecret : process.env.JWT_SECRET,
})