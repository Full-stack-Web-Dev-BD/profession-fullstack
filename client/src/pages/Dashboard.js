import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Card, CardContent, Input } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { baseURL, UserType } from '../constant';
import jwtDecode from 'jwt-decode';
import randomEmail from 'random-email';
import axios from 'axios';
import { toast } from 'react-toastify';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import moment from 'moment';


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const AdminDashboard = () => {
    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        var time = "2022-11-02T07:00:07.906Z"
        console.log(Date.now(time))
        if (window.localStorage.getItem('authToken')) {
            setUser(jwtDecode(window.localStorage.getItem('authToken')))
        }
        getUsers()
        getTask()
    }, [])

    const isExpire = (date, expTime) => {
        var taskDate = moment(date).add(expTime, 'm').toDate()
        var now = moment()
        if (now > taskDate) {
            console.log("Expired")
            return true
        } else {
            console.log('NOt Expired')
            return false
        }
    }
    const expTime = (date, expTime) => {
        var taskDate = moment(date).add(expTime, 'm').toDate()
        return moment(taskDate).format('MMMM Do YYYY, h:mm:ss a')
    }
    const getUsers = () => {
        axios.get(`${baseURL}/api/user/all-user`)
            .then(resp => {
                setUsers(resp.data.reverse())
            })
            .catch(err => {
                console.log(err)
            })
    }
    const getTask = () => {
        axios.get(`${baseURL}/api/task`)
            .then(resp => {
                console.log(resp.data)
                setTasks(resp.data.reverse())
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            {
                user.type ?
                    <div>
                        <div className='row'>
                            <div className='col-md-6 offset-md-3'>
                                <div className='mt-4'>
                                    <Card className=''>
                                        <CardContent>
                                            <div className='p-3'>
                                                <h3>Current Task (In Progress)  </h3>
                                                <hr />
                                                {
                                                    tasks.length < 1 ?
                                                        <h5>No Task Available</h5> : ''
                                                }
                                                {
                                                    tasks.map(task => {
                                                        return (
                                                            <>
                                                                {
                                                                    !isExpire(task.date, task.expireTime) ?
                                                                        <div key={task.date} className='mb-5'>
                                                                            <div className='task_header alert alert-success'>
                                                                                <h6>Expire In
                                                                                    <span className=''> <AccessTimeFilledIcon /> <b> {expTime(task.date, task.expireTime)} </b> </span>
                                                                                    {/* {expTime(task.date, task.expireTime)} */}
                                                                                </h6>
                                                                            </div>
                                                                            <p>{task.details}</p>
                                                                            <div className='text-right'>
                                                                                <a href={`/task?TID=${task._id}`} >
                                                                                    <Button variant='contained' size='small' type='submit' color='primary' className='ml-3'> Details </Button>
                                                                                </a>
                                                                            </div>
                                                                        </div> : ''
                                                                }
                                                            </>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div> :
                    <h3 className='text-center'>You are not Authorized User</h3>
            }
        </div>
    )
}

export default AdminDashboard