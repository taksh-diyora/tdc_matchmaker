import jwt from "jsonwebtoken";
import { read } from "../utils/fileDB.js";

export const login = (req, res) => {
    try{
        const {email, password} = req.body;

        // missing email or password
        if(!email || !password){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        }

        const matchmakers = read("./data/matchmaker.json");
        
        // serching for the user with entered email address
        let matchmaker = matchmakers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        
        // invalid email address
        if(!matchmaker){
            return res.status(401).json({
                message:"Invalid credentials",
                success:false,
            });
        }

        // invalid password
        if(matchmaker.password !== password){
            return res.status(401).json({
                message:"Invalid credentials",
                success:false,
            })
        }

        // payload to be stored inside JWT
        const tokenData = {
            userId: matchmaker.id
        }

        // generating signed JWT token
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn:'1d'});

        matchmaker = {
            id: matchmaker.id,
            name: matchmaker.name,
            designation: matchmaker.designation,
            initials: matchmaker.initials
        }

        // set token cookie with max age of 1 day and return user data
        return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpOnly:true, sameSite:'strict', secure: process.env.NODE_ENV==="production"}).json({
            message:`Welcome back ${matchmaker.name}`,
            matchmaker,
            success:true
        })

    }catch(error){
        console.log(error);

        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        });
    }
};