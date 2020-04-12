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
    Button,
} from "antd";
import "antd/dist/antd.css";
// import '../App.css';

const { Title } = Typography;
const Search = Input.Search;

const UPDATE_URL = new URL(
    "https://wearablecity.netlify.com/.netlify/functions/users-edit-data"
);

const deleteNotification = (contact_id) => {
    message.warning("Contact, " + contact_id + " has been deleted");
};

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
            ref: undefined,
            user: undefined,
            loaded: false,
            isEditing: false,
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
            {
                title: "operation",
                dataIndex: "operation",
                fixed: "right",
                render: (text, record, index) => (
                    <Popconfirm
                        title="Sure to delete?"
                        okType="danger"
                        onConfirm={() => {
                            console.log(this.state.user.contacts);
                            console.log(text);
                            console.log(record);
                            console.log(index);
                            this.setState({
                                user: {
                                    contacts: this.state.user.contacts.filter(
                                        (e) => e.id !== record.id
                                    ),
                                },
                            });
                        }}
                    >
                        <a href="javascript:;">Delete</a>
                    </Popconfirm>
                ),
            },
        ];

        this.onDelete = this.onDelete.bind(this);
    }

    onDelete = (contact_id) => {
        deleteNotification(contact_id);
    };

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
                    // ringId: output[0].data.ringId,
                    // userName: output[0].data.userName,
                    // firstName: output[0].data.firstName,
                    // lastName: output[0].data.lastName,
                    // password: output[0].data.password,
                    // contacts: output[0].data.contacts,
                    user: output[0].data,
                    ref: output[0].ref["@ref"].id,
                    loaded: true,
                })
            );
    };

    syncData = () => {
        UPDATE_URL.searchParams.set("ref", this.state.ref);
        fetch(UPDATE_URL.href, {
            mode: "cors",
            body: JSON.stringify(this.state.user),
            method: "POST",
        }).catch((e) => console.error(e));
    };

    componentDidMount = () => {
        console.log("componentDidMount");
        this.fetchData();
    };

    handleSelect = (contact_id) => {
        this.setState({ selectContact: contact_id });
    };

    componentDidUpdate = () => {
        console.log(this.state);
    };

    render() {
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
                    dataSource={!this.state.loaded ? [] : this.state.user.contacts}
                />
                <Button type="primary" onClick={this.syncData}>
                    Save
                </Button>
            </div>
        );
    }
}

export default ContactList;

// if (!this.state.loaded) {
//     for (let i = 0; i < this.state.contacts.length; i++) {
//         this.state.contactsOnDisplay.push(this.state.contacts[i]);
//         this.state.contacts.push(this.state.contacts[i])
//     }

//     this.setState({ loaded: true })
// }
