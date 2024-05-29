import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Row, Col, Button, Badge } from 'reactstrap' // Assuming Button is imported from reactstrap
import apiHelper from '../../Helpers/ApiHelper'

const AssignModel = ({ employee, CallBack }) => {
  const Api = apiHelper()
  const [selectedWorkingModel, setSelectedWorkingModel] = useState(null)
  const [selectedShift, setSelectedShift] = useState(null)
  const [startDate, setStartDate] = useState(new Date())
  const [working_models, setworking_models] = useState()
  const [shifts, setShifts] = useState()

  const transformData = (data) => {
    return data.map(item => ({
      value: item.id,
      label: item.title
    }))
  }

  const fetchData = async () => {
    const response = await Api.get('/employeeworking/workingmodel/')
    if (response) {
      if (response.status === 200) {
        setworking_models(transformData(response.data))
      } else {
        Api.Toast('error', response.message)
      }
    } else {
      Api.Toast('error', 'Unable to fetch data')
    }
  }

  const fetchShifts = async (id) => {
    const formData = new FormData()
    formData['working_model'] = id
    const response = await Api.jsonPost('/employeeworking/workingmodel/shift/get/', formData)
    if (response) {
      if (response.status === 200) {
        setShifts(transformData(response.data))
      } else {
        Api.Toast('error', response.message)
      }
    } else {
      Api.Toast('error', 'Unable to fetch data')
    }
  }

  const handleStartDateChange = (date) => {
    setStartDate(date)
  }

  const handleworkingmodel = async (e) => {
    if (e !== undefined && e !== null) {
      setSelectedWorkingModel(e)
      await fetchShifts(e.value)
    }
  }

  const handleSave = async () => {
    const formData = new FormData()
    formData['employee'] = employee
    formData['working_model'] =  selectedWorkingModel.value
    formData['working_model_shift'] = selectedShift.value
    formData['effective_from'] = Api.formatDate(startDate)

    const response = await Api.jsonPost('/employeeworking/workingmodel/employee/assign/', formData)
    if (response) {
      if (response.status === 200) {
        // Call back if needed
        if (CallBack) {
          CallBack()
        }
        // Optionally, show success message or navigate to another page
        Api.Toast('success', response.message)
      } else {
        Api.Toast('error', response.message)
      }
    } else {
      Api.Toast('error', 'Unable to save')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Row className='mb-2'>
        <Col md={6} className='mt-2'>
          <label>Working Model <Badge color='light-danger'>*</Badge></label>
          <Select
            options={working_models}
            value={selectedWorkingModel}
            onChange={(e) => handleworkingmodel(e)}
            placeholder="Select Working Model"
          />
        </Col>
        <Col md={6} className='mt-2'>
          <label>Working Model Shift <Badge color='light-danger'>*</Badge></label>
          <Select
            options={shifts}
            value={selectedShift}
            onChange={setSelectedShift}
            placeholder="Select Working Model Shift"
          />
        </Col>
        <Col md={6} className='mt-2'>
          <label>Effective Start Date <Badge color='light-danger'>*</Badge></label>
          <Flatpickr
            name="startDate"
            value={startDate}
            placeholder="Joining Date"
            defaultValue={startDate}
            onChange={handleStartDateChange}
            className="form-control"
          />
        </Col>
        <Col md={6} className='mt-3'>
          <Button color="primary" onClick={handleSave}>Save</Button>
        </Col>
      </Row>
    </div>
  )
}

export default AssignModel
