import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import CreateEmpEducation from "../CreateEmployeeComponents/CreateEmpEducation"
import UpdateEmpEducation from "../UpdateEmployeeComponents/UpdateEmpEducation"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const EducationDetail = ({empData, CallBack, url_params}) => {
    // const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [item, setItem] = useState()
    return (
        <Card className="emplyee_Education_detail">
                    <CardTitle>
                                <div className="row bg-blue">
                                    <div className="col-lg-4 col-md-4 col-sm-4"></div>
                                    <div className='col-lg-4 col-md-4 col-sm-4'>
                                        <h4 color='white' className="text-center">Education Detail</h4>
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
                    {Object.values(empData.employee_education).length > 0 ? (
                    <>
                        <CardBody>
                                <Table bordered striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Emplyee Name</th>
                                            <th>Degree Type</th>
                                            <th>Degree Title</th>
                                            <th>Institute</th>
                                            <th>Date of Completion</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {Object.values(empData.employee_education).map((education, key) => (
                                        <tr key={key}>
                                            <td>{education.employee_name ? education.employee_name : 'N/a'}</td>
                                            <td>{education.degree_type_title ? education.degree_type_title : 'N/A'}</td>
                                            <td>{education.degree_title ? education.degree_title : 'N/A'}</td>
                                            <td>{education.selected_institute_name ? education.selected_institute_name : (education.institute_name ? education.institute_name : 'N/A')}</td>
                                            <td>{education.year_of_completion}</td>
                                            <td>
                                                <div className="d-flex row">
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => {
                                                            setItem(education)
                                                            setEditModal(true)
                                                        }}
                                                    >
                                                        <Edit color="orange" />
                                                    </button>
                                                    </div>
                                                    <div className="col-lg-6">
                                                    <button
                                                        className="border-0"
                                                        onClick={() => EmpHelper.DeleteEmpEducation(url_params.uuid, education.id).then(() => { CallBack() })}
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
                    <CreateEmpEducation CallBack={CallBack} emp_id={empData.employee.id} uuid={url_params.uuid}/>
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <UpdateEmpEducation CallBack={CallBack} empData={item} uuid={url_params.uuid}/>
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default EducationDetail