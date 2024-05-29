import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Row, Spinner, Badge, Table } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'

const ViewConfiguration = ({ workmodel, selectedShift, shift_setup }) => {
    console.log(shift_setup)
  const [formData, setFormData] = useState([])
//   const [inputValues, setInputValues] = useState({})
  const [loading, setisloading] = useState()

  const Api = apiHelper()

  // Fetch policy data from the server and set default values
  const fetchData = async () => {
    try {
        setisloading(true)
      const formData = new FormData()
      if (shift_setup === undefined || shift_setup === null) {
      formData['working_model'] = workmodel.id
      formData['working_model_shift'] = selectedShift.id
      } else {
        formData['shift_setup'] = shift_setup
      }
      const result = await Api.jsonPost('/employeeworking/workingmodel/configuration/activeconfiguration/', formData)
      if (result.status === 200) {
        setFormData(result.data)
        // Set default input values for each policy
        // const defaultInputValues = result.data.reduce((acc, item) => {
        //   acc[item.policy_id] = item.value_type === 'boolean' ? (item.value === true) : item.value
        //   return acc
        // }, {})
        // setInputValues(defaultInputValues)
        setisloading(false)
      } else {
        Api.Toast('error', 'No record found')
        setisloading(false)
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error)
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
  </div>

  )
}

export default ViewConfiguration
