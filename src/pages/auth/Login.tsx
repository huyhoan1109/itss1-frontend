import Layout from "../../components/Layout"
import useAuth from "../../hooks/useAuth"
import { useEffect, useState, useRef, LegacyRef } from "react"
import { routePath } from "../../routes/routePath"
import {Button, Form, Input, Checkbox, notification} from "antd"

import { Api } from "../../services/api"
import { useNavigate } from "react-router-dom"
import useLocalStorage from "../../hooks/useLocalStorage"
import { useTranslation } from "react-i18next"
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


            <div className="flex">
                <div className="w-1/5 mx-auto" style={{marginTop: "5%"}}>
                <div style={{ padding: 30, border: '3px solid', borderRadius: 20 }}>
                    <Form form={form} onFinish={handleSubmit} style={{marginLeft: "5%", marginRight:"5%"}}>
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
                            <div style={{float: "right", width: "40%"}}>
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
                        <div style={{float: "right", width: "80%"}}>
                            <Button style={{textAlign: "center", fontSize: 16, borderColor: "blue"}} size="middle" htmlType="submit" block>
                                {
                                    i18n.language == 'vi' && 
                                    <a 
                                        href={routePath.auth.signup} 
                                    >
                                        Tạo tài khoản mới
                                    </a>
                                }
                                {
                                    i18n.language == 'jp' &&  
                                    <a 
                                        href={routePath.auth.signup} 
                                    >
                                        新しいアカウントを作成
                                    </a>
                                }
                            </Button>
                        </div>
                        </Form.Item>
                        <div className="flex gap-x-2" style={{float: "right", textDecoration: "underline"}}> 
                            {
                                i18n.language == 'vi' && 
                                <a 
                                    href={routePath.auth.forgotPassword} 
                                >
                                    Quên mật khẩu
                                </a>
                            }
                            {
                                i18n.language == 'jp' &&  
                                <a 
                                    href={routePath.auth.forgotPassword} 
                                >
                                    パスワード忘れた場合
                                </a>
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