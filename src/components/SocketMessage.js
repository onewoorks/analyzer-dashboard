import React, { Component } from 'react'
import Websocket from 'react-websocket';
import { notification } from 'antd'
import Config from '../Config'

const openNotification = (notify_data) => {

  notification.open({
    message: notify_data.message,
    description: notify_data.description,
  });
};

export default class SocketMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      params: this.props.params,
      myId: this.props.myid,
      screen: this.props.screen
    };
  }

  screen_result = (dataObj) => {
    this.props.handler(dataObj)
    return dataObj
  }

  screen_order = (dataObj) => {
    var newData = {
      name: dataObj.client_name,
      order_date: dataObj.planned_date,
      age: 32,
      identification_no: dataObj.client_id,
      order_status: dataObj.status,
      lis_lab_id: dataObj.lis_lab_id,
      order_result: {}
    }
    var notify_data = {
      message: 'New Order Received',
      description: `LIS Test ID #${newData.lis_lab_id} for ${newData.name} has been created!`
    }

    this.props.handler(newData)
    openNotification(notify_data)
    return newData
  }

  handleData(data) {
    var dataObj = JSON.parse(data)
    var response
    switch (dataObj.screen) {
      case "result":
        response = this.screen_result(dataObj)
        break;
      case 'order':
        response = this.screen_order(dataObj)
        break;
      default:
        break;
    }
    return response
  }

  componentDidUpdate(){
    this.socket_component()
  }

  socket_component = () => {
    return (
      <Websocket url={`${Config.server_websocket}/${this.state.myId}/${this.state.screen}`}
        onMessage={this.handleData.bind(this)} />
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.socket_component()}
      </React.Fragment>
    );
  }
}
