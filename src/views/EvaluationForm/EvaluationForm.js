import React, { useEffect, useState, Fragment } from 'react'
import {
  Row, Col, Form, Card, Label, Button, Input, CardBody, CardTitle
} from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../Helpers/ApiHelper'
import { IoIosAddCircleOutline } from "react-icons/io"

const EvaluationForm = ({procedureOptions, complexityOptions}) => {
    // console.log(dropdownData)
  const Api = apiHelper()
  const [showForm, setShowForm] = useState(false)
//   const [procedureOptions, setProcedureOptions] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    procedure: null,
    description: '',
    complexity_group: ''
  })

//   const fetchProcedures = async () => {
//     const response = await Api.get('/organizations/procedures/types/')
//     if (response) {
//       if (response.status === 200) {
//         const options = response.data.map(procedure => ({
//           value: procedure.id,
//           label: procedure.title
//         }))
//         setProcedureOptions(options)
//       } else {
//         Api.Toast('error', response.message)
//       }
//     }
//   }

  useEffect(() => {
    // fetchProcedures()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      procedure: selectedOption
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const evaluationData = {
      title: formData.title,
      procedure: formData.procedure.value,
      description: formData.description
    }

    try {
      const response = await Api.jsonPost('/evaluations/', evaluationData)
      if (response.status === 200) {
        Api.Toast('success', 'Evaluation added successfully')
        if (onSubmit) {
          onSubmit(response.data)
        }
      } else {
        Api.Toast('error', response.message)
      }
    } catch (error) {
      Api.Toast('error', 'Failed to submit evaluation')
    }
  }

  return (
    <Fragment>
      <Card className='m-0 pt-1 bg-lightgrey'>
        <CardTitle className='d-flex justify-content-between mb-0 w-100' style={{height: '38px'}}>
        
            <div><h2 className="mb-4">Evaluations</h2></div>
            <div>
                <button
                    className="border-0 no-background float-right"
                    title="Add Evalluation"
                    style={{fontSize:'14px'}}
                    onClick={() => setShowForm(!showForm)}
                    >
                    <IoIosAddCircleOutline color="#315180" size={'18px'}/> Add New
                </button>
              </div>
        </CardTitle>
      </Card>
      {showForm && (
        <Card className='mt-1'>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md='2'></Col>
                <Col md='8'>
                  <Row>
                    <Col md="4">
                        <Label for="title">Title</Label>
                        <Input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                    </Col>
                    <Col md="4">
                        <Label for="procedure">Procedure</Label>
                        <Select
                          name="procedure"
                          id="procedure"
                          value={formData.procedure}
                          onChange={handleSelectChange}
                          options={procedureOptions}
                          required
                        />
                    </Col>
                    <Col md="4">
                        <Label for="complexity_group">Complexity</Label>
                        <Select
                          name="complexity_group"
                          id="complexity_group"
                          value={formData.complexity_group}
                          onChange={handleSelectChange}
                          options={complexityOptions}
                          required
                        />
                    </Col>
                    <Col md="4">
                        <Label for="description">Description</Label>
                        <Input
                          type="textarea"
                          name="description"
                          id="description"
                          value={formData.description}
                          onChange={handleChange}
                        />
                    </Col>
                    <Col md="4">
                      <Button color="primary" type="submit" className="mt-4">Submit</Button>
                    </Col>
                  </Row>
                </Col>
                <Col md='2'></Col>
                
              </Row>
            </Form>
          </CardBody>
        </Card>
      )}
      
    </Fragment>
  )
}

export default EvaluationForm
