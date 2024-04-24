import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import UpdateEmpExperience from "../UpdateEmployeeComponents/UpdateEmpExperience"
import CreateEmpExperience from "../CreateEmployeeComponents/CreateEmpExperience"

// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const ExperienceDetail = ({empData, CallBack, url_params}) => {
    // const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [item, setItem] = useState()
    return (
        <Card className="emplyee_Experience_detail">
        <CardTitle>
                    <div className="row bg-blue">
                        <div className="col-lg-4 col-md-4 col-sm-4"></div>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            <h4 color='white' className="text-center">Experience Detail</h4>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4">
                            <button
                                className="border-0 no-background float-right"
                                title="Edit Employee"
                                onClick={() => setCreateModal(true)}
                                >
                                <Plus color="white"/>
                            </button>
                        </div>
                    </div>
        </CardTitle>
        { Object.values(empData.employee_companies).length > 0 ? (
        <>
            <CardBody>
                    <Table bordered striped responsive>
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Company Name</th>
                                <th>Designation</th>
                                <th>Joining Date</th>
                                <th>Leaving Date</th>
                                <th>Leaving Reason</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                        {Object.values(empData.employee_companies).map((company, key) => (
                            <tr key={key}>
                                <td>{company.employee_name ? company.employee_name : 'N/a'}</td>
                                <td>{company.choosen_company_name ? company.choosen_company_name : (company.company_name ? company.company_name : 'N/A')}</td>
                                <td>{company.designation ? company.designation : 'N/A'}</td>
                                <td>{company.joining_date ? company.joining_date : 'N/A'}</td>
                                <td>{company.leaving_date ? company.leaving_date : 'N/A'}</td>
                                <td>{company.leaving_reason ? company.leaving_reason : 'N/A'}</td>
                                <td>
                                    <div className="d-flex row">
                                        <div className="col-lg-6">
                                        <button
                                            className="border-0"
                                            onClick={() => {
                                                setItem(company)
                                                setEditModal(true)
                                            }}
                                            
                                        >
                                            <Edit color="orange" />
                                        </button>
                                        </div>
                                        <div className="col-lg-6">
                                        <button
                                            className="border-0"
                                            onClick={() => EmpHelper.DeleteEmpExperience(url_params.uuid, company.id).then(() => { CallBack() })}
                                        >
                                            <XCircle color="red" />
                                        </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
            </CardBody>
        </>
        ) : (
            <CardBody>
                No Data Found
            </CardBody>
        )}
                <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setCreateModal(!createModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <CreateEmpExperience CallBack={CallBack} emp_id={empData.employee.id} uuid={url_params.uuid}/>
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <UpdateEmpExperience CallBack={CallBack} empData={item} uuid={url_params.uuid}/>
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default ExperienceDetail