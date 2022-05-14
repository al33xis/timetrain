import config from "../config/config.json";

const codes = {
    getCodes: async function getCodes() {
    const response = await fetch(`${config.train_codes}`);
    const result = await response.json();

    return result.data;
    }
}

export default codes;