const parser = require('./parser')
const fs = require('fs')

const inputSample = '4050B0790033E9E20003130D98181F2561113C4C61120952611209540053F9650303EFFD0167650007D0E603DE0100000000000007D007D000\nabcd'


fs.readFile('example.log', 'utf8', (err, data) => {
  console.log('into fs.readfile...')
  if (err) {
    console.error(err)
    return
  }
  parser.originalText = data
  const output = []
  while (parser.originalText.indexOf('\n') !== -1) {
    // console.log('into while loop, parser.originalText =', parser.originalText)
    parser.takeOneLine()
    parser.takeHeader()
    parser.takeTimeStamps()
    parser.takeLocation()
    parser.takeBodyValues()
    // console.log('parser.bufferReport =', parser.bufferReport)
    output.push(Object.values(parser.bufferReport).join(','))
  }

  fs.writeFile(`output_v1.csv`, output.join('\n'), err => {
    if (err) {
      console.error(err)
      return
    }
    console.log('寫入成功')
  })
})


