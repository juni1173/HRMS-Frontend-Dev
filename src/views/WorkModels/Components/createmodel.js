import React, { useState } from 'react'
import { Row, Col, Input, Button, Form, FormGroup, Label } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'

const CreateModels = ({dropdowndata, CallBack}) => {
  const [title, setTitle] = useState('')
  const [shortCode, setShortCode] = useState('')
  const [description, setDescription] = useState('')
  const [selectedEngagementSchedule, setSelectedEngagementSchedule] = useState(null)
  const [selectedWorkMode, setSelectedWorkMode] = useState(null)
  const [selectedWorkType, setSelectedWorkType] = useState(null)
//   const [selectedShifts, setSelectedShifts] = useState(null)
  const [selectedEmployeeClass, setSelectedEmployeeClass] = useState(null)
  const [configType, setConfigType] = useState()

  const Api = apiHelper()
//   useEffect(() => {
//     fetchData()
//   }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      title,
      short_code: shortCode,
      description,
      engagement_Schedule: selectedEngagementSchedule ? selectedEngagementSchedule.value : null,
      work_mode: selectedWorkMode ? selectedWorkMode.value : null,
      work_type: selectedWorkType ? selectedWorkType.value : null,
    //   shift: selectedShifts ? selectedShifts.value : null,
      employee_class: selectedEmployeeClass ? selectedEmployeeClass.value : null,
      model_base_configuration: configType === 'Model',
      shift_base_configuration: configType === 'Shift'

    }
    // Submit formData to the API
    Api.jsonPost('/employeeworking/workingmodel/', formData)
      .then(response => {
        if (response.status === 200) {
          Api.Toast('success', 'Created successfully')
          CallBack()
        } else {
          Api.Toast('error', 'Failed to create')
        }
      })
      .catch(error => {
        Api.Toast('error', error)
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Row className='mb-2'>
        <h2>Working Model</h2>
          <Col md='6'>
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
            <Input
              type="text"
              className='react-select mb-1'
              id="shortCode"
              placeholder='Short Code'
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              required
            />
          </Col>
          <Col md='6'>
            <Select
              options={dropdowndata.engagement_Schedule}
              className='react-select mb-1'
              classNamePrefix='select'
              placeholder="Engagement Schedule"
              value={selectedEngagementSchedule}
              onChange={setSelectedEngagementSchedule}
            />
          </Col>
          <Col md='6'>
            <Select
              options={dropdowndata.work_Mode}
              className='react-select mb-1'
              classNamePrefix='select'
              placeholder="Work Mode"
              value={selectedWorkMode}
              onChange={setSelectedWorkMode}
            />
          </Col>
          <Col md='6'>
            <Select
              options={dropdowndata.work_Type}
              className='react-select mb-1'
              classNamePrefix='select'
              placeholder="Work Type"
              value={selectedWorkType}
              onChange={setSelectedWorkType}
            />
          </Col>
          {/* <Col md='6'>
            <Select
              options={dropdowndata.shift}
              className='react-select mb-1'
              classNamePrefix='select'
              placeholder="Shift"
              value={selectedShifts}
              onChange={setSelectedShifts}
            />
          </Col> */}
          <Col md='6'>
            <Select
              options={dropdowndata.employee_Class}
              className='react-select mb-1'
              classNamePrefix='select'
              placeholder="Employee Class"
              value={selectedEmployeeClass}
              onChange={setSelectedEmployeeClass}
            />
          </Col>
          <Col md='6'>
            <Row>
      <FormGroup tag="fieldset">
        <legend>Configuration Type</legend>
        <FormGroup check>
          <Label check>
            <Input type="radio" name="configType" value="Mode" checked={configType === 'Model'} onChange={() => setConfigType('Model')} />{' '}
            Mode Base Configuration
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type="radio" name="configType" value="Shift" checked={configType === 'Shift'} onChange={() => setConfigType('Shift')} />{' '}
            Shift Base Configuration
          </Label>
        </FormGroup>
      </FormGroup>
      </Row>
    </Col>
          <Col md='12'>
            <Input
              type="textarea"
              className='react-select mb-1'
              id="description"
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Col>
          <Col md='4'>
            <Button type="submit" className='btn btn-primary'>Create</Button>
          </Col>
        </Row>
      </form>
    </div>
  )
}

export default CreateModels
