import Layout from "../../components/Layout"
import useAuth from "../../hooks/useAuth"
import { useEffect, useState } from "react"
import { routePath } from "../../routes/routePath"
import {Button, Form, Input, Checkbox} from "antd"

import { Api } from "../../services/api"

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setAuth, persist, setPersist} = useAuth()  

    const handleSubmit = async () => {
        Api.request({
            method: 'POST',
            url: routePath.public.login,
            data:{
                email,
                password
            }
        }).then((res) => {
            const user = res?.data?.data?.user;
            const token = res?.data?.data?.access_token;
            setAuth({ user, token });
            setEmail('');
            setPassword('');
        }).catch((err) => {
            setAuth({});
            console.log(err)
        })
    }

    const togglePersist = () => {
        setPersist(!persist);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])

    return (
        <Layout>
            {/* <Form>
                <Form.Item>
                    <Input onChange={(e) => {
                        console.log(e.target.value)
                        setEmail(e.target.value)
                    }}/>
                </Form.Item>
                <Form.Item>
                    <Input onChange={(e) => {
                        console.log(e.target.value)
                        setPassword(e.target.value)
                    }}/>
                </Form.Item>
                <Form.Item>
                    <Checkbox 
                        onChange={togglePersist}
                        checked={persist}>    
                    </Checkbox>
                </Form.Item>
                <Button onClick={handleSubmit}>Submit</Button>
            </Form> */}
        </Layout>
    )
} 

export default LoginPage