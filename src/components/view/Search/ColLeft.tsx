import { useSearchParams } from "react-router-dom";
import { searchTeacher } from "../../../services/teacher";
import { ChangeEvent, KeyboardEvent, KeyboardEventHandler, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiUserCircle, BiSort, BiSearch, BiRefresh } from "react-icons/bi";

import styled from 'styled-components';
import { PaginationProps, Row, Col, Rate } from 'antd';
import { Button, Input, InputAdornment, IconButton, Pagination} from "@mui/material";

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

const ColLeft = () => {
    const initLists: Teacher[] = [];

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(3)
    const [pageSize, setPageSize] = useState(3)
    const [params, setParams] = useState(new URLSearchParams())
    const [teachers, setTeachers] = useState(initLists)
    const [name, setName] = useState('')

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
    }

    useEffect(() => {
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

    return (
        <Wrapper>
            <ListTop>
                <Button variant="contained" startIcon={<BiSort />}>
                    Sort
                </Button>
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
        </Wrapper>
    );
};

export default ColLeft


const Wrapper = styled.div``

const ListTop = styled.div`
    display: flex;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 15px;
    justify-content: center;
    & > button {
        display: flex;
        align-items: center;
        justify-content: space-between;
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