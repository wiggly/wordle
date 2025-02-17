import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.js";

const rootElement = document.getElementById("root")

if(!rootElement) {
    throw new Error("Cannot find 'root' element in page")
}

const root = createRoot(rootElement);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);