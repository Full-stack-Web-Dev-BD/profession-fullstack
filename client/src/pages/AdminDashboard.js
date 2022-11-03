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
import CircleIcon from '@mui/icons-material/Circle';
import moment from 'moment'

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
    const [expireTime, setExpireTime] = useState()
    const [details, setDetails] = useState()


    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        if (window.localStorage.getItem('authToken')) {
            setUser(jwtDecode(window.localStorage.getItem('authToken')))
        }
        getUsers()
        getTask()
    }, [])
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

    const createUser = () => {
        axios.post(`${baseURL}/api/user/register`, {
            email: randomEmail("gmail"),
            password: generatePassword()
        })
            .then(resp => {
                console.log(resp)
                getUsers()
                toast.success("User Generated  !!!")
            })
            .catch(err => {
                console.log(err.response)
                Object.keys(err.response?.data).map(errName => {
                    toast.error(err.response?.data[errName])
                })
            })
    }
    function generatePassword() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    const expTime = (date, expTime) => {
        var dateMS = Date.now(date)
        var totalTime = minuteToMS(expTime) + dateMS
        var expireTime = new Date(totalTime)
        return `${expireTime.getFullYear()}/${expireTime.getMonth()}/${expireTime.getDate()}  ${expireTime.getHours()}:${expireTime.getMinutes()} `;
    }

    const minuteToMS = (m) => {
        return m * 60000
    }
    const isExpire = (date, expTime) => {
        console.log(date, expTime)
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
    const createTask = (e) => {
        e.preventDefault()
        axios.post(`${baseURL}/api/task`, {
            details: details,
            expireTime: expireTime
        })
            .then(resp => {
                setDetails("")
                setExpireTime("")
                toast.success("Task Created ")
                getTask()
            })
            .catch(err => {
                console.log(err)
            })
    }
    const idToUserName = (id) => {
        var i = users.findIndex(x => x._id == id)
        console.log(users[i])
        return users[i]
    }
    return (
        <div>
            {
                user.type == UserType.instructor ?
                    <div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <Card >
                                    <CardContent>
                                        <div className='p-3'>
                                            <h3 className='mt-4'>Create a Credentials </h3>
                                            <hr />
                                            <Button onClick={e => createUser()} variant='contained' size='small' type='submit' color='secondary'> Create </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                {/* <h3 className='mt-4'>Created Users</h3>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell> <b> User Name</b></TableCell>
                                                <TableCell align="right"><b>Password</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="right">{row.calories}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer> */}
                                <h3 className='mt-4'>Distributed Users</h3>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell> <b> User Name</b></TableCell>
                                                <TableCell> <b> ID</b></TableCell>
                                                <TableCell align="right"><b>Password</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {users.map((row) => (
                                                <TableRow
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.email}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row._id}
                                                    </TableCell>
                                                    <TableCell align="right">{row.passWordInText}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div className='col-md-6'>
                                <Card className=''>
                                    <CardContent>
                                        <div className='p-3'>
                                            <h3>Create a Task </h3>
                                            <hr />
                                            <form onSubmit={e => createTask(e)}>
                                                <textarea value={details} onChange={e => setDetails(e.target.value)} required rows={5} placeholder="Enter Task Details or Question " className='form-control mb-3' />
                                                <Input value={expireTime} onChange={e => setExpireTime(e.target.value)} type="number" fullWidth placeholder='Enter  time limitation (Minutes) ' required />
                                                <div className='text-right mt-3'>
                                                    <Button variant='contained' size='small' type='submit' color='secondary'> Create </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </CardContent>
                                </Card>
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
                                                            <div key={task.date}>
                                                                {
                                                                    !isExpire(task.date, task.expireTime) ?
                                                                        <div className='mb-5'>
                                                                            <div className='task_header alert alert-success'>
                                                                                <h6>Expire In
                                                                                    <span className=''> <AccessTimeFilledIcon /> <b> {expTime(task.date, task.expireTime)} </b> </span>
                                                                                </h6>
                                                                            </div>
                                                                            <p>{task.details}</p>
                                                                            <div>
                                                                                <Accordion>
                                                                                    <AccordionSummary
                                                                                        expandIcon={<ExpandMoreIcon />}
                                                                                        aria-controls="panel1a-content"
                                                                                        id="panel1a-header"
                                                                                    >
                                                                                        <Typography>  Participant </Typography>
                                                                                    </AccordionSummary>
                                                                                    <AccordionDetails>
                                                                                        <TableContainer component={Paper}>
                                                                                            <Table aria-label="simple table">
                                                                                                <TableHead>
                                                                                                    <TableRow>
                                                                                                        <TableCell> <b>User Name</b> </TableCell>
                                                                                                        <TableCell> <b>Active Status</b> </TableCell>
                                                                                                    </TableRow>
                                                                                                </TableHead>
                                                                                                <TableBody>
                                                                                                    {task.users?.map((row, i) => (
                                                                                                        <TableRow key={i}
                                                                                                        >
                                                                                                            <TableCell component="th" scope="row">
                                                                                                                {row}
                                                                                                            </TableCell>
                                                                                                            <TableCell component="th" scope="row">
                                                                                                                <span> <CircleIcon style={{ width: '10px', color: '#00f122' }} /> Online </span>
                                                                                                            </TableCell>
                                                                                                        </TableRow>
                                                                                                    ))}
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </TableContainer>
                                                                                    </AccordionDetails>
                                                                                </Accordion>
                                                                            </div>
                                                                        </div> : ''
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className='mt-4'>
                                    <Card className=''>
                                        <CardContent>
                                            <div className='p-3'>
                                                <h3>Past Task (Expired)  </h3>
                                                <hr />
                                                {
                                                    tasks.length < 1 ?
                                                        <h5>No Task Available</h5> : ''
                                                }
                                                {
                                                    tasks.map(task => {
                                                        return (
                                                            <div key={task.date}>
                                                                {
                                                                    isExpire(task.date, task.expireTime) ?
                                                                        <div className='mb-5'>
                                                                            <div className='task_header alert alert-success'>
                                                                                <h6>Expire In
                                                                                    <span className=''> <AccessTimeFilledIcon /> <b> {expTime(task.date, task.expireTime)} </b> </span>
                                                                                </h6>
                                                                            </div>
                                                                            <p>{task.details}</p>
                                                                            <div>
                                                                                <Accordion>
                                                                                    <AccordionSummary
                                                                                        expandIcon={<ExpandMoreIcon />}
                                                                                        aria-controls="panel1a-content"
                                                                                        id="panel1a-header"
                                                                                    >
                                                                                        <Typography>  Participant </Typography>
                                                                                    </AccordionSummary>
                                                                                    <AccordionDetails>
                                                                                        <TableContainer component={Paper}>
                                                                                            <Table aria-label="simple table">
                                                                                                <TableHead>
                                                                                                    <TableRow>
                                                                                                        <TableCell> <b>User Name</b> </TableCell>
                                                                                                        <TableCell> <b>Active Status</b> </TableCell>
                                                                                                    </TableRow>
                                                                                                </TableHead>
                                                                                                <TableBody>
                                                                                                    {task.users.map((row, i) => (
                                                                                                        <TableRow key={row}
                                                                                                        >
                                                                                                            <TableCell component="th" scope="row">
                                                                                                                {idToUserName(row)?.email}
                                                                                                            </TableCell>
                                                                                                            <TableCell component="th" scope="row">
                                                                                                                <span> <CircleIcon style={{ width: '10px', color: '#00f122' }} /> Participated </span>
                                                                                                            </TableCell>
                                                                                                        </TableRow>
                                                                                                    ))}
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </TableContainer>
                                                                                    </AccordionDetails>
                                                                                </Accordion>
                                                                            </div>
                                                                        </div> : ''
                                                                }
                                                            </div>
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