const express = require("express");
const http = require("http"); 
const db = require("./src/config/db");

require("dotenv").config();
const cors = require("cors");
const path = require("path");
const load = require("./src/router/load");


const { server,app,io } = require("./src/socketCode/socket")

const port = process.env.PORT || 3014;  

app.use(cors({
    origin: "*",  
    methods: ["GET", "POST"]
}));
app.use(express.urlencoded({ limit: "400mb", extended: false }));
app.use(express.json({ limit: "400mb" }));
app.use(express.static(path.join(__dirname, "/public/")));
app.use(load);


server.listen(port, () => {
    try {
      console.log(`Server is running on http://localhost:${port}`);
    } catch (error) {
      console.error('Error in listen callback:', error);
    }
  });
