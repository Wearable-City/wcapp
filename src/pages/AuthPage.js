import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Input, Button } from "antd";

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

const AuthForm = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const onFinish = (values) => {
        console.log("Success:", {
            userName: values.userName,
            password: values.password,
        });
        fetch(AUTH_URL, {
            mode: "cors",
            body: JSON.stringify({
                userName: values.userName,
                password: values.password,
            }),
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("auth_token", data.token);
                //navigate to homepage});
                setIsLoggedIn(true);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    if (!isLoggedIn) {
        return (
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
        );
    } else {
        return <Redirect to="/" />;
    }
};

class AuthPage extends React.Component {
    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        justifyItems: "center",
                    }}
                >
                    <AuthForm />
                </div>
            </div>
        );
    }
}

export default AuthPage;
