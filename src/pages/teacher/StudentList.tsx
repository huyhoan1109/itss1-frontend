import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Api } from "../../services/api"
import { routePath } from "../../routes/routePath"
import useAuth from "../../hooks/useAuth"
import Layout from "../../components/Layout"

const StudentListPage = () => {
    const {auth} = useAuth()
    const [students, setStudents] = useState<any>([])
    const [infoPage, setInfoPage] = useState<any>({})
    const [currentPage, setCurrentPage] = useState<number>(1)
    const { isLoading, error, data } = useQuery({
        queryKey: ['studentList', currentPage],
        queryFn: () =>
            Api.request({
                method: 'GET',
                url: routePath.teacher.allStudents,
                headers: {
                    'Content-Type': 'application-json',
                    Authorization: `Bearer ${auth.token}`
                },
                params: {
                    page: currentPage,
                    limit: 10,
                },
            }),
    })

    useEffect(()=>{
        if (data?.data?.data) setStudents(data.data.data)
        return () => {
            
        }
    }, [data])

    return (
        <Layout>
            {!error && students.length > 0 && students.map(
                (value: any, index: any) => {
                    <div
                        key={index}
                        className='border border-solid gap-5 border-gray-700 p-5 rounded-3xl grid grid-cols-[10rem_1fr]'
                    >
                    </div>
                }
            )}
        </Layout>
    )
}

export default StudentListPage