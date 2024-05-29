import { Card, CardBody, Label, Input, Spinner, CardTitle, Row, Col, Table, InputGroup, InputGroupText, Badge, Modal, ModalBody, ModalHeader, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import Select from 'react-select'
import { useState, useEffect } from "react"
import { Eye, Plus, Search } from "react-feather"
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import ReactPaginate from 'react-paginate'
import AssignModel from "./Assign"
import History from "./History"
import ViewConfiguration from "../Components/ViewConfiguration"
const Index = () => {
    const Api = apiHelper()
    const searchHelper = SearchHelper()
    const [searchQuery] = useState([])
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)
    const [canvas, setCanvas] = useState(false)
    const toggleCanvas = () => setCanvas(!canvas)
    const [showCanvas, setShowCanvas] = useState(false)
    const handleCanvas = () => setShowCanvas(!showCanvas)
    const [work_model, setwork_model] = useState()
    const [work_model_shift, setwork_model_shift] = useState()
    // const [data, setData] = useState()
    const [currentItems, setCurrentItems] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [data, setData] = useState()
    const [selectedEmployee, setSelectedEmployee] = useState()
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(50)
    const itemsCount = [
      {value: 25, label: '25'},
        {value: 50, label: '50'},
        {value: 100, label: '100'},
        {value: 150, label: '150'},
        {value: 200, label: '200'}
    ]
    const handleconfigview = (work_model, work_model_shift) => {
     setwork_model({id:work_model})
     setwork_model_shift({id:work_model_shift})
     handleCanvas()
    }

    
    const getData =  async() => {
        setLoading(true)
         await Api.get(`/employeeworking/workingmodel/employee/assign/`).then(response => {
            setData(response.data)
            setSearchResults(response.data)
          }) 
         setTimeout(() => {
          setLoading(false)
         }, 1000)
      }
      const CallBack = () => {
        toggle()
        getData()
      }
      useEffect(() => {
          getData()
      }, [])
    //   const CallBack = () => {
    //     getData()
    //   }
      const getSearch = options => {
        console.log(typeof options.value)
        if (options.value === '' || options.value === null || options.value === undefined) {

            if (options.key in searchQuery) {
                delete searchQuery[options.key]
            } 
            if (Object.values(searchQuery).length > 0) {
                options.value = {query: searchQuery}
            } else {
                options.value = {}
            }
            // setItemOffset(0)
            // setEmployeeData(searchHelper.searchObj(options))
            setCurrentItems(searchHelper.searchObj(options))
            setSearchResults(searchHelper.searchObj(options))
            
        } else {
            searchQuery[options.key] = options.value
            options.value = {query: searchQuery}
            // setItemOffset(0)
            // setEmployeeData(searchHelper.searchObj(options))
            console.log(searchHelper.searchObj(options))
            setCurrentItems(searchHelper.searchObj(options))
            setSearchResults(searchHelper.searchObj(options))
            console.log(currentItems)
        }
        
    }
    useEffect(() => {
      const endOffset = itemOffset === 0 ? itemsPerPage : itemOffset + itemsPerPage            
      setCurrentItems(searchResults.slice(itemOffset, endOffset))
      setPageCount(Math.ceil(searchResults.length / itemsPerPage))
      }, [itemOffset, itemsPerPage, searchResults])

  const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % searchResults.length
      setItemOffset(newOffset)
      }
      const handleadd = (item) => {
        setSelectedEmployee(item)
        toggle()
      }
      const handleview = (item) => {
        setSelectedEmployee(item)
        toggleCanvas()
      }
  return (
    <div>
        <Card>
            <CardBody>
    {!loading ? (
    <div className="mx-1">
      <Row>
      <Col md={4}>
<Label>Serach Employee</Label>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search employee name...'  onChange={e => { getSearch({list: data, key: 'employee_name', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
                <Col md={4}>
<Label>Serach by working model</Label>
                    <InputGroup className='input-group-merge mb-2'>
                        <InputGroupText>
                            <Search size={14} />
                        </InputGroupText>
                        <Input placeholder='search working model...'  onChange={e => { getSearch({list: data, key: 'working_model_title', value: e.target.value }) } }/>
                    </InputGroup>
                </Col>
                <Col md={4}>
  <div className="mr-1">
  <span>Showing {Object.values(currentItems).length > 0 ? itemsPerPage : 0} results per page</span>
    <Select
      className="mb-2"
      placeholder="Entries"
      options={itemsCount}
      onChange={(e) => {
        setItemsPerPage(e.value)
        setItemOffset(0)
      }}
    />
  </div>

</Col>
</Row>
                {currentItems.length > 0 ? <>
                  <Table bordered striped responsive className='mb-2'>
                        <thead className='table-dark text-center'>
                            <tr>
                                <th>Name</th>
                                <th>Working Model</th>
                                <th>Working Model Shift</th>
                                <th>Effective From</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((data) => (
            <tr key={data.employee}>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={data.profile_image}
                    className="mr-2"
                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                  />
                  <div>
                    <div><strong>{data.employee_name}</strong></div>
                    <div>{data.staff_classification}</div>
                  </div>
                </div>
              </td>
              <td>
                {data.working_model_title || <Badge color='danger'>N/A</Badge>}
    </td>
    <td>
    {data.working_model_shift_title && data.working_model_shift ? (
    <>
        {data.working_model_shift_title}
        <button
            className="border-0 no-background m-0 ms-2 p-0"
            title="View History"
            onClick={() => handleconfigview(data.working_model, data.working_model_shift)}
        >
            <Eye color="green" />
        </button>
    </>
) : (
    <Badge color='danger'>N/A</Badge>
)}
    </td>
    <td>
    {data.effective_from || <Badge color='danger'>N/A</Badge>}
    </td>
    <td>
    <button
                                className="border-0 no-background m-0 p-0"
                                title="View History"
                                onClick={() => handleview(data.employee)}
                                >
                                <Eye color="grey"/>
                            </button>
                            <button
                                className="border-0 no-background m-0 ms-2 p-0"
                                title="Add Shift"
                                onClick={() => handleadd(data.employee)}
                                >
                                <Plus color="grey"/>
                            </button>
    </td>
            </tr>
                        ))}

                        </tbody> 
                    </Table>
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
                </> : <div className="text-center">No data found</div> }
    </div>
  ) : (
    <div className="container h-100 d-flex justify-content-center">
      <div className="jumbotron my-auto">
        <div className="display-3"><Spinner type='grow' color='primary'/></div>
      </div>
  </div>
  )}
  </CardBody>
        </Card>
  <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Asign Working Model</ModalHeader>
        <ModalBody>
        <AssignModel employee={selectedEmployee} CallBack={CallBack}/>
        </ModalBody>
      </Modal>
      <Offcanvas isOpen={canvas} toggle={toggleCanvas} scroll={true} direction="end">
        <OffcanvasHeader toggle={toggleCanvas}>History</OffcanvasHeader>
        <OffcanvasBody>
          <History  employee={selectedEmployee}/>
          {/* <ConfigurationHandling workmodel={selectedItem}/> */}
        </OffcanvasBody>
      </Offcanvas>
      <Offcanvas isOpen={showCanvas} toggle={handleCanvas} scroll={true} direction="end">
        <OffcanvasHeader toggle={handleCanvas}>View Configuration</OffcanvasHeader>
        <OffcanvasBody>
        <ViewConfiguration workmodel={work_model} selectedShift={work_model_shift} shift_setup={null}/>
        </OffcanvasBody>
      </Offcanvas>
  </div>
  )
}

export default Index