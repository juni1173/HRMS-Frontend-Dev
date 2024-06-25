import React, { Fragment, useEffect, useState } from 'react'
import { Card, Button, CardBody, Row, Col, CardTitle, CardText, Badge, Offcanvas, OffcanvasBody, OffcanvasHeader, Spinner} from 'reactstrap'
// import CreateModels from './createmodel'
import apiHelper from '../Helpers/ApiHelper'
import CreateFlow from './createflow'
import ViewFlow from './viewflow'
import EmployeeHelper from '../Helpers/EmployeeHelper'

const ApprovalFlow = () => {
  const Api = apiHelper()
  const EmpHelper = EmployeeHelper()
  const [flowData, setFlowData] = useState([])
  const [categoriesData, setCategoriesData] = useState()
  const [approvalUnit, setApprovalUnit] = useState()
  const [isloading, setisloading] = useState()
  const [showCanvas, setShowCanvas] = useState(false)
  const [selectedModel, setSelectedModel] = useState()
  const [employees, setEmployees] = useState([])
   
  const fetchFlowData = async () => {
        setisloading(true)
      const result = await Api.get('/approval/approvalflow/')
      if (result) {
      if (result.status === 200) {
        setFlowData(result.data)
        setisloading(false)
      } else {
        setisloading(false)
        Api.Toast('error', result.message)
      } 
} else { 
    Api.Toast('error', 'Unable to fetch data')
}
}
const handleCanvas = () => {
    setShowCanvas(!showCanvas)
  }
const handleConfiguration = (item) => {
    setSelectedModel(item)
setShowCanvas(!showCanvas)
}

  const transformData = (data) => {
    if (data && data.length > 0) {
    return data.map(item => ({
      value: item.id,
      label: item.title
    }))
}
  }
  const predata = async () => {
        setisloading(true)
      const result = await Api.jsonPost('/approval/approvalflow/pre/data/')
      if (result) {
      if (result.status === 200) {
        // setCategoriesData(result.data.categories)
        setCategoriesData(transformData(result.data.categories))
        setApprovalUnit(result.data.approval_unit)
        setisloading(false)
      } else {
        setisloading(false)
        Api.Toast('error', result.message)
      }
    } else {
        Api.Toast('error', 'Unable to fetch data')
    }
}

  const CallBack = () => {
    fetchFlowData()
  }
 

  useEffect(() => {
    predata()
    fetchFlowData()
    if (employees.length === 0) {
          EmpHelper.fetchEmployeeDropdown().then(result => {
            setEmployees(result)
          })
        }
  }, [])

  return (
    <Fragment>
      <div>
        <h2>Approval Flow</h2>
        <Button className='mt-2 mb-3 btn btn-primary' >
          Create Approval Flow
        </Button>
        
          <Card>
            <CardBody>
<CreateFlow dropdownData = {{
    categories : categoriesData,
     employees
}} CallBack={CallBack} approval_unit={approvalUnit}/>
            </CardBody>
          </Card>
        <Row className='mt-4'>
            {!isloading ? <>
            {flowData && flowData.length > 0 ?  <>
          {flowData.map(approval => (
            <Col md='12' key={approval.id} className='mb-4'>
              <Card>
                <CardBody>
                  <CardTitle tag="h5">{approval.title} ({approval.short_code})</CardTitle>
                  <CardText>
                    <Row>
                      <Col md={6} className='mb-1'>
                        <Badge color='light-success'>Category:</Badge> {approval.category_title}
                      </Col>
                      <Col md={6}>
                      <Button color="primary" onClick={() => handleConfiguration(approval)}>
                          Hierarchy
                        </Button>
                      </Col> 
                      {/* <Col md={4} className='mb-1'>
                        <Badge color='light-primary'>Work Mode:</Badge> {model.work_mode_title}
                      </Col>
                      <Col md={4} className='mb-1'>
                        <Badge color='light-warning'>Work Type:</Badge> {model.work_type_title}
                      </Col>
                      <Col md={4} className='mb-1'>
                        <Badge color='dark'>Employee Class:</Badge> {model.employee_class_title}
                      </Col>
                      <Col md={4} className='mb-1'>
                        <Button color="primary" onClick={() => handleShifts(model)}>
                          Assign Shifts
                        </Button>
                      </Col>  */}
                      <Col md={12} className='mb-1'>
                        <Badge color='light-secondary'>Description:</Badge> {approval.description}
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
        <OffcanvasHeader toggle={handleCanvas}>View Hierarchy</OffcanvasHeader>
        <OffcanvasBody>
        <ViewFlow approval={selectedModel} employees={employees}/>
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default ApprovalFlow
