// import Auth from "../../interfaces/auth";
import { useState } from "react";
import authModel from "../../models/auth";
import AuthFields from "./AuthFields";
import { showMessage } from "react-native-flash-message";

export default function Login({ navigation, setIsLoggedIn }) {
    const [auth, setAuth] = useState<Partial<Auth>>({});

    async function doLogin() {
        if (auth.email && auth.password) {
            const result = await authModel.login(auth.email, auth.password);
            if (result.type === "success") {
                setIsLoggedIn(true);
                showMessage({
                    message: "Välkommen!",
                    description: "Du är nu inloggad.",
                    type: "success",
                    floating: true
                });
            } else {
                showMessage({
                    message: "Åtkomst nekad",
                    description: "Inloggninsuppgifterna stämmer inte överens.",
                    type: "danger",
                    floating: true
                });
            }
        } else {
            showMessage({
                message: "Något saknas",
                description: "E-post eller lösenord saknas",
                type: "warning",
                floating: true
            });
        }
    }

    return (
        <AuthFields
            auth={auth}
            setAuth={setAuth}
            submit={doLogin}
            title="Logga in"
            navigation={navigation}
        />
    )
};