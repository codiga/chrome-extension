[![Code Quality Score](https://api.codiga.io/project/30142/score/svg)](https://app.codiga.io/hub/project/30142/chrome-extension)
[![Code Grade](https://api.codiga.io/project/30142/status/svg)](https://app.codiga.io/hub/project/30142/chrome-extension)
![Chrome Web Store](https://img.shields.io/chrome-web-store/users/dbkhkhonmelajjempmoadocgneoadjge)

# Codiga for Chrome: Code Snippets in your Browser

This is the Codiga Chrome extension. Create, search and use code snippets within your browser. Find code snippets from your account or from the [Codiga Hub](https://app.codiga.io/hub).

## Installation

This extension is available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/codiga/dbkhkhonmelajjempmoadocgneoadjge) where you can install it by clicking "Add to Chrome".

## Features

This extension links features from our [Coding Assistant](https://www.codiga.io/coding-assistant/) and [Hub](https://app.codiga.io/hub) right to your browser.

1. Quickly save/create a snippet found online
2. Search through our and/or your catalogue of code snippets.

### Creating a Snippet

After you install the plugin, you will have an item named "Create Codiga Snippet" in the context menu of your browser whenever you right-click **a selection** in any page.

Once clicked, we'll redirect you to [Codiga](https://app.codiga.io/assistant/snippet/create) where you can customize your code snippet before saving.

Later, you can visit [all your snippets](https://app.codiga.io/assistant/snippet/list) on Codiga. Here you can manage your snippets, create more, or even start putting related snippets in a cookbook together.

Don't forget to browse [Codiga's Hub](https://app.codiga.io/hub) to see what other's have created. You might even find some inspiration out of what other's have posted.

### Searching for Snippets

Once installed, when you are on a designated page ([GitHub](https://github.com), [GitLab](https://gitlab.com), [Bitbucket](https://bitbucket.org), [Replit](https://replit.com), [StackOverflow](https://stackoverflow.com)), you can open the `Codiga Code Snippet Search` panel by clicking on the "Codiga for Chrome" button.

Now you can filter your search until you find the desired snippet. If we're missing something, take the time to create and share it for others.

## Getting Started

### Development

- pull the repo
- run the `release.sh` script
  - `./release.sh`
- visit [chrome://extensions](chrome://extensions) and click "Load unpacked"
  - upload the `dist` folder now
- run `npm run watch`

> Note: You'll need to click "Update" on the link above when changes are made
