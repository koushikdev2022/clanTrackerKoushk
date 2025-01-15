const kafka = require("kafka-node");
const { getAllOrders } = require("../helper/orderDetails"); // Assuming orderService exports the function

const kafkaClient = new kafka.KafkaClient({ kafkaHost: `${process.env.KAFKA_HOST}` });

// Kafka Producer (for delegating updates)
const delegateproducer = new kafka.Producer(kafkaClient);
delegateproducer.on("ready", () => {
    console.log("Kafka Producer is connected and ready.");
});
delegateproducer.on("error", (err) => {
    console.error("Kafka Producer Error:", err);
});

// Kafka Consumer (for consuming updates related to delegates)
const delegateconsumer = new kafka.Consumer(
    kafkaClient,
    [{ topic: "delegateUpdates", partition: 0 }],
    { autoCommit: true }
);
delegateconsumer.on("error", (err) => {
    console.error("Kafka Consumer Error:", err);
});

// Kafka Producer (for order updates)
const orderproducer = new kafka.Producer(kafkaClient);
orderproducer.on("ready", () => {
    console.log("Order Kafka Producer is ready.");
});
orderproducer.on("error", (err) => {
    console.error("Order Kafka Producer Error:", err);
});

// Kafka Consumer (for consuming order updates)
const orderconsumer = new kafka.Consumer(
    kafkaClient,
    [{ topic: "orderUpdates", partition: 0 }],
    { autoCommit: true }
);
orderconsumer.on("error", (err) => {
    console.error("Order Kafka Consumer Error:", err);
});


const userproducer = new kafka.Producer(kafkaClient);
userproducer.on("ready",()=>{
    console.log("User kafka Producer is ready");
})

userproducer.on("error",(err)=>{
    console.log("User kafka Producer Error:", err);
});

const userconsumer = new kafka.Consumer(
    kafkaClient,
    [{topic:"userUpdate",position:0}],
    {autoCommit:true}
);

userconsumer.on("error",(err)=>{
     console.error("User kafka consumer error", err)
});

const userIdproducer = new kafka.Producer(kafkaClient);

userIdproducer.on("ready",()=>{
    console.log("User Id kafka Producer is ready");
})

userIdproducer.on("error",(err)=>{
    console.log("User Id kafka Producer Error:", err);
});

const userIdconsumer = new kafka.Consumer(
    kafkaClient,
    [{topic:"userIdUpdate",position:0}],
    {autoCommit:true}
);

userIdconsumer.on("error",(err)=>{
     console.error("User Id kafka consumer error", err)
});

module.exports = { delegateproducer, delegateconsumer, orderproducer, orderconsumer,userproducer,userconsumer,userIdproducer, userIdconsumer};
