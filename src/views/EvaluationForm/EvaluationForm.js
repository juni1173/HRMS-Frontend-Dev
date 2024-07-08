import React, { useEffect, useState } from 'react'
import {
  Container, Row, Col, Form, FormGroup, Label, Button, Input
} from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../Helpers/ApiHelper'

const EvaluationForm = ({procedureOptions, complexityOptions}) => {
    // console.log(dropdownData)
  const Api = apiHelper()
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
    <Container className="my-5">
      <h2 className="mb-4">Add Evaluation</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label for="procedure">Procedure</Label>
              <Select
                name="procedure"
                id="procedure"
                value={formData.procedure}
                onChange={handleSelectChange}
                options={procedureOptions}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label for="complexity_group">Complexity</Label>
              <Select
                name="complexity_group"
                id="complexity_group"
                value={formData.complexity_group}
                onChange={handleSelectChange}
                options={complexityOptions}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row> 
          <Col md="6">
            <Button color="primary" type="submit" className="mt-4">Submit</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default EvaluationForm
