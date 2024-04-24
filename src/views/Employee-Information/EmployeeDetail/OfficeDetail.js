import { Fragment, useState} from "react"
import { Edit, Plus, XCircle, Check} from "react-feather"
import {Modal, ModalBody, ModalHeader, Card, CardBody, CardTitle, Spinner, Table, Badge, Button, Input} from "reactstrap"
import UpdateOfficeDetail from "../AddEmployee/OfficeDetail/UpdateOfficeDetail"
import apiHelper from "../../Helpers/ApiHelper"
// import user_blank  from "../../../assets/images/avatars/user_blank.png"
const OfficeDetail = ({empData, CallBack}) => {
    const Api = apiHelper()
    const [editModal, setEditModal] = useState(false)
    
    return (
        <Card className="emplyee_office_detail">
        <CardTitle>
                    <div className="row bg-blue">
                        <div className="col-lg-4 col-md-4 col-sm-4"></div>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            <h4 color='white' className="text-center">Office Detail</h4>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4">
                            {Api.role === 'admin' && (
                                <button
                                className="border-0 no-background float-right"
                                title="Edit Employee"
                                onClick={() => setEditModal(true)}
                                >
                                <Edit color="white"/>
                            </button>
                            )}
                            
                        </div>
                    </div>
        </CardTitle>
        {
        Object.values(empData.employee).length > 0 ? (
        <>
            <CardBody>
                
                    <div className="row">
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                            <p className='label'>Employment type: &nbsp;  &nbsp;<strong>{empData.employee.employee_type_title ? empData.employee.employee_type_title : 'N/A'}</strong></p>
                            <p className='label'>Staff Classification: &nbsp;  &nbsp; <strong>{empData.employee.staff_classification_title ? empData.employee.staff_classification_title : 'N/A'}</strong></p>
                            <p className='label'>Department: &nbsp;  &nbsp; <strong>{empData.employee.department_title ? empData.employee.department_title : 'N/A'}</strong></p>
                            <p className='label'>Position: &nbsp;  &nbsp; <strong>{empData.employee.position_title ? empData.employee.position_title : 'N/A'}</strong></p>
                            <p className='label'>Official Email: &nbsp;  &nbsp; <strong>{empData.employee.official_email ? empData.employee.official_email : 'N/A'}</strong></p>
                            <p className='label'>Leaving Reason: &nbsp;  &nbsp; <strong>{empData.employee.leaving_reason ? empData.employee.leaving_reason : 'N/A'}</strong></p>
                    </div>
                        <div className='col-lg-6 col-md-6 col-sm-6'>
                        <p className='label'>Employee Code: &nbsp;  &nbsp; <strong>{empData.employee.emp_code ? empData.employee.emp_code : 'N/A'}</strong></p>
                            <p className='label'>Official Skype: &nbsp;  &nbsp; <strong>{empData.employee.skype ? empData.employee.skype : 'N/A'}</strong></p>
                            <p className='label'>Joining Date: &nbsp;  &nbsp; <strong>{empData.employee.joining_date ? empData.employee.joining_date : 'N/A'}</strong></p>
                            <p className='label'>Hiring Comment: &nbsp;  &nbsp; <strong>{empData.employee.hiring_comment ? empData.employee.hiring_comment : 'N/A'} </strong></p>
                            <p className='label'>Leaving Date: &nbsp;  &nbsp;<strong>{empData.employee.leaving_date ? empData.employee.leaving_date : 'N/A'}</strong></p>
                            <p className='label'>Starting Salary: &nbsp;  &nbsp; <strong>{empData.employee.starting_salary ? empData.employee.starting_salary : 'N/A'}</strong></p>
                            <p className='label'>Current Salary: &nbsp;  &nbsp; <strong>{empData.employee.current_salary ? empData.employee.current_salary : 'N/A'}</strong></p>
                        </div>
                    </div>
            </CardBody>
        </>
        ) : (
            <CardBody>
                No Data Found
            </CardBody>
        )
       }
        <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
                    <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
                    <ModalBody className='px-sm-5 mx-50 pb-5'>    
                   <UpdateOfficeDetail CallBack={CallBack} empData={empData.employee} />
                    </ModalBody>
                </Modal>
    </Card> 
    )
}
export default OfficeDetail