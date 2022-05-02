import { ADD_CODE_ASSISTANCE, ADD_RECIPE_CREATION, CREATE_RECIPE_FROM_SELECTION } from "./constants";

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url || changeInfo.status === "complete") {
    chrome.tabs.sendMessage(
      tabId,
      { action: ADD_RECIPE_CREATION },
      function () {
        return;
      }
    );
  }

  chrome.tabs.sendMessage(
    tabId,
    { action: ADD_CODE_ASSISTANCE },
    function () {
      return;
    }
  );
});

// Recipe creation
chrome.contextMenus.create({
  id: "Codiga Create Recipe Context Menu",
  title: "Create Codiga Recipe",
  contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener((event, tab) => {
  chrome.tabs.sendMessage(
    tab.id,
    { action: CREATE_RECIPE_FROM_SELECTION },
    function () {
      return;
    }
  );
});
