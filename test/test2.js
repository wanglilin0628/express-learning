// const loadtest = require('loadtest')
// const expect = require('chai').expect

// suite('Stress tests', () => {
//     test('Homepage should handle 100 requests in a second', function(done){
//         let options = {
//             url: 'http://localhost:8080',
//             concurrency: 4,
//             maxRequests: 100
//         }
//         loadtest.loadTest(options, (err, result) => {
//             expect(!err)
//             expect(result.totalTimeSeconds < 1)
//             done()
//         })
//     })
// })