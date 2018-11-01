import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Row, Col, List, Icon, Table, Button, notification } from 'antd';

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
    var order = ['SG', 'pH', 'LEU', 'NIT', 'PRO', 'GLU', 'KET', 'UBG', 'BIL', 'ERY']
    var sort_data = []
    order.forEach((value, key) => {
        var data = {
            key: key,
            field: value,
            value: unsortdata[value],
        }
        sort_data.push(data)
    })
    return sort_data
}

export default class UrisysOrderResult extends Component {
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
        console.log(data)
        this.setState({
            order_result: data
        })
    }

    fetch_result() {
        fetch(Config.server_mirth + 'result-2?lis_lab_id=' + this.state.match.params.lis_test_id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    order_result: {
                        result: data.result[0],
                        result_sorted: sortingResult(data.result[0].result)
                    }
                })
            })
    }

    componentDidMount() {
        fetch(Config.server_mirth + 'order-detail?lis-lab-id=' + this.state.match.params.lis_test_id)
            .then(response => response.json())
            .then(data => {
                var info = data.order
                this.setState({
                    lis_lab_id: info.order_detail.lis_lab_id,
                    client_name: info.order_detail.client_name,
                    order: [
                        {
                            icon: 'user',
                            title: 'Patient Name S',
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
                })
                this.fetch_result()
            })
    }


    confirm_result = () => {
        var order_result = this.state.order_result
        var put_body = {
            id: order_result.row_id,
            timestamp: order_result.timestamp,
            lis_lab_id: this.state.lis_lab_id,
            transaction_code: order_result.transaction_code,
        }
        openNotificationWithIcon('success', this.state.client_name, this.state.lis_lab_id)
        fetch('http://localhost:8022/analyzer/update-result', {
            method: 'PUT',
            body: JSON.stringify(put_body)
        })
    }

    result_slip = () => {
        return (
            <React.Fragment>
                <table>
                    <thead>
                        <tr>
                            <td>Result</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>

                </table>
            </React.Fragment>
        )
    }

    render() {
        var obj = (this.state.order_result) ? this.state.order_result.result.result : {}
        var table_data  = sortingResult(obj)

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
                            {this.result_slip()}
                            <Table columns={columns} dataSource={table_data} pagination={false}
                                size="small" />
                            <br />

                            <Link to='/urisys-1100'>
                                <Button type='default' style={{ float: 'right' }}><Icon type='left' /> Back To Order List</Button>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}