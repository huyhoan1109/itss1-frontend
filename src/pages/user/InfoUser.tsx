import { routePath } from '../../routes/routePath';
import { useQuery } from '@tanstack/react-query';
import { Api } from '../../services/api';  
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import useAuth from '../../hooks/useAuth';

const InfoUserPage = () => {
    const {auth} = useAuth()
    const [info, setInfo] = useState<any>({})
    const { isLoading, error, data } = useQuery({
        queryKey: ['userInfo'],
        queryFn: () => 
            Api.request({
                method: 'GET',
                url: routePath.user.base,
                headers: {
                    'Content-Type': 'application-json',
                    Authorization: `Bearer ${auth.token}`
                },
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

export default InfoUserPage