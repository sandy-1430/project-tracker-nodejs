require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const connectDB = require("./config/db");
const { secret } = require("./config/secret");
const PORT = secret.port || 7000;

// error handler
const globalErrorHandler = require("./middleware/global-error-handler");

// MiddleWare
const authMiddleWare = require("./middleware/authentication");

// routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use(cors());

app.use(express.json());

// connect database
connectDB();

app.use("/api/auth", authRoutes)
app.use("/api/user", authMiddleWare, userRoutes);

// root route
app.get("/", (req, res) => res.send({ "Message": "Welcome to CC Tracker" }));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

app.use(globalErrorHandler);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'Api endpoint Not Found',
            },
        ],
    });
    next();
});

module.exports = app;