import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import cors from "cors";


dotenv.config()

let port = process.env.PORT
let app = express()
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use('/api/complaints', complaintRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);


app.get("/", (req, res) => {
    res.send("Hello From Server")
})

app.listen(port, () => {

    console.log("Server Started")
    connectDb()
})

