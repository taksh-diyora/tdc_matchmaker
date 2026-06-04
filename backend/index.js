import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import clientRouter from "./routes/client.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

const corsOption = {
    origin: 'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOption));

const PORT = process.env.PORT || 3000

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})