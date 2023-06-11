import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Api } from "../../services/api"
import { routePath } from "../../routes/routePath"
import useAuth from "../../hooks/useAuth"

const StudentListPage = () => {
    const {auth} = useAuth()
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

    return (
        <div>

        </div>
    )
}

export default StudentListPage