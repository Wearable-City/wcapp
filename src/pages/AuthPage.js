import React from "react";

import { Form, Input, Button, Checkbox } from "antd";

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

const AUTH_URL = "";

const AuthForm = () => {
    const onFinish = (values) => {
        console.log("Success:", values);
        fetch(AUTH_URL, { mode: "cors", body: values, method: "POST" })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("auth_token", data.token);
                //navigate to homepage});
                console.log("yee");
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

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
                name="username"
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

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
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
