import React, { Fragment, useEffect, useState } from 'react'
import { Card, Button, CardBody, Row, Col, CardTitle, CardText, Badge, Offcanvas, OffcanvasBody, OffcanvasHeader, Spinner} from 'reactstrap'
import CreateModels from './createmodel'
import apiHelper from '../../Helpers/ApiHelper'
import WorkModelConfiguration from './workmodelconfiguration'
import AssignShift from './AssignShift'
// import ConfigurationHandling from './condigurationHandling'

const WorkingModel = () => {
  const Api = apiHelper()
  const [isShow, setIsShow] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const [showShiftCanvas, setShowShiftCanvas] = useState(false)
  const [workingModels, setWorkingModels] = useState([])
  const [selectedItem, setSelectedItem] = useState()
  const [isloading, setisloading] = useState()
  const [engagementSchedule, setEngagementSchedule] = useState([])
  const [workMode, setWorkMode] = useState([])
  const [workType, setWorkType] = useState([])
  const [shifts, setShifts] = useState([])
  const [shift_setup, setShift_Setup] = useState([])
  const [employeeClass, setEmployeeClass] = useState([])
  

  const handleShow = () => {
    setIsShow(!isShow)
  }
  const handleCanvas = () => {
    setShowCanvas(!showCanvas)
  }
  const handleConfiguration = (item) => {
    setSelectedItem(item)
    setShowCanvas(!showCanvas)
  }
  const handleShifts = (item) => {
    setSelectedItem(item)
    setShowShiftCanvas(!showShiftCanvas)
  }
  const handleShiftCanvas = () => {
    setShowShiftCanvas(!showShiftCanvas)
  }

  const fetchWorkingModels = async () => {
    try {
        setisloading(true)
      const result = await Api.get('/employeeworking/workingmodel/')
      if (result.status === 200) {
        setWorkingModels(result.data)
        setisloading(false)
      } else {
        setisloading(false)
        Api.Toast('error', result.message)
      }
    } catch (error) {
      Api.Toast('error', 'An error occurred while fetching working models')
    }
  }
  const CallBack = () => {
    fetchWorkingModels()
  }
  const transformData = (data) => {
    return data.map(item => ({
      value: item.id,
      label: item.title
    }))
  }
  const fetchData = async () => {
    try {
      const result = await Api.get('/employeeworking/workingmodel/pre/data/')
      if (result.status === 200) {
        setEngagementSchedule(transformData(result.data.engagement_schedule))
        setWorkMode(transformData(result.data.work_mode))
        setWorkType(transformData(result.data.work_type))
        setShifts(transformData(result.data.shifts))
        setEmployeeClass(transformData(result.data.employee_class))
        setShift_Setup(transformData(result.data.shift_setup))
      } else {
        Api.Toast('error', 'Unable to fetch')
      }
    } catch (error) {
      Api.Toast('error', 'An error occurred while fetching data')
    }
  }

  useEffect(() => {
    fetchData()
    fetchWorkingModels()
  }, [])

  return (
    <Fragment>
      <div>
        <h2>Working Model</h2>
        <Button className='mt-2 mb-3 btn btn-primary' onClick={handleShow}>
          Create Working Model
        </Button>
        {isShow ? (
          <Card>
            <CardBody>
            <CreateModels 
  dropdowndata={{
    engagement_Schedule: engagementSchedule,
    work_Mode: workMode,
    work_Type: workType,
    shift: shifts,
    employee_Class: employeeClass
  }}
  CallBack = {CallBack}
/>
            </CardBody>
          </Card>
        ) : null}
        <Row className='mt-4'>
            {!isloading ? <>
            {workingModels && workingModels.length > 0 ?  <>
          {workingModels.map(model => (
            <Col md='12' key={model.id} className='mb-4'>
              <Card>
                <CardBody>
                  <CardTitle tag="h5">{model.title} ({model.short_code})</CardTitle>
                  <CardText>
                    <Row>
                      {/* <Col md={4} className='mb-1'>
                        <Badge color='light-danger'>Short Code:</Badge> {model.short_code}
                      </Col> */}
                      <Col md={4} className='mb-1'>
                        <Badge color='light-success'>Engagement Schedule:</Badge> {model.engagement_Schedule_title}
                      </Col>
                      <Col md={4} className='mb-1'>
                        <Badge color='light-primary'>Work Mode:</Badge> {model.work_mode_title}
                      </Col>
                      <Col md={4} className='mb-1'>
                        <Badge color='light-warning'>Work Type:</Badge> {model.work_type_title}
                      </Col>
                      <Col md={4} className='mb-1'>
                        <Badge color='dark'>Employee Class:</Badge> {model.employee_class_title}
                      </Col>
                      <Col md={4} className='mb-1'>
                        {/* <Badge color='light-info'>Shift:</Badge> {model.shift_title} */}
                        <Button color="primary" onClick={() => handleShifts(model)}>
                          Assign Shifts
                        </Button>
                      </Col>
                       <Col md={4}>
                      <Button color="primary" onClick={() => handleConfiguration(model)}>
                          Configuration
                        </Button>
                      </Col>
                      <Col md={12} className='mb-1'>
                        <Badge color='light-secondary'>Description:</Badge> {model.description}
                      </Col>   
                    </Row>
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          ))}</> : <div className='text-center'>No data found</div>} </> : <div className="container h-100 d-flex justify-content-center">
          <div className="jumbotron my-auto">
            <div className="display-3"><Spinner type='grow' color='primary'/></div>
          </div>
      </div> } 
        </Row>
      </div>
      <Offcanvas isOpen={showCanvas} toggle={handleCanvas} scroll={true} direction="end">
        <OffcanvasHeader toggle={handleCanvas}>Configuration</OffcanvasHeader>
        <OffcanvasBody>
          <WorkModelConfiguration  workmodel={selectedItem}/>
          {/* <ConfigurationHandling workmodel={selectedItem}/> */}
        </OffcanvasBody>
      </Offcanvas>
      <Offcanvas isOpen={showShiftCanvas} toggle={handleShiftCanvas} scroll={true} direction="end">
        <OffcanvasHeader toggle={handleShiftCanvas}>Assign Shifts</OffcanvasHeader>
        <OffcanvasBody>
          <AssignShift  workmodel={selectedItem} shift={shifts} shift_setup={shift_setup}/>
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default WorkingModel
