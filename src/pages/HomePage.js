import React from "react";
import { Button, PageHeader } from "antd";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import "../App.css";

import { Card, message } from "antd";
import { ApiTwoTone, CompassFilled } from "@ant-design/icons";
const { Meta } = Card;

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: "#FF4D4F", //FF4D4F red 52c41a green 1790FF blue
            connected: false,
            message: "Please connect to your ring device",
            location: {},
        };
    }

    componentDidMount = () => {
        this.getLocation();
    };

    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition, () =>
                message.error("Location services failed 😞 Try again!")
            );

            console.log(this.state.location);
            if (Object.entries(this.state.location).length > 0) {
                message.success("Location services shared!");
            }
        } else {
            this.setState({ location: "Location was not supported" });
        }
    };

    showPosition = (position) => {

        this.setState({
            location: {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            },
        });
    };

    myCharacteristic;

    handleNotifications = (event) => {
        let value = event.target.value;
        // Convert raw data bytes to hex values just for the sake of showing something.
        // In the "real" world, you'd use data.getUint8, data.getUint16 or even
        // TextDecoder to process raw data bytes.
        // for (let i = 0; i < value.byteLength; i++) {
        //   a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
        // }
        // log('> ' + a.join(' '));

        // TODO: if we get an alert notification from the ring, we should hit our alert API endpoint here.
        let dec = new TextDecoder();
        console.log(dec.decode(value));
        console.log(dec.decode(value) + " and my type is " + typeof dec.decode(value));
        if (dec.decode(value) === "1") {
            this.sendAlert();
        }
    };

    sendAlert = () => {
        fetch(
            `https://wearablecity.netlify.app/.netlify/functions/alert-contacts?ringid=42069&lat=${this.state.location.lat}&long=${this.state.location.long}`,
            {
                method: "GET",
            }
        )
            .then(message.warning("ALERT HAS BEEN SENT! 🚨"))
            .catch((err) => {
                console.log(err);
            });
    };

    onStartButtonClick = () => {
        this.setState({ color: "#1790FF" });
        let serviceUuid = "c66a79e7-25fa-4928-85ec-f287069060b8"; //document.querySelector("#service1").value;
        // if (serviceUuid.startsWith("0x")) {
        //     serviceUuid = parseInt(serviceUuid);
        // }

        let characteristicUuid = "0x32c0"; //document.querySelector("#characteristic").value;
        characteristicUuid = parseInt(characteristicUuid);

        console.log("Requesting Bluetooth Device...");
        navigator.bluetooth
            .requestDevice({ filters: [{ services: [serviceUuid] }] })
            .then((device) => {
                console.log("Connecting to GATT Server...");
                return device.gatt.connect();
            })
            .then((server) => {
                console.log("Getting Service...");
                return server.getPrimaryService(serviceUuid);
            })
            .then((service) => {
                console.log("Getting Characteristic...");
                return service.getCharacteristic(characteristicUuid);
            })
            .then((characteristic) => {
                message.success("Ring has connected successfully!");
                this.myCharacteristic = characteristic;
                this.setState({
                    color: "#52c41a",
                    connected: true,
                    message: "Ring is functional",
                });
                return this.myCharacteristic.startNotifications().then((_) => {
                    console.log("> Notifications started");
                    this.myCharacteristic.addEventListener(
                        "characteristicvaluechanged",
                        this.handleNotifications
                    );
                });
            })
            .catch((error) => {
                console.log("Argh! " + error);
                this.setState({ color: "#FF4D4F" });
            });
        return false;
    };

    onStopButtonClick = () => {
        if (this.myCharacteristic) {
            this.myCharacteristic
                .stopNotifications()
                .then((_) => {
                    console.log("> Notifications stopped");
                    this.myCharacteristic.removeEventListener(
                        "characteristicvaluechanged",
                        this.handleNotifications
                    );
                    this.setState({
                        color: "#FF4D4F",
                        connected: false,
                        message: "Please connect to your ring device",
                    });
                })
                .catch((error) => {
                    console.log("Argh! " + error);
                });
        }
    };

    onLogout = () => {
        localStorage.removeItem("auth_token");
        this.setState({ loggedOut: true });
        // window.location.href = "/";
        window.location.reload();
    };

    render() {
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    title="Home"
                    color="white"
                    subTitle="Manage your Ring"
                    extra={[
                        <Link to="/settings">
                            <Button type="primary">My Contacts</Button>
                        </Link>,

                        <Button danger type="primary" onClick={this.sendAlert}>
                            Send Alert
                        </Button>,
                        <Button key="3" onClick={this.onLogout}>
                            Logout
                        </Button>,
                    ]}
                />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        justifyItems: "center",
                    }}
                >
                    <div class="container" id="content-container"></div>
                    <div style={{ marginTop: "4%" }}>
                        <Card
                            cover={
                                <img
                                    alt="example"
                                    src="https://png.pngtree.com/thumb_back/fh260/back_our/20190625/ourmid/pngtree-blue-technology-cyber-security-poster-image_261494.jpg"
                                />
                            }
                            hoverable
                            style={{ width: 325 }}
                            actions={[
                                <ApiTwoTone
                                    twoToneColor={this.state.color}
                                    id="startNotifications"
                                    onClick={() => {
                                        if (this.state.connected) {
                                            this.onStopButtonClick();
                                        } else {
                                            this.onStartButtonClick();
                                        }
                                    }}
                                    key="connect"
                                />,
                                <CompassFilled
                                    id="startLocation"
                                    onClick={this.getLocation}
                                    key="location"
                                />,
                            ]}
                        >
                            <Meta title="Ring Alert" description={this.state.message} />
                            {/* <Button
                                id="startNotifications"
                                onClick={this.onStartButtonClick}
                                type="Button"
                            >
                                Connect to your Ring
                    </Button> */}
                            {/* <Button id="stopNotifications" class="Button">
                                Stop notifications
                    </Button> */}
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
