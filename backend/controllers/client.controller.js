import {read, write} from "../utils/fileDB.js";
import {calculateMatchScore, getTopReasons} from "../utils/matchAlgorithm.js";

export const getMyClients = (req, res) => {
    try{
        // Getting Matchmaker id from jwt
        const matchmakerId = req.userId;

        const {
            search,
            stage,
            sortBy,
            page = 1,
            limit = 12
        } = req.query;

        // Getting clients from clients data
        const clients = read("./data/clients.json");

        // filtering out clients that are assigned to Matchmaker with matchmaker id = matchmakerId
        let assignedClients = clients.filter(
            client => client.platformMetadata.assignedTo?.id === matchmakerId
        );

        if(search){
            assignedClients = assignedClients.filter(
                client => client.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if(stage){
            assignedClients = assignedClients.filter(
                client => client.platformMetadata.stage === stage
            );
        }

        if(sortBy === "lastActivity"){
            assignedClients.sort(
                (a, b) =>
                    new Date(b.platformMetadata.lastActivity) -
                    new Date(a.platformMetadata.lastActivity)
            );
        }

        if(sortBy === "age"){
            assignedClients.sort(
                (a, b) => b.age - a.age
            );
        }

        if(sortBy === "name"){
            assignedClients.sort(
                (a, b) =>
                    a.fullName.localeCompare(
                        b.fullName
                    )
            );
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const startIndex =
            (pageNumber - 1) * limitNumber;

        const paginatedClients =
            assignedClients.slice(
                startIndex,
                startIndex + limitNumber
            );

        // return filtered data
        return res.status(200).json({
            success: true,

            totalClients:
                assignedClients.length,

            currentPage:
                pageNumber,

            totalPages:
                Math.ceil(
                    assignedClients.length /
                    limitNumber
                ),

            clients:
                paginatedClients
        });
    }catch(error){
        console.log(error);

        return res.status(500).json({
            message:"Internal Server Error.",
            success:false
        })
    }
}

export const getClientById = (req, res) => {
    try{
        const {id} = req.params;

        const clients = read("./data/clients.json");

        const client = clients.find(
            client => client.id === id
        );

        if(!client){
            return res.status(404).json({
                message:"Client not found",
                success:false
            });
        }

        return res.status(200).json({
            success:true,
            client
        });
    }catch(error){
        console.log(error);

        return res.status(500).json({
            message:"Internal Server Error.",
            success:false
        })
    }
}

export const updateClientStage = (req, res) => {
    try{
        const {id} = req.params;
        const {stage, reason} = req.body;

        if(!stage){
            return res.status(400).json({
                success:false,
                message:"Stage is required"
            });
        }

        const clients = read("./data/clients.json");

        const clientIndex = clients.findIndex(
            client => client.id === id
        );

        if(clientIndex === -1){
            return res.status(404).json({
                success:false,
                message:"Client not found"
            });
        }

        const oldStage = clients[clientIndex].platformMetadata.stage;

        if(oldStage === stage){
            return res.status(200).json({
                message:`Stage already is ${stage}`,
                success:true
            });
        }

        const timestamp = new Date().toISOString();

        clients[clientIndex].platformMetadata.stage = stage;
        clients[clientIndex].platformMetadata.lastActivity = timestamp;

        write("./data/clients.json", clients);

        const notes = read("./data/notes.json");

        notes.push({
            id: Date.now(),
            clientId: id,
            type: "Stage Update",
            oldStage,
            newStage: stage,
            content: reason || "",
            createdAt: timestamp,
            matchmakerId: req.userId
        });

        write("./data/notes.json", notes);

        return res.status(200).json({
            success:true,
            oldStage,
            updatedStage:stage,
            updatedAt:clients[clientIndex].platformMetadata.lastActivity,
            reason
        });

    }catch(error){
        console.log(error);

        return res.status(500).json({
            message:"Internal Server Error.",
            success:false
        })
    }
}

export const addNote = (req, res) => {
    try{
        const { id: clientId} = req.params;

        const {
            type,
            content,
            isPrivate = false
        } = req.body;

        if(!type || !content){
            return res.status(400).json({
                message:"Type and content are required",
                success:false
            })
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

        const notes = read("./data/notes.json");

        const newNote = {
            id: Date.now(),
            clientId,

            type,
            content,

            isPrivate,

            createdAt: new Date().toISOString(),

            matchmakerId: req.userId
        };

        notes.push(newNote);

        write("./data/notes.json", notes);

        return res.status(201).json({
            success: true,
            note: newNote
        });

    }catch(error){
        console.log(error);
        
        return res.status(500).json({
            message:"Internal Server Error.",
            success:false
        });
    }
}

export const getClientNotes = (req, res) => {
    try{
        const {id: clientId} = req.params;
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

        const notes = read("./data/notes.json");

        const clientNotes = notes.filter(
            note => note.clientId === clientId
        ).sort(
            (a, b) => 
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

        return res.status(200).json({
            success:true,
            count: clientNotes.length,
            notes: clientNotes
        })
    }catch(error){
        console.log(error);
        
        return res.status(500).json({
            message:"Internal Server Error.",
            success:false
        });
    }
}

export const getClientMatches = (req, res) => {
    try{
        const {id} = req.params;
        const clients = read("./data/clients.json");

        const primaryClient = clients.find(
            client => client.id === id
        );

        if(!primaryClient){
            return res.status(404).json({
                message:"Client not found.",
                success: false,
            });
        }

        const matches = clients
            .filter(client => client.gender !== primaryClient.gender)
            .map(candidate => {

                const matchScore =
                    calculateMatchScore(
                        primaryClient,
                        candidate
                    );

                const reasons =
                    getTopReasons(
                        matchScore.breakdown
                    );

                return {
                    ...candidate,
                    matchScore,
                    reasons
                };
            })
            .sort((a, b) => b.matchScore.totalScore - a.matchScore.totalScore)
            .slice(0, 5);

        return res.status(200).json({
            success:true,
            count: matches.length,
            primaryClient: {
                id: primaryClient.id,
                name: primaryClient.fullName,
                gender: primaryClient.gender
            },
            matches: matches
        });

    }catch(error){
        console.log(error);
        
        return res.status(500).json({
            message:"Internal Server Error.",
            success:false
        });
    }
}

export const revealContactInfo = (req, res) => {
    try {

        const { id } = req.params;

        const clients = read("./data/clients.json");

        const client = clients.find(
            client => client.id === id
        );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        const notes = read("./data/notes.json");

        const alreadyRevealed = notes.some(
            note =>
                note.clientId === id &&
                note.type === "Contact Reveal"
        );

        if(!alreadyRevealed){

            notes.push({
                id: Date.now(),
                clientId: id,
                type: "Contact Reveal",
                content: "Contact information revealed",
                createdAt: new Date().toISOString(),
                matchmakerId: req.userId
            });

            write("./data/notes.json", notes);
        }

        return res.status(200).json({
            success: true,
            email: client.email,
            phone: client.phone
        });

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};