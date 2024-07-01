// ** Custom Components
import { useState } from 'react'
import Avatar from '@components/avatar'
import SwiperCore, {
    Grid,
    Lazy,
    Virtual,
    Autoplay,
    Navigation,
    Pagination,
    EffectFade,
    EffectCube,
    EffectCoverflow
  } from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react/swiper-react'
// ** Icons Imports
import * as Icon from 'react-feather'
import { FcLeave } from "react-icons/fc"
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'
import '@styles/react/libs/swiper/swiper.scss'

// ** Init Swiper Functions
SwiperCore.use([Navigation, Grid, Pagination, EffectFade, EffectCube, EffectCoverflow, Autoplay, Lazy, Virtual])
const MedicalApprovals = ({ data }) => {
  const [isCardBodyVisible, setIsCardBodyVisible] = useState(false)
  const toggleCardBody = () => {
    setIsCardBodyVisible(!isCardBodyVisible) // Toggle visibility state
  }
    const params = {
        className: ' p-1',
        slidesPerView: 'auto',
        spaceBetween: 50,
        centeredSlides: true,
        navigation: true,
        slideToClickedSlide: true
      }

  const renderPendingLeavesApprovals = () => {
    return data.map(item => {
      return (
        <SwiperSlide className='rounded swiper-shadow'>
            <div key={item.id} className=''>
            <div className='text-center'>
            <a href='../statusrequests/'><Avatar className='rounded mb-2' color='light-secondary' icon={<Icon.Calendar color='white'/>} /></a>
                <div>
                <h6 className='transaction-title text-white'>{item.employee_name.toUpperCase()}</h6>
                <small className='text-white'>{`${item.leave_types_title}`}</small><br></br>
                <small className='text-white'>{`${item.start_date} to ${item.end_date}`}</small>
                </div>
            </div>
            </div>
        </SwiperSlide>
      )
    })
  }

  return (
    <Card className='card-transaction cursor-pointer mb-1' onClick={toggleCardBody} style={{background: 'linear-gradient(to right, #2c3e50, #3498db)'}}>
      <CardHeader className='p-1'>
        <Badge pill style={{background: 'linear-gradient(to right, #2c3e50, #3498db)'}} className='badge-up'>
          {data.length}
        </Badge>
        <CardTitle tag='h4' className='text-white'><FcLeave color='#fff' size={'24'} /> Leaves Approvals </CardTitle>
        <Icon.ArrowDown size={18} color='white'/>
        
        {/* <a href='../statusrequests/'></a> */}
      </CardHeader>
      {isCardBodyVisible && (
        <CardBody>
            <Swiper {...params}>
                {data && data.length > 0 ? (
                    renderPendingLeavesApprovals()
                ) : (
                    <SwiperSlide className='rounded swiper-shadow'>
                        <div className='text-center'>
                            <Avatar className='rounded mb-2' color='light-secondary' icon={<Icon.Calendar color='white'/>} />
                            <div>
                            <h6 className='transaction-title text-white'>No Leave Request Found!</h6>
                            </div>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>
        </CardBody>
      )}
    </Card>
  )
}

export default MedicalApprovals
