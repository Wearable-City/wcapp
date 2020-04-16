import React from "react";
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
    PageHeader,
} from "antd";

import {
    IdcardOutlined,
    PhoneOutlined,
    MessageOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { Redirect } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

const UPDATE_URL = new URL(
    "https://wearablecity.netlify.app/.netlify/functions/users-edit-data"
);

const saveSuccessNotification = () => {
    message.success("Data has been saved!");
};
const saveFailedNotification = (err) => {
    message.error("Saving data failed 😞 Please try again!");
    console.error(err);
};
const editNotification = () => {
    message.warning("Contact has been updated");
};
const createNotification = (id) => {
    message.success(id + " has been added");
};

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
            goingBack: false,
            loggedOut: false,
            //End of Add Contact Stuff

            location: "",
            loaded: false,
        };

        this.columns = [
            {
                title: "Contact First Name",
                dataIndex: "firstName",
                key: `idfirstName`,
                editable: true,
            },

            {
                title: "Contact Last Name",
                dataIndex: "lastName",
                key: `idlastName`,
                editable: true,
            },
            {
                title: "Contact Phone Number",
                dataIndex: "phoneNumber",
                key: `idphoneNumber`,
                editable: true,
            },
            {
                title: "Alert Message",
                dataIndex: "alertMessage",
                key: `idalertMessage`,
                editable: true,
            },
            {
                title: "",
                dataIndex: "operation",
                render: (text, record) => (
                    <Button
                        type="link"
                        onClick={() => this.toggleEditModal(true, record)}
                    >
                        Edit
                    </Button>
                ),
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
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                ),
            },
        ];

        this.onEditSubmit = this.onEditSubmit.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onChangeString = this.onChangeString.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.showPosition = this.showPosition.bind(this);
    }

    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
            console.log(this.state.location);
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

    onEditSubmit = (id, fn, ln, pn, am) => {
        let contacts = this.state.user.contacts;
        console.log(contacts);

        for (var i = 0; i < contacts.length; i++) {
            var contact = contacts[i];
            if (contact.id === id) {
                contact.firstName = fn;
                contact.lastName = ln;
                contact.phoneNumber = pn;
                contact.alertMessage = am;
                console.log(contact);
            }
        }

        this.setState({
            user: {
                contacts: contacts,
            },
            showEditModal: false,
        });

        editNotification();
    };

    toggleAddModal = () => {
        this.setState((prevState) => ({
            showAddModal: !prevState.showAddModal,
            id: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            alertMessage: "",
        }));
    };

    toggleEditModal = (editMode, editRecord) => {
        if (editMode) {
            this.setState((prevState) => ({
                showEditModal: !prevState.showEditModal,
                id: editRecord.id,
                firstName: editRecord.firstName,
                lastName: editRecord.lastName,
                phoneNumber: editRecord.phoneNumber,
                alertMessage: editRecord.alertMessage,
            }));
        } else {
            this.setState((prevState) => ({
                showEditModal: !prevState.showEditModal,
                id: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                alertMessage: "",
            }));
        }
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
        this.toggleAddModal();
        createNotification(newContact.firstName + " " + newContact.lastName);
    };

    deleteAll = () => {
        this.setState({ user: { contacts: [] } });
        message.warning("All contacts have been deleted");
    };

    fetchData = () => {
        fetch(
            "https://wearablecity.netlify.app/.netlify/functions/users-read-by-ringid?ringid=42069",
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

    onBackPressed = () => {
        this.setState({ goingBack: true });
    };

    onLogout = () => {
        localStorage.removeItem("auth_token");
        this.setState({ loggedOut: true });
        // window.location.href = "/";
        window.location.reload();
    };

    render() {
        this.getLocation();
        if (!this.state.goingBack) {
            return (
                <div>
                    <PageHeader
                        className="site-page-header"
                        onBack={this.onBackPressed}
                        title="My Contacts"
                        subTitle="Manage your contacts"
                        extra={[
                            <Button key="3" onClick={this.onLogout}>
                                Logout
                            </Button>,
                        ]}
                    />
                    ,
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
                            onClick={this.toggleAddModal}
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

                        <Popconfirm
                            title="Sure to delete all?"
                            okType="danger"
                            onConfirm={this.deleteAll}
                        >
                            <Button
                                danger
                                type="secondary"
                                // onClick={this.deleteAll}
                                style={{ float: "left", marginLeft: "4em" }}
                            >
                                Delete All
                            </Button>
                        </Popconfirm>
                        <Button
                            danger
                            type="secondary"
                            onClick={this.getLocation}
                            style={{ float: "left", marginLeft: "4em" }}
                        >
                            Geo
                        </Button>
                    </div>
                    <div>
                        <Modal
                            centered
                            visible={this.state.showAddModal}
                            title={"Creating New Emergency Contact"}
                            onCancel={this.toggleAddModal}
                            footer={[
                                <Button key="back" onClick={this.toggleAddModal}>
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
                                                                color:
                                                                    "rgba(0,0,0,.65)",
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
                                                                color:
                                                                    "rgba(0,0,0,.65)",
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
                    <div>
                        <Modal
                            centered
                            visible={this.state.showEditModal}
                            title={"Editting Emergency Contact"}
                            onCancel={() => this.toggleEditModal(false)}
                            footer={[
                                <Button
                                    key="back"
                                    onClick={() => this.toggleEditModal(false)}
                                >
                                    Cancel
                                </Button>,
                                <Button
                                    key="submit"
                                    type="primary"
                                    loading={this.state.modalIsLoading}
                                    onClick={() =>
                                        this.onEditSubmit(
                                            this.state.id,
                                            this.state.firstName,
                                            this.state.lastName,
                                            this.state.phoneNumber,
                                            this.state.alertMessage
                                        )
                                    }
                                >
                                    Submit
                                </Button>,
                            ]}
                        >
                            <div style={{ textAlign: "center" }}>
                                <Title level={3}> Contact Details </Title>
                                <div>
                                    <Input
                                        disabled
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
                                                                color:
                                                                    "rgba(0,0,0,.65)",
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
                                                                color:
                                                                    "rgba(0,0,0,.65)",
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
        } else {
            return <Redirect to="/" />;
        }
    }
}

export default ContactList;
