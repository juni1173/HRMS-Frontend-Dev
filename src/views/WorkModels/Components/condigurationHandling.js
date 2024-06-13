import React, { useState } from 'react'
import { Row, Col, FormGroup, Label, Input, Form } from 'reactstrap'
import WorkModelConfiguration from './workmodelconfiguration'
import ParentConfiguration from './ViewParentConfiguration'
import SiblingConfiguration from './SiblingConfigurations'
import SelfConfiguration from './SelfConfiguration'
import ViewConfiguration from './ViewConfiguration'

const ConfigurationHandling = ({workmodel, selectedShift, shift, CallBack, shift_setup}) => {
  const [selectedOption, setSelectedOption] = useState('')

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
    console.log(`${event.target.value} selected`)
  }
  return (
    <div>
      <Form>
        <Row>
          <Col md={4}>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="configurationOptions"
                  value="Self Configuration"
                  checked={selectedOption === 'Self Configuration'}
                  onChange={handleOptionChange}
                />
                Self Configuration
              </Label>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="configurationOptions"
                  value="Derive from Working Model"
                  checked={selectedOption === 'Derive from Working Model'}
                  onChange={handleOptionChange}
                />
                Derive from Working Model
              </Label>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="configurationOptions"
                  value="Derive from Sibling Shift"
                  checked={selectedOption === 'Derive from Sibling Shift'}
                  onChange={handleOptionChange}
                />
                Derive from Sibling Shift
              </Label>
            </FormGroup>
          </Col>
        </Row>
        {selectedOption === 'Self Configuration' ?  <SelfConfiguration  workmodel={workmodel} selectedShift={selectedShift} shift={shift} CallBack={CallBack}/> : selectedOption === 'Derive from Working Model' ? <ParentConfiguration workmodel={workmodel} selectedShift={selectedShift} CallBack={CallBack}/> : selectedOption === 'Derive from Sibling Shift' ? <SiblingConfiguration workmodel={workmodel} selectedShift={selectedShift} CallBack={CallBack} shift_setup={shift_setup}/> : null }
      </Form>
    </div>
  )
}

export default ConfigurationHandling
