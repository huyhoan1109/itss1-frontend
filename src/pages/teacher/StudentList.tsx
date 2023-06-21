import { useEffect, useState, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { Api } from "../../services/api"
import { routePath } from "../../routes/routePath"
import useAuth from "../../hooks/useAuth"
import Layout from "../../components/Layout"
import RenderAvatar from "../../components/RenderAvatar"
import DotBadge from "../../components/DotBadge"
import { Pagination, Button, notification } from "antd"
import {
    CaretDownOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneFilled,
    SearchOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'
import { useTranslation } from "react-i18next"


const StudentListPage = () => {
    const {t, i18n} = useTranslation()
    const {auth} = useAuth()
    const [students, setStudents] = useState<any>([])
    const [infoPage, setInfoPage] = useState<any>({})
    const [currentPage, setCurrentPage] = useState<any>(1)
    const { refetch, error, data } = useQuery({
        queryKey: ['studentList', currentPage],
        queryFn: () =>
            Api.request({
                method: 'GET',
                url: routePath.teacher.allStudents,
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                params: {
                    page: currentPage,
                    limit: 10,
                },
            }),
    })

    useEffect(()=>{
        if (data?.data?.data) {
            setStudents(data.data.data)
            setInfoPage(data.data.infoPage)
        }
    }, [data])

    const handleStatus = (match_id:any, status:string) => {
        Api({
            method: 'POST',
            url: routePath.teacher.matching,
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            data: {
                match_id,
                status
            }
        }).then(() => {
            refetch()
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

    return (
        <Layout>
            <div className='bg-blue-200 p-10'>
                <div className='mx-auto max-w-7xl grid grid-cols-[2fr_1fr] gap-4'>
                    <div className='shadow-2xl p-6 bg-white rounded-2xl'>
                        <div className='justify-between items-center mb-6'>
                            <div className='flex flex-col gap-6'>
                                {!error && students.length > 0 && students.map(
                                    (value: any, index: any) => {
                                        return (
                                            <div
                                                key={index}
                                                className='w-full border border-solid gap-2 border-gray-700 p-5 rounded-3xl grid grid-cols-[10rem_1fr]'
                                            >
                                                <RenderAvatar avatar={value.avatar}/>
                                                <div className="flex">
                                                    <div className="w-[85%]">
                                                        <div className='flex justify-start text-xl gap-6'>
                                                            <div className='font-semibold text-yellow-700'>{t('content.student')}</div>
                                                            <div className='font-semibold text-black'>{value.name}</div>
                                                        </div>
                                                        <div className='flex justify-between items-center'>
                                                            <div className='flex items-center justify-start text-xl gap-6'>
                                                                <div>
                                                                    <button className='astext'>
                                                                        <div className='flex my-2 gap-2' onClick={() => {}}>
                                                                            <EnvironmentOutlined className='text-purple-800 mt-1' />
                                                                            <div className='text-sm text-purple-700'>{value.address}</div>
                                                                        </div>
                                                                    </button>
                                                                    <div className='flex my-2 gap-8 text-sm'>
                                                                        <div>{t('content.gender')}: {t(`content.${value.gender}`)}</div>
                                                                        <div>{t('content.email')}: {value.email}</div>
                                                                        <div>{t('content.phone')}: {value.phone}</div>
                                                                    </div>
                                                                    <div className='my-4 gap-8 text-sm'>
                                                                        <div> {t('content.signup_date')}: {value.info}</div>
                                                                    </div>
                                                                    {value.status == "wait" &&
                                                                        <div className='flex justify-start items-center gap-10'>
                                                                            <button onClick={() => {handleStatus(value.id, "approve")}} className="text-sm bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">{t('content.agree')}</button>
                                                                            <button onClick={() => {handleStatus(value.id, "refuse")}} className="text-sm bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">{t('content.refuse')}</button>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div 
                                                        style={{
                                                            marginTop: "auto",
                                                            marginBottom: "auto",
                                                            marginLeft: "10%"
                                                        }}
                                                    > 
                                                        <DotBadge status={value.status} /> 
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                            <div className='flex flex-col' style={{marginTop: 10}}>
                                {!error && students.length == 0 && (
                                    (   
                                        i18n.language == 'jp' && 
                                            <a>結果が見つかりませんでした</a>
                                    )||
                                    (   i18n.language == 'vi' &&
                                            <a>Không tìm thấy kết quả</a>
                                    )
                                )}
                                {!error && +infoPage?.totalPages > 0 && (
                                    <Pagination
                                        current={currentPage}
                                        pageSize={3}
                                        onChange={(page, pageSize) => setCurrentPage(page)}
                                        total={+infoPage?.totalPages * 3}
                                        className="mx-auto"
                                    />
                                )}
                                {+infoPage?.totalPages == 0 && (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default StudentListPage