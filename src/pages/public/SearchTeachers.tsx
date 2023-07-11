import {
    CaretDownOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneFilled,
    SearchOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState, FC } from 'react'
import Star from '../../components/view/Star'
import { useTranslation } from 'react-i18next'
import { routePath } from '../../routes/routePath'
import { Api } from '../../services/api'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { Button, Dropdown, Form, Input, MenuProps, Pagination, Select } from 'antd'

import RenderAvatar from '../../components/RenderAvatar'
import {TimeTableProp} from '../../types/TimeTableProp'
import TimeTables from '../../components/TimeTable/TimeTables'
import MapProp from '../../components/Map/MapProp'
import Map from '../../components/Map/Map'
import * as L from "leaflet";


const SearchTeachersPage = () => {
    const {t, i18n} = useTranslation()
    
    const [chooseShift, setChooseShift] = useState<string>('')
    const [table, setTable] = useState([false,false,false,false,false,false,false])
    const [weekdays, setWeekDays] = useState<any>([])
    const [showWeekend, setShowWeekend] = useState(false);
    const [times, setTimes] = useState<any>({})
    
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

    const [c_lat, setCLat] = useState(21.0695076) 
    const [c_lng, setCLng] = useState(105.8378366)

    const [teacher_lat, setTeacherLat] = useState<any>(null)
    const [teacher_lng, setTeacherLng] = useState<any>(null)


    let map_props: MapProp = {
        c_lat: c_lat,
        c_lng: c_lng,
        lat: teacher_lat,
        lng: teacher_lng
    }

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCLat(position.coords.latitude)
                setCLng(position.coords.longitude);
            });
        }
    }, [c_lat, c_lng, teacher_lat, teacher_lng])

    const calDistance = (from_lat:number, from_lng:number, to_lat:number, to_lng:number) => {
        let latlng1 = L.latLng(from_lat, from_lng);
        let latlng2 = L.latLng(to_lat, to_lng);
        return latlng1.distanceTo(latlng2) / 1000
    }

    const [name, setName] = useState<string>('')
    const [filterValue, setFilterValue] = useState<any>({})
    const [sortType, setSortType] = useState<any>(1)
    const [teachers, setTeachers] = useState<any>([])

    const [infoPage, setInfoPage] = useState<any>({})
    const [currentPage, setCurrentPage] = useState<number>(1)
    
    const [form] = Form.useForm()

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <div>{t('content.name')} A-Z</div>,
        },
        {
            key: '2',
            label: <div>{t('content.price')}</div>,
        },
        {
            key: '3',
            label: <div>{t('content.star_average')}</div>,
        },
        {
            key: '4',
            label: <div>{t('content.level')}</div>,
        },
        {
            key: '5',
            label: <div>{t('content.experience')}</div>,
        },
    ]

    const onClickSort: MenuProps['onClick'] = (e) => {
        setSortType(e.key)
    }

    const saveClipBoard = (value: string) => {
        navigator.clipboard.writeText(value)
        alert("Copy: "+value)
    }

    const handleFinishForm = async () => {
        setFilterValue(form.getFieldsValue())
    }

    const { isLoading, error, data } = useQuery({
        queryKey: ['teacherList', name, currentPage, filterValue, times, chooseShift],
        queryFn: () =>
            Api({
                method: 'GET',
                url: routePath.allTeachers,
                params: {
                    name,
                    page: currentPage,
                    limit: 4,
                    level: filterValue.level,
                    experience: filterValue.experience,
                    low_age: filterValue.low_age,
                    high_age: filterValue.high_age,
                    low_price: filterValue.low_price,
                    high_price: filterValue.high_price,
                    gender: filterValue.gender,
                    star: filterValue.star_average,
                    shift: chooseShift,
                    days: times.dayIDs
                },
            }),
    })

    const checkTeacher = (lists:Array<any>, teacherID:number) => {
        for (let i=0; lists.length > i; i++){
            if (lists[i]?.id == teacherID) return true
        }
        return false
    }

    useEffect(() => {
        let count_teacher = 0
        if (data?.data?.data) {
            let validTeachers:any = []
            data.data.data.map((value:any) => {
                let dist = calDistance(map_props.c_lat, map_props.c_lng, value.lat, value.lng)
                let check_dist = true
                if (filterValue?.distance && filterValue.distance != '') check_dist = (filterValue?.distance >= dist)
                else check_dist = true
                if(check_dist) {
                    if (!checkTeacher(validTeachers, value.teacherID)) {
                        validTeachers.push(value)
                        count_teacher += 1
                    }
                }
            })
            setTeachers(validTeachers)
            setInfoPage(data.data.infoPage)
        }
    }, [data, times, table, filterValue])
  
    return (
        <Layout>
        <div className='bg-blue-200 p-10'>
            <div className='mx-auto max-w-7xl grid grid-cols-[2fr_1fr] gap-4'>
                <div className='shadow-2xl p-6 bg-white rounded-2xl'>
                    <div className='flex justify-between items-center mb-6'>
                        <Dropdown menu={{ items, onClick:onClickSort }}>
                            <a>
                                <div className='h-7 flex rounded-lg border border-solid items-center gap-2 px-2 cursor-pointer'>
                                    <SortAscendingOutlined /> <span>{t('content.sort_by')}</span>
                                </div>
                             </a>
                        </Dropdown>
                    <div className='relative'>
                        <SearchOutlined className='absolute right-1 top-[1px] text-xl text-gray-600' />
                        <input
                            value={name}
                            onChange={(el) => setName(el.target.value)}
                            type='text'
                            className='w-96 text-black bg-transparent border focus-visible:outline-none border-solid border-gray-500 focus:border-nature-500 focus-visible:border-blue-500 rounded mb-2 py-1 pl-4'
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-6'>
                    {!error && teachers.length > 0 && teachers.sort(
                        (a:any, b:any) => {
                            switch(+sortType) {
                                case 1:
                                    return a.name > b.name ? 1:-1
                                case 2:
                                    return +a.price > +b.price ? 1:-1
                                case 3:
                                    return +a.star_average > +b.star_average ? 1:-1
                                case 4:
                                    return +a.level > +b.level ? 1:-1
                                case 5:
                                    return +a.experience > +b.experience ? 1:-1
                            }
                        }).map((value: any, index: any) => (
                            <div
                                key={index}
                                className='border border-solid gap-5 border-gray-700 p-5 rounded-3xl grid grid-cols-[10rem_1fr]'
                            >
                                <Link key={index} to={routePath.teacher.view(value.id)}>
                                    <RenderAvatar avatar={value.avatar} size='large'/>
                                </Link>
                                <div>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center justify-start text-xl gap-6'>
                                            <div className='font-semibold text-yellow-700'>{t('content.teacher')}</div>
                                            <Link key={index} to={routePath.teacher.view(value.id)}>
                                                <div className='font-semibold text-black'>{value.name}</div>
                                            </Link>
                                        </div>
                                        <div className='cursor-pointer flex gap-1'>
                                            <div>{value.star_average}</div>
                                            <Star />
                                        </div>
                                    </div>
                                <button className='astext'>
                                    <div className='my-2 flex gap-2' onClick={() => {
                                        setTeacherLat(value.lat)
                                        setTeacherLng(value.lng)
                                    }}>
                                        <EnvironmentOutlined className='text-purple-800 mt-1' />
                                        <div className='text-sm text-purple-700'>{value.address} ({Math.ceil(calDistance(map_props.c_lat, map_props.c_lng, value.lat, value.lng))} km)</div>
                                    </div>
                                </button>
                                <div className='my-2 flex gap-2'>
                                    <PhoneFilled className='cursor-pointer rotate-90' onClick={() => saveClipBoard(value.phone)}/>
                                    <button className='astext text-sm text-blue-700' onClick={() => saveClipBoard(value.phone)}>{value.phone}</button>
                                </div>
                                <div className='my-2 flex gap-2'>
                                    <MailOutlined className='cursor-pointer' onClick={() => saveClipBoard(value.email)}/>
                                    <button className='astext text-sm text-orange-700' onClick={() => saveClipBoard(value.email)}>{value.email}</button>
                                </div>
                                <div className='flex gap-10 text-sm'>
                                    <div className='flex gap-2'>
                                        <div style={{color: 'green'}}>{t('content.age')}</div>: 
                                        <div>{value.age}</div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <div style={{color: 'blue'}}>{t('content.experience')}</div>: 
                                        <div>{value.experience}</div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <div style={{color: 'orange'}}>{t('content.price')}</div>: 
                                        <div>{value.price} VND/45m</div>
                                    </div>
                                </div>
                                <span className='text-sm text-gray-700'>{value.detail.substring(0, 100)} {value.detail.length >= 100 && '...'}</span>
                            </div>
                        </div>
                    ))}
                    {!error && teachers.length == 0 && (
                        (   
                            i18n.language == 'jp' && 
                                <a>結果が見つかりませんでした</a>
                        )||
                        (   i18n.language == 'vi' &&
                                <a>Không tìm thấy kết quả</a>
                        )
                    )   
                    }
                    {!error && +infoPage?.totalPages > 0 && (
                        <Pagination
                            current={currentPage}
                            pageSize={3}
                            onChange={(page, pageSize) => setCurrentPage(page)}
                            total={+infoPage?.totalPages * 3}
                            className='mx-auto'
                        />
                    )}
                    {+infoPage?.totalPages == 0 &&
                        <div></div>
                    }
                </div>
            </div>
                <div>
                <div className='shadow-xl p-2 bg-white rounded-xl' style={{marginBottom: 10}}> 
                    <TimeTables {...table_props} />
                </div>
                <div className='shadow-xl p-4 bg-white rounded-xl'>      
                    <Form autoComplete='off' form={form} onFinish={handleFinishForm} className='mb-1'>
                        <div style={{marginBottom: 20}}></div>
                        <Form.Item
                            label={<div className='text-base'>{t('content.distance') + " (km)"}</div>}
                            labelAlign='left'
                            name='distance'
                            rules={[{ required: false, message: 'Please input!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<div className='text-base'>{t('content.level')}</div>}
                            labelAlign='left'
                            name='level'
                            rules={[{ required: false, message: 'Please input!' }]}
                        >
                            <Select
                                className='w-full'
                                defaultValue={1}
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
                        <Form.Item
                            label={<div className='text-base'>{t('content.experience')}</div>}
                            labelAlign='left'
                            name='experience'
                            rules={[{ required: false, message: 'Please input!' }]}
                        >
                            <Select
                                className='w-full'
                                defaultValue={1}
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
                        <div className='font-medium text-base mt-10'>{t('content.price')}</div>
                        <div className='flex grid-cols-2 gap-4'>
                            <Form.Item
                                label={<div className='text-base'>{t('content.from')}</div>}
                                labelAlign='left'
                                name='low_price'
                                rules={[{ required: false, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label={<div className='text-base'>{t('content.to')}</div>}
                                labelAlign='left'
                                name='high_price'
                                rules={[{ required: false, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <Form.Item
                            label={<div className='text-base'>{t('content.gender')}</div>}
                            labelAlign='left'
                            name='gender'
                            rules={[{ required: false, message: 'Please input!' }]}
                        >
                            <Select
                                defaultValue=''
                                suffixIcon={<CaretDownOutlined className='text-black' />}
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
                        </Form.Item>
                        <div className='font-medium text-base mt-10'>{t('content.age')}</div>
                        <div className='flex grid-cols-2 gap-4'>
                            <Form.Item
                                label={<div className='text-base'>{t('content.from')}</div>}
                                labelAlign='left'
                                name='low_age'
                                rules={[{ required: false, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                className='flex-row'
                                label={<div className='text-base'>{t('content.to')}</div>}
                                labelAlign='left'
                                name='high_age'
                                rules={[{ required: false, message: 'Please input!' }]}
                                >
                                <Input />
                            </Form.Item>
                        </div>
                        <Form.Item className='mt-10'>
                            <Button type='primary' className='bg-blue-500 w-full' htmlType='submit'>
                                {<div className='text-base'>{t('content.filter')}</div>}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="p-4" style={{marginTop: 20}}>
                    <Map {...map_props}/>
                </div>
            </div>
        </div>
    </div>
    </Layout>
)}
  
export default SearchTeachersPage