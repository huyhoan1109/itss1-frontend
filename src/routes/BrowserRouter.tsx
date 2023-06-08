import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import NotFoundPage from '../pages/404'
import LoginPage from '../pages/auth/Login'
import SignUpPage from '../pages/auth/SignUp'
import HomePage from '../pages/Home'
import { routePath } from './routePath'
import SearchPage from '../pages/Search'

const BrowserRouter = () => {
  const router = createBrowserRouter([
    {
      path: routePath.home,
      element: (
        <Layout>
          <HomePage />
        </Layout>
      ),
    },
    {
      path: routePath.login,
      element: (
        <Layout>
          <LoginPage />
        </Layout>
      ),
    },
    {
      path: routePath.signup,
      element: (
        <Layout>
          <SignUpPage />
        </Layout>
      ),
    },
    {
        path: routePath.searchTeacher,
        element: (
          <Layout>
            <SearchPage />
          </Layout>
        ),
      },
    {
      path: routePath.notFound,
      element: <NotFoundPage />,
    },
  ])

  return <RouterProvider router={router} />
}

export default BrowserRouter