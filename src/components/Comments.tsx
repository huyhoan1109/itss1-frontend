import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Api } from "../services/api"
import { routePath } from "../routes/routePath"
import { useParams } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Comments = () => {
    const params = useParams()
    const [y_comment, setYComment] = useState('')
    const [star, setStar] = useState('1')
    const [fix_id, setFixId] = useState('')
    const [comments, setComments] = useState<any>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const {auth} = useAuth()

    const { isLoading, error, data } = useQuery({
        queryKey: ['teacherComment', currentPage, params.id],
        queryFn: () =>
            Api.request({
                method: 'GET',
                // url: routePath.public.commentTeacher+`${params.id}`,
                params: {
                    page: currentPage,
                    limit: 10,
                },
            }),
    })

    const handleSubmit = async () => {
        if (auth?.token) {
            if (fix_id == '') {
                Api.request({
                    method: 'POST',
                    url: routePath.comment.teacher+`${params.id}`,
                    headers: {
                        'Content-Type': 'application-json',
                        Authorization: `Bearer ${auth.token}`
                    },
                    data:{

                    }
                })
            } else {
                Api.request({   
                    method: 'POST',
                    url: routePath.comment.base+`${fix_id}`,
                    headers: {
                        'Content-Type': 'application-json',
                        Authorization: `Bearer ${auth.token}`
                    },
                    data:{

                    }
                })
            }
        }
    }

    useEffect(() => {
        if (data?.data?.data) setComments(data.data.data)
        return () => {
            
        }
    },[data])

    return (
        <div>

        </div>
    )
}
  
export default Comments
  
