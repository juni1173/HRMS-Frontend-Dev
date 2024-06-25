import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Row, Col, Label, Button, Spinner, Input, Badge, Table, UncontrolledTooltip, CardBody, Card, Nav, NavItem, TabContent, TabPane, NavLink, Offcanvas, OffcanvasBody, OffcanvasHeader, CardTitle, CardText } from 'reactstrap'
import { Save, XCircle, FileText, HelpCircle, Eye } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import DatePicker, { DateObject } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
const format = "YYYY-MM-DD"
import EmployeeHelper from '../../Helpers/EmployeeHelper'
import StatusLogsComponent from './StatusLogs'
const WorkApplication = ({workdata, yearoptions}) => {
  const employeeHelper = EmployeeHelper()
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(true)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [showform, setshowform] = useState(false)
    const [data, setData] = useState()
    const [yearvalue, setYearValue] = useState(null)
    const [employees, setEmployeeDropdown] = useState([])
    const yearValueRef = useRef(null)
    const [work_types] = useState([])
    const [attachment, setAttachment] = useState(null)
    const [hierarchyData, setHierarchyData] = useState()
    const [dates, setDates] = useState([])
    const [isLogsOpen, setIsLogsOpen] = useState(false)
    const [currentLogs, setCurrentLogs] = useState()

    const toggleLogs = () => setIsLogsOpen(!isLogsOpen)

    const handleLogsClick = (logs) => {
        setCurrentLogs(logs)
        toggleLogs()
    }
   const fetchHierarchy = async(work_type) => {
    const formData = new FormData()
      formData['type'] = work_type
      formData['short_code'] = 'WR'
      const response = await Api.jsonPost('/approval/approvalhierarchy/', formData)
      if (response.status === 200) {
        setHierarchyData(response.data)
      } else {
        return Api.Toast('error', 'Pre server data not found')   
      }
   } 
    
    const work_types_dropdown = () => {
      if (Object.values(workdata).length > 0) {
        work_types.splice(0, work_types.length)
        for (let i = 0; i < workdata['work_types'].length; i++) {
                work_types.push({value:workdata['work_types'][i].id, label: workdata['work_types'][i].title })
        } 
}
}
const getEmployeeData = async () => {
  await employeeHelper.fetchEmployeeDropdown().then(result => {
    setEmployeeDropdown(result)
   })
}
useEffect(() => {
  getEmployeeData()
  return false
}, [setEmployeeDropdown])
  const work = async () => {
      setLoading(true)
      const formData = new FormData()
      formData['year'] = yearvalue
      const response = await Api.jsonPost('/work/employee/record/work/data/', formData)
      if (response.status === 200) {
          setData(response.data)
          work_types_dropdown()
          setLoading(false)
      } else {
        setLoading(false)
        return Api.Toast('error', 'Pre server data not found')   
      }
      // setTimeout(() => {
      //     setLoading(false)
      // }, 1000)
  }
  const CallBack = () => {
    work()
  }
  useEffect(() => {
    work()
  }, [setData, yearvalue])

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setAttachment(e.target.files[0]) 
        }
      } 
    const remove_attachment = () => {
        setAttachment() 
      } 
    const removeAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Work Request!",
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
                Api.deleteData(`/work/employees/work/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Work Request Deleted!',
                            text: 'Work Request is deleted.',
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
                            title: 'Work Request can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Work Request is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
     // Initial state for workData to include evaluators object
     const [workData, setWorkData] = useState({
      work_types: '',
      start_date: '',
      end_date: '',
      duration: '',
      team_lead: '',
      evaluators: {} // Add evaluators to handle dynamic selection
    })
    const onChangeWorkDetailHandler = (InputName, InputType, e) => {
      let InputValue
      if (InputType === 'input') {
        InputValue = e.target.value
      } else if (InputType === 'select') {
        InputValue = e
      } else if (InputType === 'date') {
        const formatDate = Api.formatDate(e)
        InputValue = formatDate
      } else if (InputType === 'file') {
        InputValue = e.target.files[0].name
      }
  
      if (InputName === 'work_types') {
        fetchHierarchy(e)
      }
  
      if (InputName.startsWith('evaluator_')) {
        const evaluatorUnit = InputName.replace('evaluator_', '')
        setWorkData((prevState) => ({
          ...prevState,
          evaluators: {
            ...prevState.evaluators,
            [evaluatorUnit]: InputValue
          }
        }))
      } else {
        setWorkData((prevState) => ({
          ...prevState,
          [InputName]: InputValue
        }))
      }
    }
  
    const submitForm = async () => {
      setIsButtonDisabled(true)
      workData.duration = dates.length
      const workDates = dates.map((date) => date.format('YYYY-MM-DD'))
      workData.start_date = workDates[0]
      workData.end_date = workDates[workDates.length - 1]
  
      if (workData.work_types && workData.start_date && workData.end_date && workData.duration) {
        const formData = new FormData()
        formData.append('work_type', workData.work_types)
        formData.append('start_date', workData.start_date)
        formData.append('end_date', workData.end_date)
        formData.append('duration', workData.duration)
        formData.append('work_dates', workDates)
  
        if (workData.team_lead && workData.team_lead.value) {
          formData.append('team_lead', workData.team_lead.value)
        }
  
        if (attachment) formData.append('attachment', attachment)

// Append hierarchy_data
const hierarchydata = hierarchyData.map(item => {
  const evaluatorUnit = Object.keys(workData.evaluators).find(unit => unit === item.unit_title)
  const selectedEvaluator = evaluatorUnit ? workData.evaluators[evaluatorUnit].value : null
  
  return {
    unit_id: item.id,
    unit_title: item.unit_title,
    evaluator: item.is_fixed ? item.employee : selectedEvaluator,
    is_fixed: item.is_fixed
  }
})

       formData.append('hierarchy_data', JSON.stringify(hierarchydata))
  
        const result = await Api.jsonPost(`/work/employees/work/`, formData, false)
        if (result) {
          if (result.status === 200) {
            setLoading(true)
            Api.Toast('success', result.message)
            work()
            setWorkData({
              work_types: '',
              start_date: '',
              end_date: '',
              duration: '',
              team_lead: '',
              evaluators: {} // Reset evaluators
            })
            setDates([])
            setTimeout(() => {
              setLoading(false)
            }, 1000)
          } else {
            Api.Toast('error', result.message)
          }
          setIsButtonDisabled(false)
        }
      } else {
        Api.Toast('error', 'Please fill required fields!')
        setIsButtonDisabled(false)
      }
    }
    const [activeTab, setActiveTab] = useState(0)

    const toggleTab = (tabIndex) => {
      if (activeTab !== tabIndex) setActiveTab(tabIndex)
    }
    const renderApprovalMessage = () => {
      if (hierarchyData && hierarchyData.length > 0) {
        return (
          <div className="approval-message-container">
            <Nav tabs>
              {hierarchyData.map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    className={index === hierarchyData.length - 1 ? 'final-approval-tab' : ''}
                    active={activeTab === index}
                    onClick={() => toggleTab(index)}
                  >
                    {item.unit_title} {item.employee_name ? `(${item.employee_name})` : ''}
                    {index === hierarchyData.length - 1 && <Badge color="danger">Final</Badge>}
                    {item.is_veto && <Badge color="success">Veto Power</Badge>}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={activeTab}>
              {hierarchyData.map((item, index) => (
                <TabPane key={index} tabId={index}>
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          {item.is_veto  ? "This request requires approval from a veto authority:"   : index === hierarchyData.length - 1 ? "Your request needs final approval from:"  : "Your request needs to be approved by:"}
                        </td>
                        <td>{item.unit_title} {item.employee_name ? `(${item.employee_name})` : ''}</td>
                      </tr>
                      {item.is_fixed === false && (
                        <tr>
                          <td>Correspondent Selection:</td>
                          <td>
                            You can select the correspondent person for {item.unit_title}
                            <br />
                            <Select
                              type="text"
                              name={`evaluator_${item.unit_title}`}
                              options={employees}
                              onChange={(e) => onChangeWorkDetailHandler(`evaluator_${item.unit_title}`, 'select', e)}
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </TabPane>
              ))}
            </TabContent>
          </div>
        )
      }
      return null
    }
    
  return (
    <Fragment>
        <Row>
          <Col md={12}>
         <div className='content-header' >
          <h5 className='mb-2'>Work Request</h5>
          {/* <small>Add position.</small> */}
        </div>
        {!loading && (
            <>
            <Button className='btn btn-success mb-2' onClick={() => setshowform(!showform)}>Add Work Request </Button>
            {showform ?  <Card>
            <CardBody>
            <h5 className='mb-2'>Add Work Request</h5>
            <Row>
               <Col md="6" className="mb-1">
                <Label className="form-label">
                Work Type <Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="work_types"
                    options={work_types}
                    onChange={ (e) => onChangeWorkDetailHandler('work_types', 'select', e.value) }
                    menuPlacement="auto" 
                    menuPosition='fixed'
                />
        </Col>
        <Col md={6} className="mb-1">
        <Label className="form-label">Attachment</Label>
            {attachment ? (
              <div className="float-right">
                <FileText color='green'/>
                <button className="btn" onClick={remove_attachment}>
                  <XCircle />
                </button>
              </div>
                ) : (
                <div>
                    <Input
                        type="file"
                        id="attachment"
                        name="attachment"
                        accept="image/*"
                        onChange={imageChange}
                        />
                </div>
                )}
        </Col>
        <Col md="6" className="mb-1">
        <Label className="form-label">
               Work Dates <Badge color='light-danger'>*</Badge>
                </Label>
                <br/>
            {/* <div style={{ height: '200px', overflow: 'auto' }}> */}
        <DatePicker
          value={dates}
          onChange={setDates}
          multiple
          sort
          format={format}
          style={{ //input style
            width: "100%",
            height: "40px",
            boxSizing: "border-box"
          }}
          calendarPosition="right"
          plugins={[<DatePanel />, weekends()]}
          placeholder='Work Dates'
          mapDays={({ date }) => {
            return {
              disabled: date.weekDay.index === 0 || date.weekDay.index === 6 
            }
          }}
        />
        {/* </div> */}
            </Col>
                 {/* <Col md="6" className="mb-1">
                <Label className="form-label">
               Team Lead
                </Label>
                <Select
                    type="text"
                    name="evaluator"
                    options={employees}
                    onChange={ (e) => { onChangeWorkDetailHandler('team_lead', 'select', e) }}
                    />
            </Col> */}
            <Col md={12}>
                      <div className="mt-2">
                        {renderApprovalMessage()}
                        {/* <RenderApprovalMessage hierarchyData={hierarchyData} employees={employees}/> */}
                      </div>
                    </Col>
        <Col md={6}>
                <Button color="primary" className="btn-next mt-2" onClick={submitForm} disabled={isButtonDisabled}>
                <span className="align-middle d-sm-inline-block">
                  Submit
                </span>
                <Save
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></Save>
              </Button>
        </Col>
        </Row>
        </CardBody></Card> : null}
            
        </>
        )}
        </Col>
       
        {!loading ? (
  <>
  {/* <Card>
    <CardBody>  */}
    <Col md={6} className="mt-2">
    <Label>Search By Year</Label>
    <Select
      isClearable={true}
      options={yearoptions}
      className='react-select mb-1'
      classNamePrefix='select'
      placeholder="Search By Year"
      value={yearoptions.find(option => option.value === yearvalue)}
      onChange={(selectedOption) => {
        if (selectedOption !== null) {
          setYearValue(selectedOption.value)
          yearValueRef.current = selectedOption.value
        } else {
          setYearValue(null)
          yearValueRef.current = null
        }
      }}
      menuPlacement="auto" 
      menuPosition='fixed'
    />
  </Col>
  <div className="container mt-5">
      {data && data.length > 0 ? (
        <Row>
          {data.map((record, recordKey) => (
            <Col md={12} key={recordKey} className="mb-4">
              <Card className="shadow-sm border">
                <CardBody>
                  <Row>
                    <Col xs={12} className="text-center">
                      <CardTitle tag="h5">
                        {record.work_type_title ? record.work_type_title : <Badge color="danger">N/A</Badge>}
                      </CardTitle>
                    </Col>
                    <Col xs={4}>
                      <CardText>
                        <strong>Duration:</strong> {record.duration ? record.duration : <Badge color="danger">N/A</Badge>}
                      </CardText>
                      </Col>
                      <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>Start Date:</strong> {record.start_date ? record.start_date : <Badge color="danger">N/A</Badge>}
                      </CardText>
                      </Col>
                      <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>End Date:</strong> {record.end_date ? record.end_date : <Badge color="danger">N/A</Badge>}
                      </CardText>
                    </Col>
                    <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>Attachment:</strong> {record.attachment ? (
                          <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_PUBLIC_URL}${record.attachment}`}>
                            <FileText />
                          </a>
                        ) : (
                          <Badge color="danger">N/A</Badge>
                        )}
                      </CardText>
                      </Col>
                      <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>Status:</strong> <Badge color={record.status === 'approved' ? 'success' : 'primary'} pill>
                          {record.status ? record.status : 'N/A'}
                        </Badge>
                        {record.decision_reason && (
                          <>
                            <HelpCircle id={`UnControlledWork${recordKey}`} />
                            <UncontrolledTooltip target={`UnControlledWork${recordKey}`}>
                              {record.decision_reason}
                            </UncontrolledTooltip>
                          </>
                        )}
                        {/* {record.status !== 'approved' && record.status !== 'not-approved' && (
                          <span>
                            {record.status_logs && record.status_logs.length > 0 ? `${record.status_logs[0].status} by ${record.status_logs[0].unit_title} (${record.status_logs[0].action_by_name})` : 'in-progress'}
                          </span>
                        )} */}
                      </CardText>
                      </Col>
                      {record.status !== 'approved' && record.status !== 'not-approved' ?    <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>Latest Status:</strong>
                          <span>
                            {record.status_logs && record.status_logs.length > 0 ? `${record.status_logs[0].status} by ${record.status_logs[0].unit_title} (${record.status_logs[0].action_by_name})` : 'in-progress'}
                          </span>
                      </CardText>
                    </Col> : null}
                    {record.status === 'in-progress' ?   <Col xs={4} className="text-center mt-1">
                        <Button color="link" className="p-0" onClick={() => removeAction(record.id)}>
                          <XCircle color="red" />
                        </Button>  
                    </Col> : null}
                    <Col xs={4} className="text-center mt-1">
                    <CardText>
                      <Button color="link" className="p-0" onClick={() => handleLogsClick(record.status_logs)}>
                        View Details
                      </Button>
                      </CardText>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center">No record found</div>
      )}
    </div>

  </>
) : (
  <div className="text-center"><Spinner type='grow' color='primary'/></div>
)}
 </Row>
 <Offcanvas isOpen={isLogsOpen} toggle={toggleLogs} scroll={true} direction="end">
        <OffcanvasHeader toggle={toggleLogs}>View History</OffcanvasHeader>
        <OffcanvasBody>
        <StatusLogsComponent logs={currentLogs} />
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default WorkApplication