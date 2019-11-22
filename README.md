<div style="width:100%">
<div style="width:100%">
	<div style="width:50%; display:inline-block">
		<p align="center">
		<img align="center" width="180" height="180" alt="" src="https://github.com/cometchat-pro/ios-swift-chat-app/blob/master/Screenshots/CometChat%20Logo.png">	
		</p>	
	</div>	
</div>
</br>
</br>
</div>

CometChat React Native app (built using **CometChat Pro Java Script SDK**) is a text messaging app capable of **one-on-one** (private) and **group** messaging. 

[![Platform](https://img.shields.io/badge/Platform-React--Native-green.svg)](#)      [![Platform](https://img.shields.io/badge/Language-JavaScript-yellowgreen.svg)](#)

## Table of Contents

1. [Installation ](#installtion)

2. [Run the Sample App ](#run-the-sample-app)

3. [Screenshots ](#screenshots)

4. [Contribute](#contribute)



## Installtion

   Simply Clone the project from cometchat-pro-react-native-sampe-app repository and open in Text Editor of choice. To run the React Native App you need to have react native setup on your system. To setup react native you can follow the Installation guide at the follwing link [React Native Setup](https://facebook.github.io/react-native/docs/getting-started).


## Make CometChat Pro JavaScript SDK Compatilbe with React Native

We have injected two components from sample app to make Java script SDK compatible with React Native the components are as follows:
1] DOMParser
2] base-64 encode and decode

This is done in LoginScreen.js file in src folder. Here base-64 can be injected globally but DomParser needs to be injected only after CometChat.init().


## Run the Sample App

<h2> v2.0+ </h2>
<h4>
	Checkout master or v2 branch.
</h4>
<h4>Get your Application Keys</h4>
<a href="https://app.cometchat.io/" target="_blank">Signup for CometChat</a> and then:

1. Create a new app - select version as v2 and region as Europe or USA.

2. Head over to the API Keys section and click on the Create API Key button

3. Enter a name and select the scope as Auth Only

4. Now note the API Key and App ID

5. Replace  `appID`, &nbsp; `apiKey` and &nbsp; `appRegion` in *src/LoginScreen.js* with your APP ID, &nbsp; API KEY &nbsp;and&nbsp; APP Region respectively.<br/>

Note : APP Region values to "us" or "eu".

<h2> v1.0+ </h2>
<h4>
	Checkout v1 branch.
</h4>

   To Run to sample App you have to do the following changes by Adding **apiKey** and **appID** 

   - Open the Project App

   - Go to Under src --> LoginScreen.js

   -  modify *appID* and *apiKey* with your own **ApiKey** and **AppId**

        `let appID = "XXXXXXXXX" ,apiKey = "XXXXXXXXX";`

       
       

## Note



   For more information read [CometChat Pro JavaScript SDK](https://prodocs.cometchat.com/docs/js-quick-start) Documentation
                               


## Contribute
   
   
   Feel free to make Pull Request. 
   
