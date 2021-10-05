# chrome-extension

## General structure of the project

**manifest.json**

General settings of the plugin

**content-script.js**

Is injected into the target pages. It's loaded when the page renders, cannot call the backend but can communicate with the background scripts through messages. It's used to manipulate the DOM and add visual modifications on top of existing components.
It's used in Codiga to add highlights and other visual components on GitHub, Jupyter, etc.

**/components**

Has visual HTML5 elements that are used to highlight errors, and add the extension blocks on top of GitHub and Jupyter components.

* **CodigaElement:** Base element for CodigaExtension and CodigaExtensionHighlights wrappers. Has common properties like width, height, and shadow root.
* **CodigaExtension:** Extends CodigaElement, it's just a wrapper on top of Code Mirror or any code container component in the pages, here are things like the StatusButton component.
* **CodigaExtensionHighlights:** Extends CodigaElement, it's a wrapper on top of an inner code container component, where all the highlights and tooltips are added without affecting the functionality of the code container. Users can still edit code.
* **CodigaHighlight:** Component to highlight violations in code, when hovered on, a tooltip is shown giving an explanation of the violation.
* **CodigaStatus:** Status mark with 3 possible states. LOADING, ALL_GOOD or # of violations. Shows up in the bottom right of the code container.

**/external**

Contains external libraries for adding tooltips, being able to use custom elements, etc.

* **custom-elements.min.js:** Allows creating custom components by extending HTMLElement and define them through window.customElements.define. (See /components) 
* **popper.js:** Allows adding tooltips to highlights with ease
