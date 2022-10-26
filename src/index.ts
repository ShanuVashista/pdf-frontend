import "moment-timezone";
import { AppComponent } from "./AppComponent";
import ReactDOM from "react-dom";
import * as React from "react";
import { Provider, ProviderProps } from "react-redux";
import { store } from "./store";

ReactDOM.render(
  React.createElement(Provider, <ProviderProps>{
    store,
    children: React.createElement(AppComponent),
  }),
  document.querySelector("#app")
);
