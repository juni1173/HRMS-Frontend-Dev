import React from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Badge, Row, Col } from 'reactstrap'
import { CheckCircle, User, Calendar, MessageCircle, Briefcase } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'

const StatusLogsComponent = ({ logs }) => {
    const Api = apiHelper()
    return (
        <div className="container mt-4">
            {logs && logs.length > 0 ? (
                logs.map((log, index) => (
                    <Card key={index} className="mb-3 shadow-sm border-0">
                        <CardBody>
                            <Row className="align-items">
                                <Col md="12">
                                    <CardTitle tag="h5">
                                        <CheckCircle className="me-2 text-primary" />
                                        {log.status}
                                    </CardTitle>
                                    </Col>
                                    <Col md="12">
                                    <CardSubtitle tag="h6" className="mb-2 text-muted">
                                        <User className="me-2" />
                                        {log.action_by_name}
                                    </CardSubtitle>
                                    </Col>
                                    <Col md="6">
                                    <CardSubtitle tag="h6" className="mb-2 text-muted">
                                        <Briefcase className="me-2" />
                                        {log.unit_title}
                                    </CardSubtitle>
                                </Col>
                                <Col md="6">
                                <CardSubtitle tag="h6" className="mb-2 text-muted">
                                    <Badge color="info" className="me-2">
                                        <Calendar className="me-1" />
                                       Approval Date {Api.formatDate(log.approval_date)}
                                    </Badge>
                                    </CardSubtitle>
                                </Col>
                            </Row>
                            <CardText>
                                <MessageCircle className="me-2 text-secondary" />
                                {log.comments || 'N/A'}
                            </CardText>
                        </CardBody>
                    </Card>
                ))
            ) : (
                <Card className="text-center border-0 shadow-sm">
                    <CardBody>
                        <CardTitle tag="h5" className="text-muted">
                            No Logs Available
                        </CardTitle>
                        <CardText>Please check back later for updates.</CardText>
                    </CardBody>
                </Card>
            )}
        </div>
    )
}

export default StatusLogsComponent
