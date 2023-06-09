import {Link} from 'react-router-dom'
import { routePath } from '../routes/routePath';
import { useQuery } from '@tanstack/react-query';
import { Api } from '../services/api';  
import { useParams, redirect } from 'react-router-dom';
import { useState } from 'react';

const InfoTeacherPage = () => {
    const params = useParams()
    const [info, setInfo] = useState<any>({})
    const { isLoading, error, data } = useQuery({
        queryKey: ['teacherInfo', params.id],
        queryFn: () => 
            Api.request({
                method: 'GET',
                url: routePath.baseTeacher + `/${params.id}`
            })
    })

    return (
        <div>
            
        </div>
    );
};

export default InfoTeacherPage