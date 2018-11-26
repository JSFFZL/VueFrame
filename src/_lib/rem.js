const Rem = function () {
  let isMobile = process.__MOBILE__
  if (isMobile === 'true') { // mobile or pc
    FragmentStructure()
  } else {
    document.querySelector(`[name="viewport"]`).setAttribute('content', `width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0`)
  }
}

// rem适配方案 (vux)
function FragmentStructure () {
  let iScale = 1 / window.devicePixelRatio
  let Fragment = document.createDocumentFragment()
  Fragment.appendChild(document.querySelector(`[name="viewport"]`))
  Fragment.querySelector('meta').setAttribute('content', `width=device-width, user-scalable=no, initial-scale=${iScale}, minimum-scale=${iScale}, maximum-scale=${iScale}`)
  document.querySelector('head').appendChild(Fragment)

  let iWidth = document.documentElement.clientWidth
  let rootStyle = `font-size: ${iWidth / 10}px; width=100%; height: 100%; overflow: hidden;`
  document.querySelector('html').setAttribute('style', rootStyle)
}

export default Rem
