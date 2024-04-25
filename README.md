<p align="center">
  <img alt="CometChat" src="https://assets.cometchat.io/website/images/logos/banner.png">
</p>

# React Native Sample App by CometChat

This is a reference application showcasing the integration of [CometChat's React Native UI Kit](https://www.cometchat.com/docs/v4/react-native-uikit/overview) in React Native. It offers developers practical examples for incorporating real-time messaging, as well as voice and video calling functionalities, into their React Native-based applications.
<table>    
  <tr>
    <td valign="center" style="text-align: center">
      <div style="
          display: flex;
          align-items: center;
          justify-content: center;">
        <img src="./Screenshots/overview_cometchat_screens_ios.png">
      </div>
      <div style="
          display: flex;
          align-items: center;
          justify-content: center;">
          React Native: iOS
      </div>
    </td>  
  </tr>
</table>
<hr />
<table>    
  <tr>
    <td valign="center" style="text-align: center">
      <div style="
          display: flex;
          align-items: center;
          justify-content: center;">
        <img src="./Screenshots/overview_cometchat_screens_android.png">
      </div>
      <div style="
          display: flex;
          align-items: center;
          justify-content: center;">
          React Native: Android
      </div>
    </td>  
  </tr>
</table>


## Prerequisites

- Ensure that you have the React Native development environment set up.
  - Follow instructions for your environment at https://reactnative.dev/docs/environment-setup
- Sign up for a [CometChat](https://app.cometchat.com/) account to get your app credentials: _`App ID`_, _`Region`_, and _`Auth Key`_

## Installation

1. Clone the repository:
   - Using HTTPS
     ```
     git clone https://github.com/cometchat/cometchat-sample-app-react-native.git
     ```
   - Using SSH
     ```
     git clone git@github.com:cometchat/cometchat-sample-app-react-native.git
     ```
2. Navigate to the cloned directory:
   ```
   cd cometchat-sample-app-react-native
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. For iOS, install dependencies after navigating to ios:
   ```sh
     cd ios
     pod install
   ```
5. Enter your CometChat _`App ID`_, _`Region`_, and _`Auth Key`_ in the [AppConstants.ts](https://github.com/cometchat/cometchat-sample-app-react-native/blob/v4/AppConstants.ts) file:
   https://github.com/cometchat/cometchat-sample-app-react-native/blob/f7d4945414da14405f5dece975c8cf43926b01c7/AppConstants.ts#L1-L5
6. Run the app on a device or emulator from the repo root.
   ```sh
   npm start
   npm run android
   npm run ios
   ```

## Help and Support

For issues running the project or integrating with our UI Kits, consult our [documentation](https://www.cometchat.com/docs/react-native-uikit/integration) or create a [support ticket](https://help.cometchat.com/hc/en-us) or seek real-time support via the [CometChat Dashboard](http://app.cometchat.com/).
