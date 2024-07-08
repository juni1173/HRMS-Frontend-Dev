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
  Spinner
} from 'reactstrap'
import moment from 'moment'
import apiHelper from '../../Helpers/ApiHelper'

const EmployeeRequests = () => {
  const Api = apiHelper()
  const [requestData, setRequestData] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
    }
  }
  const fetchData = async () => {
    setIsLoading(true)
    const result = await Api.get('/promotion/employee/list/')
    if (result) {
      if (result.status === 200) {
        setRequestData(result.data.other_requests)
      } else {
        Api.Toast('error', result.message)
      }
    } else {
      Api.Toast('error', 'unable to fetch')
    }
    setIsLoading(false)
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
                  <CardTitle tag="h5">{request.employee_name}</CardTitle>
                  <CardText>
                    <strong>Type:</strong> {request.type_title}<br />
                    <strong>Reason:</strong> {request.reason_title || request.custom_reason || 'Not specified'}<br />
                    <strong>Status:</strong> <Badge color="info">{request.status}</Badge><br />
                    <strong>Requested On:</strong> {moment(request.created_at).format('LLL')}<br />
                    {request.effective_date && <><strong>Effective Date:</strong> {moment(request.effective_date).format('LL')}<br /></>}
                    <strong>Evaluation Started:</strong> {request.is_evaluation_started ? 'Yes' : 'No'}
                    {!request.approval_flow || request.approval_flow === null ? <Button color="link" size="sm" onClick={() => toggleAssignApprovalFlowModal(request.id)}>Assign Approval Flow</Button> : null}
                    {!request.is_evaluation_started ? <Button color="link" size="sm" onClick={() => startEvaluation(request.id)}>Mark as Evaluation Started</Button> : null}
                  </CardText>
                  <div className="text-center">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => toggleExpand(request.id)}
                    >
                      {expandedId === request.id ? 'Collapse' : 'Expand Details'}
                    </Button>
                  </div>
                  {expandedId === request.id && (
                    <div className="mt-3">
                      <hr />
                      <CardText>
                        <strong>Details:</strong><br />
                        {/* <strong>HR Request:</strong> {request.is_hr_request ? 'Yes' : 'No'}<br />
                        <strong>Team Lead Request:</strong> {request.is_team_lead_request ? 'Yes' : 'No'}<br />
                        <strong>Custom Reason:</strong> {request.custom_reason || 'Not specified'}<br /> */}
                      </CardText>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default EmployeeRequests
