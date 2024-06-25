import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Row, Nav, NavItem, NavLink, TabPane, TabContent, Col, Label, Button, Spinner, Input, Badge, Table, UncontrolledTooltip, CardBody, Card, Offcanvas, OffcanvasBody, OffcanvasHeader, CardText, CardTitle } from 'reactstrap'
import { Save, XCircle, FileText, HelpCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import DatePicker, { DateObject } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
// import highlightWeekends from 'react-multi-date-picker/plugins/highlight_weekends'
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
const format = "YYYY-MM-DD"
import EmployeeHelper from '../../Helpers/EmployeeHelper'
import StatusLogsComponent from './StatusLogs'
const Leave = ({leavedata, yearoptions}) => {
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
    const [leave_types] = useState([])
    const [attachment, setAttachment] = useState(null)
    const [hierarchyData, setHierarchyData] = useState()

    const [leaveData, setLeaveData] = useState({
        leave_types: '',
        start_date : '',
        end_date: '',
        duration: ''
        // team_lead: ''
   })
   const [dates, setDates] = useState([])
   const [isLogsOpen, setIsLogsOpen] = useState(false)
   const [currentLogs, setCurrentLogs] = useState()

    const toggleLogs = () => setIsLogsOpen(!isLogsOpen)

    const handleLogsClick = (logs) => {
        setCurrentLogs(logs)
        toggleLogs()
    }
    // new DateObject().set({ day: 4, format }),
    // new DateObject().set({ day: 25, format }),
    // new DateObject().set({ day: 20, format })
    const fetchHierarchy = async(leave_type) => {
      const formData = new FormData()
        formData['type'] = leave_type
        formData['short_code'] = 'LR'
        const response = await Api.jsonPost('/approval/approvalhierarchy/', formData)
        if (response.status === 200) {
          setHierarchyData(response.data)
        } else {
          return Api.Toast('error', 'Pre server data not found')   
        }
     } 
    const onChangeLeavesDetailHandler = (InputName, InputType, e) => {
        
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
        if (InputName === 'leave_types') {
          fetchHierarchy(e)
        }
        if (InputName.startsWith('evaluator_')) {
          const evaluatorUnit = InputName.replace('evaluator_', '')
          setLeaveData((prevState) => ({
            ...prevState,
            evaluators: {
              ...prevState.evaluators,
              [evaluatorUnit]: InputValue
            }
          }))
        } else {
        setLeaveData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))
      }
    }
    const leave_types_dropdown = () => {
      if (Object.values(leavedata).length > 0) {
        leave_types.splice(0, leave_types.length)
        for (let i = 0; i < leavedata['leave_types'].length; i++) {
                leave_types.push({value:leavedata['leave_types'][i].id, label: leavedata['leave_types'][i].title })
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
  const leaves = async () => {
      setLoading(true)
      const formData = new FormData()
      formData['year'] = yearvalue
      const response = await Api.jsonPost('/reimbursements/employee/recode/leave/data/', formData)
      if (response.status === 200) {
          setData(response.data)
          leave_types_dropdown()
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
    leaves()
  }
  useEffect(() => {
    leaves()
  }, [setData, yearvalue])

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setAttachment(e.target.files[0]) 
        }
      } 
    const remove_attachment = () => {
        setAttachment() 
      } 
    const submitForm = async () => {
        setIsButtonDisabled(true)
        leaveData.duration = dates.length
          const leaveDates = dates.map((date) => date.format())
          leaveData.start_date = leaveDates[0]
        leaveData.end_date = leaveDates[leaveDates.length - 1]
        if (leaveData.leave_types !== '' && leaveData.start_date !== '' && leaveData.end_date !== '' && leaveData.duration !== '') {
            const formData = new FormData()
            formData.append('leave_types', leaveData.leave_types)
            formData.append('start_date', leaveData.start_date)
            formData.append('end_date', leaveData.end_date)
            formData.append('duration', leaveData.duration)
            formData.append('leave_dates', leaveDates)
            // formData.append('team_lead', leaveData.team_lead.value)
            if (attachment !== null) formData.append('attachment', attachment)
            // Append hierarchy_data
const hierarchydata = hierarchyData.map(item => {
  const evaluatorUnit = Object.keys(leaveData.evaluators).find(unit => unit === item.unit_title)
  const selectedEvaluator = evaluatorUnit ? leaveData.evaluators[evaluatorUnit].value : null
  
  return {
    unit_id: item.id,
    unit_title: item.unit_title,
    evaluator: item.is_fixed ? item.employee : selectedEvaluator,
    is_fixed: item.is_fixed
  }
})

       formData.append('hierarchy_data', JSON.stringify(hierarchydata))
            await Api.jsonPost(`/reimbursements/employees/leaves/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setLoading(true)
                        Api.Toast('success', result.message)
                        CallBack()
                        setLeaveData(prevState => ({
                            ...prevState,
                            leave_types: '',
                            start_date : '',
                            end_date: '',
                            duration: '',
                            team_lead: '',
                            evaluators: {}
                       })
                        )
                        setDates([])
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000)
                    } else {
                        Api.Toast('error', result.message)
                    }
                    setIsButtonDisabled(false)
                }
            })
        } else {
            Api.Toast('error', 'Please fill required fields!')
            setIsButtonDisabled(false)
        }
       
    }
    const removeAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Leave Request!",
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
                Api.deleteData(`/reimbursements/employees/leaves/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Leave Request Deleted!',
                            text: 'Leave Request is deleted.',
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
                            title: 'Leave Request can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Leave Request is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
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
                              onChange={(e) => onChangeLeavesDetailHandler(`evaluator_${item.unit_title}`, 'select', e)}
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
          <h5 className='mb-2'>Leaves Request</h5>
          {/* <small>Add position.</small> */}
        </div>
        {!loading && (
            <>
            <Button className='btn btn-success mb-2' onClick={() => setshowform(!showform)}>Add Leave Request </Button>
            {showform ?  <Card>
            <CardBody>
            <h5 className='mb-2'>Add Leaves Request</h5>
            <Row>
               <Col md="6" className="mb-1">
                <Label className="form-label">
                Leave Type <Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="leave_types"
                    options={leave_types}
                    onChange={ (e) => onChangeLeavesDetailHandler('leave_types', 'select', e.value) }
                    menuPlacement="auto" 
                    menuPosition='fixed'
                />
        </Col>
        {/* <Col md='4' className='mb-1'>
                <label className='form-label'>
                  Duration <Badge color="light-danger">*</Badge> 
                </label>
                <Input type="number" 
                    name="duration"
                    onChange={ (e) => { onChangeLeavesDetailHandler('duration', 'input', e) }}
                    placeholder="Duration"  />
        </Col> */}
        <Col md={6} className="mb-1">
        <Label className="form-label">Attachment</Label>
            {attachment ? (
              <div className="float-right">
                {/* <img
                  src={URL.createObjectURL(attachment)}
                  alt="Thumb"
                  width="50"
                /> */}
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
        <Label className='form-label' for='default-picker'>
               Leave Dates <Badge color="light-danger">*</Badge>
            </Label>
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
          placeholder='Leave Dates'
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
                    onChange={ (e) => { onChangeLeavesDetailHandler('team_lead', 'select', e) }}
                    />
            </Col> */}
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
        <Col md={12}>
        <div className="mt-2">
                        {renderApprovalMessage()}
                      </div>
        </Col>
        </Row>
        </CardBody></Card> : null}
            
        </>
        )}
        </Col>
       
        {!loading ? (
  <>
  <Card><CardBody>        <Col md={6} className="mt-2">
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
   {!loading ? (
  <>
    {(data.length > 0) ? (
      <Row>
        <Col md={12}>
          {data.map((employeeData, employeeKey) => (
            <React.Fragment key={employeeKey}>
              {employeeData.leave_data.length > 0 && (
                <>
                 {/* <Table bordered striped responsive className='my-1' key={employeeKey}> */}
                  {employeeData.leave_data.some(leaveData => leaveData.employee_leave_records.length > 0) && (
                  <>
                  {/* <thead className='table-dark text-center'>
                    <tr>
                      <th scope="col" className="text-nowrap">
                        Type
                      </th>
                      <th scope="col" className="text-nowrap">
                        Duration
                      </th>
                      <th scope="col" className="text-nowrap">
                        Start Date
                      </th>
                      <th scope="col" className="text-nowrap">
                        End Date
                      </th>
                      <th scope="col" className="text-nowrap">
                        Attachment
                      </th>
                      <th scope="col" className="text-nowrap">
                        Status
                      </th>
                      <th scope="col" className="text-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead> */}
                 
                  {/* <tbody className='text-center'> */}
                    {employeeData.leave_data.map((leaveData, leaveDataKey) => (
                      <React.Fragment key={leaveDataKey}>
                        {leaveData.employee_leave_records.map((record, recordKey) => (
                          <>
                            <Col md={12} key={recordKey} className="mb-4">
              <Card className="shadow-sm border">
                <CardBody>
                  <Row>
                    <Col xs={12} className="text-center">
                      <CardTitle tag="h5">
                        {record.leave_types_title ? record.leave_types_title : <Badge color="danger">N/A</Badge>}
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
                    <Col xs={4} className='mt-1'>
                      <CardText>
                      <strong>Remaining Leaves:</strong> {leaveData.remaining_leaves ? leaveData.remaining_leaves : <Badge color="danger">N/A</Badge>}
                      </CardText>
                      </Col>
                      <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>In-Progress Leaves:</strong> {leaveData.in_progress_leaves ? leaveData.in_progress_leaves : <Badge color="danger">N/A</Badge>}
                      </CardText>
                    </Col>
                    <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>Yearly Limit:</strong> {leaveData.emp_yearly_leaves ? leaveData.emp_yearly_leaves : <Badge color="danger">N/A</Badge>}
                      </CardText>
                    </Col>
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
                          </>
                          // <tr key={recordKey}>
                          //   <td className='nowrap'>{record.leave_types_title ? record.leave_types_title : <Badge color='light-danger'>N/A</Badge>}</td>
                          //   <td className='nowrap'>{record.duration ? record.duration : <Badge color='light-danger'>N/A</Badge>}</td>
                          //   <td className='nowrap'>{record.start_date ? record.start_date : <Badge color='light-danger'>N/A</Badge>}</td>
                          //   <td className='nowrap'>{record.end_date ? record.end_date : <Badge color='light-danger'>N/A</Badge>}</td>
                          //   <td>
                          //     {record.attachment ? <a target='_blank' href={`${process.env.REACT_APP_PUBLIC_URL}${record.attachment}`}> <FileText /> </a> : <Badge color='light-danger'>N/A</Badge>}
                          //   </td>
                          //   <td>
                          //     <Badge color={(record.status && record.status === 'approved') && 'light-success'}>{record.status ? record.status : <Badge color='light-danger'>N/A</Badge>}</Badge> 
                          //     {record.decision_reason && (
                          //       <>
                          //         <HelpCircle id={`UnControlledLeave${recordKey}`} />
                          //         <UncontrolledTooltip target={`UnControlledLeave${recordKey}`}>{record.decision_reason}</UncontrolledTooltip>
                          //       </>
                          //     )}
                          //   </td>
                          //   <td>
                          //     {record.status === 'in-progress' && (
                          //       <Row className='text-center'>
                          //         <Col className='col-12'>
                          //           <button
                          //             className="border-0 no-background"
                          //             onClick={() => removeAction(record.id)}
                          //           >
                          //             <XCircle color="red" />
                          //           </button>
                          //         </Col>
                          //       </Row>
                          //     )}
                          //   </td>
                          // </tr>
                        ))}
                       </React.Fragment>
                    ))}  
                    </>
                    )}
                    </>
                //    </tbody>
                // </Table>
              )}
            </React.Fragment>
          ))}
          {!data.some(employeeData => employeeData.leave_data.some(leaveData => leaveData.employee_leave_records.length > 0)) && (
            <div className="text-center">No Leave Data Found!</div>
          )}
        </Col>
      </Row>
    ) : (
      <div className="text-center">No Leave Data Found!</div>
    )}
  </>
) : (
  <div className="text-center"><Spinner /></div>
)}</CardBody></Card>


  </>
) : (
  <div className="text-center"><Spinner /></div>
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

export default Leave