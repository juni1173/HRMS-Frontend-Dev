import React, { useEffect, useState } from 'react'
import EvaluationForm from './EvaluationForm'
import EvaluationsList from './EvaluationList'
import apiHelper from '../Helpers/ApiHelper'
import { Spinner } from 'reactstrap'

const AddEvaluationPage = () => {
    const Api = apiHelper()
    const [procedureOptions, setProcedureOptions] = useState([])
    const [complexityOptions, setComplexityOptions] = useState([])
    const [isloading, setisloading] = useState(true)
    

    const preData = async() => {
        setisloading(true)
        const response = await Api.get('/evaluations/pre/data/')
        if (response) {
            if (response.status === 200) {
                if (response.data.procedure && response.data.procedure.length > 0) {
                const options = response.data.procedure.map(procedure => ({
                    value: procedure.id,
                    label: procedure.title
                  }))
                  setProcedureOptions(options)
                }
                if (response.data.complexities && response.data.complexities.length > 0) {
                  const complexityoptions = response.data.complexities.map(complexities => ({
                    value: complexities.id,
                    label: complexities.title
                  }))
                  setComplexityOptions(complexityoptions)
                }
                setisloading(false)
            } else {
                Api.Toast('error', response.message)
                setisloading(false)
            }
        } else {
            Api.Toast('error', 'Unable to fetch')
            setisloading(false)
        }
    }

    useEffect(() => {
        preData()
    }, [])


  return (
    <div>
        { !isloading ? <>
      <EvaluationForm
                        procedureOptions={procedureOptions}
                        complexityOptions={complexityOptions}
                    />
      <EvaluationsList /> </> : <div className="container h-100 d-flex justify-content-center">
          <div className="jumbotron my-auto">
            <div className="display-3"><Spinner type='grow' color='primary'/></div>
          </div> 
          </div> }
    </div>
  )
}

export default AddEvaluationPage
