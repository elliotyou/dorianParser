const moment = require('moment')
moment.locale('en-ca')
const fs = require('fs')
const { unixConverter } = require('./tools')

fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    const { simulatedLines, IMEI } = simulatedLineConverter(data)
    fs.writeFile(`${IMEI}_v1.csv`, outputContent(simulatedLines), err => {
        if (err) {
            console.error(err)
            return
        }
        console.log('寫入成功')
    })
})

function outputContent(writeArr) {
    let outputText = ''
    outputText += 'Prefix,CRC,Length,SeqID,UnitID,GPS-Time,RTC-Time,Send-Time,Diff,Lon,Lat,Head,ID,Odom,HDOP,Input,speed,output,analog\n'
    const content = writeArr.join('\n')
    outputText += content
    return outputText
}

function simulatedLineConverter(data) {
    const rawData = data
    const rawLines = rawData.split('\n')
    const splitLines = rawLines.map(line => ({
        A: line.split(';')[0],
        E: line.split(';')[1],
        D: line.split(';')[2],
        G: line.split(';')[3],
        M: line.split(';')[4],
        S: line.split(';')[5],
        IO: line.split(';')[6],
    }))
    const convertedLines = splitLines.map(line => ({
        prefix: line['A'].split(',')[0],
        IMEI: line['A'].split(',')[1],
        reportId: line['E'].split(',')[1],
        rtcTime: line['D'].split(',')[1],
        gpsTime: line['D'].split(',')[2],
        latitude: line['G'].split(',')[1],
        longitude: line['G'].split(',')[2],
        heading: line['G'].split(',')[3],
        hdop: line['G'].split(',')[4],
        odometer: line['M'].split(',')[1],
        speed: line['S'].split(',')[1],
        input: line['IO'].split(',')[1],
        output: line['IO'].split(',')[2],
        analog: line['IO'].split(',')[3],
    }))
    const IMEI = convertedLines[0].IMEI
    const simulatedLines = convertedLines.map(line => {
        const outputArr = []
        outputArr.push(line['prefix'])
        outputArr.push('CRC')
        outputArr.push('LEN')
        outputArr.push('SEQ')
        outputArr.push(line['IMEI'])

        const gpsUnix = unixConverter(line['gpsTime'])
        const rtcUnix = unixConverter(line['rtcTime'])
        const diff = Number(rtcUnix) - Number(gpsUnix)

        outputArr.push(gpsUnix)
        outputArr.push(rtcUnix)
        outputArr.push('sendTime')
        outputArr.push(diff)

        outputArr.push(line['longitude'])
        outputArr.push(line['latitude'])
        outputArr.push(line['heading'])
        outputArr.push(line['reportId'])
        outputArr.push(line['odometer'])
        outputArr.push(line['hdop'])
        outputArr.push(line['input'])
        outputArr.push(line['speed'])
        outputArr.push(line['output'])
        outputArr.push(line['analog'])

        return outputArr.join(',')
    })

    return { simulatedLines, IMEI }
}


