import jwt from "jsonwebtoken";

export const signRefreshToken = (userId:string)=>{
    return  jwt.sign(
        {
            UserInfo: {
                id :userId
            },
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "1d" },
    );
}

export const signAccessToken = (userId:string)=>{
    return jwt.sign(
        {
            UserInfo: {
                id:userId
            },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" },
    );
}

