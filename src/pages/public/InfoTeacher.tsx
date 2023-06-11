import {Link} from 'react-router-dom'
import { routePath } from '../../routes/routePath';
import { useQuery } from '@tanstack/react-query';
import { Api } from '../../services/api';  
import { useParams, redirect } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';

const InfoTeacherPage = () => {
    const params = useParams()
    const [info, setInfo] = useState<any>({})
    const { isLoading, error, data } = useQuery({
        queryKey: ['teacherInfo', params.id],
        queryFn: () => 
            Api.request({
                method: 'GET',
                url: routePath.teacher.base + `/${params.id}`
            })
    })

    useEffect(() => {
        if (data?.data?.data) setInfo(data.data.data)
    }, [data])

    return (
        <Layout>
            
        </Layout>
    );
};

export default InfoTeacherPage