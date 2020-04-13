import React from "react";
import "../App.css";
import HomePage from "./HomePage";
import ContactList from "./ContactList";
import { Route, Switch } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route path="/" component={HomePage} exact />
                <Route path="/settings" component={ContactList} />
            </Switch>
        </div>
    );
}

export default App;
