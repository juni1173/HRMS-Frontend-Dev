import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row, Spinner, Badge } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
import { Copy } from 'react-feather'
import Select from 'react-select'

const WorkModelConfiguration = ({ workmodel, selectedShift }) => {
  const [formData, setFormData] = useState([])
  const [inputValues, setInputValues] = useState({})
  const [loading, setisloading] = useState()
  // const [selectedShifts, setSelectedShifts] = useState()

  const Api = apiHelper()

  // Fetch policy data from the server and set default values
  const fetchData = async () => {
    try {
        setisloading(true)
      const formData = new FormData()
      formData['working_model'] = workmodel.id
      selectedShift ? formData['working_model_shift'] = selectedShift.id : formData['working_model_shift'] = null
      const result = await Api.jsonPost('/employeeworking/workingmodel/configuration/data/', formData)
      if (result.status === 200) {
        setFormData(result.data)
        // Set default input values for each policy
        const defaultInputValues = result.data.reduce((acc, item) => {
          acc[item.policy_id] = item.value_type === 'boolean' ? (item.value === true) : item.value
          return acc
        }, {})
        setInputValues(defaultInputValues)
        setisloading(false)
      } else {
        Api.Toast('error', result.message)
        setisloading(false)
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle input change for each policy
  const handleInputChange = (e, id) => {
    const { value, checked } = e.target
    const inputValue = e.target.type === 'checkbox' ? checked : value
    setInputValues(prevState => ({
      ...prevState,
      [id]: inputValue
    }))
  }

  // Save the updated policy value
  const handleSave = async (id) => {
    try {
      const payload = {
        working_model: workmodel.id,
        working_model_policies: id,
        // working_model_shift: selectedShift ? selectedShift.id : null,
        value: inputValues[id]
      }
      const result = await Api.jsonPatch('/employeeworking/workingmodel/configuration/update/', payload)
      if (result.status === 200) {
        Api.Toast('success', result.message)
      } else {
        Api.Toast('error', result.message)
      }
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }
  // const handlecopy = async() => {
  //   console.log(selectedShifts)
  //   const payload = new FormData()
  //   payload['copy_shift'] = selectedShifts.value
  //   payload['shift'] = selectedShift.id
  //   const result = await Api.jsonPost('/employeeworking/workingmodel/configuration/copy/', payload)
  //   if (result) {
  //   if (result.status === 200) {
  //     Api.Toast('success', result.message)
  //     fetchData()
  //   } else {
  //     Api.Toast('error', result.message)
  //   } 
  // } else {
  //     Api.Toast('error', 'Unable to fetch data')
  //   }
  // }

  return (
    <div>
      <Form>
{/* {selectedShift ? <Row> <h5> Copy Configuration from other shift</h5>
  <Col md={6}>
    <Select
      options={shift}
      className='react-select mb-1'
      classNamePrefix='select'
      placeholder="Shift"
      value={selectedShifts}
      onChange={setSelectedShifts}
    />    
      </Col>
     <Col md={4}>
                <Button color="primary" onClick={() => handlecopy()}>
                 <Copy size={20}/> Copy
                </Button>
              </Col>

  </Row> : null} */}
  <br /><br/>
        {!loading ? <>
        {formData && formData.length > 0 ? <>
        {formData.map(item => (
          <FormGroup key={item.policy_id}>
            <Row>
              <Col md={8}>
                <Label for={`input_${item.policy_id}`}>{item.policy_title}</Label>
                {item.value_type === 'boolean' ? (
                  <Input
                    type="checkbox"
                    id={`input_${item.policy_id}`}
                    checked={inputValues[item.policy_id]}
                    onChange={e => handleInputChange(e, item.policy_id)}
                  />
                ) : (
                  <Input
                    type={item.value_type === 'date' ? 'date' : 'text'}
                    id={`input_${item.policy_id}`}
                    value={inputValues[item.policy_id]}
                    onChange={e => handleInputChange(e, item.policy_id)}
                  />
                )}
              </Col>
              <Col md={4} className='mt-2'>
                <Button color="primary" onClick={() => handleSave(item.policy_id)}>
                  Save
                </Button>
              </Col>
            </Row>
          </FormGroup>
        ))} </> : <div className='text-center'>No data found</div> } </> : <div className="container h-100 d-flex justify-content-center">
        <div className="jumbotron my-auto">
          <div className="display-3"><Spinner type='grow' color='primary'/></div>
        </div>
    </div>}
      </Form>
    </div>
  )
}

export default WorkModelConfiguration
