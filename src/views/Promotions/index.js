import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { Form, FormGroup, Label, Input, Button, Container, Row, Col, Card, CardBody } from 'reactstrap'
import EmployeeHelper from '../Helpers/EmployeeHelper'
import Employees from '../Employee-Information/EmployeeList/Employees'
import apiHelper from '../Helpers/ApiHelper'
import Requests from './Requests'
const Promotion = () => {
  const Api = apiHelper()  
  const EmpHelper = EmployeeHelper()
  const [employees, setEmployees] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [reasonData, setReasonData] = useState([])
//   const [typeData, settypeData] = useState([])

    const [promotionData, setPromotionData] = useState({
        employee: null,
        reason: null,
        custom_reason: '',
        // is_self_request: false,
        // is_hr_request: false,
        // is_team_lead_request: false,
        // is_custom_request: false,
        type: null,
        approval_flow: null
        // effective_date: ''
    })

    const onChangePromotionDataHandler = (InputName, InputType, e) => {
        
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

        setPromotionData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }

    const handleSubmit = async(event) => {
        event.preventDefault()
        console.log(promotionData)
        const formData = new FormData()
        formData['employee'] = promotionData.employee.value
        if (promotionData.reason.value === 'custom') {
            formData['reason'] = null
            formData['custom_reason'] = promotionData.custom_reason
            formData['is_custom_request'] = true
        } else {
            formData['reason'] = promotionData.reason.value
        }
        // formData['type'] = promotionData.type.value 
        // formData['approval_flow'] = promotionData.approval_flow.value
        const result = await Api.jsonPost('/promotion/request/', formData)
        if (result.status === 200) {
          Api.Toast('success', result.message)
        } else {
          // Handle error
          Api.Toast('error', result.message)
        }
    }
    const predata = async() => {
        // const formData = new FormData()
        // formData['type'] =  promotionData.type.value
    
        const result = await Api.jsonPost('/promotion/pre/data/')
        if (result.status === 200) {
            const options = result.data.reason_data.map(item => ({
                value: item.id,
                label: item.title
            }))
            options.push({ value: 'custom', label: 'Custom' })
            setReasonData(options)
        }
    }
    // const fetchtypes = async() => {
    //     const result = await Api.get('/promotiontype/')
    //     if (result.status === 200) {
    //         const options = result.data.map(item => ({
    //             value: item.id,
    //             label: item.title
    //         }))
    //         settypeData(options)
    //     }
    // }
    useEffect(() => {
            predata()
    }, [])
    
    useEffect(() => {
        if (employees.length === 0) {
              EmpHelper.fetchEmployeeDropdown().then(result => {
                setEmployees(result)
              })
            }
            if (evaluations.length === 0) {
                EmpHelper.fetchEvaluationDropdown().then(result => {
                  setEvaluations(result)
                })
              }
            // fetchtypes()
      }, [])

    return (
        <Card>
            <CardBody>
            <>
             <Form onSubmit={handleSubmit}>
            <Row>
            {/* <Col md={6}>
                        <FormGroup>
                            <Label for="type">Type:</Label>
                            <Select
                                id="type"
                                name="type"
                                options={typeData}
                                onChange={ (e) => { onChangePromotionDataHandler('type', 'select', e) }}
                            />
                        </FormGroup>
                        </Col> */}
                    <Col md={6}>
                        <FormGroup>
                            <Label for="employee">Employee:</Label>
                            <Select
                                id="employee"
                                name="employee"
                                options={employees}
                                onChange={ (e) => { onChangePromotionDataHandler('employee', 'select', e) }}
                            />
                        </FormGroup>
                        </Col>
<Col md={6}>
                        <FormGroup>
                            <Label for="reason">Reason:</Label>
                            <Select
                                id="reason"
                                name="reason"
                                options={reasonData}
                                onChange={ (e) => { onChangePromotionDataHandler('reason', 'select', e) }}
                            />
                        
                               </FormGroup> 
                               </Col>

                            {promotionData.reason?.value === 'custom' && (
                                <Col md={6}>
                                <FormGroup>
                                <Label for="reason">Reason:</Label>
                                <Input
                                    type="text"
                                    name="custom_reason"
                                    value={promotionData.custom_reason}
                                    onChange={ (e) => { onChangePromotionDataHandler('custom_reason', 'input', e) }}
                                    placeholder="Enter custom reason"
                                    // className="mt-2"
                                />
                                </FormGroup>
                                </Col>
                            )} 
                            {/* <Col md={6}>
                        <FormGroup>
                            <Label for="reason">Approval:</Label>
                            <Select
                                id="approval_flow"
                                name="approval_flow"
                                options={approvaldata}
                                onChange={ (e) => { onChangePromotionDataHandler('approval_flow', 'select', e) }}
                            />
                        
                               </FormGroup> 
                               </Col>              */}

                        <Button type="submit" color="primary">Submit</Button>
                        </Row>
                    </Form>
                    </>
            </CardBody>
            <Requests employees={employees} evaluations={evaluations}/>
        </Card>
    )     
}

export default Promotion
