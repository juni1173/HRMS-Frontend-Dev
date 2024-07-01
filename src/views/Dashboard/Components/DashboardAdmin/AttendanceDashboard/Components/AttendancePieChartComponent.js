// ** Third Party Components
import { Doughnut } from 'react-chartjs-2'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Table } from 'reactstrap'
import { FcLeave } from "react-icons/fc"
import { MdCoPresent, MdHomeWork } from "react-icons/md"
const AttendancePieChartComponent = ({ tooltipShadow, successColorShade, warningLightColor, primary, countData }) => {
  // ** Chart Options
  const options = {
    maintainAspectRatio: false,
    cutout: 60,
    animation: {
      resize: {
        duration: 500
      }
    },
    plugins: {
      legend: { display: false },
      tooltips: {
        callbacks: {
          label(context) {
            const label = context.label || ''
            if (label) {
              label += 'Ronak: '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y)
            }
            return label
          }
        },
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: tooltipShadow,
        backgroundColor: '#fff',
        titleFontColor: '#000',
        bodyFontColor: '#000'
      }
    }
  }

  // ** Chart data
  const data = {
    datasets: [
      {
        labels: ['Presents', 'WFH', 'On Leaves'],
        data: [countData.Presents, countData.WFH, countData.Leaves],
        backgroundColor: [successColorShade, warningLightColor, primary],
        borderWidth: 0,
        pointStyle: 'rectRounded'
      }
    ]
  }

  return (
    <Card style={{height: '210px'}}>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column pb-0 p-1'>
        <CardTitle tag='h4'>Attendance Today</CardTitle>
      </CardHeader>
      <CardBody className='p-0'>
        <Row>
          <Col md='5' className='mb-1'>
            {/* <div className='d-flex justify-content-center'><MdCoPresent size={17} className='text-primary' /> {countData.Presents && countData.Presents} Presents</div>
            <div className='d-flex justify-content-center'><MdHomeWork size={17} className='text-warning' /> {countData.WFH && countData.WFH} WFH</div>
            <div className='d-flex justify-content-center'><FcLeave size={17} className='text-success' /> {countData.Leaves && countData.Leaves} Leaves</div> */}
            <Table striped responsive>
                <thead>
                    <tr>
                        <th><MdCoPresent size={17} className='text-primary' /> <span style={{fontSize:'xxx-large'}}>{countData.Presents && countData.Presents}</span> Presents</th>
                    </tr>
                    <tr>
                        <th><MdHomeWork size={17} className='text-warning' /> {countData.WFH && countData.WFH} WFH</th>
                    </tr>
                    <tr>
                        <th><FcLeave size={17} className='text-success' /> {countData.Leaves && countData.Leaves} Leaves</th>
                    </tr>
                </thead>
            </Table>
          </Col>
          <Col md='7'>
            <div style={{ height: '185px' }}>
              <Doughnut data={data} options={options} height={275} />
            </div>
          </Col>
          
        </Row>
      </CardBody>
    </Card>
  )
}

export default AttendancePieChartComponent
