const getUsage = require('command-line-usage')

const sections = [
  {
    header: 'Allafredagar',
    content: 'Generates all weekdays that there are from a date to now.'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'day',
        description: 'Weekday to process.'
      },
      {
        name: 'years',
        description: 'Generate from this many years back.'
      }
    ]
  }
]
const usage = getUsage(sections)
console.log(usage)