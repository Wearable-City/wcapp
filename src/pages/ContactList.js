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

const deleteNotification = (id) => {
    message.warning("Contact, " + id + " has been deleted");
};

const editNotification = (id) => {
    message.warning('Contact, ' + id + ' has been updated');
};

// const createNotification = (id) => {
//     message.warning('Contact, ' + id + ' has been added');
// };

class ContactList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            output: undefined,
            data: undefined,
            ringId: undefined,
            userName: undefined,
            id: undefined,
            firstName: undefined,
            lastName: undefined,
            password: undefined,
            contacts: undefined,
            size: 0,
            ref: undefined,
            user: undefined,
            loaded: false,
            isEditing: true,
        };

        this.columns = [
            {
                title: "Contact First Name",
                dataIndex: "firstName",
                key: "id",
            },

            {
                title: "Contact Last Name",
                dataIndex: "lastName",
                key: "id",
            },

            {
                title: "Contact Phone Number",
                dataIndex: "phoneNumber",
                key: "id",
            },
            {
                title: "Alert Message",
                dataIndex: "alertMessage",
                key: "id",
            },
            {
                title: '',
                dataIndex: 'operation',
                render: (_: any, record: Item) => {
                    return this.state.isEditing ? (
                        <span>
                            <a href="javascript:;" onClick={() => this.onSave(record.id)} style={{ marginRight: 8 }}>
                                Save
                            </a>
                            <Popconfirm title="Sure to cancel?" onConfirm={this.onSave(record.id)} >
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

    onDelete = (id) => {
        deleteNotification(id);
    };

    onSave = (id) => {
        this.setState({ isEditing: false });
        editNotification(id);
    }

    onAdd = () => {
        const { size, contacts } = this.state;
        console.log(size);
        console.log(contacts);

        let newContact = {
            firstName: 'TEKASHI',
            lastName: 'TRUMP',
            phoneNumber: 69696969,
            alertMessage: "I snitch",
            id: "6969696-6969696"
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
                    id: output[0].data.id,
                    userName: output[0].data.userName,
                    firstName: output[0].data.firstName,
                    lastName: output[0].data.lastName,
                    password: output[0].data.password,
                    contacts: output[0].data.contacts,
                    size: output[0].data.contacts.length,
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

    handleSelect = (id) => {
        this.setState({ selectContact: id });
    };

    componentDidUpdate = () => {
        console.log("componentDidUpdate");
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
                    dataSource={!this.state.loaded ? [] : this.state.contacts}
                />
                <Button type="primary" onClick={this.syncData}>
                    Save
                </Button>
            </div>
        );
    }
}

export default ContactList;