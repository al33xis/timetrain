import config from "../config/config.json";

const delays = {
    getDelays: async function getDelays() {
    const response = await fetch(`${config.train_delays}`);
    const result = await response.json();

    return await result.data;
    }
}

export default delays;
