import {Link} from 'react-router-dom'
import { routePath } from '../../routes/routePath';
import { useQuery } from '@tanstack/react-query';
import { Api } from '../../services/api';  
import { useParams, redirect } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import TimeTables from '../../components/TimeTable/TimeTables'
import Comments from '../../components/Comments/Comments';
import CommentProvider from '../../contexts/CommentProvider';
import useComment from '../../hooks/useComment';

const InfoTeacherPage = () => {
    const params = useParams()
    const {isPopUp, setIsPopUp} = useComment()
    const [info, setInfo] = useState<any>({})
    const { isLoading, error, data } = useQuery({
        queryKey: ['teacherInfo', params.id],
        queryFn: () => 
            Api.request({
                method: 'GET',
                url: routePath.teacher.view(params.id||"")
            })
    })

    useEffect(() => {
        if (data?.data?.data) setInfo(data.data.data)
        return () => {
            
        }
    }, [data])

    const showComment = () => {
        setIsPopUp(true)
    }

    return (
        <Layout>
            <button onClick={showComment}>Show comment</button>
            {
                isPopUp &&
                <Comments />
            }
        </Layout>
    );
};

export default InfoTeacherPage