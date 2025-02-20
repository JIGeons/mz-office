import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/Store";
import Root from "./Root";

// CSS
import "./styles/index.css";

function App() {
  return (
      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              <Router>
                  <Root />
              </Router>
          </PersistGate>
      </Provider>
  );
}

export default App;
