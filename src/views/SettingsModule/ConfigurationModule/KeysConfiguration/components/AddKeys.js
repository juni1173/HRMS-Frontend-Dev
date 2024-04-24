// ** Reactstrap Imports
import {
    Row,
    Col,
    Label,
    Input,
    Button,
    Badge
  } from 'reactstrap'
  import apiHelper from '../../../../Helpers/ApiHelper'
  // ** Third Party Components
  import { useForm, Controller } from 'react-hook-form'
  import Flatpickr from 'react-flatpickr'
  import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useEffect } from 'react'
// import { setDefaultNamespace } from 'i18next'
  const AddKeys = ({ DiscardModal }) => {
      const Api = apiHelper()
    //   const [data, setdata] = useState()
      const {
          reset,
          control,
          handleSubmit,
          setValue
        } = useForm({
          defaultValues: {
            clientID: '',
            apiKey: '', 
            description: ''
          }
        })
        const onSubmit = async (data) => {
          if (data.clientID && data.apiKey) {
              const formData = new FormData()
              formData['client_id'] = data.clientID
              formData['google_api'] = data.apiKey
              await Api.jsonPost(`/organizations/apis/keys/`, formData).then(result => {
              if (result) {
                  if (result.status === 200) {
                    //   CallBack()
                    Api.Toast('success', result.message)
                  } else {
                      Api.Toast('error', result.message)
                  }
              } else {
                  Api.Toast('error', 'Server not responding')
              }
            })
          } else {
              Api.Toast('error', 'Please fill all the fields')
          }
        }
        const getKeys = async() => {
            Api.get(`/organizations/apis/keys/`).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setValue('clientID', result.data[0].client_id)
                        setValue('apiKey', result.data[0].google_api)
                        // setValue('description', result.data.description);
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
              })
        }
        useEffect(() => {
           getKeys()
        }, [])
        const onReset = () => {
          DiscardModal()
          reset({ title: '' })
        }
    return (
  <Row tag='form' onSubmit={handleSubmit(onSubmit)}>
    <Col xs={12}>
      <Label className='form-label text-white' for='clientID'>
        Google Client ID<Badge color='light-danger'>*</Badge>
      </Label>
      <Controller
        name='clientID'
        control={control}
        render={({ field }) => (
          <Input {...field} id='clientID' placeholder='Google Client ID' />
        )}
      />
    </Col>
  
    <Col xs={12}>
      <Label className='form-label text-white' for='apiKey'>
        Google API Key <Badge color='light-danger'>*</Badge>
      </Label>
      <Controller
        name='apiKey'
        control={control}
        render={({ field }) => (
          <Input {...field} id='apiKey' placeholder='Google API key' />
        )}
      />
    </Col>
  
    <Col className='text-center mt-2' xs={12}>
      <Button type='submit' color='primary' className='me-1'>
        Submit
      </Button>
      <Button type='reset' outline onClick={onReset}>
        Discard
      </Button>
    </Col>
  </Row>
  
    )
  }
  
  export default AddKeys