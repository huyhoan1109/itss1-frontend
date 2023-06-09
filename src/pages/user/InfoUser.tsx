import { routePath } from '../../routes/routePath';
import { useQuery } from '@tanstack/react-query';
import { Api } from '../../services/api';  
import { useEffect, useState, RefObject, useRef } from 'react';
import Layout from '../../components/Layout';
import useAuth from '../../hooks/useAuth';
import Container from '../../components/Container';
import { useTranslation } from 'react-i18next';
import RenderAvatar from '../../components/RenderAvatar';
import { Button, Form, Input, Select, Checkbox, InputNumber, notification, Upload, Modal, Row, Col } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { BsPencil } from 'react-icons/bs';
import { CaretDownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography } from "@mui/material";
import {TimeTableProp2, DAYS_JP, Shifts } from "../../types/TimeTableProp";
import TimeTables2 from '../../components/TimeTable2/TimeTables2';
import { HomeOutlined, MailOutline, PasswordOutlined, PersonOutline, PhoneOutlined } from '@mui/icons-material';
import axios from 'axios';


const InfoUserPage = () => {
    const [chooseShift, setChooseShift] = useState<number>(0)
    const [table, setTable] = useState([false,false,false,false,false,false,false])
    const [weekdays, setWeekDays] = useState<any>(DAYS_JP)
    const [showWeekend, setShowWeekend] = useState(false);
    const [times, setTimes] = useState<any>([])
    const [schedulers, setSchedulers] = useState<any>([])
    const [openModal, setOpenModal] = useState(false)

    let table_props: TimeTableProp2 = {
        chooseShift, 
        setChooseShift, 
        table, 
        setTable, 
        weekdays, 
        setWeekDays, 
        times, 
        setTimes, 
        showWeekend, 
        setShowWeekend,
        schedulers
    }
    
    let navigate = useNavigate()
    const {t, i18n} = useTranslation()
    const {auth, setAuth} = useAuth()
    const [info, setInfo] = useState<any>({})
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [form] = Form.useForm()
    const [lat, setLat] = useState<any>(null)
    const [lng, setLng] = useState<any>(null)
    const handleCloseModal = () => {
        setOpenModal(false)
    }
    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const getData = () => {
        Api({
            method: 'GET',
            url: auth.user.role == 'student' ? routePath.user.base : routePath.teacher.info,
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
        }).then((res) => {
            let result = res.data
            if (auth.user.role == 'teacher') {
                let teach_methods:CheckboxValueType[] = []
                let {teach_method1, teach_method2, teach_method3, ...rest} = result.data
                if (teach_method1 != null){
                    teach_methods.push(teach_method1)
                }
                if (teach_method2 != null){
                    teach_methods.push(teach_method2)
                }
                if (teach_method3 != null){
                    teach_methods.push(teach_method3)
                }
                if (result.schedulers) {
                    setInfo({...rest, teach_methods})
                    setSchedulers(result.schedulers)
                } 
                setInfo({...rest, teach_methods})
                setLat(rest.lat)
                setLng(rest.lng)
            } else {
                setInfo(result)
            }
        })
    }

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
            Api({
                method: 'POST',
                url: routePath.user.base,
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                data:{
                    avatar: res.data.url
                }
            }).then(() => {
                getData()
                notification.success({
                    message: t('message.updated_ok')
                })
            })
        }).catch((err) => {
            notification.error({
                message: t('message.error')
            })
        });
    }

    useEffect(() => {
        getData()
    }, [])

    const newLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                let {address, ...rest} = info
                console.log(address)
                let newLat = position.coords.latitude
                let newLng = position.coords.longitude
                axios.request({
                    method: 'GET',
                    url:'https://eu1.locationiq.com/v1/reverse',
                    params: {
                        key: import.meta.env.VITE_LOCATION_APIKEY,
                        lat: newLat,
                        lon: newLng,
                        format: 'json'
                    }
                }).then((res) => {
                    setLat(newLat)
                    setLng(newLng);
                    setInfo({address: res.data.display_name, ...rest})
                }) 
            });
        }
    }

    const handleSubmit = async () => {
        let formValue = form.getFieldsValue()
        let name = formValue.name || info.name
        let email = formValue.email || info.email
        let phone = formValue.phone || info.phone
        let password = formValue.password || info.password
        let address = formValue.address || info.address
        let gender = formValue.gender || info.gender
        if (auth.user.role == 'student') {
            Api({
                method: 'POST',
                url: routePath.user.base,
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                data:{
                    name,
                    phone,
                    email,
                    password,
                    address,
                    gender,
                    lat: lat || info.lat,
                    lng: lng || info.lng 
                }
            }).then(() => {
                if (auth.user.role == 'student') {
                    getData()
                    notification.success({
                        message: t('message.updated_ok')
                    })
                }
            }).catch(() => {
                notification.error({
                    message: t('message.error')
                })
                setAuth({})
                return navigate(routePath.auth.login)
            })
        }
        if (auth.user.role == 'teacher') {
            let age = formValue.age || info.age
            let level = formValue.level || info.level
            let experience = formValue.experience || info.experience
            let price = formValue.price || info.price
            let teach_method1 = formValue.teach_methods[0] || info.teach_methods[0]
            let teach_method2 = formValue.teach_methods[1] || null 
            let teach_method3 = formValue.teach_methods[2] || null
            let certificate1 = formValue.certificate1 || info.certificate1
            let certificate2 = formValue.certificate2 || info.certificate2
            let certificate3 = formValue.certificate3 || info.certificate3
            let info_link = formValue.info_link || info.info_link
            let detail = formValue.detail || info.detail
            let schedulers:any = []
            times.forEach((value:any, index:any) => {
                if (value.length > 0) {
                    schedulers.push({shiftID:index, value})
                }
            })
            Api({
                method: 'POST',
                url: routePath.teacher.info,
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                data:{
                    user_info: {
                        name,
                        phone,
                        email,
                        password,
                        address,
                        gender,
                        lat: lat || info.lat,
                        lng: lng || info.lng 
                    },
                    teacher_info: {
                        age,
                        level,
                        experience,
                        price,
                        teach_method1,
                        teach_method2: teach_method2,
                        teach_method3: teach_method3,
                        certificate1,
                        certificate2,
                        certificate3,
                        info_link,
                        detail
                    }, 
                    schedulers
                }
            }).then(() => {
                notification.success({
                    duration: 1,
                    message: t('message.updated_ok')
                })
            }).catch(() => {
                notification.error({
                    duration: 1,
                    message: t('message.error')
                })
            })      
        }
        getData()
    }

    const { TextArea } = Input;

    return (
        <Layout>
            <div className='flex items-center justify-center'>
            {auth.user.role == 'student' && 
            <div className='w-[100%] bg-blue-200'>
            <Container className='w-[100%] py-28 flex items-end justify-center bg-blue-200'>
                <div style={{width: 1000, height: 600, borderRadius: 60 }} className='p-8 shadow-md bg-white flex items-start justify-between gap-6'>
                    <div className="relative" style={{marginTop: 40, marginLeft: 40}}>
                        <RenderAvatar avatar={info.avatar} size="large"/>
                        <Upload
                            multiple={false}
                            maxCount={1}
                            beforeUpload={() => false}
                            name="file"
                            onChange={handleUpload}
                            showUploadList={false}
                        >
                            <Button className="absolute bottom-5 border-sky-600 font-bold rounded" style={{fontSize: 18, marginLeft: 90}}>
                                <BsPencil color='blue'/>
                            </Button>
                        </Upload>
                    </div>
                    <div className='w-[85%]'>
                        <div className='flex flex-col gap-2'>
                            <div className="flex gap-x-20" style={{marginTop: "4%", marginLeft: "3%"}}>
                                <h1 className='font-semibold text-black-700 text-3xl'>{info.name}</h1>
                            </div>
                            <div className='grid gap-4 grid-cols-1' style={{borderSpacing: 10, marginTop: "4%", marginLeft: "3%"}}>
                                <div className='flex gap-x-4'>
                                    <HomeOutlined />
                                    <div className='astext text-md'>{info.address}</div>
                                </div>
                                <div className='flex gap-x-4'>
                                    <PhoneOutlined className='cursor-pointer'/>
                                    <button className='astext text-md'>{info.phone}</button>
                                </div>
                                <div className='flex gap-x-4'>
                                    <MailOutline/>
                                    <button className='astext text-md'>{info.email}</button>
                                </div>
                                <div className='flex gap-x-4'>
                                    <PersonOutline/>
                                    <button className='astext text-md'>{t(`content.${info.gender}`)}</button>
                                </div>
                                <div className='flex gap-x-4'>
                                    <PasswordOutlined />
                                    <div> ************** </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center grid gap-x-8 grid-cols-2' style={{marginTop: "10%", marginLeft: "3%"}}>
                            <Button 
                                size='large' className='w-fit bg-blue-600 text-white !px-10' 
                                onClick={() => navigate(-1)}
                            >
                                {t('content.go_back')}
                            </Button>
                            <Button 
                                size='large' className='w-fit bg-blue-600 text-white !px-10' 
                                onClick={() => {setOpenModal(true)}}
                            >
                                {t('content.fix')}
                            </Button>
                        </div>
                        <Modal
                            open={openModal}
                            onOk={() => setOpenModal(false)}
                            onCancel={() => setOpenModal(false)}
                            footer={null}
                            width={800}
                        >
                            <Form 
                                form={form} 
                                onFinish={() => {
                                    handleSubmit()
                                    setOpenModal(false)
                                }} 
                                layout='vertical'
                            >
                                <Row className='flex gap-8 justify-center items-center' style={{marginTop: 20}}>
                                    <Col span={10}>
                                        <Form.Item name="name" label={<div style={{fontSize: 18}}>{t('content.name')}</div>} >
                                            <Input style={{fontSize: 16}} placeholder={info.name} name="name" />
                                        </Form.Item>
                                        <Form.Item name="gender" label={<div style={{fontSize: 18}}>{t('content.gender')}</div>} >
                                            <Select
                                                style={{fontSize: 16}}
                                                defaultValue='male'
                                            >
                                                <option style={{fontSize: 16, position: "inherit"}} value={'male'}>{t('content.male')}</option>
                                                <option style={{fontSize: 16, position: "inherit"}} value={'female'}>{t('content.female')}</option>
                                                <option style={{fontSize: 16, position: "inherit"}} value={'none'}>{t('content.null')}</option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="email" label={<div style={{fontSize: 18}}>{t('content.email')}</div>} >
                                            <Input style={{fontSize: 16}} placeholder={info.email} name="email" disabled/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item name="phone" label={<div style={{fontSize: 18}}>{t('content.phone')}</div>} >
                                            <Input style={{fontSize: 16}} placeholder={info.phone} name="phone"/>
                                        </Form.Item>
                                        <Form.Item name="address" label={<div style={{fontSize: 18}}>{t('content.address')}</div>} >
                                            <Input onClick={newLocation} style={{fontSize: 16}} placeholder={info.address} name="address"/>
                                        </Form.Item>
                                        <Form.Item name="password" label={<div style={{fontSize: 18}}>{t('content.password')}</div>} >
                                            <Input.Password 
                                                style={{fontSize: 16}} 
                                                type="password" 
                                                name="password"
                                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Box sx={{ display: "flex", justifyContent: "center"}}>
                                    <Button
                                        size="large"
                                        htmlType='submit'
                                    >
                                    {t('content.update_profile')}
                                    </Button>
                                </Box>
                            </Form>
                        </Modal>
                    </div>
                </div>

            </Container>
            </div>
            }
            {
                auth.user.role == 'teacher' && 
                <Form 
                    style={{padding: 10, border: '3px solid', borderRadius: 20, marginTop: 20, marginBottom: 20}}
                    form={form} 
                    onFinish={handleSubmit} 
                >
                    <Stack direction="row" flex={1}>
                        <Stack direction="column" style={{marginTop: "2%", marginLeft: "2%"}}>
                            <div className="relative">
                                <RenderAvatar avatar={info.avatar} size="large"/>
                                <Upload
                                    multiple={false}
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    name="file"
                                    onChange={handleUpload}
                                    showUploadList={false}
                                >
                                    <Button className="absolute bottom-5 border-sky-600 font-bold rounded" style={{fontSize: 18, marginLeft: 90}}>
                                        <BsPencil color='blue'/>
                                    </Button>
                                </Upload>                   
                            </div>
                        </Stack>
                        <Stack direction="column" flex={1} margin={"2%"}>
                            <Stack direction="row">
                                <Stack direction="column" marginRight={"4%"}>
                                <Typography>
                                    <Form.Item name="name" label={<div style={{fontSize: 18}}>{t('content.name')}</div>} >
                                        <Input style={{fontSize: 16}} placeholder={info.name} name="name" />
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item name="email" label={<div style={{fontSize: 18}}>{t('content.email')}</div>} >
                                        <Input style={{fontSize: 16}} placeholder={info.email} name="email"/>
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item name="password" label={<div style={{fontSize: 18}}>{t('content.password')}</div>} >
                                        <Input.Password 
                                            style={{fontSize: 16}} 
                                            type="password" 
                                            name="password"
                                            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                                        />
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item name="phone" label={<div style={{fontSize: 18}}>{t('content.phone')}</div>} >
                                        <Input style={{fontSize: 16}} placeholder={info.phone} name="phone"/>
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item name="address" label={<div style={{fontSize: 18}}>{t('content.address')}</div>} >
                                        <Input onClick={newLocation} style={{fontSize: 16}} placeholder={info.address} name="address"/>
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item name="gender" label={<div style={{fontSize: 18}}>{t('content.gender')}</div>} >
                                        <Select
                                            style={{fontSize: 16}}
                                            defaultValue='male'
                                            suffixIcon={<CaretDownOutlined className='text-black' />}
                                            options={[
                                                { 
                                                    value: 'male', 
                                                    label: <div style={{fontSize: 16}}>{t('content.male')}</div> 
                                                },
                                                { 
                                                    value: 'female', 
                                                    label: <div style={{fontSize: 16}}>{t('content.female')}</div> 
                                                },
                                                { 
                                                    value: 'none', 
                                                    label: <div style={{fontSize: 16}}>{t('content.null')}</div> 
                                                },
                                            ]}
                                        />
                                    </Form.Item>
                                </Typography>
                                </Stack>
                                <Stack direction="column" marginRight={"4%"}>
                                <Typography>
                                    <Form.Item name="age" label={<div style={{fontSize: 18}}>{t('content.age')}</div>} >
                                        <InputNumber style={{fontSize: 16}} placeholder={info.age} value={info.age} name="age"/>
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item 
                                        key={info.experience ? 'loaded': 'notLoaded'} 
                                        style={{width: "70%"}}
                                        initialValue={info.experience} 
                                        name="experience" 
                                        label={<div style={{fontSize: 18}}>{t('content.experience')}</div>} 
                                    >
                                        <Select
                                            style={{fontSize: 16}}
                                            value={info.experience||1}
                                            suffixIcon={<CaretDownOutlined className='text-black' />}
                                            options={
                                                [...Array(5)]
                                                .map((value, idex) => (
                                                    { 
                                                        value: idex + 1, 
                                                        label: `${idex + 1}` 
                                                    }
                                                )
                                                )
                                            }
                                        />
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item 
                                        name="price" 
                                        label={<div style={{fontSize: 18}}>{t('content.price')} (VND/45m)</div>} 
                                    >
                                        <InputNumber 
                                            style={{fontSize: 16}} 
                                            placeholder={info.price} 
                                            name="price"
                                        />
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item 
                                        style={{width: "70%"}}
                                        key={info.level ? 'loaded': 'notLoaded'} 
                                        initialValue={info.level} 
                                        name="level" 
                                        label={<div style={{fontSize: 18}}>{t('content.level')}</div>} 
                                    >
                                    <Select
                                        suffixIcon={<CaretDownOutlined className='text-black' />}
                                        options={
                                            [...Array(7)]
                                            .map((value, idex) => (
                                                { 
                                                    value: idex + 1, 
                                                    label: `${idex + 1}` 
                                                }
                                            ))
                                        }
                                    />
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item 
                                        key={info.teach_methods ? 'loaded': 'notLoaded'} 
                                        initialValue={info.teach_methods} 
                                        name='teach_methods' 
                                        label={<div style={{fontSize: 18}}>{t('content.teach_method')}</div>} 
                                    >
                                        <Checkbox.Group 
                                            style={{ width: '100%', fontSize: 18}} 
                                            name='teach_methods'
                                            options={[
                                                {
                                                    label: <div style={{fontSize: 16}}>{t('content.online')}</div>,
                                                    value: "online"
                                                },
                                                {
                                                    label: <div style={{fontSize: 16}}>{t('content.offline1')}</div>,
                                                    value: "offline1"
                                                },
                                                {
                                                    label: <div style={{fontSize: 16}}>{t('content.offline2')}</div>,
                                                    value: "offline2"
                                                }
                                            ]}
                                            onChange={(e) => {
                                                
                                            }}
                                        >
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item name="info_link" label={<div style={{fontSize: 18}}>{t('content.info_link')}</div>} >
                                        <Input style={{fontSize: 16}} placeholder={info.info_link} name="info_link"/>
                                    </Form.Item>
                                </Typography>
                                </Stack>
                                <Stack direction="column">
                                <Typography>
                                    <Form.Item name="certificate1" label={<div style={{fontSize: 18}}>{t('content.certificate')} 1</div>} >
                                        <Input style={{fontSize: 16}} placeholder={info.certificate1} name="certificate1"/>
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item name="certificate2" label={<div style={{fontSize: 18}}>{t('content.certificate')} 2</div>} >
                                        <Input style={{fontSize: 16}} placeholder={info.certificate2} name="certificate2"/>
                                    </Form.Item>
                                </Typography>
                                <Typography>
                                    <Form.Item name="certificate3" label={<div style={{fontSize: 18}}>{t('content.certificate')} 3</div>} >
                                        <Input style={{fontSize: 16}} placeholder={info.certificate3} name="certificate3"/>
                                    </Form.Item>
                                </Typography>
                                </Stack>
                            </Stack>
            
                            <Form.Item label={<div style={{fontSize: 18}}>{t('content.schedule')}</div>}>
                                <TimeTables2 {...table_props}/>
                            </Form.Item>

                            <Form.Item name="detail" label={<div style={{fontSize: 18}}>{t('content.detail')}</div>} >
                                <TextArea 
                                    placeholder={info.detail} 
                                    style={{fontSize: 18}}
                                    autoSize={{ minRows: 4, maxRows: 5 }}
                                />
                            </Form.Item>

                            <Box sx={{ display: "flex", justifyContent: "center"}}>
                                <Button
                                    size="large"
                                    style={{
                                        color: "#111111",
                                        borderColor: "#3B5B95",
                                        minWidth: "3%",
                                        fontSize: 18,
                                    }}
                                    htmlType='submit'
                                >
                                {t('content.update_profile')}
                                </Button>
                            </Box>
                        </Stack>
                    </Stack>
                </Form>
            }
            </div>
        </Layout>
    );
};

export default InfoUserPage