// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// ** Icons Imports
import { User, Lock, Bookmark, Bell, Link } from 'react-feather'

// ** User Components
import PersonalDetail from './PersonalDetail'
import OfficeDetail from './OfficeDetail'
import ProjectDetail from './ProjectDetail'
import ContactDetail from './ContactDetail'
import BankDetail from './BankDetails'
import ExperienceDetail from './ExperienceDetail'
import EducationDetail from './EducationDetail'
import SkillDetail from './SkillDetail'
import DependentDetail from './DependentDetail'
const UserTabs = ({ active, toggleTab, empData, CallBack, url_params }) => {
  return (
    <Fragment>
      <Nav pills className='mb-2'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            {/* <User className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Office</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            {/* <Lock className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Project</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            {/* <Bookmark className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Contact</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            {/* <Bell className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Bank</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
            {/* <Link className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Experience</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '6'} onClick={() => toggleTab('6')}>
            {/* <Link className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Education</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '7'} onClick={() => toggleTab('7')}>
            {/* <Link className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Skills</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '8'} onClick={() => toggleTab('8')}>
            {/* <Link className='font-medium-3 me-50' /> */}
            <span className='fw-bold'>Dependents</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          {/* <UserProjectsList />
          <UserTimeline />
          <InvoiceList /> */}
          <OfficeDetail empData={empData} CallBack={CallBack}/>
        </TabPane>
        <TabPane tabId='2'>
          {/* <SecurityTab /> */}
          <ProjectDetail empData={empData} CallBack={CallBack}/>
        </TabPane>
        <TabPane tabId='3'>
          {/* <BillingPlanTab /> */}
          < ContactDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='4'>
          {/* <Notifications /> */}
          < BankDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='5'>
          {/* <Connections /> */}
          <ExperienceDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='6'>
          {/* <Connections /> */}
          <EducationDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='7'>
          {/* <Connections /> */}
          <SkillDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
        <TabPane tabId='8'>
          {/* <Connections /> */}
          <DependentDetail empData={empData} CallBack={CallBack} url_params={url_params}/>
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
