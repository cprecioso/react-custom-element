# @cprecioso/react-custom-element

```sh
$ npm i -D @cprecioso/react-custom-element       # if you use npm
$ yarn add --dev @cprecioso/react-custom-element # if you use yarn
```

## API

Check [the docs](https://cprecioso.github.io/react-custom-element/)

## Quick-start

```tsx
import { createCustomElement } from "@cprecioso/react-custom-element";

customElements.define(
  "my-greeter",
  createCustomElement(
    ["name"], // Add the props you want to get from HTML here
    ({ name, children }) => (
      // You can use all React functionality here.
      // Anything you render will go to the Shadow DOM.
      // `children` is the `<slot>` tag.
      <h1>
        Hello, {name}, here's a message: {children}
      </h1>
    ),
  ),
);
```

```html
<script type="module" src="./my-greeter-element.js"></script>

<my-greeter name="Carlos">Here's the content</my-greeter>
```
