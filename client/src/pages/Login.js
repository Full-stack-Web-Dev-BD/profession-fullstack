import { Button, Card, CardContent, Input } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { baseURL } from '../constant'
import jwtDecode, { } from 'jwt-decode'
const Login = () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const submitHandler = (e) => {
        e.preventDefault()
        if (email && password) {
            axios.post(`${baseURL}/api/user/login`, { email: email, password: password })
                .then(resp => {
                    window.localStorage.setItem('authToken', resp.data?.token)
                    const User = jwtDecode(resp.data.token)
                    toast.success("Login Success")
                    if (User.type == 'instructor') {
                        window.location.href = '/admin'
                    } else {
                        window.location.href = '/dashboard'
                    }
                })
                .catch(err => {
                    console.log(err.response)
                    Object.keys(err.response?.data).map(errName => {
                        toast.error(err.response?.data[errName])
                    })
                })
        } else {
            toast.error("Please Fill form with  given Email and Password !!")
        }
    }
    return (
        <div>
            <div className='col-md-6 offset-md-3'>
                <Card >
                    <CardContent>
                        <form onSubmit={e => submitHandler(e)} className='p-3'>
                            <h3 className='text-center'>Login</h3>
                            <div>
                                <label>User Name / Email</label>
                                <Input type='email' required onChange={e => setEmail(e.target.value)} fullWidth placeholder='Email' />
                            </div>
                            <div>
                                <label>User Name / Email</label>
                                <Input type='password' required onChange={e => setPassword(e.target.value)} fullWidth placeholder='Password' />
                            </div>
                            <div className='text-right mt-3'>
                                <Button variant='contained' size='small' type='submit' color='secondary'> Login </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Login