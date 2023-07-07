import {Link} from 'react-router-dom'
import { routePath } from '../../routes/routePath';
import { useQuery } from '@tanstack/react-query';
import { Api } from '../../services/api';  
import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import TimeTables from '../../components/TimeTable/TimeTables'
import Comments from '../../components/Comments/Comments';
import useComment from '../../hooks/useComment';
import Container from '../../components/Container';
import { Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next';
import RenderAvatar from '../../components/RenderAvatar';
import useAuth from '../../hooks/useAuth';
import { HomeOutlined, MailOutline, PhoneOutlined } from '@mui/icons-material';

const InfoTeacherPage = () => {
    const {t} = useTranslation()
    const params = useParams()
    const navigate = useNavigate();
    const {isPopUp, setIsPopUp} = useComment()
    const [matching, setMatching] = useState<any>({})
    const [info, setInfo] = useState<any>({})
    const {auth} = useAuth()
    const { data } = useQuery({
        queryKey: ['teacherInfo', params.id],
        queryFn: () => 
            Api({
                method: 'GET',
                url: routePath.teacher.view(params.id||"")
            })
    })

    useEffect(() => {
        Api({
            method: "GET",
            url: routePath.user.infoMatch(params.id||""),
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
        }).then((res) => {
            setMatching(res.data.data)
        })
    }, [])

    useEffect(() => {
        if (data?.data?.data) setInfo(data.data.data)
        return () => {    
        }
    }, [data])

    const showComment = () => {
        setIsPopUp(true)
    }

    const saveClipBoard = (value: string) => {
        navigator.clipboard.writeText(value)
        alert("Copy: "+value)
    }

    const convertToDate = (date: Date) => {
        let dat = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        return dat;     
    }

    const handleSignup = () => {
        Api({
            method: "POST",
            url: routePath.user.matching,
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            data: {
                teacherID: params.id,
                info: convertToDate(new Date())
            }
        }).then((res) => {
            setMatching(res.data.data)
        })
    }

    return (
        <Layout>
            <div className='h-700 w-full bg-blue-200'>
            <Container className='py-32 flex items-end justify-center bg-blue-200'>
                <div className='w-[85%] h-300 rounded-3xl p-4 shadow-md bg-white flex items-start gap-6'>
                    <div style={{width: 400, marginLeft: 30, marginTop: 30}}> 
                        <RenderAvatar avatar={info.avatar} />
                    </div>
                    <div className='flex flex-col gap-2' style={{marginTop: 30}}>
                        <div className='flex items-center '>
                            <div className='flex items-center gap-x-20'>
                                <h1 style={{fontSize: 30}} className='font-semibold text-yellow-700 text-2xl'>{t('content.teacher')}</h1>
                                <h1 style={{fontSize: 30}} className='font-semibold text-black text-2xl'>{info.name}</h1>
                            </div>
                            <div style={{marginLeft: 300}}>
                                <div className="flex items-center mt-2 mb-4">
                                    {
                                        [1, 2, 3, 4, 5].map((star, index) => {
                                            if (star <= info.star_average){
                                            return (
                                                <svg key={index} className="mx-1 w-4 h-4 fill-current text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                            )}
                                            else 
                                            return (
                                                <svg key={index} className="mx-1 w-4 h-4 fill-current text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    <div className='w-[75%]'>
                        <div style={{fontSize: 18}} className='flex gap-x-2'>
                            <HomeOutlined className='text-purple-800 mt-1' />
                            <div className='font-semibold text-purple-700'>{info.address}</div>
                        </div>
                        <div style={{fontSize: 18}} className='flex gap-x-2'>
                            <PhoneOutlined className='cursor-pointer' onClick={() => saveClipBoard(info.phone)}/>
                            <button className='astext text-md text-blue-700' onClick={() => saveClipBoard(info.phone)}>{info.phone}</button>
                        </div>
                        <div style={{fontSize: 18}} className='flex gap-x-2'>
                            <MailOutline className='cursor-pointer' onClick={() => saveClipBoard(info.email)}/>
                            <button className='astext text-md text-orange-700' onClick={() => saveClipBoard(info.email)}>{info.email}</button>
                        </div>
                    </div>
                    <div className='flex gap-10'  style={{marginTop: 10}}>
                        <div style={{fontSize: 18}}>{t('content.age')}: {info.age} </div>
                        <div style={{fontSize: 18}}>{t('content.experience')}: {info.experience}</div>
                        <div style={{fontSize: 18}}>{t('content.gender')}: {t(`content.${info.gender}`)}</div>
                        <div style={{fontSize: 18}}>{t('content.price')}: {info.price}VNĐ/45m</div>
                        <div style={{fontSize: 18}}>{t('content.signup_date')}: {convertToDate(new Date(info.createdAt))}</div>
                    </div>
                    <div className='flex items-start justify-between'  style={{marginTop: 10}}>
                        <div className='flex items-center gap-2'>
                            <h1>{t('content.teach_method')}:</h1>
                            <div className='flex flex-wrap items-center gap-4'>
                                {info.teach_method1 != null ? (
                                <div style={{fontSize: 18}} className='bg-green-700 text-md p-2 rounded text-white shadow-sm shadow-gray'>
                                    {t(`content.${info.teach_method1}`)}
                                </div>
                                ) : null}

                                {info.teach_method2 != null ? (
                                <div style={{fontSize: 18}} className='bg-purple-700 text-md p-2 rounded text-white shadow-sm shadow-gray'>
                                    {t(`content.${info.teach_method2}`)}
                                </div>
                                ) : null}

                                {info.teach_method3 != null ? (
                                <div style={{fontSize: 18}} className='bg-purple-700 text-md p-2 rounded text-white shadow-sm shadow-gray'>
                                    {t(`content.${info.teach_method3}`)}
                                </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-start gap-6' style={{marginTop: 10}}>
                        <h1 style={{fontSize: 18}}>{t('content.certificate')}:</h1>
                        <ul className='list-disc'>
                            {info.certificate1 != null ? (
                                <li style={{fontSize: 18}} className='flex items-center gap-2 w-full justify-between'>
                                    {info.certificate1} <CheckOutlined className='text-green-600' />
                                </li>
                                ) : null}
                            {info.certificate2 != null ? (
                                <li style={{fontSize: 18}} className='flex items-center gap-2 w-full justify-between'>
                                    {info.certificate2} <CheckOutlined className='text-green-600' />
                                </li>
                                ) : null}
                            {info.certificate3 != null ? (
                                <li style={{fontSize: 18}} className='flex items-center gap-2 w-full justify-between'>
                                    {info.certificate3} <CheckOutlined className='text-green-600' />
                                </li>
                                ) : null}
                        </ul>
                    </div>
                    <div className='w-[75%]'>
                        <span style={{fontSize: 18}}>{info.detail}</span>
                    </div>

                    <div className='w-[75%] flex items-center gap-36' style={{marginTop: 30, marginBottom: 30}}>
                        
                        <Button size='large' style={{fontSize: 18}} className='w-fit bg-blue-600 text-white !px-10' onClick={() => navigate(-1)}>
                        {t('content.go_back')}
                        </Button>

                        {auth?.user && ( 
                            <div>
                            {!matching?.status &&
                                <Button size='large' style={{fontSize: 18}} className='w-fit bg-blue-600 text-white !px-10' onClick={handleSignup}>
                                {t('content.signup')}
                                </Button>
                            }
                            {matching?.status == 'wait' &&
                                <Button size='large' style={{fontSize: 18}} className='w-fit bg-purple-600 text-white !px-10'>
                                    {t('content.signup_wait')}
                                </Button>
                            }
                            {matching?.status == 'approve' &&
                                <Button size='large' style={{fontSize: 18}} className='w-fit bg-green-600 text-white !px-10'>
                                    {t('content.approve')}
                                </Button>
                            }
                            {matching?.status == 'refuse' &&
                                <Button size='large' style={{fontSize: 18}} className='w-fit bg-red-600 text-white !px-10'>
                                    {t('content.refuse')}
                                </Button>
                            }
                            </div>
                        )}

                        <Button size='large' style={{fontSize: 18}} className='w-fit bg-blue-600 text-white !px-10'  onClick={showComment}>
                        {t('show.comment')}
                        </Button>
                    </div>
                    </div>
                </div>
            </Container>
            {
                isPopUp &&
                <Comments />
            }
            </div>
        </Layout>
    );
};

export default InfoTeacherPage