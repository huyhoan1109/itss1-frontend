import ScrollButton from './components/ScrollButton';
import i18n from './translation/i18n';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PublicRouter from './routes/PublicRouter'
import PrivateRouter from './routes/TeacherRouter';
import AuthProvider from './contexts/AuthProvider';
import AdminRouter from './routes/AdminRouter';
import TeacherRouter from './routes/TeacherRouter';


const queryClient = new QueryClient()
const App = () => {
    return (
        <div>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <I18nextProvider i18n={i18n}>
                        <PublicRouter />
                        <AdminRouter />
                        <TeacherRouter />
                        <ScrollButton />
                    </I18nextProvider>
                </QueryClientProvider>
            </AuthProvider>
        </div>
    )
}

export default App