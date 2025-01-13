const express = require("express");
const http = require("http"); // Use http for combining express and socket.io
const db = require("./src/config/db");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const load = require("./src/router/load");
const { producer, consumer } = require("./src/config/kafkaSettings");
const socketSettings = require("./src/config/socketSettings");

const port = process.env.PORT || 3014;  // Fallback to 3014 if PORT isn't specified in .env

// Middleware
app.use(cors({
    origin: "*",  
    methods: ["GET", "POST"]
}));
app.use(express.urlencoded({ limit: "400mb", extended: false }));
app.use(express.json({ limit: "400mb" }));
app.use(express.static(path.join(__dirname, "/public/")));
app.use(load);

// Create HTTP server
const server = http.createServer(app);
const io = socketSettings.initSocket(server); // Initialize Socket.IO with HTTP server

// Kafka producer readiness
producer.on("ready", () => {
    console.log("Kafka Producer is connected and ready.");
});

producer.on("error", (err) => {
    console.error("Producer error:", err);
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("success", (message) => {
        console.log("Server says:", message);
    });

    // Delegate location update handler
    socket.on("updateLocation", (data) => {
        console.log("Location update received:", data);

        // Send data to Kafka
        const payload = [{ topic: "delegateUpdates", messages: JSON.stringify(data) }];
        producer.send(payload, (err, data) => {
            if (err) console.error("Error sending to Kafka:", err);
            else console.log("Message sent to Kafka:", data);
        });
    });

    // Kafka consumer message handler
    consumer.on("message", (message) => {
        const parsedMessage = JSON.parse(message.value);
        io.emit("locationBroadcast", parsedMessage); // Broadcast to all connected clients
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Start server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
