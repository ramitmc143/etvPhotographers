import { View, Text } from 'react-native'
import React from 'react'

const nineToOnePm = (firstPunchIn,secondPunchIn) => {
    const time1 = '09:30'
    const time2 =  '13:00'
    if (firstPunchIn <= '09:30:00' && secondPunchIn >= '13:00:00') {
       return 'pr-1'
    } else {
       return 'ab-1'
    }
}

export default nineToOnePm