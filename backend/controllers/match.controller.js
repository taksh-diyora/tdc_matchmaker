import {read, write} from "../utils/fileDB.js";

export const sendMatch = (req, res) => {
    try{
        const {id: clientId, matchId} = req.params;

        const {
            emailSubject,
            emailBody
        } = req.body;

        if(!emailSubject || !emailBody){
            return res.status(400).json({
                success:false,
                message:"Email subject and body are required"
            });
        }

        const clients = read("./data/clients.json");

        const clientExists = clients.some(
            client => client.id === clientId
        );

        if(!clientExists){
            return res.status(404).json({
                success:false,
                message:"Client not found"
            });
        }

        const matchExists = clients.some(
            client => client.id === matchId
        );

        if(!matchExists){
            return res.status(404).json({
                success:false,
                message:"Match profile not found"
            });
        }

        const matches = read("./data/matches.json");

        const matchRecord = {
            id: Date.now(),

            clientId,
            matchId,

            emailSubject,
            emailBody,

            status: "Sent",

            sentAt: new Date().toISOString(),
            matchmakerId: req.userId
        };

        matches.push(matchRecord);

        write("./data/matches.json", matches);

        return res.status(200).json({
            success:true,
            message:"Match sent successfully",
            sentAt: matchRecord.sentAt,
            matchRecord
        });
    }catch(error){
        console.log(error);
        
        return res.status(500).json({
            message:"Internal Server Error.",
            success:false
        });
    }
}

export const getMatchHistory = (req, res) => {
    try{
        const matchmakerId = req.userId;

        const matches = read("./data/matches.json");

        const history = matches
            .filter(
                match => match.matchmakerId === matchmakerId
            )
            .sort(
                (a, b) =>
                    new Date(b.sentAt) -
                    new Date(a.sentAt)
            );

        return res.status(200).json({
            success: true,
            count: history.length,
            history
        });
    }catch(error){
        console.log(error);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error."
        })
    }
}