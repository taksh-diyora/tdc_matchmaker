import {read} from "../utils/fileDB.js";

export const getDashboardStats = (req, res) => {
    try{
        const clients = read("./data/clients.json");
        const matches = read("./data/matches.json");

        const STAGES = {
            ACTIVE: "Active Search",
            DATING: "In Conversation",
            MATCHED: "Matched"
        }

        const activeClients = clients.filter(
            client => client.platformMetadata.stage === STAGES.ACTIVE
        ).length;

        const currentlyDating = clients.filter(
            client => client.platformMetadata.stage === STAGES.DATING
        ).length;

        const closedMatched = clients.filter(
            client => client.platformMetadata.stage === STAGES.MATCHED
        ).length;

        // Count matches sent this calendar month
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const matchesSentThisMonth = matches.filter(m => {
            const sentDate = new Date(m.sentAt);
            return sentDate >= monthStart && m.matchmakerId === req.userId;
        }).length;

        return res.status(200).json({
            success:true,
            activeClients,
            matchesSentThisMonth,
            currentlyDating,
            closedMatched
        });
    }catch(error){
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};