const kafka = require("kafka-node");

const kafkaClient = new kafka.KafkaClient({ kafkaHost: `${process.env.KAFKA_HOST}` });

// Kafka Producer
const producer = new kafka.Producer(kafkaClient);
producer.on("ready", () => {
    console.log("Kafka Producer is ready.");
});
producer.on("error", (err) => {
    console.error("Kafka Producer Error:", err);
});

// Kafka Consumer
const consumer = new kafka.Consumer(
    kafkaClient,
    [{ topic: "delegateUpdates", partition: 0 }],
    { autoCommit: true }
);
consumer.on("error", (err) => {
    console.error("Kafka Consumer Error:", err);
});

module.exports = { producer, consumer };
