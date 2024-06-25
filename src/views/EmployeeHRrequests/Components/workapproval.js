import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText, Spinner, Input, Label, Badge, Button, InputGroup, InputGroupText, Form, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap" 
import { Edit, FileText, XCircle, Search, Eye } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import SearchHelper from '../../Helpers/SearchHelper/SearchByObject'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactPaginate from 'react-paginate'
import StatusLogsComponent from './StatusLogs'
const Approval = () => {
    const status_choices = [
            {value: 'in-progress', label: 'in-progress'},
            // {value: 'under-review', label: 'under-review'},
            {value: 'approved', label: 'approved'},
            {value: 'not-approved', label: 'not-approved'}
]
    const Api = apiHelper() 
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    const [currentItems, setCurrentItems] = useState([])
    const [data, setData] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(50)
    const searchHelper = SearchHelper()
    const [isLogsOpen, setIsLogsOpen] = useState(false)
    const [currentLogs, setCurrentLogs] = useState()

    const toggleLogs = () => setIsLogsOpen(!isLogsOpen)

    const handleLogsClick = (logs) => {
        setCurrentLogs(logs)
        toggleLogs()
    }
    // const [selectedItems, setSelectedItems] = useState([])
    const preDataApi = async () => {
        const formData = new FormData()
        formData['short_code'] = 'WR'
        const response = await Api.jsonPost('/approval/for/approval/', formData)
        if (response.status === 200) {
            setData(response.data)
        } else {
            return Api.Toast('error', 'Data not found')
        }
    }
    const CallBack = () => {
        preDataApi()
    }
   
      const itemsCount = [
        {value: 50, label: '50'},
        {value: 100, label: '100'},
        {value: 150, label: '150'},
        {value: 200, label: '200'}
    ]
    const getSearch = options => {

        if (options.value === '' || options.value === null || options.value === undefined || options.value === 0) {

            if (options.key in searchQuery) {
                delete searchQuery[options.key]
            } 
            if (Object.values(searchQuery).length > 0) {
                options.value = {query: searchQuery}
            } else {
                options.value = {}
            }
            setItemOffset(0)
            setSearchResults(searchHelper.searchObj(options))
            setCurrentItems(searchHelper.searchObj(options))
            
        } else {
            
            searchQuery[options.key] = options.value
            options.value = {query: searchQuery}
            setItemOffset(0)
            setSearchResults(searchHelper.searchObj(options))
            setCurrentItems(searchHelper.searchObj(options))
            console.log(searchHelper.searchObj(options))
        }
    }
    const onStatusUpdate = async (id, status_value, comment) => {
            MySwal.fire({
                title: 'Are you sure?',
                text: "Do you want to update the Status!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it!',
                customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                if (result.value) {
                    const formData = new FormData()
                    formData['request_id'] = id
                    formData['status'] = status_value
                    formData['short_code'] = 'WR'
                    formData['comments'] = comment
                    // if (comment !== '') formData['decision_reason'] = comment
                     Api.jsonPost(`/approval/status/update/`, formData)
                        .then((result) => {
                            if (result.status === 200) {
                                MySwal.fire({
                                    icon: 'success',
                                    title: 'Status Updated!',
                                    text: 'Status is updated.',
                                    customClass: {
                                    confirmButton: 'btn btn-success'
                                    }
                                }).then(async function (result) {
                                    if (result.isConfirmed) {
                                        setLoading(true)
                                        await CallBack()
                                        setTimeout(() => {
                                            setLoading(false)
                                        }, 1000)
                                    }
                                })
                                } else {
                                    MySwal.fire({
                                        title: 'Error',
                                        text: result.message ? result.message : 'Something went wrong',
                                        icon: 'error',
                                        customClass: {
                                          confirmButton: 'btn btn-success'
                                        }
                                      })
                                }
                        })
                } 
            })
        }
    const StatusComponent = ({ item, index }) => {
        const [toggleThisElement, setToggleThisElement] = useState(false)
        const [comment, setComment] = useState('')
        const [statusValue, setStatusValue] = useState('')
        // console.log(item.status_logs.length)
        const firstStatusLog = item.status ? item.status.status : 'in-progress'
        return (
            <div className="single-history" key={index}>
            
            {toggleThisElement ? (
                <div className="row min-width-300">
                <div className="col-lg-8">
                <Select
                    isClearable={false}
                    options={status_choices}
                    className='react-select mb-1'
                    classNamePrefix='select'
                    defaultValue={status_choices.find(({ value }) => value === firstStatusLog) || status_choices[0]}
                            onChange={(statusData) => setStatusValue(statusData.value)}
                    />
                    {((statusValue === 'not-approved') || (statusValue === 'approved')) && (
                        <>
                        <Label>
                        Comment
                    </Label>
                    <Input 
                        type='textarea'
                        className='mb-1'
                        name='commentText'
                        placeholder="Add Remarks"
                        onChange={ (e) => { setComment(e.target.value) }}
                    />
                    </>
                    ) 
                    }
                    
                    <Button className="btn btn-primary" onClick={ async () => {
                        await onStatusUpdate(item.request_data.id, statusValue, comment).then(() => {
                            setToggleThisElement((prev) => !prev)
                        })
                    }}>
                        Submit
                    </Button>
                </div>
                <div className="col-lg-4 float-right">
                <XCircle color="red" onClick={() => setToggleThisElement((prev) => !prev)}/>
                </div>
            </div>
            ) : (
                <div className="row min-width-225">
                    <div className="col-lg-8">
                    <Badge color='info' className="mr-1">Your Status:</Badge>
                    <span> <Badge color='light-secondary'>
                                {status_choices.find(({ value }) => value === firstStatusLog)?.label || status_choices[0].label}
                            </Badge></span>
                    </div>
                    
                    <div className="col-lg-4 float-right">
                        <Edit color="orange" onClick={() => setToggleThisElement((prev) => !prev)}/>
                     </div>
                </div>
            )
                
            }
            </div>
        )
        }
       
        useEffect(() => {
            setLoading(true)
            setSearchResults(data)
            getSearch({ list: data, value: null, type: 'equal' })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }, [data])
useEffect(() => {
preDataApi()
}, [setData])
        useEffect(() => {
            if (searchResults && Object.values(searchResults).length > 0) {
                const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
                setCurrentItems(searchResults.slice(itemOffset, endOffset))
                setPageCount(Math.ceil(searchResults.length / itemsPerPage))
            }
            }, [itemOffset, itemsPerPage, searchResults])
            
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % searchResults.length
            setItemOffset(newOffset)
            }
  return (
    <Fragment>
        <Row>
        <Col md={12}>
        <div className='content-header' >
          <h5 className='mb-2'>Work Applcation Requests</h5>
          </div>
        </Col>
        
        <Col md={3}>
            <Label>
                Search Status
            </Label>
            <Select
                isClearable={true}
                options={status_choices}
                className='react-select mb-1'
                classNamePrefix='select'
                onChange={e => {
                            if (e) {
                            getSearch({list: data, key: 'team_lead_approval', value: e.value, type: 'equal' }) 
                            } else {
                                getSearch({list: data, key: 'team_lead_approval', value: '' }) 
                            }
                        } 
                    }
            />
                
        </Col>
        <Col md={3}>
            <span>Showing {currentItems && Object.values(currentItems).length > 0 ? itemsPerPage : 0} results</span>
            <Select 
                placeholder="Entries"
                options={itemsCount}
                onChange={e => {
                    setItemsPerPage(e.value)
                    setItemOffset(0)
                }}
            />
        </Col>
        <Col md={6}>
<Label>Serach Employee</Label>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search employee name...'  onChange={e => { getSearch({list: data, key: 'employee_name', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
                <Col md={6}>
             </Col>
             <Col md={12} className="mt-5">
      {!loading ? (
        <>
          {currentItems && Object.values(currentItems).length > 0 ? (
            <Row>
              {Object.values(currentItems).map((item, index) => (
                <Col md={12} key={index} className="mb-4">
                  <Card className="shadow-sm border">
                    <CardBody>
                      <CardTitle tag='h5' className="text-center">
                         {item.request_data.employee_name ? item.request_data.employee_name : <Badge color='danger'>N/A</Badge>}
                      </CardTitle>
                      <Row>
                      <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>Start Date:</strong> {item.request_data.start_date ? item.request_data.start_date : <Badge color="danger">N/A</Badge>}
                      </CardText>
                      </Col>
                      <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>End Date:</strong> {item.request_data.end_date ? item.request_data.end_date : <Badge color="danger">N/A</Badge>}
                      </CardText>
                    </Col>
                        <Col xs={4} className='mt-1'>
                          <Badge color='success' className="mr-1">Type:</Badge>
                          {item.request_data.work_type_title ? item.request_data.work_type_title : <Badge color='danger'>N/A</Badge>}
                        </Col>
                        <Col xs={4} className='mt-1'>
                          <Badge color='danger' className="mr-1">Duration:</Badge>
                          {item.request_data.duration ? item.request_data.duration : <Badge color='danger'>N/A</Badge>}
                        </Col>
                        <Col xs={4} className='mt-1'>
                      <CardText>
                        <strong>Attachment:</strong> {item.attachment ? (
                          <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_PUBLIC_URL}${item.request_data.attachment}`}>
                            <FileText />
                          </a>
                        ) : (
                          <Badge color="danger">N/A</Badge>
                        )}
                      </CardText>
                      </Col>
                      <Col xs={12} className='mt-1'>
                          <div className="mb-1">
                            <StatusComponent item={item} />
                          </div>
                        </Col>
                        <Col xs={12} className='mt-1'>
                        
                          <div className="mb-1">
                          <Badge color='info' className="mr-1">Request Status:</Badge>
                          {item.request_status ? `${item.request_status.status} by ${item.request_status.unit_title} (${item.request_status.action_by_name})` : 'in-progress'}
                          </div>
                        </Col>
                        {/* <Col xs={4} className='mt-1'>
                          <div className="mb-1">
                            <Badge color='info' className="mr-1">Your Status:</Badge>
                            <span>{item.request_data.user_status ? item.request_data.user_status : 'N/A'}</span>
                          </div>
                        </Col>
                        <Col xs={4} className='mt-1'>
                          <div className="mb-1">
                            <Badge color='info' className="mr-1">Request Status:</Badge>
                            <span>{item.request_data.request_status ? item.request_data.request_status : 'N/A'}</span>
                          </div>
                        </Col> */}
                        <Col xs={4} className='mt-1'>
                          <Button color="link" className="p-0" onClick={() => handleLogsClick(item.status_logs)}>
                            View Details
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center">No Work Application Data Found!</div>
          )}
        </>
      ) : (
        <div className="text-center"><Spinner /></div>
      )}
      <hr />
    </Col>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
                containerClassName='pagination'
                pageLinkClassName='page-num'
                previousLinkClassName='page-num'
                nextLinkClassName='page-num'
                activeLinkClassName='active'
                />
        </Row>
        <Offcanvas isOpen={isLogsOpen} toggle={toggleLogs} scroll={true} direction="end">
        <OffcanvasHeader toggle={toggleLogs}>View History</OffcanvasHeader>
        <OffcanvasBody>
        <StatusLogsComponent logs={currentLogs} />
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default Approval