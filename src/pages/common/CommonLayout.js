import React from 'react'
import Moment from 'react-moment'
import { Divider } from 'antd'

const today = new Date()

const CommonFooter = () => {
    return(
        <div style={{fontSize:12}}>
            <Moment format='YYYY'>{today}</Moment>
            <Divider type='vertical' style={{backgroundColor:'#999'}} />
            LPPKN Device Integration Panel
            <Divider type='vertical' style={{ backgroundColor: '#999' }} />
            Heitech Padu Bhd
        </div>
    )
}

export default  CommonFooter 