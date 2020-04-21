# Project Details
This repo was cloned from [this repo](https://github.com/satendra02/react-chrome-extension), which accompanies this [blog post](https://itnext.io/create-chrome-extension-with-reactjs-using-inject-page-strategy-137650de1f39). Getting a recent version of create-react-app to work with the boilerplate from this repo was a bit tricky, but luckily [this issue](https://github.com/satendra02/react-chrome-extension/issues/2) pointed me in the right direction.

## Installation
>Make sure you have latest **NodeJs** version installed

Clone repo

```
git clone https://github.com/satendra02/react-chrome-extension.git
```
Go to `react-chrome-extension` directory run

```
yarn install
```
Now build the extension using
```
yarn build
```
You will see a `build` folder generated inside `[PROJECT_HOME]`

## Adding React app extension to Chrome

In Chrome browser, go to chrome://extensions page and switch on developer mode. This enables the ability to locally install a Chrome extension.

<img src="https://cdn-images-1.medium.com/max/1600/1*OaygCwLSwLakyTqCADbmDw.png" />

Now click on the `LOAD UNPACKED` and browse to `[PROJECT_HOME]\build` ,This will install the React app as a Chrome extension.

When you go to any website and click on extension icon, injected page will toggle.

<img src="https://cdn-images-1.medium.com/max/1600/1*bXJYfvrcHDWKwUZCrPI-8w.png" />