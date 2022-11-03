import { Button, Card, CardContent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import axios from 'axios'
import { baseURL } from '../constant'
import { toast } from 'react-toastify'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import jwtDecode from 'jwt-decode'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import moment from 'moment';

const Task = () => {
    const [isAuthorised, setIsAuthorised] = useState(false)
    const [task, setTask] = useState({})
    const [user, setUser] = useState({})
    const [answer, setAnswer] = useState('')
    const [isPerticipated, setIsPerticipated] = useState(true)
    const [feedback, setFeedback] = useState()
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
    const isExpire = (date, expTime) => {
        var taskDate = moment(date).add(expTime, 'm').toDate()
        var now = moment()
        if (now > taskDate) {
            return true
        } else {
            return false
        }
    }
    const getTask = (args) => {
        if (args) {
            var url = queryString.parse(window.location.search)
            axios.get(`${baseURL}/api/task/${url.TID}`)
                .then(resp => {
                    setTask(resp.data)
                    if (resp.data.users.indexOf(args.id) !== -1) {
                        setIsPerticipated(true)
                    } else {
                        setIsPerticipated(false)
                    }
                })
                .catch(err => {
                    window.location.href = '/dashboard'
                })
        } else {
            var url = queryString.parse(window.location.search)
            axios.get(`${baseURL}/api/task/${url.TID}`)
                .then(resp => {
                    setTask(resp.data)
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

    const doAnswer = (e) => {
        e.preventDefault()
        axios.post(`${baseURL}/api/task/reply`, { id: task._id, uid: user.id, answer: answer })
            .then(resp => {
                console.log("Perticipate Sucess ", resp)
                toast.success("Answer  Submitted successful !! ")
                getTask()
            })
            .catch(err => {
                console.log(err)
            })
    }
    const isAnswerExist = (task, user) => {
        return task.answers?.findIndex((obj) => obj.uid === user.id) == -1
    }

    const expTime = (date, expTime) => {
        var taskDate = moment(date).add(expTime, 'm').toDate()
        return moment(taskDate).format('MMMM Do YYYY, h:mm:ss a')
    }
    const getMyFeedback = (task) => {
        if (task?.answers?.findIndex((obj) => obj.uid === user.id) !== -1) {
            const myIndex = task.answers?.findIndex((obj) => obj.uid === user.id)
            // console.log("task is ", task?.answers?.findIndex((obj) => obj.uid === user.id))
            // console.log("length", task?.answers?.length, "My Index", myIndex)
            if (task?.answers?.length - 1 == myIndex) {
                return task?.answers[0]
            } else {
                return task?.answers[myIndex + 1]
            }
        } else {
            return {}
        }
    }
    const doFeedback = (e) => {
        e.preventDefault()
        axios.post(`${baseURL}/api/task/feedback`, { id: task._id, uid: user.id, feedback })
            .then(resp => {
                console.log("Feedback Sucess ", resp)
                toast.success("Feedback Sent  !! ")
                setFeedback("")
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
                                    <span className='cp' onClick={e => { window.location.href = '/dashboard' }} >
                                        <ArrowBackIcon />
                                    </span>
                                    <div className='p-3'>
                                        {
                                            isExpire(task.date, task.expireTime) ?
                                                <div className='task_header alert alert-warning'>
                                                    <h6>Expired<span className=''> <AccessTimeFilledIcon /> <b> {expTime(task.date, task.expireTime)} </b> </span> </h6>
                                                </div> :
                                                <div className='task_header alert alert-success'>
                                                    <h6>Expire In<span className=''> <AccessTimeFilledIcon /> <b> {expTime(task.date, task.expireTime)} </b> </span> </h6>
                                                </div>
                                        }
                                        <p>{task.details}</p>
                                        <div>
                                            {
                                                !isPerticipated ?
                                                    <div className='text-right mt-3'>
                                                        {
                                                            isExpire(task.date, task.expireTime) ?
                                                                <Button variant='contained' size='small' type='submit' color='warning'  > Expired </Button>
                                                                :
                                                                <Button variant='contained' size='small' type='submit' color='secondary' onClick={e => perticipate()} > Perticipate </Button>

                                                        }
                                                    </div> :
                                                    <div className='text-right mt-3'>
                                                        {
                                                            isAnswerExist(task, user) ?
                                                                <form onSubmit={e => doAnswer(e)} >
                                                                    <textarea value={answer} onChange={e => setAnswer(e.target.value)} required rows={5} placeholder="Enter your Answer " className='form-control mb-3' />
                                                                    <Button variant='contained' size='small' type='submit' color='primary'  > Answer </Button>
                                                                </form> :
                                                                <>
                                                                    {
                                                                        task.answers?.map(ans => {
                                                                            return (
                                                                                <>
                                                                                    {
                                                                                        ans.uid == user.id ?
                                                                                            <div>
                                                                                                <p className='text-left text-success'> <b>Ans:</b>  {ans.answer} </p>
                                                                                                {
                                                                                                    ans.feedback ?
                                                                                                        <p className='text-left text-info'> <b>Feedback:</b> {ans.feedback}  </p> :
                                                                                                        <p className='text-left text-info'> <b>Feedback:</b> In Pending   </p>
                                                                                                }
                                                                                                <div className='card mt-3 p-3 text-left'>
                                                                                                    <div>
                                                                                                        {
                                                                                                            getMyFeedback(task).feedback ?
                                                                                                                "Your Feedback Submitted" :
                                                                                                                <div>
                                                                                                                    <h5>Write Your Feedback</h5>
                                                                                                                    <form onSubmit={e => doFeedback(e)}>
                                                                                                                        <p>
                                                                                                                            <b>Ans : </b> {getMyFeedback(task).answer}
                                                                                                                        </p>
                                                                                                                        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} required rows={5} placeholder="Enter your Feedback  about  this  " className='form-control mb-3' />
                                                                                                                        <Button variant='contained' size='small' type='submit' color='secondary'  > Feedback </Button>
                                                                                                                    </form>
                                                                                                                </div>
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div> : ''
                                                                                    }
                                                                                </>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                        }
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
        </div >
    )
}

export default Task