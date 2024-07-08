import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, FormGroup, Label, Button, Input } from 'reactstrap'
import ReactStars from 'react-rating-stars-component'
import apiHelper from '../../Helpers/ApiHelper'

const EvaluationForm = ({ data, request }) => {
  const Api = apiHelper()

  // Calculate total weightage dynamically from formData
  const totalWeightage = data.reduce((sum, item) => sum + parseFloat(item.score), 0)

  const [formData, setFormData] = useState(data.map((item) => ({ ...item, obtainedScore: 0 })))
  const [comments, setComments] = useState('')

  const [averageScore, setAverageScore] = useState(0)

  useEffect(() => {
    const totalObtainedScore = formData.reduce((sum, item) => sum + parseFloat(item.obtainedScore), 0)
    const percentageScore = (totalObtainedScore / totalWeightage) * 100
    setAverageScore(percentageScore.toFixed(2))
  }, [formData, totalWeightage])

  const handleStarChange = (id, newRating) => {
    const newFormData = formData.map((item) => {
      if (item.id === id) {
        return { ...item, obtainedScore: newRating * parseFloat(item.score) / 5 }
      }
      return item
    })
    setFormData(newFormData)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formattedData = {
      total_marks: totalWeightage.toFixed(2),
      marks_obtained: averageScore,
      approval: request.request_data.approval_flow,
      approvalsHierarchy: request.user_status[0].approvalsHierarchy,
      request_id: request.request_data.id,
      log_id: request.user_status[0].id,
      comments,
      evaluations: formData.map((item) => ({
        logs_id: request.user_status[0].id,
        evaluation_procedure_question: item.id,
        obtained_score: item.obtainedScore,
        is_active: true
      }))
    }

    try {
      const response = await Api.jsonPost('/approval/evaluation/submit/', formattedData)
      if (response.status === 200) {
        Api.Toast('Evaluation data submitted successfully')
      } else {
        Api.Toast('Failed to submit evaluation data')
      }
    } catch (error) {
      Api.Toast('Failed to fetch data')
    }
  }

  return (
    <Container>
      <h1 className="my-4">Employee Evaluation Form</h1>
      <Form onSubmit={handleSubmit}>
        {formData.map((item) => (
          <FormGroup key={item.id}>
            <Row>
              <Col md="6">
                <Label for={`score-${item.id}`}>{item.question}</Label>
              </Col>
              <Col md="6">
                <ReactStars
                  count={5}
                  onChange={(newRating) => handleStarChange(item.id, newRating)}
                  size={24}
                  activeColor="#ffd700"
                  value={item.obtainedScore / (parseFloat(item.score) / 5)} 
                />
                <span className="ml-2">{item.obtainedScore.toFixed(2)}</span>
              </Col>
            </Row>
          </FormGroup>
        ))}
        <FormGroup>
          <Label for="comments">Comment</Label>
          <Input
            type="textarea"
            name="comments"
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </FormGroup>
        <div className="my-4">
          <h5>Total Weightage: {totalWeightage.toFixed(2)}</h5>
        </div>
        <div className="my-4">
          <h5>Obtained Score: {averageScore}%</h5>
        </div>
        <Button color="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default EvaluationForm
