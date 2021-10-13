const GITHUB_KEY = 'codiga-github-key';

chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log(changes);
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );

    if(GITHUB_KEY === key){
      chrome.tabs.query({}, function(tabs) {
          console.log(tabs);
          for (var i=0; i<tabs.length; ++i) {
            chrome.tabs.sendMessage(
              tabs[i].id,
              { action: "updateContainer" },
              function (response) {}
            );
          }
      });
    }
  }
});


// To load content-script again when url changes
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url || changeInfo.status === "complete") {
    chrome.tabs.sendMessage(
      tabId,
      { action: "updateContainer" },
      function (response) {}
    );
  }
});

