import jwt from "jsonwebtoken";
import { read } from "../utils/fileDB.js";

export const login = (req, res) => {
    try{
        const {email, password} = req.body;

        // Validate login input
        if(!email || !password){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        }

        // Load matchmakers from disk
        const matchmakers = read("./data/matchmaker.json");
        
        // Find the account by email
        let matchmaker = matchmakers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        
        // Reject unknown users
        if(!matchmaker){
            return res.status(401).json({
                message:"Invalid credentials",
                success:false,
            });
        }

        // Reject bad password
        if(matchmaker.password !== password){
            return res.status(401).json({
                message:"Invalid credentials",
                success:false,
            })
        }

        // Build JWT payload
        const tokenData = {
            userId: matchmaker.id
        }

        // Create the auth token
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn:'1d'});

        // Return only safe profile fields
        matchmaker = {
            id: matchmaker.id,
            name: matchmaker.name,
            designation: matchmaker.designation,
            initials: matchmaker.initials
        }

        // Set auth cookie and respond
        return res.status(200).cookie("token", token, {
            maxAge:1*24*60*60*1000,
            httpOnly:true,
            sameSite: process.env.NODE_ENV==="production" ? "none" : "strict",
            secure: process.env.NODE_ENV==="production"
        }).json({
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