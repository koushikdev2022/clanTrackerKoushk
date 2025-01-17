// const { delegateproducer, delegateconsumer, orderproducer, orderconsumer,userproducer,userconsumer,userIdproducer,userIdconsumer } = require("./src/config/kafkaSettings");
// const socketSettings = require("./src/config/socketSettings");


// const { getAllOrders } = require("./src/helper/orderDetails") 
// const { userOrder } = require("./src/helper/userOrder")
// const { liveLocationUpdate } = require("./src/helper/liveLocationUpdate")

// const { Delegate } = require("./src/models")



// io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     socket.on('delegateInfo', (data) => {
//         const { delegate_id } = data;
//         console.log('Received delegate_id:', delegate_id);
//         socket.delegate_id = delegate_id;
//     });
//     socket.on('userInfo', (data) => {
//         const { user_id } = data;
//         console.log('Received user_id:', user_id);
//         socket.user_id = user_id;
//     });
//     socket.on('userLiveInfo', (data) => {
//         const { map_id } = data;
//         console.log('Received user_id:', map_id);
//         socket.map_id = map_id;
//     });
//     socket.on("updateLocation", async (data) => {
//         console.log("Location update received:", data);

//         const { user_id, latitude, longitude } = data;

//         if (!user_id || !latitude || !longitude) {
//             console.log("Invalid location data:", data);
//             return;
//         }

       
//         try {
//             const primaryKeyData = await Delegate.findByPk(user_id);
//             if (!primaryKeyData) {
//                 console.log(`User with user_id ${user_id} not found.`);
//                 return;
//             }

//             const updatedDelegate = await primaryKeyData.update({
//                 latitude: latitude, 
//                 longitude: longitude, 
//             });

//             if (updatedDelegate) {
//                 console.log(`Location for user_id ${user_id} successfully updated!`);
//             }
//         } catch (error) {
//             console.error("Error updating location in database:", error.message);
//         }

        
//         const payload = [{ topic: "delegateUpdates", messages: JSON.stringify(data) }];
//         delegateproducer.send(payload, (err, result) => {
//             if (err) {
//                 console.error("Error sending location data to Kafka:", err);
//             } else {
//                 console.log("Location data sent to Kafka:", result);
//             }
//         });
//     });

   
//     const sendOrderDataToUserKafkaAndSocket = async () => {
//         try {
//             const { user_id } = socket;
       
//             const userOrders = await userOrder(user_id); 

       
//             const payload = [{
//                 topic: "userUpdate",
//                 messages: [{ value: JSON.stringify(userOrders) }] 
//             }];
            
//             userproducer.send(payload, (err, result) => {
//                 if (err) {
//                     console.error("Error sending user data to Kafka:", err);
//                 } else {
//                     console.log("user data sent to Kafka:", result);
//                 }
//             });

          
//             socket.emit("userUpdate", userOrders);
//         } catch (error) {
//             console.error("Error sending user data to Kafka or emitting to Socket:", error.message);
//         }
//     };


//     const sendOrderDataToUserLocationKafkaAndSocket = async () => {
//         try {
//             const { map_id } = socket;
          
//             const userLocation = await liveLocationUpdate(map_id); 
         
       
//             const payload = [{
//                 topic: "userIdUpdate",
//                 messages: [{ value: JSON.stringify(userLocation) }] 
//             }];
            
//             userIdproducer.send(payload, (err, result) => {
//                 if (err) {
//                     console.error("Error sending live data to Kafka:", err);
//                 } else {
//                     console.log("live data sent to Kafka:", result);
//                 }
//             });

          
//             socket.emit("userIdUpdate", userLocation);
//         } catch (error) {
//             console.error("Error sending live  data to Kafka or emitting to Socket:", error.message);
//         }
//     };

//     const sendOrderDataToKafkaAndSocket = async () => {
//         try {
//             const { delegate_id } = socket;
//             const orders = await getAllOrders(delegate_id); 

       
//             const payload = [{
//                 topic: "orderUpdates",
//                 messages: [{ value: JSON.stringify(orders) }] 
//             }];
            
//             delegateproducer.send(payload, (err, result) => {
//                 if (err) {
//                     console.error("Error sending order data to Kafka:", err);
//                 } else {
//                     console.log("Order data sent to Kafka:", result);
//                 }
//             });

          
//             socket.emit("orderData", orders);
//         } catch (error) {
//             console.error("Error sending order data to Kafka or emitting to Socket:", error.message);
//         }
//     };
//     const orderInterval = setInterval(sendOrderDataToKafkaAndSocket, 5000);
//     const useInterval = setInterval(sendOrderDataToUserKafkaAndSocket, 5000);
//     const useLiveUpdateInterval = setInterval(sendOrderDataToUserLocationKafkaAndSocket, 1000);
   
//     orderconsumer.on("message", (message) => {
//         console.log("Received order data from Kafka:", message.value);
//         try {
          
//             const orderData = JSON.parse(message.value);
//             socket.emit("orderData", orderData); 
//         } catch (error) {
//             console.error("Error parsing and sending order data to client:", error.message);
//         }
//     });
//     userIdconsumer.on("message", (message) => {
//         console.log("Received live data from Kafka:", message.value);
//         try {
          
//             const userLocationData = JSON.parse(message.value);
//             socket.emit("liveData", userLocationData); 
//         } catch (error) {
//             console.error("Error parsing and sending live data to client:", error.message);
//         }
//     });

//     userconsumer.on("message", (message) => {
//         console.log("Received user data from Kafka:", message.value);
//         try {
          
//             const userData = JSON.parse(message.value);
//             socket.emit("userUpdate", userData); 
//         } catch (error) {
//             console.error("Error parsing and sending user data to client:", error.message);
//         }
//     });
  
//     socket.on("disconnect", () => {
//         console.log("Client disconnected:", socket.id);
//         clearInterval(orderInterval); 
//         clearInterval(useInterval); 
//         clearInterval(useLiveUpdateInterval);
//     });
// });