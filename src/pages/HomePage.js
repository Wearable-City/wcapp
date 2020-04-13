import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

class HomePage extends React.Component {
    render() {
        return (
            <div>
                <Link to="/settings">
                    <Button type="primary">Settings</Button>
                </Link>
            </div>
        );
    }
}

export default HomePage;
