import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18n from './translation/i18n';
import { I18nextProvider } from 'react-i18next';
import ScrollButton from './components/ScrollButton';

import AppRoutes from './routes/AppRoutes';

const queryClient = new QueryClient()

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                        <AppRoutes />
                </BrowserRouter>
                <ScrollButton />
            </I18nextProvider>
        </QueryClientProvider>
    )
}

export default App