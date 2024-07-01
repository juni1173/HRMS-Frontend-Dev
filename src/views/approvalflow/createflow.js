import React, { useState } from 'react'
import { Row, Col, Input, Button, Label } from 'reactstrap'
import Select from 'react-select'
import { RefreshCcw, Save } from 'react-feather'
import apiHelper from '../Helpers/ApiHelper'

const CreateFlow = ({ dropdownData, CallBack, approval_unit }) => {
  console.log(dropdownData)
  const [title, setTitle] = useState('')
  const [shortCode, setShortCode] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [selectedUnits, setSelectedUnits] = useState([])
  const [unitDetails, setUnitDetails] = useState({})
  const Api = apiHelper()

  const handleUnitDetailChange = (unitId, field, value) => {
    setUnitDetails((prevDetails) => ({
      ...prevDetails,
      [unitId]: {
        ...prevDetails[unitId],
        unit: unitId, // Ensure unit field is set
        [field]: value
      }
    }))
  }

  const handleVetoChange = (unitId, isChecked) => {
    const updatedDetails = { ...unitDetails }

    if (isChecked) {
      Object.keys(updatedDetails).forEach((id) => {
        if (id !== unitId) {
          updatedDetails[id] = { ...updatedDetails[id], is_veto: false }
        }
      })
    }

    updatedDetails[unitId] = {
      ...updatedDetails[unitId],
      is_veto: isChecked
    }

    setUnitDetails(updatedDetails)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      title,
      short_code: shortCode,
      description,
      category: category ? category.value : null,
      unit_details: unitDetails
    }
    // Submit formData to the API
    Api.jsonPost('/approval/approvalflow/', formData)
      .then((response) => {
        if (response.status === 200) {
          Api.Toast('success', 'Created successfully')
          CallBack()
        } else {
          Api.Toast('error', 'Failed to create')
        }
      })
      .catch((error) => {
        Api.Toast('error', error)
      })
  }

  const renderConditionalFields = (selectedUnit) => {
    const unitId = selectedUnit.value
    const shortCode = category?.short_code
    console.log(category)
    console.log(shortCode)
    return (
      <>
        {shortCode === 'PD' && (
          <>
            <Col md='6' className='mb-1'>
              <Label for={`weightage-${unitId}`}>Weightage</Label>
              <Input
                type="number"
                step="0.01"
                id={`weightage-${unitId}`}
                placeholder='Enter Weightage'
                value={unitDetails[unitId]?.weightage || ''}
                onChange={(e) => handleUnitDetailChange(unitId, 'weightage', e.target.value)}
                required
              />
            </Col>
            <Col md='6' className='mb-1'>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={unitDetails[selectedUnit.value]?.is_fixed || false}
                    onChange={(e) => handleUnitDetailChange(selectedUnit.value, 'is_weightage_fixed', e.target.checked)}
                  />{' '}
                    Is Weightage Fixed
                </Label>
              </Col>
            <Col md='6' className='mb-1'>
              <Label for={`evaluation-${unitId}`}>Select Evaluation</Label>
              <Select
                options={dropdownData.categories}
                id={`evaluation-${unitId}`}
                value={dropdownData.categories.find(evaluation => evaluation.value === unitDetails[unitId]?.evaluation) || null}
                onChange={(selectedOption) => handleUnitDetailChange(unitId, 'evaluation', selectedOption.value)}
                classNamePrefix='select'
                placeholder="Select Evaluation"
              />
            </Col>
            <Col md='6' className='mb-1'>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={unitDetails[selectedUnit.value]?.is_fixed || false}
                    onChange={(e) => handleUnitDetailChange(selectedUnit.value, 'is_evaluation_fixed', e.target.checked)}
                  />{' '}
                    Is evaluation Fixed
                </Label>
              </Col>
          </>
        )}
        {(shortCode === 'LR' || shortCode === 'WR') && (
          <Col md='6' className='mb-1'>
            <Label check>
              <Input
                type="checkbox"
                checked={unitDetails[unitId]?.is_veto || false}
                onChange={(e) => handleVetoChange(unitId, e.target.checked)}
              />{' '}
              Has Veto
            </Label>
          </Col>
        )}
      </>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Row className='mb-2'>
          <h2>Approval Flow</h2>
          <Col md='6'>
            <Input
              type="text"
              className='react-select mb-1'
              id="title"
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Col>
          <Col md='6'>
            <Input
              type="text"
              className='react-select mb-1'
              id="shortCode"
              placeholder='Short Code'
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              required
            />
          </Col>
          <Col md='6'>
            <Select
              options={dropdownData.categories}
              className='react-select mb-1'
              classNamePrefix='select'
              placeholder="Category"
              value={category}
              onChange={setCategory}
            />
          </Col>
          <Col md='12'>
            <Input
              type="textarea"
              className='react-select mb-1'
              id="description"
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Col>
          <Col md='12'>
            <Select
              isMulti
              options={approval_unit && approval_unit.length > 0 ? approval_unit.map(unit => ({ value: unit.id, label: unit.title })) : null}
              className='react-select mb-1'
              classNamePrefix='select'
              placeholder="Select Approval Units"
              value={selectedUnits}
              onChange={setSelectedUnits}
            />
          </Col>
          {selectedUnits.map(selectedUnit => (
            <React.Fragment key={selectedUnit.value}>
              <Col md='6' className='mb-1'>
                <Label for={`unit-${selectedUnit.value}`}>{selectedUnit.label} Level</Label>
                <Input
                  type="number"
                  id={`unit-${selectedUnit.value}`}
                  placeholder='Enter Level'
                  value={unitDetails[selectedUnit.value]?.level || ''}
                  onChange={(e) => handleUnitDetailChange(selectedUnit.value, 'level', e.target.value)}
                  required
                />
              </Col>
              <Col md='6' className='mb-1'>
                <Label for={`employee-${selectedUnit.value}`}>Select Employee</Label>
                <Select
                  options={dropdownData.employees}
                  id={`employee-${selectedUnit.value}`}
                  value={dropdownData.employees.find(emp => emp.value === unitDetails[selectedUnit.value]?.employee) || null}
                  onChange={(selectedOption) => handleUnitDetailChange(selectedUnit.value, 'employee', selectedOption.value)}
                  classNamePrefix='select'
                  placeholder="Select Employee"
                />
              </Col>
              {renderConditionalFields(selectedUnit)}
              <Col md='6' className='mb-1'>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={unitDetails[selectedUnit.value]?.is_fixed || false}
                    onChange={(e) => handleUnitDetailChange(selectedUnit.value, 'is_fixed', e.target.checked)}
                  />{' '}
                    Is Employee Fixed
                </Label>
              </Col>
              
            </React.Fragment>
          ))}
          <Col md='4'>
            <Button type="submit" className='btn btn-primary'>Create</Button>
          </Col>
        </Row>
      </form>
    </div>
  )
}

export default CreateFlow
