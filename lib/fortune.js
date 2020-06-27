var fortuneCookies = [
  "AAA",
  "MMM",
  "CCC",
  "EEE"
]

exports.getFortune = () => {
  let idx = Math.floor(Math.random() * fortuneCookies.length)
  return fortuneCookies[idx]
}
