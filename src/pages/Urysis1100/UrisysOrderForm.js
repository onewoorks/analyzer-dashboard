import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Row, Col, List, Icon, Table, Button, notification, Spin, Alert  } from 'antd';

import SocketMessage from '../../components/SocketMessage'
import Config from '../../Config'

notification.config({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
});

const openNotificationWithIcon = (type, patient_name, lis_lab_id) => {
    notification[type]({
        message: 'Record Save',
        description: `This record has successfully bind to ${patient_name} with ${lis_lab_id}`,
    });
};

const sortingResult = (unsortdata) => {
    var sort_data = []
    if(Object.keys(unsortdata).length>0){
        var order = ['SG', 'pH', 'LEU', 'NIT', 'PRO', 'GLU', 'KET', 'UBG', 'BIL', 'ERY']
        order.forEach((value, key) => {
            var data = {
                key: key,
                field: value,
                value: unsortdata[value],
            }
            sort_data.push(data)
        })
    }
    return sort_data
}

export default class UrisysOrderForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            match: this.props.match,
            order: [],
            order_result: false
        }
        this.handler = this.handler.bind(this)
    }

    handler(data) {
        this.setState({
            order_result: data
        })
    }

    componentDidMount() {
        fetch(Config.server_mirth + 'order-detail?lis-lab-id=' + this.state.match.params.lis_test_id)
            .then(response => response.json())
            .then(data => {
                var info = data.order
                this.setState({
                    lis_lab_id: info.order_detail.sample_id,
                    client_name: info.order_detail.client_name,
                    order: [
                        {
                            icon: 'user',
                            title: 'Patient Name',
                            desc: info.order_detail.client_name
                        },
                        {
                            icon: 'barcode',
                            title: 'Lis Test Id',
                            desc: info.order_detail.lis_lab_id
                        },
                        {
                            icon: 'idcard',
                            title: 'Identification No',
                            desc: info.order_detail.client_id
                        },
                        {
                            icon: 'book',
                            title: 'Ordered By',
                            desc: info.order_detail.order_by
                        }]
                }
                )
            })
    }

    websocket = () => {
        console.log('load ws')
        return(
            <SocketMessage params={this.props.match} handler={this.handler} myid="1" screen="result" />
        )
    }

    button_confirm = () => {
        if (this.state.order_result)
            return (
                <React.Fragment>
                    <Button type='primary' style={{ float: 'right' }}
                        onClick={() => this.confirm_result()}><Icon type='check' /> Confirm Result</Button>
                    <Button type='default' style={{ float: 'right', marginRight: 5 }} ><Icon type='sync' /> Re Run</Button>
                </React.Fragment>
            )
    }

    checking_data = () => {
        var obj = (this.state.order_result) ? this.state.order_result.result.result : {}
        var r = sortingResult(obj)

        if (this.state.order_result){
            const columns = [
                {
                    title: 'Field',
                    key: 'field',
                    dataIndex: 'field'
                },
                {
                    title: 'Value',
                    key: 'value',
                    dataIndex: 'value'
                }
            ]
            return (
                <React.Fragment>
                    <Table columns={columns} dataSource={r} pagination={false}
                        size="small" />
                    <br />    
                    <Link to='/urisys-1100'>
                        <Button type='default' style={{ float: 'left' }}><Icon type='left' /> Back To Order List</Button>
                    </Link>
                </React.Fragment>
            )
        } else {
            return (
                <Spin tip="Measuring..." size='large'>
                    <Alert
                        message="Fetching data from machine"
                        description="Result will be appeared here."
                        type="info"
                    />
                </Spin>
            )
        }
        
    }

    confirm_result = () => {
        var order_result = this.state.order_result
        var put_body = {
            id: order_result.row_id,
            timestamp: order_result.timestamp,
            lis_lab_id: this.state.match.params.lis_test_id,
            transaction_code: order_result.transaction_code,
        }
        console.log(put_body)
        openNotificationWithIcon('success', this.state.client_name, this.state.lis_lab_id)
        fetch(Config.server_mirth + 'update-result', {
            method: 'POST',
            body: JSON.stringify(put_body)
        })
    }

    socket_2 = () => {
        

    }

    render() {
        
        return (
            <React.Fragment>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="Patient Information" bordered={true} headStyle={{ backgroundColor: '#f2f4f5' }}>
                            <List
                                itemLayout="horizontal"
                                size='small'
                                dataSource={this.state.order}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={item.title}
                                            description={item.desc}
                                        />

                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card title="Urisys Result" bordered={true} headStyle={{ backgroundColor: '#f2f4f5' }}>
                            { this.checking_data() }
                            {this.button_confirm()}
                        </Card>
                    </Col>
                </Row>
                <SocketMessage 
                    params={this.props.match} 
                    handler={this.handler} 
                    myid="1" 
                    screen="order" />
            </React.Fragment>
        )
    }
}