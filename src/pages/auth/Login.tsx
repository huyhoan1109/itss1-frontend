import Layout from "../../components/Layout"
import useAuth from "../../hooks/useAuth"
import { useEffect, useState, useRef, LegacyRef } from "react"
import { routePath } from "../../routes/routePath"
import {Button, Form, Input, Checkbox, notification} from "antd"

import { Api } from "../../services/api"
import { useNavigate, NavLink } from "react-router-dom"
import useLocalStorage from "../../hooks/useLocalStorage"
import { useTranslation } from "react-i18next"
import appLogout from "../../services/appLogout"

const LoginPage = () => {
    const {t, i18n} = useTranslation()
    let navigate = useNavigate();
    const {auth, setAuth, persist, setPersist} = useAuth()
    const [email, setEmail] = useLocalStorage("email", "")
    const [password, setPassword] = useLocalStorage("password", "")
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [form] = Form.useForm()
    const handleSubmit = () => {
        Api({
            method: 'POST',
            url: routePath.auth.login,
            data:{
                email:email,
                password:password
            }
        }).then((res) => {
            console.log(res)
            const user = res.data.data.user;
            const token = res.data.data.access_token;
            const timeout =  res.data.data.timeout;
            appLogout(timeout)
            setAuth({ user, token, timeout })
            notification.success({
                message: t('message.welcome') + ' ' + user.name
            })
            if (user.role == 'admin') return navigate(routePath.admin.dashboard, {replace: true})
            else return navigate(routePath.allTeachers, {replace: true});
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
        if (auth?.user) {
            if (auth.user.role === 'admin') return navigate(routePath.admin.dashboard, {replace: true})
            else return navigate(routePath.allTeachers, {replace: true});
        }
    }, [])
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
            <div className="flex">
                <div className=" mx-auto" style={{ width: 400, marginTop: "5%"}}>
                <div style={{ padding: 30, border: '3px solid', borderRadius: 20 }}>
                    <Form form={form} onFinish={handleSubmit} style={{marginLeft: "10", marginRight:"20"}}>
                        <h1 style={{fontSize: 30, marginBottom: "5%" }}>SaGaSuy</h1>
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
                            <div style={{float: "right", width: 120}}>
                            <Button style={{borderColor: "blue"}} size="middle" htmlType="submit" block>
                                <div style={{fontSize: 16}}>{t('content.login')}</div>
                            </Button>
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <div className="flex gap-x-2" style={{float: "right"}}> 
                                <div style={{fontSize: 16}}>{t('content.remember_me')}</div>
                                <Checkbox 
                                    onChange={togglePersist}
                                    checked={persist}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item>
                        <div style={{float: "right", width: 220}}>
                            <Button style={{textAlign: "center", fontSize: 16, borderColor: "blue"}} size="middle" htmlType="submit" block>
                                {
                                    i18n.language == 'vi' && 
                                    <NavLink to={routePath.auth.signup}>
                                        Tạo tài khoản mới
                                    </NavLink>
                                }
                                {
                                    i18n.language == 'jp' &&  
                                    <NavLink to={routePath.auth.signup}>
                                        新しいアカウントを作成
                                    </NavLink>
                                }
                            </Button>
                        </div>
                        </Form.Item>
                        <div className="flex gap-x-2" style={{float: "right", textDecoration: "underline"}}> 
                            {
                                i18n.language == 'vi' && 
                                <NavLink to={routePath.auth.forgotPassword}>
                                    Quên mật khẩu
                                </NavLink>
                            }
                            {
                                i18n.language == 'jp' &&  
                                <NavLink to={routePath.auth.forgotPassword} >
                                    パスワード忘れた場合
                                </NavLink>
                            }
                        </div>
                    </Form>
                </div>
            </div>
            </div>
        </Layout>
    )
} 

export default LoginPage