import config from "../config/config.json";

const stations = {
    getStations: async function getStations() {
    const response = await fetch(`${config.train_stations}`);
    const result = await response.json();

    return result.data;
    }
}

export default stations;