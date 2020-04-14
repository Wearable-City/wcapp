import React from "react";
import "../App.css";
import HomePage from "./HomePage";
import ContactList from "./ContactList";
import AuthPage from "./AuthPage";
import { Route, Switch } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route
                    path="/"
                    component={localStorage.getItem("auth_token") ? HomePage : AuthPage}
                    exact
                />
                <Route path="/settings" component={ContactList} />
            </Switch>
        </div>
    );
}

export default App;
