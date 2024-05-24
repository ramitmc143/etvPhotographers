

const onePmToFivePm = (firstPunchIn,secondPunchIn) => {
    const time1 = '09:30'
    const time2 =  '13:00'

    if (firstPunchIn <= '13:00:00' && secondPunchIn >= '17:30:00') {
        return 'pr-2'
    } else {
        return 'ab-2'
    }
}

export default onePmToFivePm