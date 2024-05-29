import { useState, useEffect } from 'react'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Table,
  Spinner
} from 'reactstrap'
// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import apiHelper from '../../Helpers/ApiHelper'

const Access = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [unitData, setUnitData] = useState([])
    const [accessData, setAccessData] = useState([])
    const [watchValues, setWatchValues] = useState({})

    const fetchPreData = async () => {
        setLoading(true)
        await Api.get(`/OrganizationUnit/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setUnitData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })

        await Api.get(`/OrganizationUnitAccess/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setAccessData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
        setLoading(false)
    }

    const {
        reset,
        control,
        handleSubmit
    } = useForm()

    const onReset = () => {
        reset({ title: '' })
    }

    useEffect(() => {
        fetchPreData()
    }, [setAccessData])


    const CallBack = () => {
        fetchPreData()
    }
    
    const onSubmit = async () => {
        setLoading(true)
        const updates = []

        for (const unit of unitData) {
            const unitTitle = unit.title
            const unitAccess = accessData.find(access => access.unit === unit.id)
            console.log(unitTitle)
            console.log(watchValues[`View-${unitTitle}`])
            console.log(watchValues[`Create-${unitTitle}`])

            const payload = {
                unit: unit.id,
                can_derive: watchValues[`View-${unitTitle}`] !== undefined ? watchValues[`View-${unitTitle}`] : unitAccess.can_derive,
                can_create: watchValues[`Create-${unitTitle}`] !== undefined ? watchValues[`Create-${unitTitle}`] : unitAccess.can_create
            }

            updates.push(payload)
        }

        await Api.jsonPatch(`/OrganizationUnitAccess/bulk-update/`, { updates }).then(result => {
            if (result.status === 200) {
                Api.Toast('success', 'Access data updated successfully')
                // fetchPreData()
                setLoading(false)
                CallBack()
            } else {
                Api.Toast('error', result.message)
                setLoading(false)
            }
        })

        
    }

    return (
        <Row>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Col xs={12}>
                    <Table className='table-flush-spacing' responsive>
                        <tbody>
                            {!loading ? (
                                unitData.map((unit, index) => {
                                    const unitAccess = accessData.find(access => access.unit === unit.id)
                                    return (
                                        <tr key={index}>
                                            <td className='text-nowrap fw-bolder'>{unit.title}</td>
                                            <td>
                                                <div className='d-flex'>
                                                    <div className='form-check me-3 me-lg-5'>
                                                        <Controller
                                                            name={`View-${unit.title}`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    type='checkbox'
                                                                    id={`View-${unit.title}`}
                                                                    name={`View-${unit.title}`}
                                                                    defaultChecked={unitAccess ? unitAccess.can_derive : false}
                                                                    onChange={(e) => {
                                                                        setWatchValues({
                                                                            ...watchValues,
                                                                            [`View-${unit.title}`]: e.target.checked
                                                                        })
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                        <Label className='form-check-label' for={`View-${unit.title}`}>
                                                           Can Derive
                                                        </Label>
                                                    </div>
                                                    <div className='form-check me-3 me-lg-5'>
                                                        <Controller
                                                            name={`Create-${unit.title}`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    type='checkbox'
                                                                    id={`Create-${unit.title}`}
                                                                    name={`Create-${unit.title}`}
                                                                    defaultChecked={unitAccess ? unitAccess.can_create : false}
                                                                    onChange={(e) => {
                                                                        setWatchValues({
                                                                            ...watchValues,
                                                                            [`Create-${unit.title}`]: e.target.checked
                                                                        })
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                        <Label className='form-check-label' for={`Create-${unit.title}`}>
                                                           Can Create
                                                        </Label>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr className='text-center'>
                                    <td colSpan={5}> <Spinner/></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
                <Col className='text-center mt-2' xs={12}>
                    <Button type='submit' color='primary' className='me-1'>
                        Submit
                    </Button>
                    <Button type='reset' outline onClick={onReset}>
                        Discard
                    </Button>
                </Col>
            </form>
        </Row>
    )
}

export default Access
