import { StrictMode } from "react";
import ReactDOM from "react-dom";

import Example from "./Example";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Example />
  </StrictMode>,
  rootElement
);
