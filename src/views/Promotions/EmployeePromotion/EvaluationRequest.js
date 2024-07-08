import React, { useEffect, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  Button,
  Spinner,
  Offcanvas,
  OffcanvasBody, 
  OffcanvasHeader
} from 'reactstrap'
import moment from 'moment'
import apiHelper from '../../Helpers/ApiHelper'
import EvaluationForm from './Evaluation'

const Evaluationrequest = () => {
  const Api = apiHelper()
  const [requestData, setRequestData] = useState([])
  const [evaluateQuestions, setEvaluateQuestions] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [canvasPlacement, setCanvasPlacement] = useState('end')
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState()
  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
    }
  }
  const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
  }
  const fetchData = async () => {
    setIsLoading(true)
    const result = await Api.get('/approval/promotion/for/approval/')
    if (result) {
      if (result.status === 200) {
        setRequestData(result.data)
        console.log(result.data[0].user_status)
      } else {
        Api.Toast('error', result.message)
      }
    } else {
      Api.Toast('error', 'unable to fetch')
    }
    setIsLoading(false)
  }

  const StartEvaluate = async (id, request) => {
    // setIsLoading(true)
    setSelectedRequest(request)
    const result = await Api.get(`/evaluations/evaluation/questions/${id}/`)
    if (result) {
      if (result.status === 200) {
        setEvaluateQuestions(result.data)
        toggleCanvasEnd()
        // setEaluateQuestions(result.data)
        // console.log(evaluateQuestions)
      } else {
        Api.Toast('error', result.message)
      }
    } else {
      Api.Toast('error', 'unable to fetch')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Container fluid>
      <h1 className="text-center my-4">Promotion Requests</h1>
      {isLoading ? (
        <div className="container h-100 d-flex justify-content-center">
          <div className="jumbotron my-auto">
            <div className="display-3"><Spinner type='grow' color='primary' /></div>
          </div>
        </div>
      ) : requestData.length === 0 ? (
        <Card>
          <CardBody>
            <div className='text-center'><p>No data found...</p></div>
          </CardBody>
        </Card>
      ) : (
        <Row>
          {requestData.map(request => (
            <Col key={request.id} xs="12" sm="6" md="4" className="mb-4">
              <Card className="h-100 border-primary">
                <CardBody>
                  <CardTitle tag="h5">{request.request_data.employee_name}</CardTitle>
                  <CardText>
                    <strong>Type:</strong> {request.request_data.type_title}<br />
                    <strong>Reason:</strong> {request.request_data.reason_title || request.request_data.custom_reason || 'Not specified'}<br />
                    <strong>Status:</strong> <Badge color="info">{request.request_data.status}</Badge><br />
                    <strong>Requested On:</strong> {moment(request.request_data.created_at).format('LLL')}<br />
                    {request.request_data.effective_date && <><strong>Effective Date:</strong> {moment(request.request_data.effective_date).format('LL')}<br /></>}
                    <strong>Evaluation Started:</strong> {request.request_data.is_evaluation_started ? 'Yes' : 'No'}
                  </CardText>
                  <div className="text-center">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => StartEvaluate(request.user_status[0].evaluation, request)}
                    >
                      Evaluate
                    </Button>
                  </div>
                  <div className="text-center">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => toggleExpand(request.request_data.id)}
                    >
                      {expandedId === request.request_data.id ? 'Collapse' : 'Expand Details'}
                    </Button>
                  </div>
                  {expandedId === request.request_data.id && (
                    <div className="mt-3">
                      <hr />
                      <CardText>
                        <strong>Details:</strong><br />
                      </CardText>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
                <EvaluationForm data={evaluateQuestions} request={selectedRequest}/>
          </OffcanvasBody>
        </Offcanvas>
    </Container>
  )
}

export default Evaluationrequest
