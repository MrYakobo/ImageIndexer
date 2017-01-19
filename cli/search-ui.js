const getUsage = require('command-line-usage')

const sections = [{
  header: 'search.js',
  content: 'Search your indexed database for files.'
}, {
  header: 'Options',
  optionList: [{
    name: 'sql <query>',
    description: 'Run query against the database.'
  }]
}, {
  "header": "Presets",
  "optionList": [{
    name: 'weekday <weekday1> <weekday2> ...',
    description: 'Search for photos taken on the specified weekday(s). Case-insensitive.'
  }]
}]
const usage = getUsage(sections)
console.log(usage)