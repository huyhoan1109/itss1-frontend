import { DeleteOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Modal, Pagination, Table, Input, notification } from 'antd'
import { AiFillEye, AiOutlineClose } from 'react-icons/ai'
import { TbLock, TbLockOpen } from 'react-icons/tb'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Api } from '../../services/api'
import RenderAvatar from '../../components/RenderAvatar'
import { useTranslation } from 'react-i18next'
import useAuth from '../../hooks/useAuth'
import { routePath } from '../../routes/routePath'
import Logo from "../../assets/images/logo.png";
import TimeChart from '../../components/TimeChart'

const AdminPage = () => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {auth, setAuth} = useAuth() 
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [infoPage, setInfoPage] = useState<any>({})
    const [user, setUser] = useState<any>({})
    const [tab, setTab] = useState('teacher')
    const [name, setName] = useState<string>('')
    const [infos, setInfos] = useState<any>([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentPage, setCurrentPage] = useState<number>(1)
    const { search } = useLocation()
    const tabRef = useMemo(() => 
        new URLSearchParams(search).get('tab')
    , [search])

    const TabComponent = ({ tab, title }: { tab: string; title: string }) => {
        return (
        <div
            className='h-12 w-full flex items-center justify-center rounded-lg cursor-pointer bg-white font-bold text-xl border-[2px] border-solid border-gray-800 mb-6'
            style={{ borderColor: tab == tabRef ? '#db2323' : '' }}
            onClick={() => { 
                setSearchParams({tab})
                setTab(tab)
            }}
        >
            {title}
        </div>
        )
    }

    const getByTab = (name:any, page:any, tab:any) => {
        if (tab === 'student' || tab === 'teacher') {
            Api({
                method: 'GET',
                url: `admin/${tab}`,
                params: {
                    name,
                    page,
                    limit: 5,
                }
            }).then(res => {
                setInfos(res.data.data)
                setInfoPage(res.data.infoPage)
            })
        } else {
            Api({
                method: 'GET',
                url: `admin/${tab}`
            }).then(res => {
                setInfos(res.data.data)
            })
        }
    }

    useEffect(() => {
        getByTab(name, currentPage, tab)
    }, [name, currentPage, tab])

    return (
        <div className='w-full border border-solid border-gray-800 flex flex-col'>
        <div className='h-20 flex items-center justify-between px-8 border-b border-solid border-gray-800'>
            <div className='gap-2 admin-logo w-52 h-15 bg-gray-200 flex items-center justify-center border border-solid border-gray-800'>
                <div className='font-medium text-lg text-purple-500'>
                    SagaSuy <span className='text-red-600'>Admin</span>
                </div>
                <Link 
                    to={routePath.home}
                >
                    <img src={Logo} alt="logo" width="50px" />
                </Link>
            </div>
            <div className='flex items-center gap-5'>
                <a 
                    onClick={() => {
                        setAuth({})
                        navigate(routePath.auth.login)
                    }
                }
                >ログアウト</a>
                <RenderAvatar avatar={auth?.user?.avatar} size='small' />
            </div>
        </div>
        <div className='flex-1 grid-cols-[1fr_5fr] grid'>
            <div style={{overflow: "hidden", height: 1000}} className='border-r border-solid border-gray-800 bg-gray-300 py-10 px-4'>
                <TabComponent tab={'teacher'} title={'教師管理'} />
                <TabComponent tab={'student'} title={'学生管理'} />
                <TabComponent tab={'matching'} title={'統計'} />
            </div>
            <div className='py-6 px-5'>
                {(tab == 'teacher' || tab == 'student') &&
                <div> 
                    <Input
                        size='large'
                        type='text'
                        className='mx-10 h-8 rounded-lg bg-white-200 w-7/12 pl-3 text-lg'
                        placeholder='名前を入力して探す'
                        onChange={(e) => {
                            setName(e.target.value)
                            console.log(e.target.value)
                        }}
                    />
                    <table className='w-[80%] mt-6 border' style={{border: "1px solid black", borderCollapse: "collapse", textAlign: "center", marginLeft: "auto", marginRight: "auto"}}>
                        <tr>
                            <th style={{fontSize: 25, border: "1px solid black", borderCollapse: "collapse"}}>ID</th>
                            <th style={{fontSize: 25, border: "1px solid black", borderCollapse: "collapse"}}>名前</th>
                            {tab == 'teacher' &&
                            <th style={{fontSize: 25, border: "1px solid black", borderCollapse: "collapse"}}>点</th>
                            }
                            <th style={{fontSize: 25, border: "1px solid black", borderCollapse: "collapse"}}>様子</th>
                            <th style={{fontSize: 25, border: "1px solid black", borderCollapse: "collapse"}}>機能</th>
                        </tr>
                        {infos.map((value: any, idex: any) => (
                        <tr key={idex}>
                            <td style={{fontSize: 25, border: "1px solid black", borderCollapse: "collapse"}}>{value.id}</td>
                            <td style={{fontSize: 25, border: "1px solid black", borderCollapse: "collapse"}}>{value.name}</td>
                            {tab == 'teacher' &&
                            <td style={{fontSize: 25, border: "1px solid black", borderCollapse: "collapse"}}>{value.star_average == 0 ? 3: value.star_average}</td>
                            }
                            <td style={{fontSize: 25, border: "1px solid black", borderCollapse: "collapse"}}>
                                {value.isBlock == 0 && <div style={{color: "green"}}>オンライン</div>}
                                {value.isBlock != 0 && <div style={{color: "red"}}>ブロック</div>}
                            </td>
                            <td style={{border: "1px solid black", borderCollapse: "collapse"}}>
                            <div style={{fontSize: 25}} className='flex gap-2 justify-center items-center'>
                                <DeleteOutlined 
                                    onClick={() => {
                                        Api.delete(
                                        `${routePath.admin.base}/user/${value.id}`
                                        ).then(() => {getByTab(name, currentPage, tab)}
                                        ).catch(() => {
                                            notification.error({
                                                message: t('message.error')
                                            })
                                        })
                                    }}
                                />
                                <AiFillEye 
                                    onClick={() => {
                                        setUser(value)
                                        setIsModalOpen(true)
                                    }}
                                />
                                {value.isBlock == 0 && 
                                    <TbLockOpen 
                                        onClick={() => {
                                            Api.post(
                                            `${routePath.admin.base}/user/${value.id}`,{
                                                isBlock: 1
                                            }
                                            ).then(() => {getByTab(name, currentPage, tab)}
                                            ).catch(() => {
                                                notification.error({
                                                    message: t('message.error')
                                                })
                                            })
                                        }}
                                    />
                                }
                                {value.isBlock != 0 && 
                                    <TbLock 
                                        onClick={() => {
                                            console.log(value.id)
                                            Api.post(
                                            `${routePath.admin.base}/user/${value.id}`,{
                                                isBlock: 0
                                            }
                                            ).then(() => {getByTab(name, currentPage, tab)}
                                            ).catch(() => {
                                                notification.error({
                                                    message: t('message.error')
                                                })
                                            })
                                        }}
                                    />
                                }
                            </div>
                            </td>
                        </tr>
                        ))}
                    </table>
                    <div className='flex justify-center items-center my-6'>
                        <Pagination
                            current={currentPage}
                            pageSize={5}
                            onChange={(page, pageSize) => setCurrentPage(page)}
                            total={+infoPage.totalPages * 5}
                            className='mx-auto'
                        />
                    </div>
                </div>
                }
                {tab == 'matching' && 
                    <TimeChart data={infos}/>
                }
            </div>
        </div>
        <Modal open={isModalOpen} footer={[]} closeIcon={<AiOutlineClose />} onCancel={() => setIsModalOpen(false)}>
            <div className='bg-white p-8'>
            <RenderAvatar avatar={user.avatar}/>
            <div className='my-4 text-lg font-bold'>ID:{user.id}</div>
            <div className='my-4 text-lg font-bold'>ID:{t(`content.${user.role}`)}</div>
            <div className='my-4 text-lg font-bold'>名前:{user.name}</div>
            {user.role == 'teacher' &&
            <div className='my-4 text-lg font-bold'>SCORE:{user.star_average}</div>
            }
            <div className='my-4 text-lg font-bold'>電話番:{user.phone}</div>
            <div className='my-4 text-lg font-bold'>メール:{user.email}</div>
            <div className='my-4 text-lg font-bold'>
                様子：
                {user.isBlock == 0 && <span style={{color: 'green'}}>オンライン</span>}
                {user.isBlock != 0 && <span style={{color: 'red'}}>ブロック</span>}
                </div>
            <div className='my-4 text-lg font-bold'>アカウント作成日:{new Date(user.createdAt).toDateString()}</div>
            </div>
        </Modal>
        </div>
    )
}

export default AdminPage