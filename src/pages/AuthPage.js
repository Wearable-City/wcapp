import React from "react";
import { Form, Input, Button, PageHeader, message } from "antd";
import "../styles/login.css";
import { Card, Avatar } from 'antd';


const { Meta } = Card;

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

    let style = {
        animationName: 'float',
        animationDuration: "10s",
        animationDelay: '0.0s',
        animationIterationCount: 10000000,

        width: 325,
        marginTop: "4%"
    };

    return (
        <div>
            <PageHeader className="site-page-header" title="Wearable City" />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    justifyItems: "center",
                }}
            >

                <Card

                    style={style}
                    cover={
                        <img
                            alt="example"
                            src="https://png.pngtree.com/thumb_back/fh260/back_our/20190625/ourmid/pngtree-blue-technology-cyber-security-poster-image_261494.jpg"
                        />
                    }
                ><Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                        <Meta
                            style={{ marginTop: "4%" }}
                            title="Login"
                            description="Please input your account details"
                        />
                        <Form.Item
                            label="Username"
                            name="userName"
                            style={{ marginTop: "19%" }}
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

                        <Form.Item {...tailLayout} style={{ marginTop: "9%", float: "right", marginRight: "10%" }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                    </Button>
                        </Form.Item>
                    </Form>

                </Card>

            </div>
        </div>
    );
};

export default AuthPage;
