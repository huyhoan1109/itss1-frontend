import Layout from "../../components/Layout"
import useAuth from "../../hooks/useAuth"
import { useEffect, useState } from "react"
import { routePath } from "../../routes/routePath"
import { notification } from "antd"
import { Api } from "../../services/api"
import { useTranslation } from "react-i18next"

const SignUpPage = () => {
    const {t} = useTranslation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [c_password, setC_Password] = useState('')
    const [role, setRole] = useState('student')

    const handleSubmit = async () => {
        Api.request({
            method: 'POST',
            url: routePath.auth.signup,
            data:{
                name,
                email,
                phone,
                password,
                role
            }
        }).then(() => {
            notification.success({
                message:t('message.welcome_member')
            })
            setName('')
            setEmail('')
            setPassword('')
            setPhone('')
            setC_Password('')
            setRole('student')
        }).catch(() => {
            notification.error({
                message: t('message.error') 
            })
        })
    }

    return (
        <Layout>
            
        </Layout>
    )
} 

export default SignUpPage