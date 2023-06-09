import {Link} from 'react-router-dom'
import { routePath } from '../../routes/routePath';
import { useQuery } from '@tanstack/react-query';
import { Api } from '../../services/api';  

const LoginPage = () => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            Api.request({
                method: 'GET',
                url: routePath.infoTeacher,
                params: {
                    id
                },
            }),
    })

    return (
        <div></div>
    );
};

export default LoginPage