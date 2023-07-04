import {routePath} from '../../routes/routePath'
import Layout from '../../components/Layout'
import { useState } from 'react'
import {Input, Form, Button, notification} from 'antd'
import { useTranslation } from 'react-i18next'
import { Api } from '../../services/api'
import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ForgotPasswordPage = () => {
    const navigate = useNavigate()
    const {t, i18n} = useTranslation()
    const [email, setEmail] = useState('')
    const [page, setPage] = useState(1)
    const [countdown, setCountDown] = useState(300)
    const [otp, setOtp] = useState('')
    const [token, setToken] = useState<any>(null)
    const [password, setPassword] = useState('')
    const [c_password, setC_Password] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [c_passwordVisible, setCPasswordVisible] = useState(false);
    let intervalId = useRef<any>(null)

    const handleSendOtp = () => {
        Api({
            method: "POST",
            url: '/send_otp',
            data: {
                email
            }
        }).then(() => {
            setPage(2)
            startCountDown()
        }).catch((err) => {
            notification.error({
                message: t('message.error')
            })
        })
    }

    const handleCheckOtp = () => {
        Api({
            method: "POST",
            url: '/check_otp',
            data: {
                email,
                otp
            }
        }).then((res) => {
            setPage(3)
            setOtp('')
            setToken(res.data.data.pass_token)
        }).catch((err) => {
            notification.error({
                message: t('message.error')
            })
        })
        resetCountDown()
    }

    const handleChangePass = () => {
        if (password.localeCompare(c_password) == 0 && password != ''){
            Api({
                method: "POST",
                url: '/change_password',
                data: {
                    email,
                    pass_token: token
                }
            }).then(() => {
                return navigate(routePath.auth.login)
            }).catch(() => {
                notification.error({
                    message: t('message.error')
                })
            })
        } else {
            notification.error({
                message: t('message.error')
            })
        }
    }

    const resetCountDown = () => {
        setCountDown(300)
        clearInterval(intervalId.current)
    }

    const startCountDown = () => {
        // Bắt đầu đếm ngược
        if (intervalId != null) {
            resetCountDown()
        }
        intervalId.current = setInterval(() => {
            setCountDown((prev:any) => (prev - 1))
            if (countdown === 0) {
                resetCountDown()
            }
        }, 1000);
    };

    useEffect(() => {
        return () => {
            setPage(1)
            resetCountDown()
        }
    }, [])

    return (
        <Layout>
            { page == 1 &&
            <div className="w-2/5 mx-auto" style={{marginTop: "5%"}}>
                <div style={{ padding: 20, border: '3px solid', borderRadius: 40 }}>
                    <Form onFinish={handleSendOtp} style={{marginLeft: "5%", marginRight:"5%", textAlign: "center"}}>
                        <h1 style={{fontSize: 30, marginBottom: "5%" }}>{t('content.forgot_password')}</h1>
                        <Form.Item>
                            <Input 
                                size="large"
                                name="email"
                                value={email}
                                placeholder={t('content.email')||""}
                                onChange={(e) => {setEmail(e.target.value)}}
                            />
                        </Form.Item>
                        {i18n.language == 'vi' && 
                            <div style={{marginBottom: "5%", fontSize: 16}}>Hãy nhập email của bạn để chúng tôi tiến hành gửi mã OTP xác nhận</div>
                        }
                        {i18n.language == 'jp' && 
                            <div style={{marginBottom: "5%", fontSize: 16}}>メールを入力して、OTP確認を送ります</div>
                        }
                        <Button size="large" htmlType='submit'>
                            {i18n.language == 'vi' && 
                                <div style={{marginBottom: "3%", fontSize: 18}}>Gửi</div>
                            }
                            {i18n.language == 'jp' && 
                                <div style={{marginBottom: "3%", fontSize: 18}}>送る</div>
                            }
                        </Button>
                    </Form>
                </div>
            </div>
            }
            {page == 2 &&
            <div className="w-2/5 mx-auto" style={{marginTop: "5%"}}>
                <div style={{ padding: 20, border: '3px solid', borderRadius: 40 }}>
                    <Form onFinish={handleCheckOtp} style={{marginLeft: "5%", marginRight:"5%", textAlign: "center"}}>
                        <h1 style={{fontSize: 30, marginBottom: "5%" }}>{t('content.forgot_password')}</h1>
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
                            <Input 
                                size="large"
                                name="otp"
                                value={otp}
                                placeholder={'OTP'}
                                onChange={(e) => {setOtp(e.target.value)}}
                            />
                        </Form.Item>
                        <Form.Item>
                        {countdown > 0 && 
                            <div className="flex my-4 gap-x-4" style={{float: 'right'}}>
                                <div style={{fontSize: 18}}>
                                    {countdown}
                                    {i18n.language == 'vi' && 
                                    <>Giây</>
                                    }
                                    {i18n.language == 'jp' && 
                                    <>秒</>
                                    }
                                </div>
                                <Button size='large' onClick={handleSendOtp}>
                                    {i18n.language == 'vi' && 
                                    <div style={{fontSize: 18}}>Gửi lại</div>
                                    }
                                    {i18n.language == 'jp' && 
                                        <div style={{fontSize: 18}}>もう一度送る</div>
                                    }
                                </Button>
                            </div>
                        }
                        </Form.Item>
                        {i18n.language == 'vi' && 
                            <div style={{marginBottom: "5%", fontSize: 16}}>Hãy nhập OTP của bạn để xác nhận</div>
                        }
                        {i18n.language == 'jp' && 
                            <div style={{marginBottom: "5%", fontSize: 16}}>OTPを入力して、確認します</div>
                        }
                        <Button size="large" htmlType='submit'>
                            {i18n.language == 'vi' && 
                                <div style={{marginBottom: "3%", fontSize: 18}}>Gửi</div>
                            }
                            {i18n.language == 'jp' && 
                                <div style={{marginBottom: "3%", fontSize: 18}}>送る</div>
                            }
                        </Button>
                    </Form>
                </div>
            </div>
            }
            {page == 3 &&
            <div className="w-2/5 mx-auto" style={{marginTop: "5%"}}>
                <div style={{ padding: 20, border: '3px solid', borderRadius: 40 }}>
                    <Form onFinish={handleChangePass} style={{marginLeft: "5%", marginRight:"5%", textAlign: "center"}}>
                        <h1 style={{fontSize: 30, marginBottom: "5%" }}>{t('content.forgot_password')}</h1>
                        <Form.Item>
                            <Input.Password 
                                size="large"
                                name="password"
                                value={password}
                                placeholder={t('content.password')||""}
                                onChange={(e) => {setPassword(e.target.value)}}
                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input.Password 
                                size="large"
                                name="c_password"
                                value={c_password}
                                placeholder={t('content.c_password')||""}
                                onChange={(e) => {setC_Password(e.target.value)}}
                                visibilityToggle={{ visible: c_passwordVisible, onVisibleChange: setCPasswordVisible }}
                            />
                        </Form.Item>
                        {i18n.language == 'vi' && 
                            <div style={{marginBottom: "5%", fontSize: 16}}>Nhập mật khẩu mới của bạn</div>
                        }
                        {i18n.language == 'jp' && 
                            <div style={{marginBottom: "5%", fontSize: 16}}>新しいパスワードを入力してください</div>
                        }
                        <Button size="large" htmlType='submit'>
                            {i18n.language == 'vi' && 
                                <div style={{marginBottom: "3%", fontSize: 18}}>Gửi</div>
                            }
                            {i18n.language == 'jp' && 
                                <div style={{marginBottom: "3%", fontSize: 18}}>送る</div>
                            }
                        </Button>
                    </Form>
                </div>
            </div>
            }
        </Layout>
    )
}

export default ForgotPasswordPage
