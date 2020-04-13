import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { Card, Avatar } from 'antd';
import { EditOutlined, ContactsOutlined, SettingOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";

const { Meta } = Card;
//future use

class HomePage extends React.Component {
    myCharacteristic;

    handleNotifications = (event) => {
        let value = event.target.value;
        let a = [];
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
        if (dec.decode(value) === 1) {
            this.sendAlert();
        }
    };

    sendAlert = () => {
        fetch('https://wearablecity.netlify.com/.netlify/functions/alert-contacts?ringid=42069', {
            method: "GET",
        }).catch((err) => {
            console.log(err);
        });
    };

    onStartButtonClick = () => {
        let serviceUuid = document.querySelector("#service1").value;
        if (serviceUuid.startsWith("0x")) {
            serviceUuid = parseInt(serviceUuid);
        }

        let characteristicUuid = document.querySelector("#characteristic").value;
        if (characteristicUuid.startsWith("0x")) {
            characteristicUuid = parseInt(characteristicUuid);
        }

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
                this.myCharacteristic = characteristic;
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
                })
                .catch((error) => {
                    console.log("Argh! " + error);
                });
        }
    };

    render() {
        return (
            <div>
                {/* <Card
                    style={{ width: 300 }}
                    cover={
                        <img
                            alt="example"
                            src="https://www.gatech.edu/sites/default/files/uploads/images/superblock_images/tower.png"
                        />
                    }
                    actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <Link to="/settings">
                            <ContactsOutlined key="contacts" />
                        </Link>,
                    ]}
                >
                    <Meta
                        avatar={<Avatar src="https://www.pinclipart.com/picdir/big/157-1578752_wi-fi-computer-icons-hotspot-wireless-signal-transparent.png" />}
                        title="Ring Alert"
                        description="This is the description"
                    />
                </Card> */}
                <Link to="/settings">
                    <Button type="primary">My Contacts</Button>
                </Link>
                <div class="container" id="header-container"></div>
                <div class="container" id="content-container">
                    <div
                        style={{
                            border: "green",
                            padding: "50px",
                            margin: "100px",
                        }}
                    >
                        <form>
                            <label for="allDevices">All Devices</label>
                            <input id="allDevices" type="checkbox" />
                            <input
                                id="service"
                                type="text"
                                size="17"
                                list="services"
                                placeholder="Bluetooth Service"
                            />
                            <input
                                id="name"
                                type="text"
                                size="17"
                                placeholder="Device Name"
                            />
                            <input
                                id="namePrefix"
                                type="text"
                                size="17"
                                placeholder="Device Name Prefix"
                            />
                        </form>
                        <Button type="primary" onClick="">
                            basic info
                        </Button>
                        <Button type="primary" onClick={this.getBatteryLevel}>
                            battery info
                        </Button>
                        <p id="devname"></p>
                        <p id="devbattery"></p>
                    </div>
                    <div
                        style={{
                            border: "blue",
                            padding: "50px",
                            margin: "100px",
                        }}
                    >
                        <form>
                            <input
                                id="service1"
                                type="text"
                                list="services"
                                autofocus=""
                                placeholder="Bluetooth Service"
                            />
                            <input
                                id="characteristic"
                                type="text"
                                list="characteristics"
                                placeholder="Bluetooth Characteristic"
                            />
                        </form>
                        <Button
                            id="startNotifications"
                            onClick={this.onStartButtonClick}
                            type="Button"
                        >
                            Start notifications
                        </Button>
                        <Button id="stopNotifications" class="Button">
                            Stop notifications
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
