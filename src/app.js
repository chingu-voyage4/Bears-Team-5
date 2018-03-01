import React from "react";
import ReactDOM from "react-dom";

const template = (
  <div>
    <h2>This is a test</h2>
    <p>
      This is a test to check whether the environment has been properly
      configured for React development
    </p>
  </div>
);

ReactDOM.render(template, document.getElementById("app"));
