module.exports = {
  originalText: '',
  currentLine: '',
  sizeMappingTalbe: {},
  bufferReport: {},
  takeOneLine() {
    console.log('into takeOneLine, this.originalText =', this.originalText)
    const position = this.originalText.indexOf('\n')
    if (position !== -1) {
      this.currentLine = this.originalText.substring(0, position)
      this.originalText = this.originalText.substring(position + 1)
    }
    console.log('leaving takeOneLine, this.originalText =', this.originalText)
  },
  takeHeader() {
    console.log('--into takeHeader...currentLine =', this.currentLine)
    this.takePrefix()
    this.takeCRC()
    this.takeLen()
    this.takeSeqId()
    this.takeIMEI()
  },
  takePrefix() {
    const rawValue = this.currentLine.substring(0, 4)
    this.bufferReport['prefix'] = this.hex_to_ascii(rawValue)
    this.currentLine = this.currentLine.substring(4)
  },
  takeCRC() {
    this.bufferReport['CRC'] = this.currentLine.substring(0, 4)
    this.currentLine = this.currentLine.substring(4)
  },
  takeLen() {
    const rawValue = this.currentLine.substring(0, 4)
    this.bufferReport['Len'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(4)
  },
  takeSeqId() {
    const rawValue = this.currentLine.substring(0, 4)
    this.bufferReport['SeqId'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(4)
  },
  takeIMEI() {
    const rawValue = this.currentLine.substring(0, 16)
    this.bufferReport['IMEI'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(16)
  },
  takeTimeStamps() {
    console.log('--into takeTimeStamps...currentLine =', this.currentLine)
    this.takeGpsTime()
    this.takeRTCTime()
    this.takeSendTime()
  },
  takeGpsTime() {
    const rawValue = this.currentLine.substring(0, 8)
    this.bufferReport['GpsTime'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(8)
  },
  takeRTCTime() {
    const rawValue = this.currentLine.substring(0, 8)
    this.bufferReport['RTCTime'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(8)
  },
  takeSendTime() {
    const rawValue = this.currentLine.substring(0, 8)
    this.bufferReport['SendTime'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(8)
  },
  takeLocation() {
    console.log('--into takeLocation...currentLine =', this.currentLine)
    this.takeLongitude()
    this.takeLatitude()
  },
  takeLongitude() {
    const rawValue = this.currentLine.substring(0, 8)
    this.bufferReport['Lon'] = this.hex_to_signed_decimal(rawValue)
    this.currentLine = this.currentLine.substring(8)
  },
  takeLatitude() {
    const rawValue = this.currentLine.substring(0, 8)
    this.bufferReport['Lat'] = this.hex_to_signed_decimal(rawValue)
    this.currentLine = this.currentLine.substring(8)
  },
  takeBodyValues() {
    console.log('--into takeBodyValues...currentLine =', this.currentLine)
    this.takeHeading()
    this.takeReportId()
    this.takeOdom()
    this.takeHDOP()
    this.takeInput()
    this.takeSpeed()
    this.takeOutput()
    this.takeAnalog()
    this.takeDriverID()
    this.takeTemp1()
    this.takeTemp2()
    this.takeText()
  },
  takeHeading() {
    const rawValue = this.currentLine.substring(0, 4)
    this.bufferReport['Heading'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(4)
  },
  takeReportId() {
    const rawValue = this.currentLine.substring(0, 2)
    this.bufferReport['ReportId'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(2)
  },
  takeOdom() {
    const rawValue = this.currentLine.substring(0, 8)
    this.bufferReport['Odom'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(8)
  },
  takeHDOP() {
    const rawValue = this.currentLine.substring(0, 4)
    this.bufferReport['HDOP'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(4)
  },
  takeInput() {
    const rawValue = this.currentLine.substring(0, 2)
    this.bufferReport['Input'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(2)
  },
  takeSpeed() {
    const rawValue = this.currentLine.substring(0, 4)
    this.bufferReport['Speed'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(4)
  },
  takeOutput() {
    const rawValue = this.currentLine.substring(0, 2)
    this.bufferReport['Output'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(2)
  },
  takeAnalog() {
    const rawValue = this.currentLine.substring(0, 4)
    this.bufferReport['Analog'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(4)
  },
  takeDriverID() {
    const position00 = this.currentLine.indexOf('00')
    if (position00 === -1) {
      throw 'no 00 can be found'
    }
    const rawValue = this.currentLine.substring(0, position00)
    this.bufferReport['DriverId'] = this.hex_to_ascii(rawValue)
    this.currentLine = this.currentLine.substring(position00 + 2)
  },
  takeTemp1() {
    const rawValue = this.currentLine.substring(0, 4)
    this.bufferReport['Temp1'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(4)
  },
  takeTemp2() {
    const rawValue = this.currentLine.substring(0, 4)
    this.bufferReport['Temp2'] = parseInt(rawValue, 16)
    this.currentLine = this.currentLine.substring(4)
  },
  takeText() {
    const position00 = this.currentLine.indexOf('00')
    if (position00 === -1) {
      throw 'no 00 can be found'
    }
    const rawValue = this.currentLine.substring(0, position00)
    this.bufferReport['Text'] = this.hex_to_ascii(rawValue)
    this.currentLine = this.currentLine.substring(position00 + 2)
  },
  hex_to_ascii(inputString) {
    var hex = inputString.toString();
    var outputString = '';
    for (var n = 0; n < hex.length; n += 2) {
      outputString += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return outputString;
  },
  hex_to_signed_decimal(hex) {
    var num = parseInt(hex, 16);
    var maxVal = Math.pow(2, hex.length / 2 * 8);
    if (num > maxVal / 2 - 1) {
      num = num - maxVal
    }
    return num;
  },

}