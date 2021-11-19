import { ADD_CODE_VALIDATION, GITHUB_KEY, BASE_URL } from "./constants";

const Buffer = require('buffer/').Buffer;

/**
 * When the GitHub key this sends a request to the content_script to run code validation again
 */
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );

    if(GITHUB_KEY === key){
      chrome.tabs.query({}, function(tabs) {
          for (var i=0; i<tabs.length; ++i) {
            chrome.tabs.sendMessage(
              tabs[i].id,
              { action: ADD_CODE_VALIDATION },
              function (response) {}
            );
          }
      });
    }
  }
});


/**
 * When the GitHub key this sends a request to the content_script to run code validation again
 */
// To load content-script again when url changes
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url || changeInfo.status === "complete") {
    chrome.tabs.sendMessage(
      tabId,
      { action: ADD_CODE_VALIDATION},
      function (response) {}
    );
  }
});


// Recipe creation
chrome.contextMenus.create({
  id: 'Codiga Create Recipe Context Menu',
  title: "Create recipe: %s", 
  contexts:["selection"]
});

chrome.contextMenus.onClicked.addListener(event => {
  console.log(event);
  const encodedRecipe = Buffer.from(event.selectionText).toString('base64');
  chrome.tabs.create({  
    url: `${BASE_URL}/assistant/recipe/create?code=${encodedRecipe}`
  });
});