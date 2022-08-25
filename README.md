<br>

<div align="center">
  <img src="https://bookface-images.s3.amazonaws.com/logos/90412fbc5679b873ae4756218a6fb86d0f4c99c2.png" alt="snaptrade">
</div>
<h1 align="center">snaptrade-react</h1>
<h3 align="center">A <a href="https://reactjs.org">React</a> modal component for <a href="https://snaptrade.com/">SnapTrade</a> connection portal.

<br>

## [![NPM Version](https://img.shields.io/npm/v/snaptrade-react.svg?style=flat-square)](https://www.npmjs.com/package/snaptrade-react) [![NPM Downloads](https://img.shields.io/npm/dm/snaptrade-react.svg?style=flat-square)](https://www.npmjs.com/package/snaptrade-react) [![npm-bundle-size](https://img.shields.io/bundlephobia/minzip/snaptrade-react?style=flat-square)](https://bundlephobia.com/package/snaptrade-react) [![license-badge](https://img.shields.io/npm/l/snaptrade-react.svg?style=flat-square)](https://github.com/passiv/snaptrade-react/blob/main/LICENSE)

## 📖 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [⚙️ Configuration](#%EF%B8%8F-configuration)
- [👨🏼‍⚖️ License & copyrights](#%EF%B8%8F-license)

## 🚀 Getting Started

```shell
npm install snaptrade-react
```

```jsx
import { useState } from 'react';
import { SnapTradeReact } from 'snaptrade-react';

const ConnectBrokerage = () => {
  const [open, setOpen] = useState(false);
  const [redirectLink, setRedirectLink] = useState(null);

  const connectionProcess = () => {
    // call "https://api.snaptrade.com/api/v1/snapTrade/login" to  generate a redirect link
    const link = getRedirectURI();

    // update the state with the generated link
    setRedirectLink(link);

    // update the "open" state to show the modal
    setOpen(true);
  };
  return (
    <div>
      {/* your Connect button */}
      <button onClick={connectionProcess}>Connect</button>

      <SnapTradeReact
        loginLink={redirectLink}
        isOpen={open}
        close={() => setOpen(false)}
      />
    </div>
  );
};

export default ConnectBrokerage;
```

## ⚙️ Configuration

`SnapTradeReact` requires the following props:

| Prop         | Type                                                                                                                                                                              | Default value                                                                                                                                                                                                                    | Description                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| loginLink    | `string`                                                                                                                                                                          | `undefined`                                                                                                                                                                                                                      | The generated redirect link. (retrieve by calling `https://api.snaptrade.com/api/v1/snapTrade/login`) |
| isOpen       | `boolean`                                                                                                                                                                         | `undefined`                                                                                                                                                                                                                      | Determines to show/hide the modal.                                                                    |
| close        | `Function`                                                                                                                                                                        | `undefined`                                                                                                                                                                                                                      | A function to be called when user clicks out of the modal or click the `X` button.                    |
| closeBtn     | `boolean`                                                                                                                                                                         | `true`                                                                                                                                                                                                                           | Determines to show/hide the `X` (close button)                                                        |
| contentLabel | `string`                                                                                                                                                                          | `SnapTrade Connection Portal rendering in an iframe`                                                                                                                                                                             | Indicating how the content container should be announced to screenreaders                             |
| style        | `{ overlay: { backgroundColor: string, width: string}, content: {backgroundColor: string, margin: string, width: string, padding: string, borderRadius: string, border: string}}` | `{ overlay: { backgroundColor: rgba(255, 255, 255, 0.75), width: 100%}, content: {backgroundColor: #f8fafc, margin: 0 auto, width: 500px, padding: 20px 20px, borderRadius: 1rem, border: 1px solid rgba(255, 255, 255, 0.75)}}` | Change styling for the overlay and content                                                            |

<br>

## 👨🏼‍⚖️ License & copyrights

Licensed under [Apache License 2.0][1].

[1]: LICENSE
