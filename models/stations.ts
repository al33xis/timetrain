import config from "../config/config.json";
import storage from "./storage";

const stations = {
    getStations: async function getStations() {
    const response = await fetch(`${config.train_stations}`);
    const result = await response.json();

    return result.data;
    },
    addFavouriteStation: async function addFavouriteStation(acronym: string) {
        const token = await storage.readToken();

        var data = {
            artefact: `${acronym}`,
            api_key: config.api_key
        };

        const response = await fetch(`${config.base_url}/data`, 
        {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token.token
            },
            method: 'POST'
        });

        const result = await response.json();
    },
    getFavouriteStation: async function getFavouriteStation() {
        const token = await storage.readToken();

        const response = await fetch(`${config.base_url}/data?api_key=${config.api_key}`, 
        {
            headers: {
                'x-access-token': token.token
            }
        });

        const result = await response.json();

        return result.data;
    },
    deleteFavouriteStation: async function deleteFavouriteStation() {
        const token = await storage.readToken();
        var data = {
            id: 1807,
            api_key: config.api_key
        };

        const response = await fetch(`${config.base_url}/data`, 
        {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-access-token': token.token
            },
            method: 'DELETE',
        });
    }
}

export default stations;