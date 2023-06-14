import { useQuery } from "@tanstack/react-query"
import { useEffect, useState, RefObject, useRef, useCallback } from "react"
import { Api } from "../../services/api"
import { routePath } from "../../routes/routePath"
import { useParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { Select, Input, notification } from "antd"
import {FaRegPaperPlane} from "react-icons/fa"
import { AiFillDelete, AiOutlineRedo } from "react-icons/ai"
import './Comments.css'
import { useTranslation } from "react-i18next"
import useComment from "../../hooks/useComment"
import user_image from '../../assets/images/user.png'

const Comments = () => {
    const {t, i18n} = useTranslation()
    const params = useParams()
    const [y_comment, setYComment] = useState('')
    const [star, setStar] = useState('1')
    const [fix_id, setFixId] = useState('')
    const [comments, setComments] = useState<any>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const {auth, setAuth} = useAuth()
    const popRef:RefObject<any> = useRef()
    const {isPopUp, setIsPopUp} = useComment()
    const [rerender, setRerender] = useState(false);

    const handleClickOutside = (e: any) => {
        if (popRef.current && !popRef.current.contains(e.target)){
            setIsPopUp(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isPopUp])

    const { TextArea } = Input;

    const { isLoading, error, data } = useQuery({
        queryKey: ['teacherComment', currentPage, params.id],
        queryFn: () =>
            Api.request({
                method: 'GET',
                url: routePath.comment.teacher(params.id||""),
                params: {
                    page: currentPage,
                    limit: 10,
                },
            }),
    })
    
    const handleSubmit = async () => {
        if (auth?.token && y_comment != "") {
            if (fix_id == '') {
                Api({
                    method: 'post',
                    url: routePath.comment.teacher(params.id||""),
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    },
                    data: {
                        content: y_comment,
                        star
                    }
                }).then(() => {
                    notification.success({
                        duration: 3,
                        message: t('message.created_ok')
                    })
                }).catch(() => {
                    notification.error({
                        duration: 3,
                        message: t('message.error')
                    })
                    setAuth({})
                })
            } else {
                Api({   
                    method: 'post',
                    url: routePath.comment.view(fix_id),
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    },
                    data:{
                        content: y_comment,
                        star 
                    }
                }).then(() => {
                    notification.success({
                        duration: 3,
                        message: t('message.updated_ok')
                    })
                }).catch(() => {
                    notification.error({
                        duration: 3,
                        message: t('message.error')
                    })
                })
                setFixId('')
            }
        } else {
            notification.error({
                duration: 3,
                message: t('message.error')
            })
        }
        setRerender(!rerender)
    }

    const chooseComment = (value:any) => {
        setYComment(value.content)
        setStar(value.star)
        setFixId(value.id)
    }

    const delComment = (value:any) => {
        if (value?.id){
            Api({   
                method: 'delete',
                url: routePath.comment.view(value.id),
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
            }).then(() => {
                notification.success({
                    duration: 3,
                    message: t('message.deleted_ok')
                })
            }).catch(() => {
                notification.error({
                    duration: 3,
                    message: t('message.error')
                })
            })
        }
        setRerender(!rerender)
    }

    useEffect(() => {
        if (data?.data?.data) {
            setComments(data.data.data)
        }
    },[data, rerender])

    return (
        <div ref={popRef} className="comments-section" id="comments-section">
            <div className="popup">
                <div className="show-comment">
                    {
                        comments.map((value:any, idx:any) => {
                            return (
                                
                                <div key={idx} role="button" className="row-container">
                                    <div className="row-left">
                                        <div className="comment">
                                        <img 
                                            src={value.avatar || user_image} 
                                            width="50px" 
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null; // prevents looping
                                                currentTarget.src = user_image
                                            }}
                                        />
                                        <div className="info">
                                            <span className="username">{value.name}</span>
                                            <p className="content">{value.content}</p>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="row-center">
                                        <div className="flex justify-center items-center">
                                        <div className="flex items-center mt-2 mb-4">
                                            {
                                                [1, 2, 3, 4, 5].map((star, index) => {
                                                    if (star <= value.star){
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
                                    <div className="row-right">
                                        {
                                            value?.userID == auth?.user?.id && (
                                                <div>
                                                    <button style={{marginLeft: 25, marginRight: 25}} onClick={() => chooseComment(value)} > <AiOutlineRedo size={25}/> </button>
                                                    <button onClick={() => delComment(value)}> <AiFillDelete size={25}/> </button>
                                                </div>
                                            )
                                        }
                                        
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {   
                    auth?.user && 
                    (
                        <div className="input-container" style={{margin: "auto"}}>
                            <div className="input-left ">
                            {
                                i18n.language == 'jp' &&
                                <TextArea 
                                    placeholder="コメントを入力" 
                                    style={{fontSize: 18}}
                                    autoSize={{ minRows: 4, maxRows: 5 }}
                                    value={y_comment}
                                    onChange={(e) => setYComment(e.target.value)}
                                />
                            }
                            {
                                i18n.language == 'vi' &&
                                <TextArea 
                                    placeholder="Nhập bình luận của bạn"
                                    style={{fontSize: 18}}
                                    autoSize={{ minRows: 4, maxRows: 5 }}
                                    value={y_comment}
                                    onChange={(e) => setYComment(e.target.value)}
                                />
                            }
                            </div>
                            <div className="input-center">
                                <div className="rating-input">
                                <select 
                                    className="select-star" 
                                    value={star} 
                                    onChange={(e) => {setStar(e.target.value)}}
                                >
                                    <option value={"1"} label="1" onClick={() => setStar("1")}/>
                                    <option value={"2"} label="2" onClick={() => setStar("2")}/>
                                    <option value={"3"} label="3" onClick={() => setStar("3")}/>
                                    <option value={"4"} label="4" onClick={() => setStar("4")}/>
                                    <option value={"5"} label="5" onClick={() => setStar("5")}/>
                                </select>
                                </div>
                                <button className="comment-button" onClick={handleSubmit}>
                                    <div style={{textAlign: "center"}}>
                                        <FaRegPaperPlane />
                                    </div>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
  
export default Comments
  
