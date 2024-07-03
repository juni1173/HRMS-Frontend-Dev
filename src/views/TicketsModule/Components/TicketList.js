import {Fragment, useState} from 'react'
import { Row, Col, InputGroup, InputGroupText, Input, Button, Badge, CardBody, Card, CardTitle, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import { Eye, Trash2, Search, RefreshCcw, Filter } from 'react-feather'
import TicketDetails from './TicketDetails'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import Select from "react-select"
import withReactContent from 'sweetalert2-react-content'
import { FaUserGear, FaUserTie  } from "react-icons/fa6"
import { GrStatusInfo } from "react-icons/gr"
import { MdCategory } from "react-icons/md"
const TicketList = ({ data, CallBack, status_choices }) => {
    console.warn(data)
  const Api = apiHelper()
  const MySwal = withReactContent(Swal)
  const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [UpdateData, setUpdateData] = useState([])
    const [filterStatus, setFilterStatus] = useState(false)
    const [searchResults, setSearchResults] = useState(data ? data : [])
   

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
    const deleteAction = (id) => {
      console.warn(id)
      MySwal.fire({
          title: 'Are you sure?',
          text: "Do you want to remove ticket?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, proceed!',
          customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ms-1'
          },
          buttonsStyling: false
      }).then(function (result) {
          if (result.value) {
              Api.deleteData(`/ticket/employee/${id}/`, {method: 'Delete'})
              .then((deleteResult) => {
                  if (deleteResult.status === 200) {
                      MySwal.fire({
                          icon: 'success',
                          title: 'Ticket Deleted!',
                          text: 'Ticket deleted successfully.',
                          customClass: {
                          confirmButton: 'btn btn-success'
                          }
                      }).then(function (result) {
                          if (result.isConfirmed) {
                              CallBack()
                          }
                      }) 
                  } else {
                      MySwal.fire({
                          icon: 'error',
                          title: 'Ticket can not be deleted!',
                          text: deleteResult.message ? deleteResult.message : 'Ticket is not in deleted.',
                          customClass: {
                          confirmButton: 'btn btn-danger'
                          }
                      })
                  }
                          
                  })
          } 
      })
    }
   
    const filterClick = () => {
        setFilterStatus(!filterStatus)
    }
   
    const onSearch = (inputName, e) => {
        if (e) {
            if (inputName === 'subject') {
                setSearchResults(data.filter(item => (item.subject).toLowerCase().includes((e.target.value).toLowerCase())))
            }
            if (inputName === 'ticket_status') {
            setSearchResults(data.filter(item => item.ticket_status === e.value))
            }
        } else {
            setSearchResults(data)
        }
    }
  return (
    <Fragment>
            <div className=' row '>
                <Col md='12'>
                <span onClick={filterClick} className='cursor-pointer float-right mb-1'><Filter color={filterStatus ? 'darkblue' : 'gray'} size={'18'} title="Filters"/> Filters </span>
                </Col>
                <Col md='12'>
                {filterStatus && (
                        <div className='row d-flex justify-content-center mb-1'>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Search by Subject  <RefreshCcw color='darkblue' size={'14'} onClick={() => onSearch('subject', null)}/>
                            </label>
                            <InputGroup className='input-group-merge mb-2'>
                                <InputGroupText>
                                    <Search size={14} />
                                </InputGroupText>
                                <Input placeholder='search by title...'  onChange={e => { onSearch('subject', e) } }/>
                            </InputGroup>
                        </div>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Status  
                            </label>
                            <Select
                                isClearable={true}
                                className='react-select'
                                classNamePrefix='select'
                                name="status"
                                options={status_choices ? status_choices : ''}
                                // value={status_choices.find(option => option.value === query.status) || null}
                                onChange={ (e) => { onSearch('ticket_status', e) }}
                            />
                        </div>
                    </div>                    
                    
                )}
                </Col>
                
            </div>
      
    {searchResults && Object.values(searchResults).length > 0 ? (
        <div className="row">
             {Object.values(searchResults).map((item, key) => (
                                    <Col md={6} className='' key={key}>
                                        <Card bg="light" style={{ backgroundColor: '#F2F3F4' }} className='text-nowrap'>    
                                            <CardBody>
                                                <Row>
                                                    <Col md={4}><h4>{item.subject ? (item.subject).substring(0, 25) : 'N/A'}</h4></Col>
                                                    <Col md={4}>
                                                       {<><FaUserTie /><Badge color='light-warning'>{item.team_lead_name ? item.team_lead_name : 'N/A'}</Badge><br></br></>}
                                                    </Col>
                                                    <Col md={4} className='d-flex justify-content-end'>
                                                        <Eye color='green' onClick={() => DetailsToggle(item)}/><br></br>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.ticket_status_title ? (
                                                        <>
                                                            <GrStatusInfo /> <Badge color="light-success">{item.ticket_status_title}</Badge>
                                                        </>
                                                        ) : <Badge color="light-danger">N/A</Badge>}<br></br>
                                                        <MdCategory /> <Badge color='light-warning' className='mt-1'>{item.category_title ? item.category_title : 'N/A'}</Badge>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.transfer_to && <><b>{`Transferred to ${(item.transfer_to_name ? item.transfer_to_name.toUpperCase() : 'N/A')}`}</b><br></br></>}
                                                        {<><FaUserGear /> <Badge color='light-secondary' title='Assigned to' className=''>{item.assign_to_name ? item.assign_to_name : 'N/A'}</Badge></>}
                                                    </Col>
                                                    <Col md={4} className="">
                                                        <p>{item.ticket_status === 1 && <Trash2 className="float-right" color='red' onClick={() => deleteAction(item.id)}/>}</p><br></br>
                                                        <span style={{color: '#808080b5'}} className="float-right">{Api.formatDateDifference(item.created_at)}</span>
                                                    </Col>
                                                    
                                                </Row>
                                        
                                            </CardBody>
                                        </Card>
                                    </Col>
                        ))}
        </div>   
      ) : (
          <div className="text-center">No Ticket Data Found!</div>
    )}
     <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
           <TicketDetails data={UpdateData}/>
            
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default TicketList