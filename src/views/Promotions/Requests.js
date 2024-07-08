import React, { useEffect, useState } from 'react'
import Select from 'react-select'
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  TabContent,
  TabPane,
  Table,
  Nav,
  NavItem,
  NavLink,
  Spinner
} from 'reactstrap'
import moment from 'moment'
import apiHelper from '../Helpers/ApiHelper'
import EmployeeHelper from '../Helpers/EmployeeHelper'

const Request = ({ employees, evaluations }) => {
  const EmpHelper = EmployeeHelper()
  const [data, setData] = useState({
    evaluators: {} // Add evaluators to handle dynamic selection
  })
  const Api = apiHelper()
  const [approvaldata, setApprovalData] = useState([])
  const [hierarchyData, setHierarchyData] = useState([])
  const [requestData, setRequestData] = useState([])
  const [selectedApprovalId, setSelectedApprovalId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [modalAssignApprovalFlow, setModalAssignApprovalFlow] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchApprovalFlow = async () => {
    try {
      const result = await Api.get('/approval/approvalflow/')
      if (result.status === 200) {
        const options = result.data.map(item => ({
          value: item.id,
          label: `${item.title} - ${item.short_code}`
        }))
        setApprovalData(options)
      }
    } catch (error) {
      console.error('Error fetching approval flow:', error)
    }
  }

  useEffect(() => {
    fetchApprovalFlow()
  }, [])

  const onchangeapprovaldatahandler = async (name, type, e) => {
    if (name === "approval_flow") {
      setSelectedApprovalId(e.value)
      try {
        const result = await Api.jsonPost('/approval/approvalhierarchy/', {
          approval: e.value,
          short_code: "PD"
        })
        if (result.status === 200) {
          setHierarchyData(result.data)
        }
      } catch (error) {
        console.error('Error fetching approval hierarchy:', error)
      }
    }
  }

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
    }
  }

  const toggleAssignApprovalFlowModal = (request_id) => {
    setExpandedId(request_id)
    setModalAssignApprovalFlow(!modalAssignApprovalFlow)
  }

  const onChangePromotionDataHandler = (InputName, InputType, e) => {
    let InputValue
    if (InputType === 'input') {
      InputValue = e.target.value
    } else if (InputType === 'select') {
      InputValue = e
    } else if (InputType === 'date') {
      const formatDate = Api.formatDate(e)
      InputValue = formatDate
    } else if (InputType === 'file') {
      InputValue = e.target.files[0].name
    }

    if (InputName.startsWith('evaluator_')) {
      const evaluatorUnit = InputName.replace('evaluator_', '')
      setData((prevState) => ({
        ...prevState,
        evaluators: {
          ...prevState.evaluators,
          [evaluatorUnit]: InputValue
        }
      }))
    } else {
      setData((prevState) => ({
        ...prevState,
        [InputName]: InputValue
      }))
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    const result = await Api.get('/promotion/request/')
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

  const handleSubmitHierarchy = async (request_id) => {
    setIsLoading(true)
    const hierarchydata = hierarchyData.map(item => {
      const evaluatorUnit = Object.keys(data.evaluators).find(unit => unit === item.unit_title)
      const selectedEvaluator = evaluatorUnit ? data.evaluators[evaluatorUnit].value : null

      return {
        unit_id: item.id,
        unit_title: item.unit_title,
        evaluator: item.is_fixed ? item.employee : selectedEvaluator,
        is_fixed: item.is_fixed,
        weightage: item.is_weightage_fixed ? item.weightage : data[`weightage_${item.unit_title}`],
        evaluation: item.is_evaluation_fixed ? item.evaluation : (data[`evaluation_${item.unit_title}`] ? data[`evaluation_${item.unit_title}`].value : null)
      }
    })
    const formData = new FormData()
    formData['approval_flow'] = selectedApprovalId
    formData['hierarchy_data'] = JSON.stringify(hierarchydata)

    const result = await Api.jsonPatch(`/promotion/request/update/${request_id}/`, formData)
    if (result) {
      if (result.status === 200) {
        Api.Toast('success', result.message)
        fetchData()
      } else {
        Api.Toast('error', result.message)
        setIsLoading(false)
      }
    } else {
      Api.Toast('error', 'Unable to update data')
      setIsLoading(false)
    }
  }

  const startEvaluation = async (request_id) => {
    setIsLoading(true)
    const formData = new FormData()
    formData['is_evaluation_started'] = true

    const result = await Api.jsonPatch(`/promotion/request/update/${request_id}/`, formData)
    if (result) {
      if (result.status === 200) {
        fetchData()
        Api.Toast('success', result.message)
      } else {
        Api.Toast('error', result.message)
        setIsLoading(false)
      }
    } else {
      Api.Toast('error', 'Unable to update data')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const [activeTab, setActiveTab] = useState(0)

  const toggleTab = (tabIndex) => {
    if (activeTab !== tabIndex) setActiveTab(tabIndex)
  }

  const renderApprovalMessage = () => {
    if (hierarchyData && hierarchyData.length > 0) {
      return (
        <div className="approval-message-container">
          <Nav tabs>
            {hierarchyData.map((item, index) => (
              <NavItem key={index}>
                <NavLink
                  className={index === hierarchyData.length - 1 ? 'final-approval-tab' : ''}
                  active={activeTab === index}
                  onClick={() => toggleTab(index)}
                >
                  {item.unit_title} {item.employee_name ? `(${item.employee_name})` : ''}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            {hierarchyData.map((item, index) => (
              <TabPane key={index} tabId={index}>
                <Table>
                  <tbody>
                    <tr>
                      <td>{item.unit_title} {item.employee_name ? `(${item.employee_name})` : ''}</td>
                    </tr>
                    {item.is_fixed === false ? (
                      <tr>
                        <td>Correspondent Selection:</td>
                        <td>
                          You can select the correspondent person for {item.unit_title}
                          <br />
                          <Select
                            type="text"
                            name={`evaluator_${item.unit_title}`}
                            options={employees}
                            defaultValue={employees.find(emp => emp.value === item.employee)} // Set the initial value
                            onChange={(e) => onChangePromotionDataHandler(`evaluator_${item.unit_title}`, 'select', e)}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>Correspondent:</td>
                        <td>{employees.find(emp => emp.value === item.selected_evaluator)?.label || 'Not selected'}</td>
                      </tr>
                    )}
                    {item.is_weightage_fixed === false ? (
                      <tr>
                        <td>Weightage:</td>
                        <td>
                          <Input
                            type="number"
                            name={`weightage_${item.unit_title}`}
                            defaultValue={item.weightage} // Set the initial value
                            onChange={(e) => onChangePromotionDataHandler(`weightage_${item.unit_title}`, 'input', e)}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>Weightage:</td>
                        <td>{item.weightage}</td>
                      </tr>
                    )}
                    {item.is_evaluation_fixed === false ? (
                      <tr>
                        <td>Evaluation:</td>
                        <td>
                          You can select the correspondent Evaluation for {item.unit_title}
                          <br />
                          <Select
                            type="text"
                            name={`evaluation_${item.unit_title}`}
                            options={evaluations}
                            placeholder='select evaluation'
                            defaultValue={evaluations.find(evalItem => evalItem.value === item.evaluation)} // Set the initial value
                            onChange={(e) => onChangePromotionDataHandler(`evaluation_${item.unit_title}`, 'select', e)}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>Evaluation:</td>
                        <td>{evaluations.find(evalItem => evalItem.value === item.evaluation)?.label || 'Not selected'}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </TabPane>
            ))}
          </TabContent>
        </div>
      )
    }
    return null
  }

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
                        <strong>HR Request:</strong> {request.is_hr_request ? 'Yes' : 'No'}<br />
                        <strong>Team Lead Request:</strong> {request.is_team_lead_request ? 'Yes' : 'No'}<br />
                        <strong>Custom Reason:</strong> {request.custom_reason || 'Not specified'}<br />
                      </CardText>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Evaluation Started */}

      {/* Modal for Assign Approval Flow */}
      <Modal isOpen={modalAssignApprovalFlow} toggle={toggleAssignApprovalFlowModal}>
        <ModalHeader toggle={toggleAssignApprovalFlowModal}>Assign Approval Flow</ModalHeader>
        <ModalBody>
          <p>No approval flow is assigned to this request. Please select an approval flow to proceed.</p>
          <Form>
            <FormGroup>
              <Label for="approvalFlowSelect">Select Approval Flow</Label>
              <Select
                id="approvalFlowSelect"
                name="approvalFlowSelect"
                options={approvaldata}
                onChange={(e) => onchangeapprovaldatahandler('approval_flow', 'select', e)}
              />
            </FormGroup>
            {renderApprovalMessage()}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleSubmitHierarchy(expandedId)}>Submit</Button>{' '}
          <Button color="secondary" onClick={toggleAssignApprovalFlowModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

export default Request
