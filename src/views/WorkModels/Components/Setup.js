import React, { useEffect, useState } from 'react'
import { Spinner, Table, Card, CardBody, Input, Button, Badge, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
import ViewConfiguration from './ViewConfiguration'

const Setup = () => {
  const Api = apiHelper()
  const [loading, setisloading] = useState(false)
  const [data, setData] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [showCanvas, setShowCanvas] = useState(false)
  const [shift_setup_id, setShiftSetupId] = useState()


  const fetchData = async () => {
    try {
      setisloading(true)
      const result = await Api.get('/employeeworking/workingmodel/shift/get/')
      if (result.status === 200) {
        setData(result.data)
      } else {
        Api.Toast('error', result.message)
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error)
    } finally {
      setisloading(false)
    }
  }
  const handleCanvas = () => {
    setShowCanvas(!showCanvas)
  }
  const handleview = (id) => {
    setShiftSetupId(id)
    setShowCanvas(!showCanvas)
  }

  const handleEditClick = (index, currentTitle) => {
    setEditingIndex(index)
    setEditTitle(currentTitle)
  }

  const handleSaveClick = async (id) => {
    try {
      setisloading(true)
      const result = await Api.jsonPatch(`/employeeworking/workingmodel/shiftsetup/update/${id}/`, { title: editTitle })
      if (result.status === 200) {
        fetchData() 
        setEditingIndex(null)
        setEditTitle('')
      } else {
        Api.Toast('error', result.message)
      }
    } catch (error) {
      console.error('An error occurred while saving data:', error)
    } finally {
      setisloading(false)
    }
  }

  const handleCancelClick = () => {
    setEditingIndex(null)
    setEditTitle('')
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Card>
        <CardBody>
          {!loading ? (
            <>
              {data && data.length > 0 ? (
                <Table bordered striped responsive>
                  <thead className='table-dark text-center'>
                    <tr>
                      <th>Title</th>
                      <th>Working Model</th>
                      <th>Shift</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          {editingIndex === index ? (
                            <Input
                              type='text'
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          ) : (
                            item.title || <Badge color='danger'>N/A</Badge>
                          )}
                        </td>
                        <td>{item.working_model_title || <Badge color='danger'>N/A</Badge>}</td>
                        <td>{item.working_model_shift_title || <Badge color='danger'>N/A</Badge>}</td>
                        <td>
                          {editingIndex === index ? (
                            <>
                              <Button color='success' size='sm' onClick={() => handleSaveClick(item.id)}>Save</Button>{' '}
                              <Button color='secondary' size='sm' onClick={handleCancelClick}>Cancel</Button>
                            </>
                          ) : (
                            <>
                            <Button color='primary' size='sm' onClick={() => handleEditClick(index, item.title)}>Edit</Button>
                            <Button className='ms-2' color='success' size='sm' onClick={() => handleview(item.id)}>View</Button>
                          </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className='text-center'>No data found</div>
              )}
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
              <Spinner type='grow' color='primary' />
            </div>
          )}
        </CardBody>
      </Card>
      <Offcanvas isOpen={showCanvas} toggle={handleCanvas} scroll={true} direction="end">
        <OffcanvasHeader toggle={handleCanvas}>View Configuration</OffcanvasHeader>
        <OffcanvasBody>
        <ViewConfiguration workmodel={null} selectedShift={null} shift_setup={shift_setup_id}/>
        </OffcanvasBody>
      </Offcanvas>
    </div>
  )
}

export default Setup
