import config from "../config/config.json";

const messages = {
    getMessages: async function getMessages() {
    const response = await fetch(`${config.train_messages}`);
    const result = await response.json();

    return result.data;
    }
}

export default messages;