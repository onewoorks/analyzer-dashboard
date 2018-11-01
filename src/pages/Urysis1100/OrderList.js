import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Divider, Row, Col } from 'antd'
import Moment from 'react-moment'

import SocketMessage from '../../components/SocketMessage'
import Config from '../../Config'

const columns = [
    {
        title: 'Lis Lab Id',
        dataIndex: 'sample_id',
        key: 'sample_id',
    }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Lis Test Id',
        dataIndex: 'lis_lab_id',
        key: 'lis_lab_id'
    }, {
        title: 'Order Date',
        dataIndex: 'order_date',
        key: 'order_date'
    }, {
        title: 'Identification No',
        dataIndex: 'identification_no',
        key: 'identification_no',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'transaction_code',
        className: 'table-column-center',
        render: (transaction_code, order) => {
            var styles = button_style(transaction_code)
            var link = '/urisys-1100/forms/' + order.sample_id
            var status = (transaction_code!== null) ? "COMPLETED" : "NEW"
            if (transaction_code !== null){
                return (
                    <Button type="default" style={styles}  >{status}</Button>
                )
            } else {
                return (
                    <Link to={link} >
                        <Button type="default" style={styles}  >{status}</Button>
                    </Link>
                )
            }
            
        }
    },
    {
        title: 'Result',
        key: 'result',
        data: 'order',
        className: 'table-column-center',
        render: order => {
            console.log(order.transaction_code)
            if (order.transaction_code !== null) {
                var to = '/urisys-1100/result/' + order.sample_id
                return (
                    <Link to={to}><Button>View Result</Button></Link>
                )
            }
        }
    }];

const style = {
    completed: {
        backgroundColor: '#52c41a',
        color: '#fff'
    },
    newOrder: {
        backgroundColor: '#1890ff',
        color: '#fff'
    },
    default: {
        backgroundColor: '#fffff'
    }
}

const button_style = (transaction_code) => {
    var styles = ''
    if (transaction_code !== null) {
        styles = style.completed
    } else {
        styles = style.newOrder
    }
    return styles
}

export default class OrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: null
        }
        this.handler = this.handler.bind(this)
    }

    componentDidMount() {
        fetch(Config.server_mirth + 'device-order?device-id=1')
            .then(response => response.json())
            .then(data => {
                if (data.orders) {
                    var orders = data.orders.map((value, key) => {
                        return ({
                            key: key + 1,
                            sample_id: value.order_detail.lis_lab_id,
                            name: value.order_detail.client_name,
                            order_date: value.timestamp,
                            age: '',
                            identification_no: value.order_detail.client_id,
                            order_status: value.status,
                            lis_lab_id: value.order_detail.test_code.toString(),
                            order_id: '',
                            order_result: {},
                            transaction_code: value.transaction_code
                        })
                    })
                    this.setState({
                        dataSource: orders
                    })
                }
            })
    }

    handler(data) {
        var ds = this.state.dataSource
        let totalKey = Object.keys(ds).length + 1
        var newDs = data
        newDs.key = totalKey
        ds.push(newDs)
        this.setState({
            dataSource: ds
        })
    }

    render() {
        const datenow = new Date()
        return (
            <React.Fragment>
                <Row>
                    <Col span={18}><h1>Urisys 1100 | Order List</h1></Col>
                    <Col>
                        <div style={{ textAlign: 'right', lineHeight: 3 }}><Moment format="DD MMMM YYYY">{datenow}</Moment></div>
                    </Col>
                </Row>
                <Divider />
                <Table bordered={true} columns={columns} dataSource={this.state.dataSource}
                    pagination={false} size="small" />
                <SocketMessage
                    params={this.props.match}
                    handler={this.handler}
                    myid="1"
                    screen="order" />
            </React.Fragment>
        )
    }
}

