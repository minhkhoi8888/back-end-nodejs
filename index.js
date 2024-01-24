require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHanler')
const { logger, logEvents } = require('./middleware/logger')
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const connectDB = require('./config/dbConnect.js')
const mongoose = require('mongoose')
const { options } = require('./config/swaggerConfig.js')
const PORT = process.env.PORT || 3500;
const specs = swaggerJsDoc(options);
const cors = require('cors')
const corsOptions = require('./config/ corsOptions.js')

connectDB();

app.use(logger);
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, 'public')));

app.use("/", require('./routes/root'));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use('/notes', require('./routes/noteRoutes'));
app.use('/posts', require('./routes/postsRouter.js'));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.all("*", (req, res) => {
    res.status(404);
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")){
        res.json({message: "404 Not Found"});
    } else {
        res.type("txt").send("404 Not Found");
    }
})

app.use(errorHandler);


mongoose.connection.once("open",() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

})

mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
})