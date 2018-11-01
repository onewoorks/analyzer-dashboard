const UrisysOrder = {
    orders: [{
        key: '1',
        name: 'Sofia',
        order_date: '10 September 2018',
        age: 32,
        identification_no: 'New York No. 1 Lake Park',
        order_status: 'completed',
        lis_lab_id: 1230,
        order_result: {}
    }, {
        key: '2',
        name: 'Aryana',
        order_date: '10 September 2018',
        age: 42,
        identification_no: 'London No. 1 Lake Park',
        order_status: 'new order',
        lis_lab_id: 1231,
        order_result: {}
    }, {
        key: '3',
        name: 'Zulaika',
        order_date: '11 September 2018',
        age: 32,
        identification_no: 'Sidney No. 1 Lake Park',
        order_status: 'completed',
            lis_lab_id: 1232,
        order_result: {}
    }],
    get: function (key) {
        let orders = this.orders.find(p => p.key === key)
        return orders
    }
}

export default UrisysOrder