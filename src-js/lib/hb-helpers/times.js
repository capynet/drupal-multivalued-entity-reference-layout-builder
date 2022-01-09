module.exports = function (n, block) {
  let output = ''

  for (let i = 0; i < n; ++i) {
    output += block.fn(i)
  }

  return output
}
