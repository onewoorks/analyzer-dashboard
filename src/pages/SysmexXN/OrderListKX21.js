import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Divider } from 'antd';

import SocketMessage from '../../components/SocketMessage'
import Config from '../../Config'

const columns = [{
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
    dataIndex: 'order_status',
    className: 'table-column-center',
    render: (order_status, order) => {
        var styles = button_style(order_status)
        var link = '/urisys-1100/forms/' + order.lis_test_id
        return (
            <Link to={link} >
                <Button type="default" style={styles}  >{order_status}</Button>
            </Link>
        )
    }
},
{
    title: 'Result',
    key: 'result',
    data: 'order',
    className: 'table-column-center',
    render: order => {
        if (order.order_status === 'completed') {
            return (
                <Button>View Result</Button>
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

const button_style = (status) => {
    var styles = ''
    switch (status) {
        case 'COMPLETED':
            styles = style.completed
            break;
        case 'NEW':
            styles = style.newOrder
            break;
        default:
            styles = style.default
            break;
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

    handler(data) {
        var ds = this.state.dataSource
        var newDs = data
        ds.push(newDs)
        this.setState({
            dataSource: ds
        })
    }

    componentDidMount() {
        fetch(Config.server_mirth + 'device-order?device-id=5')
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
                            order_result: {}
                        })
                    })
                    this.setState({
                        dataSource: orders
                    })
                }
            })
    }

    render() {
        return (
            <React.Fragment>
                <h1>SYSMEX 350 XN | Order List</h1>
                <Divider />
                <Table bordered={true} columns={columns} dataSource={this.state.dataSource}
                    pagination={false} size="small" />
                <SocketMessage params={this.props.match} handler={this.handler} myid="2" screen="order" />
            </React.Fragment>
        )
    }
}

