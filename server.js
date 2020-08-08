require("dotenv").config();
const express = require("express");
const cors = require("cors");
// IMPORT routes
const postsRouter = require("./posts/posts-router");

const server = express();
const Port = process.env.PORT || 8080;

server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
    res.json({
        message: "Welcome to my NODE 2 Project API",
    });
});
// add routes
server.use(postsRouter);

server.listen(Port, () => {
    console.log(`## Server Running at http:localhost:${Port}`);
});
