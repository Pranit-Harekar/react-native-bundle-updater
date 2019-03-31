![react-native-bundle-updater](https://user-images.githubusercontent.com/17886017/55283012-16a12400-5327-11e9-991d-e5de07e2db72.png)

# react-native-bundle-updater

A client side library for dynamically updating jsbundles in React Native apps

## Goals

- Allow developers to utilize their existing CD tools to deliver jsbundles
- Provide flexible options for users to update jsbundles
- Allow developers to deploy jsbundles based on groups
- Allow developers to ship zipped jsbundles
- Allow users to rollback to previous versions of the jsbundle

## Inspiration

> My team was recently looking for a client side library that would let us ship React Native jsbundle updates without having to add another CI/CD framework into our stack and surprisingly there were no libraries that could do that, except [react-native-auto-updater](https://github.com/redbooth/react-native-auto-updater) which is no longer maintained. Because of this reason and also due to the lack of time, we were forced to use [Microsoft's CodePush](https://microsoft.github.io/code-push/). CodePush is a really good service but with an added complexity which some projects might not require. Hence I decided to start an open source project to build a simple, lightweight, client-side library that dynamically updates the jsbundles in React Native apps. - [Pranit Harekar](https://twitter.com/pranitharekar)
