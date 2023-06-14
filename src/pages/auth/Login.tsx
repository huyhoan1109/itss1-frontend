import Layout from "../../components/Layout"
import useAuth from "../../hooks/useAuth"
import { useEffect, useState, useRef, LegacyRef } from "react"
import { routePath } from "../../routes/routePath"
import {Button, Form, Input, Checkbox, notification} from "antd"

import { Api } from "../../services/api"
import { useNavigate } from "react-router-dom"
import useLocalStorage from "../../hooks/useLocalStorage"
import { useTranslation } from "react-i18next"
import Container from "../../components/Container"

const LoginPage = () => {
    const {t} = useTranslation()
    let navigate = useNavigate();
    const {setAuth, persist, setPersist} = useAuth()
    const [email, setEmail] = useLocalStorage("email", "")
    const [password, setPassword] = useLocalStorage("password", "")
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [form] = Form.useForm()
    const handleSubmit = async () => {
        Api.request({
            method: 'POST',
            url: routePath.auth.login,
            data:{
                email:email,
                password:password
            }
        }).then((res) => {
            const user = res?.data?.data?.user;
            const token = res?.data?.data?.access_token;
            setAuth({ user, token })
            notification.success({
                message: t('message.welcome') + ' ' + user.name
            })
            if (user.role == 'admin') navigate(routePath.admin.dashboard, {replace: true})
            return navigate(routePath.allTeachers, {replace: true});
        }).catch((err) => {
            notification.error({
                message: t('message.error') 
            })
            console.log(err)
        })
        form.resetFields(["email", "password"]);
    }

    const togglePersist = () => {
        setPersist(!persist);
    }
    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
        return () => {
            if (persist == false) {
                setEmail("")
                setPassword("")
            }
        }
    }, [persist])
    return (
        <Layout>
            <Container>
                <Form form={form}>
                    <Form.Item>
                        <Input 
                            name="email"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input.Password 
                            name="password"
                            type="password"
                            value={password}
                            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                            defaultValue={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox 
                            onChange={togglePersist}
                            checked={persist}>    
                        </Checkbox>
                    </Form.Item>
                    <Button onClick={handleSubmit}>Submit</Button>
                </Form>
            </Container>
        </Layout>
    )
} 

export default LoginPage