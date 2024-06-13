import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row, Spinner, Badge, Table } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'

const ParentConfiguration = ({ workmodel, selectedShift, CallBack }) => {
  const [formData, setFormData] = useState([])
  const [loading, setisloading] = useState()

  const Api = apiHelper()

  // Fetch policy data from the server and set default values
  const fetchData = async () => {
    try {
        setisloading(true)
      const formData = new FormData()
      formData['working_model'] = workmodel.id
      const result = await Api.jsonPost('/employeeworking/workingmodel/configuration/data/', formData)
      if (result.status === 200) {
        setFormData(result.data)
        setisloading(false)
      } else {
        Api.Toast('error', result.message)
        setisloading(false)
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error)
    }
  }
const handlederive = async() => {
    const payload = new FormData()
    payload['working_model'] = workmodel.id
    payload['derive_to_shift'] = selectedShift.id
    const result = await Api.jsonPost('/employeeworking/workingmodel/configuration/parentderive/', payload)
    if (result) {
    if (result.status === 200) {
      Api.Toast('success', result.message)
      CallBack()
    } else {
      Api.Toast('error', result.message)
    } 
  } else {
      Api.Toast('error', 'Unable to fetch data')
    }
  }
  useEffect(() => {
    fetchData()
  }, [])


  return (
    <div>
    {!loading ? (
      formData && formData.length > 0 ? (
        <Table bordered striped responsive>
          <thead className='table-dark text-center'>
            <tr>
              <th>Title</th>
              <th>Value</th>
              <th>Value Type</th>
            </tr>
          </thead>
          <tbody>
            {formData.map(item => (
              <tr key={item.policy_id}>
                <td>{item.policy_title}</td>
                <td>
                {item.value_type === 'boolean' ? item.value !== null && item.value !== undefined  ? item.value ? 'True' : 'False' : <Badge color='danger'>N/A</Badge>  : item.value || <Badge color='danger'>N/A</Badge>
                    }
                </td>
                <td>{item.value_type || <Badge color='danger'>N/A</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className='text-center'>No data found</div>
      )
    ) : (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner type='grow' color='primary' />
      </div>
    )}
     <Button onClick = {() => handlederive()} className='btn btn-primary'>Confirm Derive</Button>
  </div>
  )
}

export default ParentConfiguration
