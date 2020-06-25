var fortuneCookies = [
  "AAA",
  "bbb",
  "CCC",
  "DDD"
]

exports.getFortune = () => {
  let idx = Math.floor(Math.random() * fortuneCookies.length)
  return fortuneCookies[idx]
}
