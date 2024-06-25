import React, { Fragment, useState, lazy, Suspense } from 'react'
import { Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap'
// Lazy-loaded components
const Work = lazy(() => import('./work'))
const Approval = lazy(() => import('./workapproval'))

const WorkTabs = ({workdata, yearoptions}) => {
    const [active, setActive] = useState('1')
    const toggle = (tab) => {
        if (active !== tab) {
            setActive(tab)
        }
    }
    const renderComponent = () => {
        switch (active) {
            case '1':
                return <Work workdata={workdata} yearoptions={yearoptions} />
            case '2':
                return <Approval />
            default:
                return null
        }
    }

    return (
                    <div className='nav-vertical configuration_panel bg-white'>
                        <Nav tabs className='nav-left mt-2'>
                            {[1, 2].map((tabId) => (
                                <NavItem key={tabId}>
                                    <NavLink active={active === tabId.toString()} onClick={() => toggle(tabId.toString())}>
                                        {tabId === 1 ? 'Requests' : 'Approvals'}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                    
                    <TabContent activeTab={active} className="mt-2">
                        <TabPane tabId={active}>
                            <Suspense fallback={<div>Loading...</div>}>{renderComponent()}</Suspense>
                        </TabPane>
                    </TabContent>
                    </div>
        //         </CardBody>
        //     </Card>
        //     </Row>
        // </Fragment>
    )
}

export default WorkTabs
