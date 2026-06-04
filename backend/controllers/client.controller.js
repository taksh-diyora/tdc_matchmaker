import {read, write} from "../utils/fileDB.js";

export const getMyClients = (req, res) => {
    try{
        // Getting Matchmaker id from jwt
        const matchmakerId = req.userId;

        // Getting clients from clients data
        const clients = read("./data/clients.json");

        // filtering out clients that are assigned to Matchmaker with matchmaker id = matchmakerId
        const assignedClients = clients.filter(
            client => client.platformMetadata.assignedTo?.id === matchmakerId
        );

        // return filtered data
        return res.status(200).json({
            success:true,
            count: assignedClients.length,
            clients: assignedClients
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