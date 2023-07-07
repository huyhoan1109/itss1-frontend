import Layout from "../../components/Layout"
import { ChangeEvent, useEffect, useState } from "react"
import { routePath } from "../../routes/routePath"
import { Typography, notification } from "antd"
import { Api } from "../../services/api"
import { useTranslation } from "react-i18next"
import {Form, Input, Radio, Button, Select, Upload, Modal} from "antd"
import {CaretDownOutlined, UploadOutlined} from "@ant-design/icons"
import axios from "axios"
import MapProp from "../../components/Map/MapProp"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

const SignUpPage = () => {
    const {t, i18n} = useTranslation()
    const navigate = useNavigate()
    const {auth} = useAuth()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('Ha Noi')
    const [role, setRole] = useState('student')
    const [lat, setLat] = useState(21.006568)
    const [lng, setLng] = useState(105.84752)
    const [password, setPassword] = useState('')
    const [c_password, setC_Password] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [c_passwordVisible, setCPasswordVisible] = useState(false);
    const [avatar, setAvatar] = useState<any>(null)
    const newLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {    
                axios.request({
                    method: 'GET',
                    url:'https://eu1.locationiq.com/v1/reverse',
                    params: {
                        key: import.meta.env.LOCATION_APIKEY,
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        format: 'json'
                    }
                }).then((res) => {
                    setAddress(res.data.display_name)
                }) 
                setLat(position.coords.latitude)
                setLng(position.coords.longitude);
            },
            () => {}, 
            {maximumAge:0, timeout:10000, enableHighAccuracy:true}
        );
    }

    
    const handleSubmit = () => {
        if(email != '' && name != '' && phone != '') {
            if (password.localeCompare(c_password) == 0 && password != ''){
                Api({
                    method: 'POST',
                    url: routePath.auth.signup,
                    data:{
                        name,
                        email,
                        phone,
                        password,
                        role,
                        lat,
                        lng,
                        avatar,
                        address
                    }
                }).then(() => {
                    notification.success({
                        message:t('message.welcome_member')
                    })
                    setName('')
                    setEmail('')
                    setPassword('')
                    setPhone('')
                    setAddress('')
                    setC_Password('')
                    setAvatar(null)
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
    
    let map_props: MapProp = {
        c_lat: 0,
        c_lng: 0,
        lat: null,
        lng: null
    }

    useEffect(() => {
        if (auth?.user) {
            if (auth.user.role === 'admin') return navigate(routePath.admin.dashboard, {replace: true})
            else return navigate(routePath.allTeachers, {replace: true});
        }
    }, [])

    const handleUpload = async (options: any) => {
        const {file} = options;
        const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDY_NAME}/image/upload`;
        var data = new FormData();
        data.append('upload_preset', import.meta.env.VITE_CLOUDY_PRESET);
        data.append('file', file);
        axios(url,{
            method: "POST",
            headers: { 
                "content-type": "multipart/form-data",
            },
            data: data
        })
        .then((res) => {
            console.log(res.data.url)
            setAvatar(res.data.url)
        }).catch((err) => {
            console.log(err)
            setAvatar(null)
        });
    }

    return (
        <Layout>
            <div className="w-2/5 mx-auto" style={{ marginTop: "5%"}}>
                <div style={{ padding: 20, border: '3px solid', borderRadius: 40 }}>
                    <Form>
                        <div style={{width: "75%", marginLeft: "auto", marginRight: "auto"}}>
                            <div style={{textAlign: "center"}}>
                                {i18n.language == 'vi' && <h1 style={{fontSize: 30, marginBottom: "5%" }}>Tạo tài khoản mới</h1>}
                                {i18n.language == 'jp' && <h1 style={{fontSize: 30, marginBottom: "5%" }}>アカウント登録</h1>}
                            </div>
                            <div className="flex justify-between">
                            <Form.Item>
                                <Input
                                    style={{borderColor: "blue"}} 
                                    size="large"
                                    type="name" 
                                    value={name} 
                                    placeholder={t('content.name')||""}
                                    onChange={(e) => {setName(e.target.value)}} 
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input 
                                    style={{borderColor: "blue"}}
                                    size="large"
                                    type="email" 
                                    value={email} 
                                    placeholder={t('content.email')||""}
                                    onChange={(e) => {setEmail(e.target.value)}}
                                />
                            </Form.Item>
                            </div>
                            <div className="flex justify-between">
                                <Form.Item>
                                    <Input
                                        style={{borderColor: "blue"}}
                                        size="large"
                                        type={passwordVisible ? "text" : "password"} 
                                        placeholder={t('content.password')||""} 
                                        value={password} 
                                        onChange={(e) => {setPassword(e.target.value)}} 
                                    />
                                    <button
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                                        onClick={(e) => {
                                            e.preventDefault() 
                                            setPasswordVisible(!passwordVisible)
                                        }}
                                    >
                                        {passwordVisible ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        </svg>
                                        ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                            />
                                        </svg>
                                        )}
                                    </button>
                                </Form.Item>

                                <Form.Item>
                                    <Input 
                                        style={{borderColor: "blue"}}
                                        size="large"
                                        type={c_passwordVisible ? "text" : "password"} 
                                        placeholder={t('content.c_password')||""} 
                                        value={c_password} 
                                        onChange={(e) => {setC_Password(e.target.value)}} 
                                    />
                                    <button
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                                        onClick={(e) => {
                                            e.preventDefault() 
                                            setCPasswordVisible(!c_passwordVisible)
                                        }}
                                    >
                                        {c_passwordVisible ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        </svg>
                                        ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                            />
                                        </svg>
                                        )}
                                    </button>
                                </Form.Item>
                            </div>
                            <div className="flex justify-between">
                                <Form.Item>
                                    <Upload
                                        multiple={false}
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        name="file"
                                        onChange={handleUpload}
                                        progress={{
                                            strokeColor: {
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                            },
                                            strokeWidth: 3,
                                            format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
                                        }}
                                    >
                                        {i18n.language == 'jp' &&
                                            <Button size="large" icon={<UploadOutlined />}>イメージアップロード</Button>
                                        }
                                        { i18n.language == 'vi' &&
                                            <Button size="large" icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                        }
                                    </Upload>
                                </Form.Item>
                                <Form.Item>
                                    <Input 
                                        style={{borderColor: "blue"}}
                                        size="large"
                                        type="phone" 
                                        value={phone} 
                                        placeholder={t('content.phone')||""}
                                        onChange={(e) => {setPhone(e.target.value)}}
                                    />
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <Input 
                                    style={{borderColor: "blue"}}
                                    size="large"
                                    type="address" 
                                    value={address} 
                                    placeholder={t('content.address')||""}
                                    onClick={newLocation}
                                    onChange={(e) => {setAddress(e.target.value)}}
                                />
                            </Form.Item>
                            <Form.Item>
                                <div className="flex float-right gap-4">
                                    <Typography>
                                        <Select
                                            size="large"
                                            defaultValue={t('content.male')}
                                            suffixIcon={<CaretDownOutlined className='text-black'/>}
                                            options={[
                                                { 
                                                    value: 'female', 
                                                    label: t('content.female') 
                                                },
                                                { 
                                                    value: 'male', 
                                                    label: t('content.male') 
                                                },
                                                { 
                                                    value: 'none', 
                                                    label: t('content.null') 
                                                },
                                            ]}
                                    />
                                    </Typography>
                                    <Typography>
                                        <Radio.Group 
                                            onChange={(e) => {setRole(e.target.value)}} 
                                            value={role}
                                            size="large"
                                        >
                                            <Radio.Button value="student"><div style={{fontSize: 18}}>{t('content.student')}</div></Radio.Button>
                                            <Radio.Button value="teacher"><div style={{fontSize: 18}}>{t('content.teacher')}</div></Radio.Button>
                                        </Radio.Group>
                                    </Typography>
                                </div>
                            </Form.Item>
                            <div style={{width: "70%", marginLeft: "auto", marginRight: "auto"}}>
                                <Form.Item>
                                    <Button style={{borderColor: "blue"}} onClick={handleSubmit} block>
                                        <div style={{fontSize: 16}}>{t('content.signup')}</div>
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
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
                    </Form>
                </div>
            </div>
        </Layout>
    )
} 

export default SignUpPage