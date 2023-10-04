import { parse } from 'csv-parse'
import path from 'path'
import { PassThrough, pipeline } from 'stream'
import { createReadStream } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvParser = parse({ columns: true })

function resetLine() {
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
}

function printProgress(progress) {
  resetLine()
  process.stdout.write(`read: ${progress}`) // has to be of type string
}



function crimeTrend() {
  const stream = new PassThrough({ objectMode: true })
  const crimesPerYear = {}
  let entryCount = 0

  stream.on('data', (chunk) => {
    // console.log(chunk)
    entryCount++
    if (entryCount % 100000 === 0) {
      printProgress(entryCount)
    }
    const { year, value } = chunk
    if (year in crimesPerYear) {
      crimesPerYear[year] += Number(value)
    } else {
      crimesPerYear[year] = Number(value)
    }
  })

  stream.on('end', () => {
    resetLine()
    const crimesPerYearSorted = Object.entries(crimesPerYear).sort(
      (a, b) => a[0] - b[0]
    )

    console.log('==============')
    for (let i = 1; i < crimesPerYearSorted.length; i++) {
      const increased =
        crimesPerYearSorted[i][1] - crimesPerYearSorted[i - 1][1] > 0
      console.log(
        `year ${crimesPerYearSorted[i][0]}: ${
          increased ? 'increased' : 'decreased'
        }`
      )
    }
  })

  return stream
}

function mostDangerousArea() {
  const stream = new PassThrough({ objectMode: true })
  const crimesPerArea = {}

  stream.on('data', (chunk) => {
    const { borough, value } = chunk

    if (borough in crimesPerArea) {
      crimesPerArea[borough] += Number(value)
    } else {
      crimesPerArea[borough] = Number(value)
    }
  })

  stream.on('end', () => {
    const crimesPerAreaSorted = Object.entries(crimesPerArea).sort(
      (a, b) => b[0] - a[0]
    )
    
    console.log('==============')
    console.log(
      `${crimesPerAreaSorted[0][0]} are the most dangerous area with crime number: ${crimesPerAreaSorted[0][1]}`
    )
  })

  return stream
}

const filename = 'london_crime_by_lsoa.csv'
const inputStream = createReadStream(path.resolve(__dirname, filename))

const afterParseStream = inputStream.pipe(csvParser)


pipeline(afterParseStream, crimeTrend(), (err) => {
  if (err) {
    console.error(err)
  }
})

pipeline(afterParseStream, mostDangerousArea(), (err) => {
  if (err) {
    console.error(err)
  }
})
