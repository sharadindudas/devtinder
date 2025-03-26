import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import App from "./App";
import store from "./store/store";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <BrowserRouter>
            <StrictMode>
                <App />
            </StrictMode>
        </BrowserRouter>
    </Provider>
);

