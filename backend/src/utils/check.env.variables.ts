const checkEnvVariables = ()=>{
    const requiredEnvVars = ['MONGODB_URI', 'PORT', 'NODE_ENV','ACCESS_TOKEN_SECRET'];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Environment variable ${envVar} is not set`);
        }
    }
}

export default checkEnvVariables;