// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(gotMessage)

function gotMessage (message, sender, sendResponse) {
  if (message.action === 'grabkey') {
    if (document.getElementsByClassName('courtesy-navigation__list')[0].children.length === 2) {
      const key = document.getElementsByClassName('css-8ipnjq')
      const button = document.querySelectorAll('[class^="MuiButtonBase-root MuiButton-root"]')
      if (button.length === 1) {
        console.log('redeeming key')
        button[0].click()
        sendResponse({ action: 'claimed', key: document.getElementById('key-recieved-successfully')[0].innerHTML })
      } else if (key.length === 1) {
        sendResponse({ action: 'claimed', key: key[0].innerHTML })
      } else {
        console.log('need to refresh')
        sendResponse({ action: 'need_to_refresh' })
      }
    } else {
      console.log('not login')
      sendResponse({ action: 'not_login' })
    }
  }
}
