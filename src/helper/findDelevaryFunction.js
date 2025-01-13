const axios = require('axios');
const { Delegate } = require('../models'); // Replace with your model
const  { getBoundingBox } = require("./getBoundingBox")
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const {Op,Sequelize} = require("sequelize")


const findDelevaryFunction = async () => {
    try {
        const branchLocation = { lat: 22.595112, lng: 88.4113408 }; // Branch location
        const searchRadius = 5; // Radius in kilometers

        // Step 1: Calculate the bounding box
        const { minLat, maxLat, minLon, maxLon } = getBoundingBox(branchLocation.lat, branchLocation.lng, searchRadius);

        // Step 2: Fetch delegates within the bounding box
        const delegates = await Delegate.findAll({
            attributes: [
                'id',
                'fullname',
                [Sequelize.cast(Sequelize.col('latitude'), 'DOUBLE PRECISION'), 'latitude'],
                [Sequelize.cast(Sequelize.col('longitude'), 'DOUBLE PRECISION'), 'longitude']
            ],
            where: Sequelize.and(
                Sequelize.where(
                    Sequelize.cast(Sequelize.col('latitude'), 'DOUBLE PRECISION'),
                    { [Op.between]: [minLat, maxLat] }
                ),
                Sequelize.where(
                    Sequelize.cast(Sequelize.col('longitude'), 'DOUBLE PRECISION'),
                    { [Op.between]: [minLon, maxLon] }
                )
            )
        });

        if (delegates.length === 0) {
            console.log("No delegates found within the bounding box.");
            return;
        }

        // Step 3: Prepare Google Distance Matrix API request
        const destinations = delegates
            .map((delegate) => `${delegate.latitude},${delegate.longitude}`)
            .join('|');
        const origin = `${branchLocation.lat},${branchLocation.lng}`;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${GOOGLE_API_KEY}`;
        console.log("API URL:", url);

        // Step 4: Fetch distances from Google Distance Matrix API
        const response = await axios.get(url);
        console.log("API Response:", JSON.stringify(response.data, null, 2));

        // Validate response structure
        const rows = response.data?.rows || [];
        if (!rows.length || !rows[0]?.elements) {
            console.error("Invalid response structure from Google Distance Matrix API");
            return;
        }

        // Step 5: Filter nearby delegates based on distance
        const nearbyDelegates = delegates.filter((delegate, index) => {
            const distanceData = rows[0].elements[index];
            const distance = distanceData?.distance?.value / 1000; // Convert meters to kilometers
            if (distance === undefined) return false; // Handle undefined distances
            return distance <= searchRadius;
        });

        console.log("Nearby Delegates:", nearbyDelegates);

        // Step 6: Notify clients within the 5 km radius
        nearbyDelegates.forEach((delegate) => {
            // Loop over each connected socket and check if it matches the delegate's location
            clients.forEach((socket) => {
                if (socket.latitude && socket.longitude) {
                    const delegateDistance = getDistance(
                        socket.latitude,
                        socket.longitude,
                        delegate.latitude,
                        delegate.longitude
                    );

                    if (delegateDistance <= searchRadius) {
                        console.log(`Sending "Hi" to client ${socket.id} (within 5 km)`);
                        socket.emit("notification", "Hi");
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error fetching nearby delegates:", error.message);
    }
};

// Distance calculation function between two points
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Result in kilometers
};

module.exports = { findDelevaryFunction };






