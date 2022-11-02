import { Button, Card, CardContent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import axios from 'axios'
import { baseURL } from '../constant'
import { toast } from 'react-toastify'
import jwtDecode from 'jwt-decode'
const Task = () => {
    const [isAuthorised, setIsAuthorised] = useState(false)
    const [task, setTask] = useState({})
    const [user, setUser] = useState({})
    const [isPerticipated, setIsPerticipated] = useState(true)
    useEffect(() => {
        if (window.localStorage.getItem("authToken")) {
            setUser(jwtDecode(window.localStorage.getItem('authToken')))
            setIsAuthorised(true)
            getTask(jwtDecode(window.localStorage.getItem('authToken')))
        } else {
            toast.error("Login Required !!")
            setIsAuthorised(false)
            setTimeout(() => {
                window.location.href = '/login'
            }, 3000);
        }
    }, [])
    const getTask = (args) => {
        if (args) {
            var url = queryString.parse(window.location.search)
            axios.get(`${baseURL}/api/task/${url.TID}`)
                .then(resp => {
                    console.log(resp.data)
                    setTask(resp.data)
                    console.log(resp.data.users, user)
                    if (resp.data.users.indexOf(args.id) !== -1) {
                        setIsPerticipated(true)
                    } else {
                        setIsPerticipated(false)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            var url = queryString.parse(window.location.search)
            axios.get(`${baseURL}/api/task/${url.TID}`)
                .then(resp => {
                    console.log(resp.data)
                    setTask(resp.data)
                    console.log(resp.data.users, user)
                    if (resp.data.users.indexOf(user.id) !== -1) {
                        setIsPerticipated(true)
                    } else {
                        setIsPerticipated(false)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    const perticipate = () => {
        axios.post(`${baseURL}/api/task/perticipate`, { id: task._id, uid: user.id })
            .then(resp => {
                console.log("Perticipate Sucess ", resp)
                toast.success("Perticipate Sucess ")
                getTask()
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div>
            {
                isAuthorised ?
                    <div className='row'>
                        <div className='col-md-6 offset-md-3'>
                            <Card>
                                <CardContent>
                                    {console.log("asdf", task)}
                                    <div className='p-3'>
                                        <p>{task.details}</p>
                                        <div>
                                            {
                                                !isPerticipated ?
                                                    <div className='text-right mt-3'>
                                                        <Button variant='contained' size='small' type='submit' color='secondary' onClick={e => perticipate()} > Perticipate </Button>
                                                    </div> :
                                                    <div className='text-right mt-3'>
                                                        <Button variant='contained' size='small' type='submit' color='primary'  > Perticipated </Button>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div> :
                    <h4 className='text-center'>You are Not Authorized</h4>
            }
        </div>
    )
}

export default Task