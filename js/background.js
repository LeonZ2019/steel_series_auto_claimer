/* eslint-disable no-undef */
const _chrome = chrome
const extension = {}
extension.grabIds = []

chrome.browserAction.onClicked.addListener(async function () {
  const api = 'https://api.igsp.io/promotions'
  const res = await fetch(api)
  if (res.ok) {
    const json = await res.json()
    extension.active = json.filter(giveaway => giveaway.active && giveaway.numberTotal > giveaway.numberClaimed)
    _chrome.tabs.query({ windowType: 'normal' }, checkUrl)
  } else {
    chrome.browserAction.setTitle({ title: 'something wrong???' })
  }
})

function checkUrl (tabs) {
  const filteredTabs = tabs.filter(t => {
    const url = new URL(t.url)
    const arrayId = url.pathname.match(/[0-9]{1,10}/g)
    if (arrayId !== null) {
      const id = Number(arrayId.toString())
      const filteredIds = extension.active.map(giveaway => giveaway.id).filter(id => !extension.grabIds.includes(id))
      return url.hostname === 'games.steelseries.com' && RegExp('/giveaway/[0-9]{1,10}/overview', 'g').test(url.pathname) && filteredIds.includes(id)
    }
  })
  filteredTabs.forEach(tab => {
    const id = Number(new URL(tab.url).pathname.match(/[0-9]{1,10}/g).toString())
    extension.grabIds.push(id)
    chrome.tabs.sendMessage(tab.id, { action: 'grabkey' }, function (response) {
      console.log(response)
      if (response.action !== 'claimed') {
        extension.grabIds.splice(extension.grabIds.indexOf(id), 0)
        chrome.browserAction.setTitle({ title: 'You are the best, key : ' + response.key })
      } else if (response.action === 'need_to_refresh') {
        chrome.tabs.reload(tab.id)
      } else if (response.action === 'not_login') {
        chrome.browserAction.setTitle({ title: 'You are not login' })
      }
    })
  })
}
