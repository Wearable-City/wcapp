import React, { Component } from "react";
import "antd/dist/antd.css";
import {
    Table,
    Typography,
    Popconfirm,
    message,
    Button,
    Tooltip,
    Modal,
    Input,
    Row,
    Col,
} from "antd";

import {
    IdcardOutlined,
    PhoneOutlined,
    MessageOutlined,
    RightOutlined,
} from "@ant-design/icons";


const { Title } = Typography;
const { TextArea } = Input;

const UPDATE_URL = new URL("https://wearablecity.netlify.com/.netlify/functions/users-edit-data");

const deleteNotification = (id) => { message.warning(id + " has been deleted"); };
const saveSuccessNotification = () => { message.success("Data has been saved!"); };
const saveFailedNotification = (err) => { message.error("Saving data failed 😞 Please try again!"); console.error(err); };
const editNotification = (id) => { message.warning(id + " has been updated"); };
const createNotification = (id) => { message.success(id + " has been added"); };

class ContactList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ref: undefined,
            user: undefined,

            //Add/Edit Contact Stuff
            showEditModal: false,
            showAddModal: false,
            modalIsLoading: false,
            id: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            alertMessage: "",
            //End of Add Contact Stuff

            loaded: false,
        };

        this.columns = [
            {
                title: "Contact First Name",
                dataIndex: "firstName",
                key: "id" + "firstName",
                editable: true,
            },

            {
                title: "Contact Last Name",
                dataIndex: "lastName",
                key: "id" + "lastName",
                editable: true,
            },
            {
                title: "Contact Phone Number",
                dataIndex: "phoneNumber",
                key: "id" + "phoneNumber",
                editable: true,
            },
            {
                title: "Alert Message",
                dataIndex: "alertMessage",
                key: "id" + "alertMessage",
                editable: true,
            },
            {
                title: "",
                dataIndex: "operation",
                render: (text, record, index) => (

                    <Button type="link" onClick={() => this.toggleEditModal()}>
                        Edit
                    </Button>

                )
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
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                ),
            },
        ];

        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onChangeString = this.onChangeString.bind(this);
    }
    onDelete = (id) => {
        deleteNotification(id);
    };

    onSave = (id) => {
        this.setState({ isEditing: false });
    };

    toggleModal = () => {
        this.setState((prevState) => ({
            showAddModal: !prevState.showAddModal,
            id: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            alertMessage: "",
        }));
    };

    onAdd = () => {
        let contacts = this.state.user.contacts;
        const newContact = {
            id: this.state.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            alertMessage: this.state.alertMessage,
        };
        let newContacts = [...contacts, newContact];
        this.setState({ user: { contacts: newContacts } });
        this.toggleModal();
        createNotification(newContact.firstName + " " + newContact.lastName);
    };

    deleteAll = () => {
        this.setState({ user: { contacts: [] } });
        message.warning("All contacts have been deleted");
    };

    fetchData = () => {
        fetch(
            "https://wearablecity.netlify.com/.netlify/functions/users-read-by-ringid?ringid=42069",
            { mode: "cors" }
        )
            .then((response) => response.json())
            .then((output) =>
                this.setState({
                    user: output[0].data,
                    ref: output[0].ref["@ref"].id,
                    loaded: true,
                })
            )
            .then(() => console.log(this.state.user.contacts));
    };

    onChangeString(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    syncData = () => {
        UPDATE_URL.searchParams.set("ref", this.state.ref);
        fetch(UPDATE_URL.href, {
            mode: "cors",
            body: JSON.stringify(this.state.user),
            method: "POST",
        })
            .then((res) => {
                if (res.ok) {
                    saveSuccessNotification();
                }
            })
            .catch((err) => {
                saveFailedNotification(err);
            });
    };

    componentDidMount = () => {
        console.log("componentDidMount");
        this.fetchData();
    };

    componentDidUpdate = () => {
        console.log("componentDidUpdate");
    };

    render() {

        return (
            <div>
                <Title level={2} style={{ textAlign: "center", padding: "1em" }}>
                    {" "}
                    Contact List{" "}
                </Title>

                <Table
                    columns={this.columns}
                    loading={!this.state.loaded}
                    dataSource={!this.state.loaded ? [] : this.state.user.contacts}
                />
                <div style={{ marginLeft: "2.5em", marginTop: "1.5em" }}>
                    <Button
                        onClick={this.toggleModal}
                        type="primary"
                        style={{ float: "left", marginRight: "1em" }}
                    >
                        Add Contact
                    </Button>
                    <Button
                        type="primary"
                        onClick={this.syncData}
                        style={{ float: "left" }}
                    >
                        Save
                    </Button>

                    <Button
                        danger
                        type="secondary"
                        onClick={this.deleteAll}
                        style={{ float: "left", marginLeft: "4em" }}
                    >
                        Delete All
                    </Button>
                </div>

                <div>
                    <Modal
                        centered
                        visible={this.state.showAddModal}
                        title={"Creating New Emergency Contact"}
                        onOk={this.onSave}
                        onCancel={this.toggleModal}
                        footer={[
                            <Button key="back" onClick={this.toggleModal}>
                                Cancel
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                loading={this.state.modalIsLoading}
                                onClick={this.onAdd}
                            >
                                Submit
                            </Button>,
                        ]}
                    >
                        <div style={{ textAlign: "center" }}>
                            <Title level={3}> Contact Details </Title>
                            <div>
                                <Input
                                    placeholder="Contact ID"
                                    id="id"
                                    value={this.state.id}
                                    onChange={this.onChangeString}
                                    size="large"
                                    prefix={
                                        <Tooltip title="CHAR 64, Cannot be left empty">
                                            <IdcardOutlined />
                                        </Tooltip>
                                    }
                                />

                                <Row>
                                    <Col span={12}>
                                        <Input
                                            allowClear
                                            placeholder="First Name"
                                            id="firstName"
                                            value={this.state.firstName}
                                            onChange={this.onChangeString}
                                            size="large"
                                            prefix={
                                                <Tooltip title="Cannot have special characters">
                                                    <RightOutlined
                                                        style={{
                                                            color: "rgba(0,0,0,.65)",
                                                        }}
                                                    />
                                                </Tooltip>
                                            }
                                            style={{ marginTop: "3.9%" }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Input
                                            allowClear
                                            placeholder="Last Name"
                                            id="lastName"
                                            value={this.state.lastName}
                                            onChange={this.onChangeString}
                                            size="large"
                                            prefix={
                                                <Tooltip title="Cannot have special characters">
                                                    <RightOutlined
                                                        style={{
                                                            color: "rgba(0,0,0,.65)",
                                                        }}
                                                    />
                                                </Tooltip>
                                            }
                                            style={{ marginTop: "3.9%" }}
                                        />
                                    </Col>
                                </Row>

                                <Input
                                    allowClear
                                    placeholder="Contact Phone Number"
                                    id="phoneNumber"
                                    value={this.state.phoneNumber}
                                    onChange={this.onChangeString}
                                    size="large"
                                    prefix={
                                        <Tooltip title="Can only have Numeric Characters">
                                            <PhoneOutlined
                                                style={{ color: "rgba(0,0,0,.65)" }}
                                            />
                                        </Tooltip>
                                    }
                                    style={{ marginTop: "3.9%" }}
                                />

                                <TextArea
                                    rows={4}
                                    allowClear
                                    placeholder="Alert Message"
                                    id="alertMessage"
                                    value={this.state.alertMessage}
                                    onChange={this.onChangeString}
                                    size="large"
                                    prefix={
                                        <Tooltip title="Customize your message to your liking!">
                                            <MessageOutlined
                                                style={{ color: "rgba(0,0,0,.65)" }}
                                            />
                                        </Tooltip>
                                    }
                                    style={{ marginTop: "5%" }}
                                />
                                <br />
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default ContactList;
