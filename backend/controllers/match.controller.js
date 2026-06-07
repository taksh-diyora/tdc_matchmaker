import {read, write} from "../utils/fileDB.js";
import {calculateMatchScore} from "../utils/matchAlgorithm.js";

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

        // Load client records
        const clients = read("./data/clients.json");

        // Verify both profiles exist
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
        const timestamp = new Date().toISOString();

        // Store the sent match record
        const matchRecord = {
            id: Date.now(),

            clientId,
            matchId,

            emailSubject,
            emailBody,

            status: "Sent",

            sentAt: timestamp,
            matchmakerId: req.userId
        };

        matches.push(matchRecord);
        write("./data/matches.json", matches);

        // Stage update rules after sending a match
        const STAGE_COLORS = {
            "Active Search": { bg: "#DCFCE7", color: "#166534" },
            "Shortlisted":   { bg: "#FEF3C7", color: "#92400E" },
            "In Conversation": { bg: "#DBEAFE", color: "#1E40AF" },
            "Matched":       { bg: "#EDE9FE", color: "#5B21B6" },
            "On Hold":       { bg: "#F3F4F6", color: "#374151" },
        };

        const clientIdx = clients.findIndex(c => c.id === clientId);
        const currentStage = clients[clientIdx].platformMetadata.stage;
        let stageChanged = false;

        if (["Active Search", "Shortlisted"].includes(currentStage)) {
            const oldStage = currentStage;
            clients[clientIdx].platformMetadata.stage = "In Conversation";
            clients[clientIdx].platformMetadata.stageBg = STAGE_COLORS["In Conversation"].bg;
            clients[clientIdx].platformMetadata.stageColor = STAGE_COLORS["In Conversation"].color;
            clients[clientIdx].platformMetadata.lastActivity = timestamp;
            write("./data/clients.json", clients);

            // Log the stage change
            const notes = read("./data/notes.json");
            notes.push({
                id: Date.now() + 1,
                clientId,
                type: "Stage Update",
                oldStage,
                newStage: "In Conversation",
                content: `Auto-transitioned after match proposal sent to ${matchId}`,
                createdAt: timestamp,
                matchmakerId: req.userId
            });
            write("./data/notes.json", notes);
            stageChanged = true;
        }

        return res.status(200).json({
            success:true,
            message:"Match sent successfully",
            sentAt: matchRecord.sentAt,
            matchRecord,
            stageChanged,
            newStage: stageChanged ? "In Conversation" : currentStage
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

        // Load sent matches and profiles
        const matches = read("./data/matches.json");
        const clients = read("./data/clients.json");

        // Build a safe profile lookup
        const clientMap = {};
        clients.forEach(c => {
            const { contact, ...profile } = c;
            clientMap[c.id] = profile;
        });

        const history = matches
            .filter(
                match => match.matchmakerId === matchmakerId
            )
            .map(match => {
                const clientProfile = clientMap[match.clientId] || null;
                const matchProfile = clientMap[match.matchId] || null;
                let matchScore = null;
                if (clientProfile && matchProfile) {
                    matchScore = calculateMatchScore(clientProfile, matchProfile);
                }
                return {
                    ...match,
                    clientDetails: clientProfile,
                    matchDetails: matchProfile,
                    matchScore,
                };
            })
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