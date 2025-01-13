const express = require("express");
const http = require("http"); // Use http for combining express and socket.io
const db = require("./src/config/db");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const load = require("./src/router/load");
const { delegateproducer, delegateconsumer, orderproducer, orderconsumer } = require("./src/config/kafkaSettings");
const socketSettings = require("./src/config/socketSettings");


const {getAllOrders} = require("./src/helper/orderDetails") 

const { Delegate } = require("./src/models")

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
delegateproducer.on("ready", () => {
    console.log("Kafka Producer is connected and ready.");
});

delegateconsumer.on("error", (err) => {
    console.error("Producer error:", err);
});

// Socket.IO connection handling


io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Listen for location updates from client
    socket.on("updateLocation", async (data) => {
        console.log("Location update received:", data);

        const { user_id, latitude, longitude } = data;

        // Ensure the user ID and coordinates are valid
        if (!user_id || !latitude || !longitude) {
            console.log("Invalid location data:", data);
            return;
        }

        // Step 1: Update location in the database
        try {
            const primaryKeyData = await Delegate.findByPk(user_id);
            if (!primaryKeyData) {
                console.log(`User with user_id ${user_id} not found.`);
                return;
            }

            const updatedDelegate = await primaryKeyData.update({
                latitude: latitude, // New latitude
                longitude: longitude, // New longitude
            });

            if (updatedDelegate) {
                console.log(`Location for user_id ${user_id} successfully updated!`);
            }
        } catch (error) {
            console.error("Error updating location in database:", error.message);
        }

        // Step 2: Send location data to Kafka (Optional step for background processing)
        const payload = [{ topic: "delegateUpdates", messages: JSON.stringify(data) }];
        delegateproducer.send(payload, (err, result) => {
            if (err) {
                console.error("Error sending location data to Kafka:", err);
            } else {
                console.log("Location data sent to Kafka:", result);
            }
        });
    });

    // Function to send order data to Kafka and emit to frontend
    const sendOrderDataToKafkaAndSocket = async () => {
        try {
            // Fetch orders from the database (optional - you can adjust this as needed)
            const orders = await getAllOrders(); // Assume you have a function to fetch orders

            // Send orders data to Kafka
            const payload = [{
                topic: "orderUpdates",
                messages: [{ value: JSON.stringify(orders) }] // Send orders data as a Kafka message
            }];
            
            delegateproducer.send(payload, (err, result) => {
                if (err) {
                    console.error("Error sending order data to Kafka:", err);
                } else {
                    console.log("Order data sent to Kafka:", result);
                }
            });

            // Emit orders data to the connected frontend
            socket.emit("orderData", orders);
        } catch (error) {
            console.error("Error sending order data to Kafka or emitting to Socket:", error.message);
        }
    };

    // Periodically send order data to client and Kafka every 5 seconds
    const orderInterval = setInterval(sendOrderDataToKafkaAndSocket, 5000);

    // Kafka Consumer to listen for incoming order updates
    orderconsumer.on("message", (message) => {
        console.log("Received order data from Kafka:", message.value);
        try {
            // Parse the received order data and emit to frontend
            const orderData = JSON.parse(message.value);
            socket.emit("orderData", orderData); // Send data to client
        } catch (error) {
            console.error("Error parsing and sending order data to client:", error.message);
        }
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        clearInterval(orderInterval); // Clean up interval when the client disconnects
    });
});

// Start server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
