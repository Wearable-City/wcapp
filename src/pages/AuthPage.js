import React from "react";
import { Form, Input, Button, PageHeader, message } from "antd";

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const AUTH_URL = "https://wearablecity.netlify.com/.netlify/functions/auth";

const AuthPage = (props) => {
    const onFinish = (values) => {
        fetch(AUTH_URL, {
            mode: "cors",
            body: JSON.stringify({
                userName: values.userName,
                password: values.password,
            }),
            method: "POST",
        })
            .then((res) => {
                res.json().then((data) => {
                    console.log("in last then");
                    localStorage.setItem("auth_token", data.token);
                    window.location.reload();
                });
            })
            .catch((e) =>
                message.error("There was an error when logging in. Please try again!")
            );
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const onLogout = () => {
        localStorage.removeItem("auth_token");
        this.setState({ loggedOut: true });
        // window.location.href = "/";
        window.location.reload();
    };

    return (
        <div>
            <PageHeader className="site-page-header" title="Wearable City - Login" />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    justifyItems: "center",
                }}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="userName"
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AuthPage;
