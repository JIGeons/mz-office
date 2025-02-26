import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/Store";
import Root from "./Root";

// CSS
import "./styles/index.css";
import "./styles/fonts/paperlogy.css"
import "./styles/fonts/pretendard.css";

function App() {
  return (
      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              <Router basename="/">
                  <Root />
              </Router>
          </PersistGate>
      </Provider>
  );
}

export default App;
