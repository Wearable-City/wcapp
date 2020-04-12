import React, { Component } from "react";
import {
    Table,
    Input,
    Typography,
    Popconfirm,
    notification,
    Tag,
    Spin,
    message,
    DatePicker,
} from "antd";
import "antd/dist/antd.css";
// import '../App.css';

const { Title } = Typography;
const Search = Input.Search;

// const deleteNotification = (contact_id) => {
//     message.warning('Contact, ' + contact_id + ' has been deleted');
// };

// const editNotification = (contact_id) => {
//     message.warning('Contact, ' + contact_id + ' has been updated');
// };

// const createNotification = (contact_id) => {
//     message.warning('Contact, ' + contact_id + ' has been added');
// };

class ContactList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            output: undefined,
            data: undefined,
            ringId: undefined,
            userName: undefined,
            firstName: undefined,
            lastName: undefined,
            password: undefined,
            contacts: undefined,
            loaded: false,
        };

        this.columns = [
            {
                title: "Contact First Name",
                dataIndex: "firstName",
                key: "contact_id",
            },

            {
                title: "Contact First Name",
                dataIndex: "lastName",
                key: "contact_id",
            },

            {
                title: "Contact Phone Number",
                dataIndex: "phoneNumber",
                key: "contact_id",
            },
            {
                title: "Alert Message",
                dataIndex: "alertMessage",
                key: "contact_id",
            },
        ];
    }

    fetchData = () => {
        fetch(
            "https://wearablecity.netlify.com/.netlify/functions/users-read-by-ringid?ringid=42069",
            { mode: "cors" }
        )
            .then((response) => response.json())
            .then((output) =>
                this.setState({
                    output: output,
                    data: output[0].data,
                    ringId: output[0].data.ringId,
                    userName: output[0].data.userName,
                    firstName: output[0].data.firstName,
                    lastName: output[0].data.lastName,
                    password: output[0].data.password,
                    contacts: output[0].data.contacts,
                    loaded: true,
                })
            );
    };

    componentDidMount() {
        console.log("componentDidMount");
        this.fetchData();
    }

    handleSelect = (contact_id) => {
        this.setState({ selectContact: contact_id });
    };

    render() {
        // if (!this.state.loaded) {
        //     for (let i = 0; i < this.state.contacts.length; i++) {
        //         this.state.contactsOnDisplay.push(this.state.contacts[i]);
        //         this.state.contacts.push(this.state.contacts[i])
        //     }

        //     this.setState({ loaded: true })
        // }

        return (
            <div>
                <div>
                    <Title level={2} style={{ float: "left", color: "white" }}>
                        {" "}
                        Contact List{" "}
                    </Title>
                    <div style={{ textAlign: "right" }}>
                        <Search
                            placeholder="Search"
                            id="search_contact"
                            onChange={this.handleChange}
                            style={{ width: 215 }}
                        />
                    </div>
                </div>
                <Table
                    columns={this.columns}
                    loading={!this.state.loaded}
                    dataSource={this.state.contacts}
                />
                <DatePicker />
            </div>
        );
    }
}

export default ContactList;
