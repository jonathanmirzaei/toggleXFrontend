import { createRoot } from "react-dom/client";
import keycloak from './keycloak'
import React from "react";

import App from "./components/app"

const container = document.getElementById("app")
const root = createRoot(container)

// root.render(<App initialData={(window as any).initialData} />);
keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
    console.log("authenticated");
    if (authenticated) {
        root.render(<App initialData={(window as any).initialData}  keycloak={keycloak} />);
        console.log("authenticated");
        console.log(keycloak);
        console.log(keycloak.tokenParsed.name);


    } else {
        console.log("Not authenticated");
        window.location.reload();
    }

    // Token Refresh
    setInterval(() => {
        keycloak.updateToken(70).catch(() => {
            keycloak.logout();
        });
    }, 60000);
});
