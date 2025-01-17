const express = require("express");

const http = require("http"); 




const app = express();

const { delegateproducer, delegateconsumer, orderproducer, orderconsumer,userproducer,userconsumer,userIdproducer,userIdconsumer,pdproducer,pdconsumer } = require("../config/kafkaSettings");
const socketSettings = require("../config/socketSettings");


const { getAllOrders } = require("../helper/orderDetails") 
const { userOrder } = require("../helper/userOrder")
const { liveLocationUpdate } = require("../helper/liveLocationUpdate")

const { Delegate } = require("../models")

const {pgClient} = require('../config/postGresConnect') 

const server = http.createServer(app);

const io = socketSettings.initSocket(server); 

delegateproducer.on("ready", () => {
    console.log("Kafka Producer is connected and ready.");
});

delegateconsumer.on("error", (err) => {
    console.error("Producer error:", err);
});
(async () => {
    try {
      await pgClient.connect();
      console.log("Connected to PostgreSQL successfully.");
  
      // Execute the LISTEN queries after a successful connection
      await pgClient.query('LISTEN order_update');
      await pgClient.query('LISTEN order_item_update');
      await pgClient.query('LISTEN delegate_order_map_update');
  
      console.log("LISTEN queries executed successfully.");
    } catch (err) {
      console.error("Error connecting to PostgreSQL:", err.message);
    }
  })();


  let delegateKafkaData = {}; // Cache data for each delegate
  let socketIntervals = {}; 

// Function to fetch and send data to Kafka
const fetchAndSendToKafka = async (delegate_id) => {
    try {
        console.log("Fetching orders for delegate_id:", delegate_id);

        // Fetch the latest orders for the delegate
        const orders = await getAllOrders(delegate_id);

        // Prepare Kafka payload
        const payload = [
            {
                topic: "orderUpdates",
                messages: [{ value: JSON.stringify({ delegate_id, orders }) }],
            },
        ];

        // Send data to Kafka
        await new Promise((resolve, reject) => {
            delegateproducer.send(payload, (err, result) => {
                if (err) {
                    console.error("Error sending order data to Kafka:", err);
                    reject(err);
                } else {
                    console.log("Order data sent to Kafka:", result);
                    resolve(result);
                }
            });
        });

        // Update the delegate-specific Kafka data
        delegateKafkaData[delegate_id] = orders;
        console.log(`Updated delegateKafkaData for delegate_id ${delegate_id}:`, orders);
    } catch (error) {
        console.error("Error fetching or sending order data to Kafka:", error.message);
    }
};


// Function to emit data to the socket every second
const emitToSocketEverySecond = (socket) => {
    const delegate_id = socket.delegate_id;
    if (delegateKafkaData[delegate_id]) {
        socket.emit("orderData", delegateKafkaData[delegate_id]); // Emit the latest data for this delegate
    } else {
        console.warn(`No Kafka data available to emit for delegate_id: ${delegate_id}`);
    }
};
// On PostgreSQL notification
// pgClient.on('notification', async (msg) => {
//     console.log('Received PostgreSQL notification:', msg);

//     const message = JSON.parse(msg.payload);
//     const { action, record_id } = message;

//     // Fetch and send updated data to Kafka for each delegate
//     for (const socket of io.sockets.sockets.values()) {
//         const delegate_id = socket.delegate_id; // Get the delegate_id stored in the socket

//         if (delegate_id) {
//             console.log(`Notifying delegate_id: ${delegate_id}`);

//             // Fetch the latest data for the connected delegate and send it to Kafka
//             await fetchAndSendToKafka(delegate_id);

//             // Emit the update to the socket (new data post-update)
//             socket.emit("orderDataUpdate", { delegate_id, action, record_id });

//             // Immediately emit the updated data to the connected delegate
//             socket.emit("orderData", kafkaData);
//         }
//     }

//     // Prepare Kafka payload
//     const kafkaPayload = [
//         {
//             topic: msg.channel === 'pd_update' ? 'pdUpdates' : 'orderUpdates',
//             messages: [{ value: JSON.stringify({ action, record_id, timestamp: new Date() }) }]
//         }
//     ];

//     // Send the appropriate Kafka message
//     try {
//         if (msg.channel === 'pd_update') {
//             pdproducer.send(kafkaPayload, (err, data) => {
//                 if (err) {
//                     console.error('Error sending to Kafka (pd_update):', err);
//                 } else {
//                     console.log('Sent to pdUpdates:', data);
//                 }
//             });
//         } else if (msg.channel === 'order_update') {
//             orderproducer.send(kafkaPayload, (err, data) => {
//                 if (err) {
//                     console.error('Error sending to Kafka (order_update):', err);
//                 } else {
//                     console.log('Sent to orderUpdates:', data);
//                 }
//             });
//         }
//     } catch (error) {
//         console.error('Error sending Kafka message:', error);
//     }
// });
pgClient.on('notification', async (msg) => {
    console.log('Received PostgreSQL notification:', msg);

    const message = JSON.parse(msg.payload);
    const { action, record_id } = message;

    for (const socket of io.sockets.sockets.values()) {
        const delegate_id = socket.delegate_id;

        if (delegate_id) {
            console.log(`Notifying delegate_id: ${delegate_id}`);

            // Fetch new data for the delegate
            await fetchAndSendToKafka(delegate_id);

            // Emit real-time updates to the delegate
            socket.emit("orderDataUpdate", { delegate_id, action, record_id });
            socket.emit("orderData", delegateKafkaData[delegate_id]);
        }
    }
});
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("delegateInfo", async (data) => {
        const { delegate_id } = data;
        console.log("Received delegate_id:", delegate_id);

        socket.delegate_id = delegate_id;

        await fetchAndSendToKafka(delegate_id); // Fetch data for the given delegate

        if (socketIntervals[socket.id]) {
            clearInterval(socketIntervals[socket.id]);
        }

        socketIntervals[socket.id] = setInterval(() => emitToSocketEverySecond(socket), 1000);

        socket.emit("orderData", delegateKafkaData[delegate_id]); // Emit delegate-specific data immediately
    });
    
    // When a delegate connects, store their ID and emit the data every second
  
 
    socket.on('userInfo', (data) => {
        const { user_id } = data;
        console.log('Received user_id:', user_id);
        socket.user_id = user_id;
    });
    socket.on('userLiveInfo', (data) => {
        const { map_id } = data;
        console.log('Received user_id:', map_id);
        socket.map_id = map_id;
    });
    socket.on("updateLocation", async (data) => {
        console.log("Location update received:", data);

        const { user_id, latitude, longitude } = data;

        if (!user_id || !latitude || !longitude) {
            console.log("Invalid location data:", data);
            return;
        }

       
        try {
            const primaryKeyData = await Delegate.findByPk(user_id);
            if (!primaryKeyData) {
                console.log(`User with user_id ${user_id} not found.`);
                return;
            }

            const updatedDelegate = await primaryKeyData.update({
                latitude: latitude, 
                longitude: longitude, 
            });

            if (updatedDelegate) {
                console.log(`Location for user_id ${user_id} successfully updated!`);
            }
        } catch (error) {
            console.error("Error updating location in database:", error.message);
        }

        
        const payload = [{ topic: "delegateUpdates", messages: JSON.stringify(data) }];
        delegateproducer.send(payload, (err, result) => {
            if (err) {
                console.error("Error sending location data to Kafka:", err);
            } else {
                console.log("Location data sent to Kafka:", result);
            }
        });
    });

   
    const sendOrderDataToUserKafkaAndSocket = async () => {
        try {
            const { user_id } = socket;
       
            const userOrders = await userOrder(user_id); 

       
            const payload = [{
                topic: "userUpdate",
                messages: [{ value: JSON.stringify(userOrders) }] 
            }];
            
            userproducer.send(payload, (err, result) => {
                if (err) {
                    console.error("Error sending user data to Kafka:", err);
                } else {
                    console.log("user data sent to Kafka:", result);
                }
            });

          
            socket.emit("userUpdate", userOrders);
        } catch (error) {
            console.error("Error sending user data to Kafka or emitting to Socket:", error.message);
        }
    };


    const sendOrderDataToUserLocationKafkaAndSocket = async () => {
        try {
            const { map_id } = socket;
          
            const userLocation = await liveLocationUpdate(map_id); 
         
       
            const payload = [{
                topic: "userIdUpdate",
                messages: [{ value: JSON.stringify(userLocation) }] 
            }];
            
            userIdproducer.send(payload, (err, result) => {
                if (err) {
                    console.error("Error sending live data to Kafka:", err);
                } else {
                    console.log("live data sent to Kafka:", result);
                }
            });

          
            socket.emit("userIdUpdate", userLocation);
        } catch (error) {
            console.error("Error sending live  data to Kafka or emitting to Socket:", error.message);
        }
    };

    // const sendOrderDataToKafkaAndSocket = async () => {
    //     try {
    //         const { delegate_id } = socket;
    //         const orders = await getAllOrders(delegate_id); 

       
    //         const payload = [{
    //             topic: "orderUpdates",
    //             messages: [{ value: JSON.stringify(orders) }] 
    //         }];
            
    //         delegateproducer.send(payload, (err, result) => {
    //             if (err) {
    //                 console.error("Error sending order data to Kafka:", err);
    //             } else {
    //                 console.log("Order data sent to Kafka:", result);
    //             }
    //         });

          
    //         socket.emit("orderData", orders);
    //     } catch (error) {
    //         console.error("Error sending order data to Kafka or emitting to Socket:", error.message);
    //     }
    // };
    // const orderInterval = setInterval(sendOrderDataToKafkaAndSocket, 5000);
 

    const useInterval = setInterval(sendOrderDataToUserKafkaAndSocket, 5000);
    const useLiveUpdateInterval = setInterval(sendOrderDataToUserLocationKafkaAndSocket, 1000);
   
    orderconsumer.on("message", (message) => {
        console.log("Received order data from Kafka:", message.value);
        try {
          
            const orderData = JSON.parse(message.value);
            socket.emit("orderData", orderData); 
        } catch (error) {
            console.error("Error parsing and sending order data to client:", error.message);
        }
    });
    userIdconsumer.on("message", (message) => {
        console.log("Received live data from Kafka:", message.value);
        try {
          
            const userLocationData = JSON.parse(message.value);
            socket.emit("liveData", userLocationData); 
        } catch (error) {
            console.error("Error parsing and sending live data to client:", error.message);
        }
    });

    userconsumer.on("message", (message) => {
        console.log("Received user data from Kafka:", message.value);
        try {
          
            const userData = JSON.parse(message.value);
            socket.emit("userUpdate", userData); 
        } catch (error) {
            console.error("Error parsing and sending user data to client:", error.message);
        }
    });
  
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        // clearInterval(orderInterval); 
        clearInterval(useInterval); 
        clearInterval(useLiveUpdateInterval);
    });
});





module.exports = {io,server,app}