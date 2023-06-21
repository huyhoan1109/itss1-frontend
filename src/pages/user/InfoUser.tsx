import { routePath } from '../../routes/routePath';
import { useQuery } from '@tanstack/react-query';
import { Api } from '../../services/api';  
import { useEffect, useState, RefObject, useRef } from 'react';
import Layout from '../../components/Layout';
import useAuth from '../../hooks/useAuth';
import Container from '../../components/Container';
import { useTranslation } from 'react-i18next';
import RenderAvatar from '../../components/RenderAvatar';
import { Button, Form, Input, Select, Checkbox, InputNumber, notification } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { BsPencil } from 'react-icons/bs';
import { EnvironmentOutlined, PhoneFilled, MailOutlined, CaretDownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import { Box, Dialog, Stack, Typography } from "@mui/material";
import TimeTableProp, { Shifts } from "../../types/TimeTableProp";
import TimeTables from '../../components/TimeTable2/TimeTables2';
import { PersonOutlined } from '@mui/icons-material';

const InfoUserPage = () => {

    const [chooseShift, setChooseShift] = useState<number>(0)
    const [table, setTable] = useState([false,false,false,false,false,false,false])
    const [weekdays, setWeekDays] = useState<any>([])
    const [showWeekend, setShowWeekend] = useState(false);
    const [times, setTimes] = useState<any>([])
    
    let table_props: TimeTableProp = {
        chooseShift, 
        setChooseShift, 
        table, 
        setTable, 
        weekdays, 
        setWeekDays, 
        times, 
        setTimes, 
        showWeekend, 
        setShowWeekend
    }
    
    let navigate = useNavigate()
    const {t, i18n} = useTranslation()
    const {auth, setAuth} = useAuth()
    const [info, setInfo] = useState<any>({})
    const [visibleDiag, setVisibleDiag] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [form] = Form.useForm()
    const { refetch, error, data } = useQuery({
        queryKey: [`userInfo${auth.token}`, info],
        queryFn: () => 
            Api({
                method: 'GET',
                url: routePath.user.base,
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
            })
    })

    if (error) {
        setAuth({})
        return navigate(routePath.auth.login)
    }

    useEffect(() => {
        if (data?.data?.data) {
            let teach_methods:CheckboxValueType[] = []
            let result = data.data.data
            let {teach_method1, teach_method2, teach_method3, ...rest} = result
            if (teach_method1 != null){
                teach_methods.push(teach_method1)
            }
            if (teach_method2 != null){
                teach_methods.push(teach_method2)
            }
            if (teach_method3 != null){
                teach_methods.push(teach_method3)
            }
            setInfo({...rest, teach_methods})
        }
        return () => {
            setInfo({})
        }
    }, [data])

    const handleSubmit = async () => {
        let formValue = form.getFieldsValue()
        let name = formValue.name || info.name
        let phone = formValue.phone || info.phone
        let password = formValue.password || info.password
        let address = formValue.address || info.address
        let gender = formValue.gender || info.gender
        Api({
            method: 'POST',
            url: routePath.user.base,
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            data:{
                name,
                phone,
                password,
                address,
                gender
            }
        }).then(() => {
            // setAuth({user: res.data.data, token: auth.token, timeout: auth.timeout})
            notification.success({
                message: t('message.updated_ok')
            })
        }).catch(() => {
            notification.error({
                message: t('message.error')
            })
            setAuth({})
            return navigate(routePath.auth.login)
        })
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
            Api({
                method: 'POST',
                url: routePath.teacher.postInfo,
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                data:{
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
                    schedulers: {
                        times
                    }
                }
            }).then(() => {
                notification.success({
                    message: t('message.updated_ok')
                })
            }).catch(() => {
                notification.error({
                    message: t('message.error')
                })
            })      
        }
        refetch()
    }

    const { TextArea } = Input;

    return (
        <Layout>
            {auth.user.role == 'student' && 
            <div className='h-180 w-full bg-blue-200'>
            <Container className='py-10 flex items-end justify-center bg-blue-200'>
                <div className='w-3/5 h-3/5 rounded-xl p-8 shadow-md bg-white flex items-start justify-between gap-6'>
                    <div className="relative">
                        <RenderAvatar avatar={info.avatar} />
                        <Button className="absolute bottom-0 border-sky-600 font-bold rounded" style={{fontSize: 18, marginLeft: 90}}>
                            <BsPencil color='blue'/>
                        </Button>
                    </div>
                    <div className='w-[85%]'>
                        <div className='flex flex-col gap-2'>
                            <div className="flex gap-x-14" style={{marginTop: "4%", marginLeft: "3%"}}>
                                <h1 className='font-semibold text-orange-700 text-2xl'>
                                    {t('content.student')}
                                </h1>
                                <h1 className='font-semibold text-black-700 text-2xl'>{info.name}</h1>
                            </div>
                            <div className='flex gap-x-6' style={{marginTop: "2%", marginLeft: "3%"}}>
                                <div className='flex gap-x-1'>
                                    <EnvironmentOutlined className='text-purple-800 mt-1' />
                                    <div className='font-semibold text-purple-700'>{info.address}</div>
                                </div>
                                <div className='flex gap-x-1'>
                                    <PhoneFilled className='cursor-pointer rotate-90'/>
                                    <button className='astext text-md text-blue-700'>{info.phone}</button>
                                </div>
                                <div className='flex gap-x-1'>
                                    <MailOutlined className='cursor-pointer'/>
                                    <button className='astext text-md text-orange-700'>{info.email}</button>
                                </div>
                            </div>
                            <div className='flex gap-x-6'>
                                <div className='flex gap-x-1' style={{marginTop: "2%", marginLeft: "3%"}}>
                                    <PersonOutlined className='cursor-pointer'/>
                                    <button className='astext text-md text-green-700'>{t(`content.${info.gender}`)}</button>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-20' style={{marginTop: 30, marginLeft: 30}}>
                        <Button 
                            size='large' className='w-fit bg-blue-600 text-white !px-10' 
                            onClick={() => navigate(-1)}
                        >
                            {t('content.go_back')}
                        </Button>
                        <Button 
                            size='large' className='w-fit bg-blue-600 text-white !px-10' 
                            onClick={() => {}}
                        >
                            {t('content.fix')}
                        </Button>
                        </div>
                    </div>
                </div>
            </Container>
            </div>
            }
            {
                auth.user.role == 'teacher' && 
                <div 
                    className="fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue p-4 border border-gray-300 shadow-lg"
                    style={{top: "43%", width: "70%", height: "inherit"}}
                >
                    <Form 
                        form={form} 
                        onFinish={handleSubmit} 
                    >
                        <Stack direction="row" flex={1}>
                            <Stack direction="column" style={{marginTop: "2%", marginLeft: "2%"}}>
                                <div className="relative">
                                    <RenderAvatar avatar={info.avatar}/>
                                    <Button onClick={() => setVisibleDiag(true)} className="absolute bottom-0 border-sky-600 font-bold rounded" style={{fontSize: 18, marginLeft: 90}}>
                                        <BsPencil color='blue'/>
                                    </Button>                   
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
                                            <Input style={{fontSize: 16}} placeholder={info.email} name="email" disabled/>
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
                                            <Input style={{fontSize: 16}} placeholder={info.address} name="address"/>
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
                                {/* <div className="flex gap-x-4" style={{fontSize: 18}}>
                                        {t('content.schedule')}: {times.map((value:any, index:any) => {
                                                if (value.length > 0) {
                                                    return (
                                                        <div key={index} className="flex" style={{fontSize: 18, marginRight: 10}}>({Shifts[index]}: {value.map((dayID:any, idx:any) => {
                                                            return (
                                                                <a key={idx} style={{marginRight: 2}}>{weekdays[dayID]}</a>
                                                            )
                                                        })})</div>
                                                    )
                                                }
                                            })
                                        }
                                </div>
                                <div style={{marginTop: 10}}>
                                    <TimeTables {...table_props} />
                                </div> */}

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
                                            fontWeight: "bold",
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
                </div>
            }
        </Layout>
    );
};

export default InfoUserPage