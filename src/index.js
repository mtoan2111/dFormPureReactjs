import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import { initContract } from "./utils";
import App from "./App";

window.nearInitPromise = initContract()
    .then((walletProps) => {
        ReactDOM.render(<App {...walletProps} />, document.querySelector("#root"));
    })
    .catch(console.error);
