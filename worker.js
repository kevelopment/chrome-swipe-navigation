/**
 * Helper function to retrieve the currently opened tab
 * @returns {url: string} an object containing the url (and other stuff)
 */
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/**
 * Registers the swipe-handler script in the current tab
 * @param {} tab currently active tab
 */
async function register(tab) {
  const { tabId } = tab;

  // catch Settings Pages
  const { url } = await getCurrentTab();
  if (url.startsWith("chrome://") || url.startsWith("edge://")) {
    return;
  }

  // execute the script
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["swipe-handler.js"],
  });
}

// register on tab activation
chrome.tabs.onActivated.addListener((tab) => register(tab));
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
  register({ tabId, tab })
);
