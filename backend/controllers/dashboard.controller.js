import {read} from "../utils/fileDB.js";

export const getDashboardStats = (req, res) => {
    try{
        const clients = read("./data/clients.json");

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

        return res.status(200).json({
            success:true,
            activeClients,
            matchesSentThisMonth: 0,
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