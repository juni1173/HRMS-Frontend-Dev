import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import EmployeeHelper from "../../Helpers/EmployeeHelper"
import UpdateEmpDependent from "../UpdateEmployeeComponents/UpdateEmpDependent"
import CreateEmpDependent from "../CreateEmployeeComponents/CreateEmpDependent"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const DependentDetail = ({empData, CallBack, url_params}) => {
    // const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [item, setItem] = useState()
    return (
        <Card className="emplyee_Dependent_detail">
        <CardTitle>
                    <div className="row bg-blue">
                        <div className="col-lg-4 col-md-4 col-sm-4"></div>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            <h4 color='white' className="text-center">Dependents Detail</h4>
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
        {Object.values(empData.employee_dependents).length > 0 ? (
        <>
            <CardBody>
                    <Table bordered striped responsive>
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Dependent Name</th>
                                <th>Relationship</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                        {Object.values(empData.employee_dependents).map((dependent, key) => (
                            <tr key={key}>
                                <td>{dependent.employee_name ? dependent.employee_name : 'N/a'}</td>
                                <td>{dependent.name ? dependent.name : 'N/A'}</td>
                                <td>{dependent.relationship_name ? dependent.relationship_name : 'N/A'}</td>
                                <td>
                                    <div className="d-flex row">
                                        <div className="col text-center">
                                        <button
                                            className="border-0"
                                            onClick={() => {
                                                setItem(dependent)
                                                setEditModal(true)
                                            }}
                                        >
                                            <Edit color="orange" />
                                        </button>
                                        </div>
                                        <div className="col">
                                        <button
                                            className="border-0"
                                            onClick={() => EmpHelper.DeleteEmpDependent(url_params.uuid, dependent.id).then(() => { CallBack() })}
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
                    <CreateEmpDependent CallBack={CallBack} emp_id={empData.employee.id} uuid={url_params.uuid}/>
                        {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
                    </ModalBody>
                </Modal>
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                    <UpdateEmpDependent CallBack={CallBack} empData={item} uuid={url_params.uuid}/>
                    </ModalBody>
                </Modal>
                </Card>
    )
}
export default DependentDetail