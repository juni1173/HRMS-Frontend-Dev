import React, { useEffect, useState } from 'react'
import { Row, Col, Spinner, Button } from 'reactstrap'
import apiHelper from '../Helpers/ApiHelper'
import Select from 'react-select'
import { FaEdit } from 'react-icons/fa'
import { Edit } from 'react-feather'

const ViewFlow = ({ approval }) => {
  const Api = apiHelper()
  const [hierarchyData, setHierarchyData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // const [editIndex, setEditIndex] = useState(null) // State to track the index being edited
  // const [selectedEmployee, setSelectedEmployee] = useState(null) // State to track the selected employee

  const preData = async () => {
    setIsLoading(true)
    const result = await Api.jsonPost(`/approval/approvalflow/${approval.id}/`)
    if (result) {
      if (result.status === 200) {
        setHierarchyData(result.data.hierarchy_data)
      } else {
        Api.Toast('error', result.message)
      }
    } else {
      Api.Toast('error', 'Unable to fetch data')
    }
    setIsLoading(false)
  }

  // const handleEditClick = (index) => {
  //   setEditIndex(index)
  // }

  // const handleEmployeeChange = (selectedOption) => {
  //   setSelectedEmployee(selectedOption)
  // }

//   const handleSubmit = async (item) => {
//     if (selectedEmployee !== null && selectedEmployee !== undefined)  { 
//     const result = await Api.jsonPatch(`/approval/approvalflow/setup/update/${item.id}/`, {
//       employee_id: selectedEmployee.value
//     })
//     if (result && result.status === 200) {
//       Api.Toast('success', result.message)
//       preData() // Refresh the data after updating
//     } else {
//       Api.Toast('error', 'Failed to update employee')
//     }
//     setEditIndex(null)
//     setSelectedEmployee(null)
// } else {
//     Api.Toast('error', 'Please select employee')
// }
//   }

  useEffect(() => {
    preData()
  }, [])

  return (
    <div>
      {!isLoading ? (
        <>
          {hierarchyData && hierarchyData.length > 0 ? (
            <div>
              {/* <h3>Hierarchy Data</h3> */}
              <Row>
                <Col>
                  {hierarchyData.map((item, index) => (
                    <div key={index}>
                      <p><strong>Level:</strong> {item.level}</p>
                      <p><strong>Approval Unit:</strong> {item.unit_title}</p>
                      <p><strong>Employee:</strong> {item.employee ? item.employee_name : 'N/A'}</p>
                      {/* {!item.is_fixed ? (
                        <>
                          {editIndex === index ? (
                            <>
                              <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="employee"
                                options={employees}
                                onChange={handleEmployeeChange}
                              />
                              <Button className='mt-2' color='primary' onClick={() => handleSubmit(item)}>Submit</Button>
                            </>
                          ) : (
                            <Edit onClick={() => handleEditClick(index)} style={{ cursor: 'pointer' }} />
                          )}
                        </>
                      ) : null} */}
                      <hr />
                    </div>
                  ))}
                </Col>
              </Row>
            </div>
          ) : (
            <div className='text-center'>No data found</div>
          )}
        </>
      ) : (
        <div className="container h-100 d-flex justify-content-center">
          <div className="jumbotron my-auto">
            <div className="display-3"><Spinner type='grow' color='primary' /></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewFlow
