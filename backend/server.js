require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const productionConfig = require("./config/production");

const app = express();

// Production security headers
if (process.env.NODE_ENV === 'production') {
    Object.entries(productionConfig.securityHeaders).forEach(([key, value]) => {
        app.use((req, res, next) => {
            res.setHeader(key, value);
            next();
        });
    });
}

app.use(cors(process.env.NODE_ENV === 'production' ? productionConfig.corsOptions : {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET","PUT","POST","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

connectDB();

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense",expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);

//serve upload folders
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const port = process.env.PORT || 5000;

//starting the server to listen to port
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});