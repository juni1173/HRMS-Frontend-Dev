import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Row, Col, Button, Badge, Spinner } from 'reactstrap' // Assuming Button is imported from reactstrap
import apiHelper from '../../Helpers/ApiHelper'

const History = ({ employee }) => {
  const Api = apiHelper()
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState()

  const fetchData = async () => {
    setIsLoading(true)
    const formData = new FormData()
    formData['employee'] = employee
    const response = await Api.jsonPost('/employeeworking/workingmodel/employee/assign/history/', formData)
    if (response) {
      if (response.status === 200) {
        setData(response.data)
        setIsLoading(false)
      } else {
        Api.Toast('error', response.message)
        setIsLoading(false)
      }
    } else {
      Api.Toast('error', 'Unable to fetch data')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Row className='mt-2 mb-2'>
        {!isLoading ? (
          <>
            {data && data.length > 0 ? (
              <Row>
                {data.map((item, index) => (
                  <React.Fragment key={index}>
                    <Col md={12} className='mb-2'>
                      <h4><Badge color='light-warning'>Created At : {item.created_at}</Badge></h4>
                    </Col>
                    <Col md={6} className='mb-2'>
                      <Badge color='light-info'>Working Model : </Badge> {item.working_model_title || <Badge color='danger'>N/A</Badge>}
                    </Col>
                    <Col md={6} className='mb-2'>
                      <Badge color='light-success'>Working Model Shift: </Badge> {item.working_model_shift_title || <Badge color='danger'>N/A</Badge>}
                    </Col>
                    <Col md={6} className='mb-2'>
                      <Badge color='light-secondary'>Effective From : </Badge> {item.effective_from || <Badge color='danger'>N/A</Badge>}
                    </Col>
                    <Col md={6} className='mb-2'>
                      <Badge color='light-primary'>End Date : </Badge> {item.end_date || <Badge color='danger'>N/A</Badge>}
                    </Col>
                    <hr/>
                  </React.Fragment>
                ))}
              </Row>
            ) : (
              <div className='text-center'>No data found</div>
            )}
          </>
        ) : (
          <div className="container h-100 d-flex justify-content-center">
            <div className="jumbotron my-auto">
              <div className="display-3"><Spinner type='grow' color='primary'/></div>
            </div>
          </div>
        )}      
      </Row>
    </div>
  )
}

export default History
