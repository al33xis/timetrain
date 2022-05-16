// models/auth.ts
import config from "../config/config.json";
import storage from "./storage";

const auth = {
    loggedIn: async function loggedIn() {
        const token: any = await storage.readToken();
        const twentyFourHours = 1000*60*60*24;
        const notExpired = (new Date().getTime() - token?.date) < twentyFourHours;

        return token && notExpired;
    },
    register: async function register(email: string, password: string) {
        const data = {
            api_key: config.api_key,
            email: email,
            password: password,
        };

        const response = await fetch(`${config.base_url}/register`,
        {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json"
            }
        });
        return await response.json();
    },
    login: async function login(email: string, password: string) {
        const data = {
            api_key: config.api_key,
            email: email,
            password: password,
        };

        const response = await fetch(`${config.base_url}/login`,
        {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json"
            }
        });

        const result = await response.json();

        if (Object.prototype.hasOwnProperty.call(result, "errors")) {
            return {
                message: result.errors.title,
                description: result.errors.detail,
                type: "danger"
            }
        }

        await storage.storeToken(result.data.token); 

        // return result.data.message;

        return {
            message: "Inloggad",
            description: result.data.message,
            type: "success"
        }
    },
    logout: async function logout() {
        await storage.deleteToken();
    }
};

export default auth;