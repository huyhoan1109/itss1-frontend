import Container from '../components/Container'

import { Form, Divider, Select, Col, Row, InputNumber, Rate, Dropdown, MenuProps} from 'antd'
import { MdOutlineAttachMoney, MdOutlinePersonPinCircle } from 'react-icons/md'
import {ImFilter} from 'react-icons/im'

import { searchTeacher } from "../services/teacher";
import { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiUserCircle, BiSort, BiSearch, BiRefresh } from "react-icons/bi";

import styled from 'styled-components';
import { Button, Input, InputAdornment, IconButton, Pagination} from "@mui/material";

import {
    SortAscendingOutlined,
} from '@ant-design/icons'

interface PaginInfo {
    totalPages?: number,
    pageSize?: number,
    currentPage?: number
}

interface Teacher {
    id?: number,
    name?: string,
    email?: string,
    phone?: string,
    role?: string,
    address?: string,
    avatar?: string,
    age?: number,
    level?: number,
    experience?: number,
    gender?: string,
    price?: number,
    info_link?: string,
    detail?: string,
    star_average?: number,
    certificate1?: string,
    certificate2?: string,
    certificate3?: string,
    teach_method1?: string,
    teach_method2?: string,
    createdAt?: string,
    updatedAt?: string,
    comments?: object
}

interface SearchInfo {
    data: Teacher[],
    infoPage: PaginInfo
}

const RenderAvatar = ({ teacher }:{teacher: Teacher}) => {
    // if (teacher.avatar) {
    //     return <img src={teacher.avatar} alt='Avatar' />
    // }
    return <BiUserCircle className='avatar-icon' />
}

const TeacherList = ({teachers}:{teachers: Teacher[]}) => {
    const { t } = useTranslation()
    return (
        <List>
            {teachers.map((teacher: Teacher, index) => (
                <Person key={index}>
                    <RenderAvatar teacher={teacher} /> 
                    <PersonInfo>
                        <Row gutter={[30, 30]}>
                            <Col span={10}>
                                <div className='header'>
                                    <p>{t('content.tutor')}</p>
                                    <h3 className='fullname'>{teacher.name}</h3>
                                </div>
                                <Rate allowHalf value={teacher.star_average} disabled />
                                <div className='personal'>
                                    <p className='address'>{t('content.address')}:  {teacher.address}</p>
                                    <p className='price'>{t('content.price')}:  {teacher.price} VND/{t('content.month')}</p>
                                    <p className='phone'>{t('content.phone')}:  {teacher.phone}</p>
                                    <p className='email'>{t('content.mail')}:  {teacher.email}</p>
                                    <p className='info_link'>{t('content.info_link')}:  {teacher.info_link}</p>
                                </div>
                            </Col>
                            <Col span={10}>
                                <div className='other'>
                                    <p className='level'>{t('content.level')}:  {teacher.level}</p>
                                    <p className='experience'>{t('content.experience')}:  {teacher.experience} {t('content.year')}</p>
                                    <p className='certificate'> {t('content.certificate')}:  {teacher.certificate1}  {teacher.certificate2}  {teacher.certificate3}</p>
                                    <p className='teach_method'> {t('content.teach_method')}:   {
                                                                                                    teacher.teach_method1 
                                                                                                    && <span style={{color: 'red'}}>{t(`content.${teacher.teach_method1}`)}</span> 
                                                                                                }  {
                                                                                                    teacher.teach_method2 
                                                                                                    && <span style={{color: 'blue'}}>{t(`content.${teacher.teach_method2}`)}</span> 
                                                                                                    } 
                                    </p>
                                    <p className='age'>{t('content.age')}:  {teacher.age}</p>
                                    <p className='gender'>
                                        {t('content.gender')} 
                                            : {teacher.gender == 'male' && t('content.male')}
                                            {teacher.gender == 'female' && t('content.female')}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </PersonInfo>
                </Person> 
            ))}
            
        </List>
    )
}

const SearchPage = () => {

    const initLists: Teacher[] = [];

    const { t } = useTranslation()

    const items: MenuProps['items'] = [
        {
          key: '1',
          label: <div>{t('content.sort_by_name')} A-Z</div>,
        },
        {
          key: '2',
          label: <div>{t('content.sort_by_price')}</div>,
        },
        {
          key: '3',
          label: <div>{t('content.sort_by_level')}</div>,
        },
        {
          key: '4',
          label: <div>{t('content.sort_by_star')}</div>,
        },
    ]

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(3)
    const [pageSize, setPageSize] = useState(3)
    const [params, setParams] = useState(new URLSearchParams())
    const [teachers, setTeachers] = useState(initLists)
    const [name, setName] = useState('')


    const [lowAge, setLowAge] = useState('');
    const [highAge, setHighAge] = useState('');
    const [lowPrice, setLowPrice] = useState('');
    const [highPrice, setHighPrice] = useState('');
    const [gender, setGender] = useState('');
    const [experience, setExperience] = useState('');
    const [teachMethod, setTeachMethod] = useState('');
    const [stars, setStars] = useState('');
    const [level, setLevel] = useState('');


    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter'){
            let newParams = new URLSearchParams()
            params.forEach((value, key) => {
                newParams.append(key, value)
            })
            newParams.set('name', name)
            setParams(newParams)
        }
    }

    const delParams = () => {
        setParams(new URLSearchParams())
        setLowAge('')
        setHighAge('')
        setLowPrice('')
        setHighPrice('')
        setGender('')
        setExperience('')
        setTeachMethod('')
        setStars('')
        setLevel('')
    }

    useEffect(() => {
        console.log(params.toString())
        params.set('page', page.toString())
        params.set('limit', pageSize.toString())
        searchTeacher(params.toString())
            .then((res) => {
                setTeachers(res.data)
                setPage(res.infoPage.currentPage)
                setTotalPages(res.infoPage.totalPages)
                setPageSize(res.infoPage.pageSize)
            })     
    }, [params, page])

    const handleSubmit = () => {
        let newParams = new URLSearchParams('')
        params.forEach((value, key) => {
            newParams.set(key, value)
        })
        newParams.set('low_age', lowAge),
        newParams.set('high_age', highAge),
        newParams.set('low_price', lowPrice),
        newParams.set('high_price', highPrice),
        newParams.set('gender', gender),
        newParams.set('experience', experience),
        newParams.set('teach_method', teachMethod),
        newParams.set('star_average', stars)
        newParams.set('level', level)
        setParams(newParams)
    }

    

    return (
            <Wrapper>
                <Container>
                    <Panel>
                        <Row gutter={[16, 16]}>
                            <Col className='col-left' span={15}>
                            <Wrapper1>
                                <ListTop>
                                    <Dropdown menu={{ items }}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <div className='h-7 flex rounded-lg border border-solid items-center gap-2 px-4 cursor-pointer'>
                                            <SortAscendingOutlined /> <span>{t('content.sort_by')}</span>
                                            </div>
                                        </a>
                                    </Dropdown>
                                    <Input 
                                        placeholder='Search by name...' 
                                        onChange={handleChange} 
                                        onKeyDown={handleKey}
                                        style={{ width: 300 }} 
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <BiSearch />
                                            </InputAdornment>
                                        }
                                    />
                                    <IconButton onClick={delParams}>
                                        <BiRefresh />
                                    </IconButton>
                                </ListTop>
                                {teachers.length > 0 && <TeacherList teachers={teachers} />}
                                {
                                    <WrapperPagin>
                                        <Pagination count={totalPages} variant="outlined" page={page} onChange={(e, value) => {setPage(value)}} />
                                    </WrapperPagin>
                                }
                            </Wrapper1>
                            </Col>
                            <Col span={1}></Col>
                            <Col className='col-right' span={8}>
                                <Wrapper2>
                                    <Form className='form' >
                                        <Divider><ImFilter /></Divider>
                                        <Form.Item label={t('content.level')} style={{ maxWidth: 200 }}>
                                            <Select
                                                defaultValue={'0'}
                                                options={
                                                    Array(8)
                                                        .fill(0)
                                                        .map((item, index) => {
                                                            const age = index + 0
                                                            return {
                                                                value: age.toString(),
                                                                label: age.toString(),
                                                            }
                                                        }
                                                    )
                                                }
                                                onSelect={(value) => {
                                                    setLevel(value)
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item label={t('content.experience')} style={{ maxWidth: 200 }}>
                                            <Select
                                                defaultValue={'0'}
                                                options={
                                                    Array(10)
                                                        .fill(0)
                                                        .map((item, index) => {
                                                            const age = index + 0
                                                            return {
                                                                value: age.toString(),
                                                                label: age.toString()+' '+t('content.year'),
                                                            }
                                                        }
                                                    )
                                                }
                                                onSelect={(value) => {setExperience(value)}}
                                            />
                                        </Form.Item>
                                        <Form.Item label={t('content.price')} >
                                        </Form.Item>
                                        <Row gutter={[16, 16]}>
                                            <Col span={10}>
                                            <Form.Item label={t('content.from')} colon>
                                                <InputNumber 
                                                    min={0}
                                                    style={{ width: '120%' }} 
                                                    prefix={<MdOutlineAttachMoney className='site-form-item-icon' />}
                                                    onChange={(value) => {
                                                        if (value != null){
                                                            setLowPrice(value.toString())
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                            <Form.Item label={t('content.to')} colon >
                                                <InputNumber 
                                                    min={0}
                                                    style={{ width: '120%' }} 
                                                    prefix={<MdOutlineAttachMoney className='site-form-item-icon' />} 
                                                    onChange={(value) => {
                                                        if (value != null){
                                                            setHighPrice(value.toString())
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item label={t('content.age')} >
                                        </Form.Item>
                                        <Row gutter={[16, 16]}>
                                            <Col span={10}>
                                                <Form.Item label={t('content.from')} colon >
                                                    <InputNumber 
                                                        min={15}
                                                        max={80}
                                                        style={{ width: '120%' }} 
                                                        prefix={<MdOutlinePersonPinCircle className='site-form-item-icon' />}
                                                        onChange={(value) => {
                                                            if (value != null){
                                                                setLowAge(value.toString())
                                                                if(value > Number(highAge) || highAge == '') setHighAge(value.toString())
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item label={t('content.to')} colon >
                                                    <InputNumber 
                                                        min={15}
                                                        max={80}
                                                        style={{ width: '120%' }} 
                                                        prefix={<MdOutlinePersonPinCircle className='site-form-item-icon' />}
                                                        onChange={(value) => {
                                                            if (value != null){
                                                                setHighAge(value.toString())
                                                                if(value < Number(lowAge) || lowAge == '') setLowAge(value.toString())
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item label={t('content.rating')} >
                                            <Rate 
                                                onChange={(value) => {
                                                    setStars(value.toString())
                                                }
                                            }/>
                                        </Form.Item>
                                        <Form.Item label={t('content.gender')} style={{ maxWidth: 200 }}>
                                            <Select
                                                options={[
                                                {
                                                    value: 'male',
                                                    label: t('content.male'),
                                                },
                                                {
                                                    value: 'female',
                                                    label: t('content.female'),
                                                },
                                                {
                                                    value: '',
                                                    label: t('content.null'),
                                                },
                                                ]}
                                                onSelect={(value) => {
                                                    setGender(value)
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item label={t('content.teach_method')} style={{ maxWidth: 300 }}>
                                            <Select
                                                options={
                                                    ["online", "offline1", "offline2"]
                                                    .map((item, index) => {
                                                        return {
                                                            value: item,
                                                            label: t(`content.${item}`),
                                                        }
                                                    })}
                                                onSelect={(value) => {
                                                    setTeachMethod(value)
                                                }}
                                            />
                                        </Form.Item>
                                        <Button variant="contained" onClick={handleSubmit}>{t('content.filter')}</Button>
                                    </Form>
                                </Wrapper2>
                            </Col> 
                        </Row>
                    </Panel>
                </Container>
            </Wrapper>
    )
}
  
const Wrapper = styled.div``
const Panel = styled.div`
    margin-top: 20px;

    .col-left {
        border: 1px solid;
        border-radius: 8px;
        padding: 20px 0;
    }
    .col-right {
        max-height: 650px;
        border: 1px solid;
        border-radius: 8px;
        padding: 20px 0;
    }
`

const Wrapper1 = styled.div``

const ListTop = styled.div`
    display: flex;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 15px;
    justify-content: space-between;
    & > button {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-right: 20px
    }
`

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-height: 700px;
    overflow: auto;
`
const Person = styled.div`
    border: 1px solid;
    border-radius: 8px;
    display: flex;

    .avatar-icon {
        margin-top: 10px;
        margin-left: 10px;
        font-size: 80px;
    }
`

const PersonInfo = styled.div`
    flex: 1%;
    padding: 0 20px;

    .header {
        display: flex;
        align-items: center;
    }
    .header .fullname {
        margin-left:20px;
    }
    .header .rating {
        margin-left: 100px;
        float:right;
        justify-content: space-between;
    }
    .personal {

    }
    .other {
        margin-top: 55px
    }

`
const WrapperPagin = styled.div`
    flex: 1%;
    padding: 0 10px; 
    margin-top: 20px;  
    text-align: center;
`


const Wrapper2 = styled.div`
    .form {
        display: flex;
        flex-direction: column;
        // margin-top: 25%;
    }

    .ant-form-item {
        margin-left: 20px
    }

    .ant-form-item-label {
        text-align: start;
    }

    .ant-form-item-label>label {
        font-size: 15px;
    }


`

export default SearchPage
  

