import Layout from "../../components/Layout"
import { useEffect, useState } from "react"
import { routePath } from "../../routes/routePath"
import { notification } from "antd"
import { Api } from "../../services/api"
import { useTranslation } from "react-i18next"
import {Form, Checkbox, Input, Radio, Button} from "antd"

const SignUpPage = () => {
    const {t, i18n} = useTranslation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [c_password, setC_Password] = useState('')
    const [role, setRole] = useState('student')
    const [lat, setLat] = useState(0)
    const [lng, setLng] = useState(0)
    const [passwordVisible, setPasswordVisible] = useState(false);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude)
                setLng(position.coords.longitude);
            });
        }
    }, [])

    
    const handleSubmit = async () => {
        if(email != '' && name != '' && phone != '') {
            console.log(password, c_password)
            if (password.localeCompare(c_password) == 0 && password != ''){
                Api.request({
                    method: 'POST',
                    url: routePath.auth.signup,
                    data:{
                        name,
                        email,
                        phone,
                        password,
                        role,
                        lat,
                        lng
                    }
                }).then(() => {
                    notification.success({
                        message:t('message.welcome_member')
                    })
                    setName('')
                    setEmail('')
                    setPassword('')
                    setPhone('')
                    setC_Password('')
                    setRole('student')
                }).catch(() => {
                    notification.error({
                        duration: 2,
                        message: t('message.error') 
                    })
                })
            } else {
                notification.error({
                    duration: 2,
                    message:t('message.check_password')
                })
            }
        } else {
            notification.error({
                duration: 2,
                message:t('message.error')
            })
        }
    }

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50, height: 550}}>
                <div style={{ width: 400, padding: 20, border: '3px solid #ddd', borderRadius: 6 }}>
                    <h1 style={{ textAlign: 'center', fontSize: 30}}>{t('content.signup')}</h1>
                    <Form onFinish={handleSubmit}>
                    <Form.Item>
                        <Input 
                            size="large"
                            type="name" 
                            value={name} 
                            placeholder={t('content.name')||""}
                            onChange={(e) => {setName(e.target.value)}} 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input 
                            size="large"
                            type="email" 
                            value={email} 
                            placeholder={t('content.email')||""}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input 
                            size="large"
                            type="phone" 
                            value={phone} 
                            placeholder={t('content.phone')||""}
                            onChange={(e) => {setPhone(e.target.value)}}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input.Password 
                            size="large"
                            type="password" 
                            placeholder={t('content.password')||""} 
                            value={password} 
                            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                            onChange={(e) => {setPassword(e.target.value)}} 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input.Password 
                            size="large"
                            type="password" 
                            placeholder={t('content.c_password')||""} 
                            value={c_password} 
                            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                            onChange={(e) => {setC_Password(e.target.value)}} 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Radio.Group 
                            onChange={(e) => {setRole(e.target.value)}} 
                            value={role}
                        >
                            <Radio value="student"><div style={{fontSize: 18}}>{t('content.student')}</div></Radio>
                            <Radio value="teacher"><div style={{fontSize: 18}}>{t('content.tutor')}</div></Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" block>
                            <div style={{fontSize: 16}}>{t('content.signup')}</div>
                        </Button>
                    </Form.Item>
                    </Form>
                    <div style={{ textAlign: 'center' }}> 
                        {
                            i18n.language == 'vi' &&  
                            <div style={{fontSize: 18}}>Đã có tài khoản?  <a href={routePath.auth.login} style={{marginLeft: 20, color: "blue"}}>{t('content.login')}</a></div>
                        }
                        {
                            i18n.language == 'jp' &&  
                            <div style={{fontSize: 18}}>アカウントがある?  <a href={routePath.auth.login} style={{marginLeft: 20, color: "blue"}}>{t('content.login')}</a></div>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
} 

export default SignUpPage