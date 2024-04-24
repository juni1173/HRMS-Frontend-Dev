import React, { Fragment, useState } from 'react'
import {Input, Button, Label, Row, Col, Badge} from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'

const ProjectAdd = ({ CallBack }) => {
  const Api = apiHelper()
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (name !== '') {
      const formData = new FormData()
      formData['name'] = name
      if (code !== '') formData['code'] = code
      await Api.jsonPost(`/projects/`, formData).then(result => {
        if (result) {
          if (result.status === 200) {
            Api.Toast('success', result.message)
            CallBack()
          } else {
            Api.Toast('error', result.message)
          }
        } else {
          Api.Toast('error', 'Server not responding!')
        }
      })
    } else {
      Api.Toast('error', 'Please fill all the fields')
    }
  }

  return (
    <Fragment>
      <h2>Add Project</h2>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className='mt-1'>
            <Label>Name <Badge color='light-danger'>*</Badge></Label>
            <Input
              type="text"
              id="name"
              onChange={(event) => setName(event.target.value)}
            />
          </Col>
            
            <Col md={6} className='mt-1'>
            <Label>Code </Label>
            <Input
              type="text"
              id="note"
              onChange={(event) => setCode(event.target.value)}
            />
          </Col>
        </Row>
      <Button className='btn btn-success mt-1 float-right'>
        Save
      </Button>
    </form>
    </Fragment>
  )
}

export default ProjectAdd