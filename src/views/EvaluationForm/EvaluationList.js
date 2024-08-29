import React, { useEffect, useState, Fragment } from 'react'
import {
  Row, Col, ListGroup, ListGroupItem, Button, Offcanvas, OffcanvasHeader, OffcanvasBody, Form, FormGroup, Label, Input, CardHeader,
  Card, CardTitle, Badge
} from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
import Select from 'react-select'
import { CgDetailsMore } from "react-icons/cg"
import { RiNumbersFill } from "react-icons/ri"
import { FaRegQuestionCircle } from "react-icons/fa"
import { IoIosAddCircleOutline } from "react-icons/io"

const EvaluationsList = () => {
  const Api = apiHelper()
  const [evaluations, setEvaluations] = useState([])
  const [complexities, setComplexities] = useState([])
  const [selectedEvaluation, setSelectedEvaluation] = useState(null)
  const [selectedComplexity, setSelectedComplexity] = useState(null)
  const [offcanvasOpen, setOffcanvasOpen] = useState(false)
  const [questions, setQuestions] = useState([])
  const [showParamForm, setShowParamForm] = useState(false)
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
      console.warn(response.data)
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
        console.warn(complexityOptions)
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
    <Fragment>
      {/* <h2 className="mb-4">Evaluations</h2> */}
      <Row>
        {evaluations.map((evaluation) => (
          <Col md='4 mt-2'>
              <Card key={evaluation.id} className='card-transaction cursor-pointer mb-1' style={{background: 'linear-gradient(to right, #d3cce3, #e9e4f0)'}} onClick={() => handleAddQuestions(evaluation)}>
              <CardHeader className='p-1'>
                <Badge pill style={{background: 'linear-gradient(to right, #d3cce3, #e9e4f0)'}} className='badge-up text-dark'>
                  {evaluation.questions ? Object.values(evaluation.questions).length : '0'} parameters
                </Badge>
                <CardTitle tag='h5' className=' px-1'> {evaluation.title ? evaluation.title : 'N/A'}</CardTitle>
                <CgDetailsMore size={18} />
              </CardHeader>
              
            </Card>
          </Col>
          
        ))}
      </Row>
      
      {/* <ListGroup>
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
      </ListGroup> */}

      <Offcanvas isOpen={offcanvasOpen} direction="end" toggle={() => setOffcanvasOpen(!offcanvasOpen)}>
        <OffcanvasHeader toggle={() => setOffcanvasOpen(!offcanvasOpen)}>
        </OffcanvasHeader>
        <OffcanvasBody>
          <div className='d-flex justify-content-between mb-0 w-100' style={{height: '70px'}}>
            
              <div><h2 className="mb-1">Parameters for {selectedEvaluation?.title}</h2>
              <p>Total Score <b>{totalScore}</b></p></div>
              <div>
                  <button
                      className="border-0 no-background float-right"
                      title="Add Evalluation"
                      style={{fontSize:'14px'}}
                      onClick={() => setShowParamForm(!showParamForm)}
                      disabled={totalScore >= 100 && 'disabled'}
                      >
                      <IoIosAddCircleOutline color={totalScore >= 100 ? "lightgrey" : "#315180"} size={'18px'}/> Add New Parameter
                  </button>
                </div>
          </div>
          {showParamForm && (
            <Form className='py-1'>
            <Row>
              <Col md='4'>
                <Label for="question">Parameter</Label>
                <Input
                  type="text"
                  name="question"
                  id="question"
                  value={newQuestion.question}
                  onChange={e => handleNewQuestionChange(e.target, { name: 'question' })}
                  required
                />
              </Col>
              <Col md='4'>
                <Label for="complexity">Complexity</Label>
                <Select
                  name="complexity"
                  id="complexity"
                  value={selectedComplexity}
                  onChange={option => handleNewQuestionChange(option, { name: 'complexity' })}
                  options={complexities}
                  required
                />
              </Col>
              
                {selectedComplexity?.score_type === 'custom' && (
                <>
                <Col md='4'>
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
                    </Col>
                      </>
                  )}
              
                {selectedComplexity?.score_type === 'fixed' && (
                  <>
                  <Col md='4'>
                    <Label for="score">Score</Label>
                    <Input
                      type="text"
                      name="score"
                      id="score"
                      value={selectedComplexity?.fixed_value}
                      readOnly
                    />
                  </Col>
                  </>
                )}
              <Col md='4'>
                <Button color="primary" onClick={handleAddNewQuestion} className='mt-2'>
                  {newQuestion.id ? 'Update Question' : 'Add Question'}
                </Button>
              </Col>
            </Row>
          </Form>
          )}
          
          {totalScore < 100 && (
            <div className="mt-3 text-danger">
              Total score of all parameters is {totalScore}. It is still remaining {remainingScore} from 100.
            </div>
          )}
          <ListGroup>
            {questions.map((question) => (
              <Card key={question.id} className='mb-1'>
                <CardHeader className="d-flex justify-content-between">
                  <div><FaRegQuestionCircle color='#FDAC34' size={18}/> {question.question} </div>
                  <div><RiNumbersFill color="#315180" size={18}/> {complexities.find(pre => pre.value === question.complexity) && complexities.find(pre => pre.value === question.complexity).label} <b>{question.score}</b></div>
                </CardHeader>
              </Card>
              
            ))}
          </ListGroup>
          
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default EvaluationsList
