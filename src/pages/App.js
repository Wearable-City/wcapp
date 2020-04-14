import React from "react";
import "../App.css";
import HomePage from "./HomePage";
import ContactList from "./ContactList";
import AuthPage from "./AuthPage";
import { Route, Switch, Redirect } from "react-router-dom";

const GoToAuth = () => <Redirect to="/auth" />;

function App() {
    return (
        <div className="App">
            <Switch>
                <Route path="/auth" component={AuthPage} />
                <Route
                    path="/"
                    component={localStorage.getItem("auth_token") ? HomePage : GoToAuth}
                    exact
                />
                <Route
                    path="/settings"
                    component={
                        localStorage.getItem("auth_token") ? ContactList : GoToAuth
                    }
                />
            </Switch>
        </div>
    );
}

export default App;
