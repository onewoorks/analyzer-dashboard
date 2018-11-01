import React, { Component } from 'react';
// import { BrowserRouter as Router, HashRouter, Route, Link } from 'react-router-dom'
import { HashRouter, Route, Link } from 'react-router-dom'
import { Layout, Menu} from 'antd';

import Home from './pages/Home'
import { UrisysOrderList, UrisysOrderForm, UrisysOrderResult } from './pages/Urysis1100'
import { CobasC311_Order, Cobas311Result} from './pages/CobasC311'
import { Cobas411OrderList, Cobas411Result} from './pages/CobasE411'
import {SysmexOrder, SysmexResult} from './pages/SysmexXN'
import CommonFooter from './pages/common/CommonLayout'

const { Header, Content, Footer } = Layout;

const Paging = () => {
  return (
    <HashRouter>
      <Layout className="layout" style={{minHeight:"100vh"}}>
        <Header>
          <div className="logo" >LPPKN Device Integration</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            style={{ lineHeight: '64px', float: 'right' }}
          >
            <Menu.Item key="home"><Link to='/'>Home</Link></Menu.Item>
            <Menu.Item key="urisys-1100"><Link to='/urisys-1100'>Urysis 1100</Link></Menu.Item>
            <Menu.Item key="cobas-c-311"><Link to='/cobas-c-311'>Cobas C 311</Link></Menu.Item>
            <Menu.Item key="cobas-e-411"><Link to='/cobas-e-411'>Cobas E 411</Link></Menu.Item>
            <Menu.Item key="sysmex-xn-350-kx-21"><Link to='/sysmex-xn-350-kx-21'>Sysmex XN 350 & KX 21</Link></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>

          <div style={{ background: '#fff', padding: 24, minHeight: 580, marginTop:23 }}>
            <React.Fragment>
              <Route exact path="/" component={Home} />
              <Route exact path='/urisys-1100' component={UrisysOrderList} />
              <Route exact path='/urisys-1100/forms/:lis_test_id' component={UrisysOrderForm} />
              <Route exact path='/urisys-1100/result/:lis_test_id' component={UrisysOrderResult} />
              <Route exact path='/cobas-c-311' component={CobasC311_Order} />
              <Route exact path='/cobas-c-311/result/:lis_test_id' component={Cobas311Result} />
              <Route exact path='/cobas-e-411' component={Cobas411OrderList} />
              <Route exact path='/cobas-e-411/result/:lis_test_id' component={Cobas411Result} />
              <Route exact path='/sysmex-xn-350-kx-21' component={SysmexOrder} />
              <Route exact path='/sysmex-xn-350-kx-21/result/:lis_test_id' component={SysmexResult} />
            </React.Fragment>
          </div>

        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <CommonFooter />
        </Footer>
      </Layout>
    </HashRouter>
  )
}

class App extends Component {
  
  render() {
    return (
      <Paging />
    );
  }
}

export default App;