# Codiga Plugin for Chrome

This is the source code for the Codiga Chrome Extension.

## Features

This extension links features from our [Coding Assistant]() and [Hub]() right to your browser.

1. Quickly save/create a snippet found online
2. Search through our and/or your catalogue of code snippets.

### Creating a Snippet

After you install the plugin, you will have an item named "Create Codiga Snippet" in the context menu of your browser whenever you right-click **a selection** in any page.

Once clicked, we'll redirect you to [Codiga](https://app.codiga.io/assistant/snippet/create) where you can customize your code snippet before saving.

Later, you can visit [all your snippets](https://app.codiga.io/assistant/snippet/list) on Codiga. Here you can manage your snippets, create more, or even start putting related snippets in a cookbook together.

Don't forget to browse [Codiga's Hub](https://app.codiga.io/hub) to see what other's have created. You might even find some inspiration out of what other's have posted.

### Searching for Snippets

Once installed, when you are on a designated page ([GitHub](https://github.com), [GitLab](https://gitlab.com), [Bitbucket](https://bitbucket.org), [Replit](https://replit.com), [StackOverflow](https://stackoverflow.com)), you can open the `Codiga Code Snippet Search` panel by clicking on the Codiga icon button.

Now you can filter your search until you find the desired snippet. If we're missing something, take the time to create and share it for others.

## Getting Started

### Installation

This extension is available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/codiga/dbkhkhonmelajjempmoadocgneoadjge) where you can install it by clicking "Add to Chrome"

### Development

- pull the repo
- run the `release.sh` script
  - `./release.sh`
- visit [chrome://extensions](chrome://extensions) and click "Load unpacked"
  - upload the `dist` folder now
- run `npm run watch`

> Note: You'll need to click "Update" on the link above when changes are made
