import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Divider } from 'antd';

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
        render: (transaction_code) => {
            var status = (transaction_code !== null) ? "COMPLETED" : "NEW"
            var styles = button_style(transaction_code)
            return (
                    <Button type="default" style={styles}  >{status}</Button>
            )
        }
    },
    {
        title: 'Result',
        key: 'result',
        data: 'order',
        className: 'table-column-center',
        render: order => {
            if (order.transaction_code !== null) {
                var link = '/cobas-e-411/result/' + order.sample_id
                return (
                    <Link to={link} >
                        <Button type="default"  > Result</Button>
                    </Link>
                )
            }
        }
    }
];

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
    if (transaction_code !== null){
        styles = style.completed
    } else {
        styles = style.default
    }
    return styles
}

export default class Cobas411OrderList extends Component {
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
        fetch(Config.server_mirth + 'device-order?device-id=2')
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

    render() {
        return (
            <React.Fragment>
                <h1>Cobas E 411 | Order List</h1>
                <Divider />
                <Table bordered={true} columns={columns} dataSource={this.state.dataSource}
                    pagination={false} size="small" />
                <SocketMessage params={this.props.match} handler={this.handler} myid="2" screen="order" />
            </React.Fragment>
        )
    }
}

