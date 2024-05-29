import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row, Spinner, Table, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import { Eye, Settings, XCircle } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import WorkModelConfiguration from './workmodelconfiguration'
import ConfigurationHandling from './condigurationHandling'
import ViewConfiguration from './ViewConfiguration'

const AssignShift = ({ workmodel, shift, shift_setup }) => {
  const Api = apiHelper()
  const MySwal = withReactContent(Swal)
  const [data, setData] = useState([])
  const [loading, setisloading] = useState()
  const [selectedShifts, setSelectedShifts] = useState(null)
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [showCanvas, setShowCanvas] = useState(false)
  const [showViewCanvas, setShowViewCanvas] = useState(false)
  const [selectedShift, setSelectedShift] = useState()
  const [modelShifts, setModelShifts] = useState()
  // const handleShow = () => {
  //   setIsShow(!isShow)
  // }
  const transformData = (data) => {
    return data.map(item => ({
      value: item.id,
      label: item.title
    }))
  }
  const fetchData = async () => {
    try {
    setisloading(true)
      const formData = new FormData()
      formData['working_model'] = workmodel.id
      const result = await Api.jsonPost('/employeeworking/workingmodel/shift/get/', formData)
      if (result.status === 200) {
        setData(result.data)
        setModelShifts(transformData(result.data))
        setisloading(false)
      } else {
        Api.Toast('error', result.message)
        setisloading(false)
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error)
    }
  }
  const handleCanvas = () => {
    setShowCanvas(!showCanvas)
    fetchData()
  }
  const handleViewCanvas = () => {
    setShowViewCanvas(!showViewCanvas)
  }
  const handleConfiguration = (item) => {
    setSelectedShift(item)
    setShowCanvas(!showCanvas)
  }
  const handleView = (item) => {
    setSelectedShift(item)
    setShowViewCanvas(!showCanvas)
  }
  
  // Fetch policy data from the server and set default values
 
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      title,
      start_time: startTime,
      end_time: endTime,
      working_model: workmodel.id,
      shift: selectedShifts.value
    }
    // Submit formData to the API
    Api.jsonPost('/employeeworking/workingmodel/shift/create/', formData)
      .then(response => {
        if (response.status === 200) {
          Api.Toast('success', 'Created successfully')
          fetchData()
        } else {
          Api.Toast('error', 'Failed to create')
        }
      })
      .catch(error => {
        Api.Toast('error', error)
      })
  }
  const removeShift = (id) => {
    MySwal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete the assigned shift!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it!',
        customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ms-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            Api.deleteData(`/employeeworking/workingmodel/shift/delete/${id}/`, {method: 'Delete'})
            .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Shift Deleted!',
                            text: 'Shift is deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                fetchData()
                            }
                        })
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: deleteResult.message ? deleteResult.message : 'Shift can not be deleted!',
                            text: 'Shift is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                })
        } 
    })
}


  useEffect(() => {
    fetchData()
  }, [])
 
  const CallBack = () => {
    setShowCanvas(false)
    setShowViewCanvas(false)
    fetchData()
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <Row className='mb-2'>
          <Col md='6'>
          <Label className="form-label">
               Title
            </Label>
            <Input
              type="text"
              className='react-select mb-1'
              id="title"
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Col>
          <Col md='6'>
          <Label className="form-label">
                Shift<Badge color='light-danger'>*</Badge>
            </Label>
            <Select
              options={shift}
              className='react-select mb-1'
              classNamePrefix='select'
              placeholder="Shift"
              value={selectedShifts}
              onChange={setSelectedShifts}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label">
                Start Time<Badge color='light-danger'>*</Badge>
            </Label>
            <Flatpickr 
                className='form-control'
                id='default-picker'
                options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'H:i'
                }}
                onChange={(date) => setStartTime(Api.formatTime(date[0]))}
            />
        </Col>
        <Col md="6" className="mb-1">
            <Label className="form-label">
                End Time<Badge color='light-danger'>*</Badge>
            </Label>
            <Flatpickr 
                className='form-control'
                id='default-picker'
                options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'H:i'
                }}
                onChange={(date) => setEndTime(Api.formatTime(date[0]))}
            />
        </Col>

          <Col md='4'>
            <Button type="submit" className='btn btn-primary'>Create</Button>
          </Col>
        </Row>
      </form>
     {!loading ? <> 
     {data && data.length > 0 ? <> 
      <div>
<Table>
<thead>
    <th>Title</th>
    <th>Shift Title</th>
    <th>Start Time</th>
    <th>End Time</th>
    <th>Action</th>
</thead>
     {data.map((item, index) => {
        return (
<tbody key={index}>
    <td>{item.title}</td>
    <td>{item.shift_title}</td>
    <td>{item.start_time}</td>
    <td>{item.end_time}</td>
    <td>  <button
                                className="border-0 no-background m-0 p-1"
                                title="View"
                                onClick={() => handleView(item)}
                                >
                                <Eye color="green"/>
                            </button><button
                                className="border-0 no-background m-0 p-1"
                                title="Delete"
                                onClick={() => removeShift(item.id)}
                                >
                                <XCircle color="red"/>
                            </button>
                            {workmodel.shift_base_configuration ? <button
                                className="border-0 no-background m-0 p-0"
                                title="Setup"
                                onClick={() => handleConfiguration(item)}
                                >
                                <Settings color="grey"/>
                            </button> : null}</td>
</tbody>
        )
     })}
     </Table></div>
     </> : <div className='text-center'>No data found</div>}
     
     </> :  <div className="container h-100 d-flex justify-content-center">
        <div className="jumbotron my-auto">
          <div className="display-3"><Spinner type='grow' color='primary'/></div>
        </div>
    </div>}
    <Offcanvas isOpen={showCanvas} toggle={handleCanvas} scroll={true} direction="end">
        <OffcanvasHeader toggle={handleCanvas}>Configuration</OffcanvasHeader>
        <OffcanvasBody>
          {/* <WorkModelConfiguration  workmodel={workmodel} selectedShift={selectedShift} shift={modelShifts}/> */}
        <ConfigurationHandling workmodel={workmodel} selectedShift={selectedShift} shift={modelShifts} CallBack={CallBack} shift_setup={shift_setup}/>
        </OffcanvasBody>
      </Offcanvas>
      <Offcanvas isOpen={showViewCanvas} toggle={handleViewCanvas} scroll={true} direction="end">
        <OffcanvasHeader toggle={handleViewCanvas}>View Configuration</OffcanvasHeader>
        <OffcanvasBody>
        <ViewConfiguration workmodel={workmodel} selectedShift={selectedShift} />
        </OffcanvasBody>
      </Offcanvas>
    </div>
  )
}

export default AssignShift
