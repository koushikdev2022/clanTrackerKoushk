const getBoundingBox = (lat, lon, radius) => {
    const R = 6371; // Earth's radius in kilometers
    const latDelta = radius / R * (180 / Math.PI);
    const lonDelta = radius / (R * Math.cos((lat * Math.PI) / 180)) * (180 / Math.PI);

    return {
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
        minLon: lon - lonDelta,
        maxLon: lon + lonDelta,
    };
};

module.exports={getBoundingBox}