import React, {Children, useState} from 'react'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { ArrowRight, PenTool, Save, Settings } from 'react-feather'
import { CgNotes } from 'react-icons/cg'
const menuItems = [   
  {
            id: 'workmodel-accesscontrol',
            title: 'Access Control',
            icon: <PenTool size={20} />,
            navLink: '/workmodel/accesscontrol'
          },
          {
            id: 'workmodel-models',
            title: 'View Configuration Setup',
            icon: <Settings size={20} />,
            navLink: '/workmodel/setup'
          },
          {
            id: 'workmodel-models',
            title: 'Working Models',
            icon: <CgNotes size={20} />,
            navLink: '/workmodel/showmodels'
          },
          {
            id: 'workmodel-models',
            title: 'Assign Models',
            icon: <Save size={20} />,
            navLink: '/workmodel/assign'
          }

    ] 


const Index = () => {
  const history = useHistory()
  const [hoveredItem, setHoveredItem] = useState(null)
return (
    <Row>
    {menuItems.map((item, index) => (
                  <Col md={4}>
                    <Card className='cursor-pointer' key={index}  
                    onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          onClick={() => history.push(item.navLink)}>
                              <CardBody className='d-flex justify-content-between align-items-center'>
                                  <div>
                                      <span className='mr-2 pr-4'>
                                         
                                          {item.icon}
                                      </span>
                                      <strong className='ps-1'>{item.title}</strong>
                                  </div>
                                  {item.id === hoveredItem ? <ArrowRight/>   : <ArrowRight color='#AAAFB4'/>}
                              </CardBody>
                          </Card>
</Col>
              ))}
    </Row>
  // </div> 
)
}

export default Index