import React, { Component } from "react";
import {
    Table,
    Input,
    Typography,
    Popconfirm,
    notification,
    Tag,
    Spin,
    Button,
    message,
} from "antd";
import "antd/dist/antd.css";
// import '../App.css';

const { Title } = Typography;
const Search = Input.Search;

const deleteNotification = (contact_id) => {
    message.warning("Contact, " + contact_id + " has been deleted");
};

const editNotification = (contact_id) => {
    message.warning('Contact, ' + contact_id + ' has been updated');
};

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
            size: 0,

            loaded: false,
            isEditing: true,
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
                title: '',
                dataIndex: 'operation',
                render: (_: any, record: Item) => {
                    return this.state.isEditing ? (
                        <span>
                            <a href="javascript:;" onClick={() => this.onSave(record.contact_id)} style={{ marginRight: 8 }}>
                                Save
                            </a>
                            <Popconfirm title="Sure to cancel?" onConfirm={this.onSave(record.contact_id)} >
                                <a>Cancel</a>
                            </Popconfirm>
                        </span>
                    ) : (
                            <a href="javascript:;" onClick={() => this.toggleEdit()}>
                                Edit
                            </a>
                        );
                },
            },
            {
                title: "",
                dataIndex: "operation",
                fixed: "right",
                render: (text, record, index) => (
                    <Popconfirm
                        title="Sure to delete?"
                        okType="danger"
                        onConfirm={() => {
                            console.log(this.state.contacts);
                            console.log(text);
                            console.log(record);
                            console.log(index);
                            this.setState({
                                contacts: this.state.contacts.filter(
                                    (e) => e.firstName !== record.firstName
                                ),
                            });
                        }}
                    >
                        <a href="javascript:;">Delete</a>
                    </Popconfirm>
                ),
            },

        ];

        this.toggleEdit = this.toggleEdit.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

    toggleEdit = () => {
        console.log(this.state.isEditing);
        this.setState({ isEditing: true });
        console.log(this.state.isEditing);
    }

    onDelete = (contact_id) => {
        deleteNotification(contact_id);
    };

    onSave = (contact_id) => {
        this.setState({ isEditing: false });
        editNotification(contact_id);
    }

    onSave = (contact_id) => {
        this.setState({ isEditing: false });
    }

    onAdd = () => {
        const { size, contacts } = this.state;
        console.log(size);
        console.log(contacts);

        let newContact = {
            // contact_id: 000,
            firstName: 'TEKASHI',
            lastName: 'TRUMP',
            phoneNumber: 69696969,
            alertMessage: "I snitch",
        };

        this.setState({
            contacts: [...contacts, newContact],
            size: this.state.size + 1,
        });
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
                    ringId: output[0].data.ringId,
                    userName: output[0].data.userName,
                    firstName: output[0].data.firstName,
                    lastName: output[0].data.lastName,
                    password: output[0].data.password,
                    contacts: output[0].data.contacts,
                    size: output[0].data.contacts.length,
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
                    <div>
                        <Button onClick={this.onAdd} type="primary" style={{ marginBottom: 16 }}>
                            Add Contact
        </Button>
                    </div>

                </div>
                <Table
                    columns={this.columns}
                    loading={!this.state.loaded}
                    dataSource={this.state.contacts}
                />
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
