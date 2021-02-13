# react-keyboard-navigation-popup

## This is a zero-dependency, opinionated library for providing a slack-like "jump to" popup on keyboard shortcut press.
![screenshot](https://user-images.githubusercontent.com/5597580/107835546-23538780-6d9a-11eb-970e-46ad89bc1627.png)
## [Check out the demo here](https://aleqsio.github.io/react-keyboard-navigation-popup/)

[![NPM](https://img.shields.io/npm/v/react-keyboard-navigation-popup.svg)](https://www.npmjs.com/package/react-keyboard-navigation-popup) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save react-keyboard-navigation-popup
```

## Usage

Basic usage requires passing just a list of available actions.
```tsx
import * as React from 'react'

import { ShortcutPopup } from "react-keyboard-navigation-popup";

class Example extends React.Component {
  render () {
    actions = [
      {
        label: "Create a reminder",
        image: "https://picsum.photos/id/1/200",
        onClick: () => console.log("Create a reminder")
      },
      ...
    ]
    return (
      <ShortcutPopup actions={actions} />
    )
  }
}
```

## Available props
```tsx
actions: MyAction[];
```
Required array of available actions. The ShortcutPopup component is generic and accepts a type argument for custom action types.
```tsx
renderResultRow?: (result: MyAction & AddtionalResultProps) => Element;
```
Provide a custom component for rendering a single available action row. AddtionalResultProps provides a relevancy rating and a keyboard shortcut for selecting the option.
```tsx
getSearchKeywordsForAction?: (action: MyAction) => string[];
```
If you want to search custom fields on the action object, provide a function that returns a list of keywords from a single action object.
```tsx
onActionPress?: (action: MyAction) => void;
```
By default this function runs ```onClick``` from the action object, but you can also provide a custom handler based on the action fields.
```tsx
getKeyShortcutForResult?: ActionKeyShortcut<MyAction>;
```
Override a key combination for selecting an action.
ActionKeyShortcut is of type:
```tsx
type ActionKeyShortcut<MyAction> = (result: {
  index: number;
  action: MyAction;
}) => { label: string; isPressed: (e: KeyboardEvent) => boolean };
```
Label is then returned in AddtionalResultProps as ```keyShortcut```
```tsx
getKeyShortcutForOpen?: KeyShortcut;
```
Override a key combination for opening the keyboard selection popup. (Cmd on mac, ctrl on other os + K by default)
KeyShortcut is of type:
```tsx
type KeyShortcut = () => {
  label: string;
  isPressed: (e: KeyboardEvent) => boolean;
};
```
```tsx
getKeyShortcutForClose?: KeyShortcut;
```
Override a key combination for closing the keyboard selection popup. (Esc by default)

```tsx
getRatingForKeywords?: (keywords: string[], searchQuery: string) => number;
```
Override the relevancy calculation algorithm for the set of keywords. By default it uses Damerau-Levenshtein on each pair of words from keywords, searchQuery.
```tsx
showTopNResults?: number;
```
Show top N results from the actions list.
## License

MIT © [aleqsio](https://github.com/aleqsio)
