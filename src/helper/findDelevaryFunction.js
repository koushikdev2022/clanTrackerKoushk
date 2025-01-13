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
    } catch (error) {
        console.error("Error fetching nearby delegates:", error.message);
    }
};



module.exports = {findDelevaryFunction}
// findDelevaryFunction();
