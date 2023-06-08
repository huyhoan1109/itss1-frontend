import {
    CaretDownOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneFilled,
    SearchOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'

import { useQuery } from '@tanstack/react-query'
import { Button, Dropdown, Form, Input, MenuProps, Pagination, Select } from 'antd'
import { useEffect, useState } from 'react'
import Star from '../components/view/Star'
import { useTranslation } from 'react-i18next'
import { routePath } from '../routes/routePath'
 
import { Api } from '../services/api'


const SearchPage = () => {
    const {t} = useTranslation()
    const [name, setName] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [value, setValue] = useState<any>({})
    const [sortType, setSortType] = useState<any>(1)
    const [teachers, setTeachers] = useState<any>([])
    const [infoPage, setInfoPage] = useState<any>({})
    
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
        alert("Copied value: " + value);
    }

    const handleFinishForm = async () => {
        setValue(form.getFieldsValue())
    }

    const { isLoading, error, data } = useQuery({
        queryKey: ['repoData', name, currentPage, value],
        queryFn: () =>
            Api.request({
            method: 'GET',
            url: routePath.searchTeacher,
            params: {
                name,
                page: currentPage,
                limit: 3,
                level: value.level,
                experience: value.experience,
                low_age: value.low_age,
                high_age: value.high_age,
                low_price: value.low_price,
                high_price: value.high_price,
                gender: value.gender,
                star: value.star_average
            },
            }),
    })
  
    useEffect(() => {
        if (data?.data?.data) setTeachers(data.data.data)
        if (data?.data?.infoPage) setInfoPage(data.data.infoPage)
    }, [data])
  
    return (
        <div className='bg-blue-200 p-10'>
            <div className='mx-auto max-w-7xl grid grid-cols-[2fr_1fr] gap-4'>
                <div className='shadow-2xl p-6 bg-white'>
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
                            switch(+sortType){
                                case 1:
                                    return a.name > b.name ? 1:-1
                                case 2:
                                    return a.price > b.price ? 1:-1
                                case 3:
                                    return a.star_average > b.star_average ? 1:-1
                                case 4:
                                    return a.level > b.level ? 1:-1
                                case 5:
                                    return a.experience > b.experience ? 1:-1
                            }
                        }).map((value: any, index: any) => (
                        <div
                            key={index}
                            className='border border-solid gap-5 border-gray-700 p-5 rounded-3xl grid grid-cols-[10rem_1fr]'
                        >
                        <div className='flex justify-center items-start'>
                            <img
                                src={value.avatar}
                                className='w-36 h-36 object-cover rounded-full border border-solid border-gray-500'
                                alt=''
                            />
                        </div>
                        <div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center justify-start text-xl gap-6'>
                                    <div className='font-semibold text-yellow-700'>{t('content.tutor')}</div>
                                    <div className='font-semibold text-black'>{value.name}</div>
                                </div>
                                <div className='cursor-pointer flex gap-1'>
                                    <div>{value.star_average}</div>
                                    <Star />
                                </div>
                            </div>
                        <div className='flex my-2 gap-2'>
                            <EnvironmentOutlined className='text-purple-800 mt-1' />
                            <div className='text-sm text-purple-700'>{value.address}</div>
                        </div>
                        <div className='flex gap-10 text-sm'>
                            <div>{t('content.age')} {value.age}</div>
                            <div>{t('content.experience')}  {value.experience}</div>
                            <div>{t('content.price')}   {value.price}VNĐ/45p</div>
                        </div>
                        <div className='my-2 flex gap-2' onClick={() => saveClipBoard(value.phone)}>
                            <PhoneFilled className='cursor-pointer rotate-90'/>
                            <button className='astext text-sm text-blue-700'>{value.phone}</button>
                        </div>
                        <div className='my-2 flex gap-2' onClick={() => saveClipBoard(value.email)}>
                            <MailOutlined className='cursor-pointer' />
                            <button className='astext text-sm text-orange-700'>{value.email}</button>
                        </div>
                        <div className='text-sm text-gray-700'>{value.detail}</div>
                        </div>
                    </div>
                    ))}
                    {!error && infoPage?.totalPages && (
                        <Pagination
                            current={currentPage}
                            pageSize={3}
                            onChange={(page, pageSize) => setCurrentPage(page)}
                            total={+infoPage?.totalPages * 3}
                            className='mx-auto'
                        />
                    )}
                </div>
            </div>
            {/* <div style={{position:"fixed", right:250, width: 400}}>  */}
            <div>
            <div className='shadow-2xl p-6 bg-white'>
                <Form autoComplete='off' form={form} onFinish={handleFinishForm} className='mb-1'>
                    <Form.Item
                        label={t('content.level')}
                        labelAlign='left'
                        name='level'
                        rules={[{ required: false, message: 'Please input your username!' }]}
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
                                    })
                                )
                            }
                        />
                    </Form.Item>
                <Form.Item
                    label={t('content.experience')}
                    labelAlign='left'
                    name='experience'
                    rules={[{ required: false, message: 'Please input your username!' }]}
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
                    <Form.Item
                        label={t('content.from')}
                        labelAlign='left'
                        name='low_price'
                        rules={[{ required: false, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('content.to')}
                        labelAlign='left'
                        name='high_price'
                        rules={[{ required: false, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>
    
                    <Form.Item
                        label={t('content.gender')}
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
                                    value: '', 
                                    label: t('content.null') 
                                },
                            ]}
                        />
                    </Form.Item>
                <div className='font-medium text-base mt-10'>{t('content.age')}</div>
                <div className='flex grid-cols-2 gap-4'>
                    <Form.Item
                        label={t('content.from')}
                        labelAlign='left'
                        name='low_age'
                        rules={[{ required: false, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        className='flex-row'
                        label={t('content.to')}
                        labelAlign='left'
                        name='high_age'
                        rules={[{ required: false, message: 'Please input!' }]}
                        >
                        <Input />
                    </Form.Item>
                </div>
                <Form.Item className='mt-10'>
                    <Button type='primary' className='bg-blue-500 w-full' htmlType='submit'>
                        {t('content.filter')}
                    </Button>
                </Form.Item>
                </Form>
            </div>
            </div>
            </div>
        </div>
    )
}
  
export default SearchPage
  
