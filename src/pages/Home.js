import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Progress, Divider, Button, Avatar } from 'antd'
import Config from '../Config'
import Moment from 'react-moment'

import SocketMessage from '../components/SocketMessage'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dashboard_data: null
        }
    }

    _pagelinker = (no) => {
        let number = 'A' + no
        var page = ''
        switch (number) {
            case 'A1':
                page = 'urisys-1100'
                break;
            case 'A2':
                page = 'cobas-e-411'
                break;
            case 'A3':
                page = 'cobas-c-311'
                break;
            case 'A4':
                page = 'sysmex-xn-350-kx-21'
                break;
            default:
                break;
        }
        return page;
    }

    componentDidMount() {
        fetch(Config.server_mirth + 'dashboard')
            .then(response => response.json())
            .then(data => {

                if (data) {
                    var devices = Object.keys(data).map((value, key) => {
                        return ({
                            device_name: data[value].device_name,
                            new_request: data[value].new_request,
                            completed: data[value].completed,
                            total: data[value].total,
                            link: value
                        })
                    })
                    this.setState({
                        dashboard_data: devices
                    })
                }
            })
    }

    _dashcard = () => {

        var dd = this.state.dashboard_data
        if (dd !== null) {

            return (
                dd.map((value, key) => (
                    <Col key={key} span={12} style={{ marginBottom: 12 }}>
                        <Card title={value.device_name} style={{ textTransform: 'uppercase' }}>
                            <Row gutter={12}>
                                <Col span={8}>
                                    <Avatar shape="square" size={140} src={require(`../images/${value.link}.jpg`)} />
                                </Col>
                                <Col span={7}>
                                    <Progress type="circle" percent={parseInt((value.completed / value.total * 100), 10)} />
                                </Col>

                                <Col span={9}>
                                    <div>
                                        <b>Completed :</b> {value.completed}
                                    </div>

                                    <div>
                                        <b>Total Order :</b> {value.total}
                                    </div>
                                    <Divider />
                                    <Link to={`/${this._pagelinker(value.link)}`}><Button type='default'>View</Button></Link>
                                </Col>


                            </Row>

                        </Card>
                    </Col>
                ))
            )


        }
    }

    render() {
        const datenow = new Date()
        return (
            <React.Fragment>
                <Row>
                    <Col span={18}><h1>Dashboard | <Moment format="DD MMMM YYYY">{datenow}</Moment></h1></Col>
                </Row>

                <Divider />
                <Row gutter={12}>
                    {this._dashcard()}
                </Row>

                <SocketMessage params={this.props.match} handler={this.handler} myid="0" screen="dashboard" />
            </React.Fragment>
        )
    }
}