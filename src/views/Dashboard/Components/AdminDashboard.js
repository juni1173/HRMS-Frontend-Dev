import React, { Fragment, useEffect } from 'react'
import PermissionsHelper from '../../Helpers/PermissionsHelper'
import { useHistory } from 'react-router-dom'
import { Card, Row, Col, CardBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
// import Charts from './Charts/index'
// import EventsCalender from './Calender/index'
import DashboardAdmin from './DashboardAdmin/index'
const AdminDashboard = () => {
    const Permissions = PermissionsHelper()
    const history = useHistory()
    const checkPermission = () => {
      if (Permissions === 'employee') history.push('/employee/dashboard')
      if (Permissions === 'admin') history.push('/admin/dashboard')
    }
    
    // const [active, setActive] = useState('1')
    // const toggle = tab => {
    //   if (active !== tab) {
    //     setActive(tab)
    //   }
    // }
     useEffect(() => {
      checkPermission()
    }, [Permissions])
  return (
    (Permissions === 'admin') ? (
        <Fragment>
          <DashboardAdmin />
            {/* <Card>
              <CardBody style={{padding:'0.5rem 1.5rem'}}>
                <Row>
                  <Col md='3'>
                    {active === '1' && <h3 style={{paddingTop:'0.5rem'}}>Dashboard</h3>}
                    {active === '2' &&  <h3 style={{paddingTop:'0.5rem'}}>Charts</h3>}
                    {active === '3' &&  <h3 style={{paddingTop:'0.5rem'}}>Calender</h3>}
                  </Col>
                  <Col md='6'>
                  <Nav className='justify-content-center' tabs>
                    <NavItem>
                      <NavLink
                        active={active === '1'}
                        onClick={() => {
                          toggle('1')
                        }}
                      >
                        Dashboard
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === '2'}
                        onClick={() => {
                          toggle('2')
                        }}
                      >
                        Charts
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        active={active === '3'}
                        onClick={() => {
                          toggle('3')
                        }}
                      >
                        Calender
                      </NavLink>
                    </NavItem>
                  </Nav>
      
                  </Col>
                  <Col md='3'>
                    {/* <Button color='gradient-secondary'>Secondary</Button> */}
                  {/* </Col>
                </Row>
              </CardBody>
            </Card> */}
            
              {/* <TabContent className='py-50' activeTab={active}>
                <TabPane tabId='1'>
                
                {active === '1' ? (
                    <>
                      <DashboardAdmin />
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Dashboard Found!</p>
                      </CardBody>
                    </Card>
                  )}
                 
                </TabPane>
                <TabPane tabId='2'>
                  {active === '2' ? (
                    <>
                      <Charts />
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Charts Found!</p>
                      </CardBody>
                    </Card>
                  )}
                </TabPane>
                <TabPane tabId='3'>
                {active === '3' ? (
                    <>
                     <Card>
                      <CardBody>
                        <EventsCalender />
                      </CardBody>
                      </Card>
                    </>
                  ) : (
                    <Card>
                      <CardBody>
                        <p>No Calender Found!</p>
                      </CardBody>
                    </Card>
                  )}
                  
                 
                </TabPane>
              </TabContent> */} 
            
        </Fragment>
    ) : (
        <div>You do not have access...</div>
    )
    
  )
}

export default AdminDashboard