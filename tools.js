module.exports = {
  unixConverter(rawTime) {    //28022021183029 --> 1628632145
    const originalTimeStamp = rawTime
    const date = originalTimeStamp.slice(0, 2)
    const month = originalTimeStamp.slice(2, 4)
    const year = originalTimeStamp.slice(4, 8)
    const hour = originalTimeStamp.slice(8, 10)
    const minute = originalTimeStamp.slice(10, 12)
    const second = originalTimeStamp.slice(12, 14)
    const outputTime = new Date(year, month, date, hour, minute, second)
    const outputTimestamp = Math.floor(outputTime / 1000);
    return outputTimestamp
  }
}