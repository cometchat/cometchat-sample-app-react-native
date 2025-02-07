package com.demosampleapp

import android.content.res.Configuration
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import com.CometChatCalls.CallNotificationServiceModule
import com.CometChatCalls.PictureInPictureModule
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "demosampleapp"

    private fun getReactApplicationContextFromInstance(): ReactApplicationContext? {
        val reactInstanceManager: ReactInstanceManager? = (application as? ReactApplication)?.reactNativeHost?.reactInstanceManager
        return reactInstanceManager?.currentReactContext as? ReactApplicationContext
    }

    override fun onPictureInPictureModeChanged(
        isInPictureInPictureMode: Boolean,
        newConfig: Configuration
    ) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)

        val reactContext = getReactApplicationContextFromInstance()
        if (reactContext != null) {
            val pipEventModule = PictureInPictureModule(reactContext)
            pipEventModule.notifyPipModeChanged(isInPictureInPictureMode)
        }
    }

    fun initializePictureInPictureMode() {
        val reactApplicationContext = getReactApplicationContextFromInstance()
        if (reactApplicationContext != null) {
            val pipEventModule = PictureInPictureModule(reactApplicationContext)
            pipEventModule.initializePictureInPictureMode();
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onStart() {
        super.onStart()
        val reactInstanceManager: ReactInstanceManager? = (application as? ReactApplication)?.reactNativeHost?.reactInstanceManager
        val reactApplicationContext = getReactApplicationContextFromInstance()

        if (reactApplicationContext != null) {
            initializePictureInPictureMode();
        } else {
            reactInstanceManager?.addReactInstanceEventListener {
                initializePictureInPictureMode();
            }
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public override fun onUserLeaveHint() {
        super.onUserLeaveHint()

        val reactContext = getReactApplicationContextFromInstance()
        if (reactContext != null) {
            val pipEventModule = PictureInPictureModule(reactContext)
            pipEventModule.enterPictureInPictureMode();
        }
    }


  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
