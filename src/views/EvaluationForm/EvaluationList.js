import React, { useEffect, useState } from 'react'
import {
  Container, Row, Col, ListGroup, ListGroupItem, Button, Offcanvas, OffcanvasHeader, OffcanvasBody, Form, FormGroup, Label, Input
} from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
import Select from 'react-select'

const EvaluationsList = () => {
  const Api = apiHelper()
  const [evaluations, setEvaluations] = useState([])
  const [complexities, setComplexities] = useState([])
  const [selectedEvaluation, setSelectedEvaluation] = useState(null)
  const [selectedComplexity, setSelectedComplexity] = useState(null)
  const [offcanvasOpen, setOffcanvasOpen] = useState(false)
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState({
    id: null,
    question: '',
    complexity: '',
    score: '',
    evaluation: ''  // Add evaluation to the newQuestion state
  })
  const [totalScore, setTotalScore] = useState(0)  // Add state for total score
  const [remainingScore, setRemainingScore] = useState(100)  // Track remaining score out of 100

  const fetchEvaluations = async () => {
    const response = await Api.get('/evaluations/evaluation/with/question/')
    if (response && response.status === 200) {
      setEvaluations(response.data)
    } else {
      Api.Toast('error', response?.message || 'Failed to fetch evaluations')
    }
  }

  const fetchComplexities = async (evaluation) => {
    if (evaluation) {
      const response = await Api.jsonPost('/complexities/list-by-group/', { complexity_group: evaluation.complexity_group })
      if (response && response.status === 200) {
        const complexityOptions = response.data.map(complexity => ({
          value: complexity.id,
          label: complexity.title,
          score_type: complexity.score_type,
          min_value: complexity.min_value,
          max_value: complexity.max_value,
          fixed_value: complexity.fixed_value // Add this line to include fixed_value
        }))
        setComplexities(complexityOptions)
      } else {
        Api.Toast('error', response?.message || 'Failed to fetch complexities')
      }
    }
  }

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const fetchQuestions = async (evaluation) => {
    const response = await Api.get(`/evaluations/${evaluation.uuid}/evaluation/questions/`)
    if (response && response.status === 200) {
      setQuestions(response.data)
      // Calculate total score of all questions
      const total = response.data.reduce((acc, question) => acc + parseFloat(question.score), 0)
      setTotalScore(total)
      setRemainingScore(100 - total)
    } else {
      Api.Toast('error', response?.message || 'Failed to fetch questions')
    }
  }

  const handleAddQuestions = (evaluation) => {
    setSelectedEvaluation(evaluation)
    fetchQuestions(evaluation)
    fetchComplexities(evaluation)
    setNewQuestion({
      ...newQuestion,
      evaluation: evaluation.id
    })
    setOffcanvasOpen(true)
  }

  const handleNewQuestionChange = (target, actionMeta) => {
    if (actionMeta.name === 'complexity') {
      setSelectedComplexity(target)
      const score = target.score_type === 'fixed' ? target.fixed_value : target.min_value
      setNewQuestion({
        ...newQuestion,
        complexity: target.value,
        score
      })
    } else {
      const { name, value } = target
      setNewQuestion({
        ...newQuestion,
        [name]: value
      })
    }
  }
  const resetNewQuestion = () => {
    setNewQuestion({
      id: null,
      question: '',
      complexity: '',
      score: '',
      evaluation: selectedEvaluation.id  // Ensure the evaluation ID is reset for new questions
    })
    setSelectedComplexity(null)
  }
  const handleAddNewQuestion = async () => {
    if (newQuestion.id) {
      // Update existing question if id exists
      const { id, ...updateData } = newQuestion
      const response = await Api.jsonPatch(`/evaluations/${selectedEvaluation.uuid}/evaluation/questions/${id}/`, updateData)
      if (response && response.status === 200) {
        Api.Toast('success', 'Question updated successfully')
        fetchQuestions(selectedEvaluation)
        resetNewQuestion()
      } else {
        Api.Toast('error', response?.message || 'Failed to update question')
      }
    } else {
      // Add new question
      const response = await Api.jsonPost(`/evaluations/${selectedEvaluation.uuid}/evaluation/questions/`, newQuestion)
      if (response && response.status === 200) {
        Api.Toast('success', 'Question added successfully')
        fetchQuestions(selectedEvaluation)
        resetNewQuestion()
      } else {
        Api.Toast('error', response?.message || 'Failed to add question')
      }
    }
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Evaluations</h2>
      <ListGroup>
        {evaluations.map((evaluation) => (
          <ListGroupItem key={evaluation.id}>
            <Row>
              <Col>{evaluation.title}</Col>
              <Col className="text-right">
                <Button color="primary" onClick={() => handleAddQuestions(evaluation)}>
                  {evaluation.is_completed ? 'View/Add Questions' : 'Add Questions'}
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
        ))}
      </ListGroup>

      <Offcanvas isOpen={offcanvasOpen} toggle={() => setOffcanvasOpen(!offcanvasOpen)}>
        <OffcanvasHeader toggle={() => setOffcanvasOpen(!offcanvasOpen)}>
          Questions for {selectedEvaluation?.title}
        </OffcanvasHeader>
        <OffcanvasBody>
          <ListGroup>
            {questions.map((question) => (
              <ListGroupItem key={question.id}>{question.question} - {question.score}</ListGroupItem>
            ))}
          </ListGroup>
          <h5 className="mt-4">Add New Question</h5>
          <Form>
            <FormGroup>
              <Label for="question">Question</Label>
              <Input
                type="text"
                name="question"
                id="question"
                value={newQuestion.question}
                onChange={e => handleNewQuestionChange(e.target, { name: 'question' })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="complexity">Complexity</Label>
              <Select
                name="complexity"
                id="complexity"
                value={selectedComplexity}
                onChange={option => handleNewQuestionChange(option, { name: 'complexity' })}
                options={complexities}
                required
              />
            </FormGroup>
            {selectedComplexity?.score_type === 'custom' && (
              <FormGroup>
                <Label for="score">Score</Label>
                <div className="d-flex align-items-center">
                  <span>{selectedComplexity.min_value}</span>
                  <Input
                    type="range"
                    name="score"
                    id="score"
                    value={newQuestion.score}
                    min={selectedComplexity.min_value}
                    max={selectedComplexity.max_value}
                    onChange={e => handleNewQuestionChange(e.target, { name: 'score' })}
                    required
                    className="mx-2"
                  />
                  <span>{selectedComplexity.max_value}</span>
                </div>
                <div>Selected Score: {newQuestion.score}</div>
              </FormGroup>
            )}
            {selectedComplexity?.score_type === 'fixed' && (
              <FormGroup>
                <Label for="score">Score</Label>
                <Input
                  type="text"
                  name="score"
                  id="score"
                  value={selectedComplexity?.fixed_value}
                  readOnly
                />
              </FormGroup>
            )}
            <Button color="primary" onClick={handleAddNewQuestion}>
              {newQuestion.id ? 'Update Question' : 'Add Question'}
            </Button>
          </Form>
          {totalScore < 100 && (
            <div className="mt-3 text-danger">
              Total score of all questions is {totalScore}. It is still remaining {remainingScore} from 100.
            </div>
          )}
        </OffcanvasBody>
      </Offcanvas>
    </Container>
  )
}

export default EvaluationsList
