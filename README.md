# Codiga Plugin for Chrome

## General structure of the project

This is the source code for the Chrome plugin for Codiga.

Codiga provides two main functionalities:

 - **Coding Assistant**: import or create reusable code blocks based on your context
 - **Code Analysis**: no-configuration code analysis for 12+ language for Jupyter and GitHub

## Quickstart 

The plugin is available on the [Chrome web store](https://plugins.jetbrains.com/plugin/17969-codiga) 
and you can install it by just clicking "Add to Chrome"

![image](https://user-images.githubusercontent.com/90006571/145100624-073d5344-4fa8-4e1e-b036-8f8a572cb377.png)

## Use in Jupyter

After installing it'll do automatic code analysis when you open a Jupyter Notebook or a Jupyter Lab instance in your browser.

![jupyter-codiga-gif](https://user-images.githubusercontent.com/90006571/145106392-b0f00bcb-d2ec-4c03-90b2-bc499f444f07.gif)

## Use in GitHub

### Public repositories

For **public repositories** Codiga will also automatically start analysis while viewing or editing files, and also in Pull Requests

![Dec-07-2021 16-06-53](https://user-images.githubusercontent.com/90006571/145106436-b74c40aa-8ced-4e1a-a29f-03bbaa41bb4b.gif)

### Private repositories

For **private repositories** Codiga will still work for viewing or editing source files, but not when analysing pull requests, it will throw a notification asking you to add a GitHub Token with access to that repository. By clicking the notification it will open a new tab where you can create GitHub tokens.

![private-key-github](https://user-images.githubusercontent.com/90006571/145107901-5363b0a0-b841-41c0-9042-d84e0dc4a574.gif)


After you create your token all you have to do is save it **locally** so the plugin can use it, for this you can simply open the extension popup and add the GitHub token.

![set-codiga-token](https://user-images.githubusercontent.com/90006571/145108586-5e003193-da3d-43c3-9977-fc8b9577bf18.gif)
