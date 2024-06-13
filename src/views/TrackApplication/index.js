import React, { useState } from 'react'
import { CardBody, Card, Label, Input, Button } from 'reactstrap'
import InputMask from 'react-input-mask'
import apiHelper from '../Helpers/ApiHelper'
function TrackApplication() {
    const Api = apiHelper()
  const [cnic, setCnic] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [cnicError, setCnicError] = useState()
  const checkCnic = (cnic) => {
    const getCnicNumberCount = cnic.replace(/[^0-9]/g, '')
        if (getCnicNumberCount.length !== 13) {
                setCnicError("Your Cnic Length must be 13")
            return false
        }
        return true
    }
  const onValidateCnic = (event, track) => {
    checkCnic(event.target.value, track)
}

const onChangeCnic = (event) => {
        setCnic(event.target.value)
        setCnicError("")
    
}

  const handleSubmit = (event) => {
    event.preventDefault()
    const isValidCnic = checkCnic(cnic)
    if (!isValidCnic) {
        Api.Toast('error',   "Cnic is not valid")
        return
    }
    // Mock data for search results
    const fullName = "John Doe"
    const email = "john@example.com"
    const phone = "+1234567890"
    const jobTitle = "Software Engineer"
    const department = "Engineering"
    const location = "New York"
    const status = "In Review"
    // Update search results state
    setSearchResults({
      fullName,
      cnic,
      email,
      phone,
      jobTitle,
      department,
      location,
      status
    })
  }

  return (
    <div className="container mt-5 d-flex justify-content-center">
  <div className="col-md-6">
    <Card className="d-flex align-items-center">
      <CardBody>
        <h2 className="mb-2 text-primary">Track Your Application</h2>
        <h6 className='mb-2 text-dark'>Enter your credentials to track your application status</h6>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Label className="font-weight-bold">CNIC :</Label>
            {/* <label htmlFor="cnic">CNIC (National ID) Number:</label> */}
            <InputMask className="form-control"
                        mask="99999-9999999-9"  
                        id="cnic"
                        value={cnic}
                        name="cnic"
                        placeholder="cnic"
                        onBlur={onValidateCnic}
                        onChange={onChangeCnic}
                        
                        />
                         <p style={{fontSize:'10px', color:'red'}}>{cnicError ? cnicError : null}</p> 
          </div>
          <div className="text-center">
          <Button type="submit" className="mt-2 btn btn-primary text-center">Search Application</Button>
          </div>
        </form>
        {searchResults && (
          <div className="mt-4">
            <h3 className='text-dark'>Applied Jobs</h3>
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Job</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchResults.fullName}</td>
                  <td>{searchResults.jobTitle}</td>
                  <td>{searchResults.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  </div>
</div>
  )
}

export default TrackApplication
