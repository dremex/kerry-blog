const getLatLngPairs = (latLngPairs) => {
    let markerPairs = [];

    latLngPairs.forEach(function(pair) {
        markerPairs.push(`markers=color:blue%7C${pair.latitude},${pair.longitude}`);
    });

    return markerPairs.join('&');
};

export default getLatLngPairs;