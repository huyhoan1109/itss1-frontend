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
import appLogout from "../../services/appLogout"

const LoginPage = () => {
    const {t, i18n} = useTranslation()
    let navigate = useNavigate();
    const {setAuth, persist, setPersist} = useAuth()
    const [email, setEmail] = useLocalStorage("email", "")
    const [password, setPassword] = useLocalStorage("password", "")
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [form] = Form.useForm()
    const handleSubmit = () => {
        Api.request({
            method: 'POST',
            url: routePath.auth.login,
            data:{
                email:email,
                password:password
            }
        }).then((res) => {
            const user = res.data.data.user;
            const token = res.data.data.access_token;
            const timeout =  res.data.data.timeout;
            appLogout(timeout)
            setAuth({ user, token, timeout })
            notification.success({
                message: t('message.welcome') + ' ' + user.name
            })
            if (user.role == 'admin') navigate(routePath.admin.dashboard, {replace: true})
            return navigate(routePath.allTeachers, {replace: true});
        }).catch((err) => {
            notification.error({
                message: t('message.error') 
            })
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
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100, height: 400}}>
                <div style={{ width: 400, padding: 20, border: '3px solid #ddd', borderRadius: 6 }}>
                <h1 style={{ textAlign: 'center', fontSize: 30}}>{t('content.login')}</h1>
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item>
                        <Input 
                            size="large"
                            name="email"
                            value={email}
                            placeholder={t('content.email')||""}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input.Password 
                            size="large"
                            name="password"
                            type="password"
                            placeholder={t('content.password')||""}
                            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox 
                            style={{fontSize: 18}}
                            onChange={togglePersist}
                            checked={persist}
                        >
                            <div style={{fontSize: 18}}>{t('content.remember_me')}</div>    
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button size="middle" htmlType="submit" block>
                            <div style={{fontSize: 16}}>{t('content.login')}</div>
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}> 
                        {
                            i18n.language == 'vi' && 
                            <div style={{fontSize: 18}}>
                                Chưa có tài khoản?  <a href={routePath.auth.signup} style={{marginLeft: 20, color: "blue"}}>{t('content.signup')}</a>
                            </div>
                        }
                        {
                            i18n.language == 'jp' &&  
                            <div style={{fontSize: 18}}>
                                アカウントがない?  <a href={routePath.auth.signup} style={{marginLeft: 20, color: "blue"}}>{t('content.signup')}</a>
                            </div>
                        }
                        <div style={{marginTop: 10}}>
                        <a href={routePath.auth.forgotPassword} style={{fontSize: 18, marginLeft: 20, color: "blue"}}>{t('content.forgot_password')}</a>
                        </div>
                    </div>
                </Form>
            </div>
            </div>
        </Layout>
    )
} 

export default LoginPage