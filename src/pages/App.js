import React from "react";
import "../App.css";
import HomePage from "./HomePage";
import ContactList from "./ContactList";
import AuthPage from "./AuthPage";
import { Route, Switch } from "react-router-dom";

function App() {
    console.log("in the switch");
    return (
        <div className="App">
            <Switch>
                <Route path="/" exact>
                    {localStorage.getItem("auth_token") !== null ? (
                        <HomePage />
                    ) : (
                        <AuthPage />
                    )}
                </Route>
                <Route path="/settings">
                    {localStorage.getItem("auth_token") !== null ? (
                        <ContactList />
                    ) : (
                        <AuthPage />
                    )}
                </Route>
            </Switch>
        </div>
    );
}

export default App;
