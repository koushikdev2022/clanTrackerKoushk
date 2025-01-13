const socketio = require("socket.io");

const initSocket = (server) => {
    const io = socketio(server, {
        cors: {
            origin: "*",   // Allow all origins (modify for production security)
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true,
        },
    });

    io.on("error", (err) => {
        console.error("Socket.IO Error:", err);
    });

    return io;
};

module.exports = { initSocket };
