import {Fragment, useState, useEffect, useCallback} from 'react'
import { Row, Col, Label, Spinner, Button, Badge, CardBody, Card, Input, Offcanvas, OffcanvasHeader, OffcanvasBody, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Eye, Edit, XCircle, CheckCircle } from 'react-feather'
import TicketDetails from '../TicketDetails'
import apiHelper from '../../../Helpers/ApiHelper'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import TransferForm from './TransferForm'
const AssignedTickets = () => {
  const Api = apiHelper()
  const MySwal = withReactContent(Swal)
  const [loading, setLoading] = useState(false)
  const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [data, setData] = useState([])
    const [UpdateData, setUpdateData] = useState([])
    const [basicModal, setBasicModal] = useState(false)
    const status_choices = [
        {value: 1, label: 'Pending'},
        {value: 2, label:'In Progress by Team Lead'},
        {value: 3, label: 'Rejected by Team Lead'},
        {value: 4, label: 'Approved by Team Lead'},
        // {value: 5, label: 'In Progress by CTO'},
        // {value: 6, label: 'Rejected by CTO'},
        // {value: 7, label: 'Approved by CTO'},
        {value: 8, label: 'In Progress by Admin'},
        {value: 9, label: 'Rejected by Admin'},
        {value: 10, label: 'Solved by Admin'}
        // {value: 11, label: 'In Progress by HR'},
        // {value: 12, label: 'Reject by HR'},
        // {value: 13, label: 'Solved by HR'}
    ]
    const admin_choices = [
        {value: 8, label: 'In Progress by Admin'},
        {value: 9, label: 'Rejected by Admin'},
        {value: 10, label: 'Solved by Admin'}
    ]
    const toggleCanvasEnd = () => {
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
    }
    const DetailsToggle = (item) => {
      if (item !== null) {
          setUpdateData(item)
      }
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
      
    }
    const TransferModal = (item) => {
        if (item !== null) {
            setUpdateData(item)
        }
      setBasicModal(!basicModal)
    }
    const getTicketsData = async () => {
        setLoading(true)
        await Api.get(`/ticket/assign/to/employee/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const resultData = result.data
                    console.warn('hello', resultData)
                    setData(resultData)
                } else {
                    // Api.Toast('error', result.message)
                }
            } else (
             Api.Toast('error', 'Server not responding!')   
            )
        }) 
         
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
  useEffect(() => {
    getTicketsData()
    }, [])

    const CallBack = useCallback(() => {
        setBasicModal(false)
        getTicketsData()
      }, [data])

    const onStatusUpdate = async (id, status_value, comment) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to update the Status!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const formData = new FormData()
                formData['ticket_status'] = status_value
                if (comment !== '') {
                    formData['decision_reason'] = comment
                    Api.jsonPatch(`/ticket/action/by/assign/to/employee/${id}/`, formData)
                    .then((result) => {
                        if (result.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Status Updated!',
                                text: 'Status is updated.',
                                customClass: {
                                confirmButton: 'btn btn-success'
                                }
                            }).then(async function (result) {
                                if (result.isConfirmed) {
                                    setLoading(true)
                                    await CallBack()
                                    setTimeout(() => {
                                        setLoading(false)
                                    }, 1000)
                                }
                            })
                            } else {
                                MySwal.fire({
                                    title: 'Error',
                                    text: result.message ? result.message : 'Something went wrong',
                                    icon: 'error',
                                    customClass: {
                                      confirmButton: 'btn btn-success'
                                    }
                                  })
                            }
                    })
                } else Api.Toast('error', 'Comment is required!')
            } 
        })
    }
    const StatusComponent = ({ item, index }) => {
        const [toggleThisElement, setToggleThisElement] = useState(false)
        const [comment, setComment] = useState('')
        const [statusValue, setStatusValue] = useState('')
        return (
            <div className="single-history" key={index}>
            
            {toggleThisElement ? (
                <div className="row min-width-300">
                <div className="col-lg-8">
                <Select
                    isClearable={false}
                    options={admin_choices}
                    className='react-select mb-1'
                    classNamePrefix='select'
                    defaultValue={status_choices.find((value) => value === item.ticket_status) ? status_choices.find((value) => value === item.ticket_status) : status_choices[0] }
                    onChange={(statusData) => setStatusValue(statusData.value)}
                    />
                    <>
                        <Label>
                            Comment
                        </Label>
                        <Input 
                            type='textarea'
                            className='mb-1'
                            name='commentText'
                            placeholder="Add Remarks"
                            onChange={ (e) => { setComment(e.target.value) }}
                        />
                    </>
                    
                    <Button className="btn btn-primary" onClick={ async () => {
                        await onStatusUpdate(item.id, statusValue, comment).then(() => {
                            setToggleThisElement((prev) => !prev)
                        })
                    }}>
                        Submit
                    </Button>
                </div>
                <div className="col-lg-4 float-right">
                <XCircle color="red" onClick={() => setToggleThisElement((prev) => !prev)}/>
                </div>
            </div>
            ) : (
                <div className="row min-width-225">
                    <div className="col-lg-9">
                    <h3><Badge color='light-secondary'>{status_choices.find(({value}) => value === item.ticket_status) ? status_choices.find(({value}) => value === item.ticket_status).label : status_choices[0].label }</Badge></h3>
                    </div>
                    
                    <div className="col-lg-3 float-right justify-content-end d-flex">
                        <Edit color="orange" onClick={() => setToggleThisElement((prev) => !prev)}/>
                     </div>
                </div>
            )
                
            }
            </div>
        )
        }
  return (
    <Fragment>
    {!loading ? (
            data && Object.values(data).length > 0 ? (
                    Object.values(data).map((item, key) => (
                        <div className="row" key={key}>
                                    <Col md={12} className=' m-1'>
                                        <Card bg="light" style={{ backgroundColor: '#F2F3F4' }} className='text-nowrap'>    
                                            <CardBody>
                                                <Row>
                                                    <Col md={4} className='mb-1'><h4>{item.subject ? (item.subject).substring(0, 25) : 'N/A'}</h4>by <h4>{item.employee_name.toUpperCase()}</h4></Col>
                                                    <Col md={2}>
                                                        {(item.ticket_status === 4 || item.ticket_status === 7 || item.ticket_status === 10 || item.ticket_status === 13) ? (
                                                                <>
                                                                    <Badge color='light-success'><CheckCircle color='green'/> {item.ticket_status_title ? item.ticket_status_title : 'N/A'}</Badge>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Badge color='light-warning'>{item.ticket_status_title ? item.ticket_status_title : 'N/A'}</Badge>
                                                                </>
                                                        )} - {item.transfer_to ? <b>{`Transferred to ${(item.transfer_to_name ? item.transfer_to_name.toUpperCase() : 'N/A')}`}</b> : <Button className='btn btn-primary btn-sm' outline onClick={() => TransferModal(item)}>Transfer</Button>}
                                                    </Col>
                                                    <Col md={6} className=''>
                                                        <Eye className='float-right mb-2' color='green' onClick={() => DetailsToggle(item)}/><br></br><br></br>
                                                        {(item.category === 2) && <StatusComponent item={item} key={key}/>} 
                                                    </Col>
                                                    {/* <Col md={3}>
                                                        
                                                        <Badge color='light-warning' className='mt-1'>{item.category_title ? item.category_title : 'N/A'}</Badge>
                                                    </Col> */}
                                                    
                                                    
                                                </Row>
                                        
                                            </CardBody>
                                        </Card>
                                    </Col>
                        </div>
                        ))
                    
            ) : (
                <div className="text-center">No Ticket Data Found!</div>
            )
        ) : <div className='text-center'><Spinner type='grow'/></div>    
    }
     <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
           <TicketDetails data={UpdateData}/>
            
          </OffcanvasBody>
        </Offcanvas>
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>Transfer Ticket</ModalHeader>
          <ModalBody>
                <TransferForm id={UpdateData.id} CallBack={CallBack}/>
          </ModalBody>
        </Modal>
    </Fragment>
  )
}

export default AssignedTickets