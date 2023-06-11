import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AuthProvider from './contexts/AuthProvider';

import i18n from './translation/i18n';
import { I18nextProvider } from 'react-i18next';
import ScrollButton from './components/ScrollButton';

import PublicRoutes from './routes/PublicRoutes';
import UserRoutes from './routes/private/UserRoutes';
import AdminRoutes from './routes/private/AdminRoutes';
import TeacherRoutes from './routes/private/TeacherRoutes';
import useAuth from './hooks/useAuth';
import { routePath } from './routes/routePath';


const queryClient = new QueryClient()

const App = () => {
    const {auth} = useAuth()
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18n}>
                    <BrowserRouter>
                        <PublicRoutes />
                        <UserRoutes />
                        <AdminRoutes />
                        <TeacherRoutes /> 
                    </BrowserRouter>
                    <ScrollButton />
                </I18nextProvider>
            </QueryClientProvider>
        </div>
    )
}

export default App