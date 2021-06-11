## Simulator Setup

### Android

1. Install [Android Studio](https://docs.expo.io/workflow/android-studio-emulator) and through its interface download the Android SDK, Emulation tools (under platform SDK), and a simulator image through the Android Virtual Device manager (recommend using **Pixel 4** with Android Platform API 29). Details below:

![android-sdk](docs/android-sdk.png)

![android-sdk-tools](docs/android-sdk-tools.png)

![avd-manager](docs/avd-manager.png)

![avd-config](docs/avd-config.png)

2.  Add the following to your `.bashrc`/`.zshrc` and reload your shell.

```
export ANDROID_SDK=$HOME/Library/Android/sdk
export PATH=$ANDROID_SDK/emulator:$ANDROID_SDK/tools:$PATH
```

3.  List all simulators and start one from your terminal:

```bash
$ emulator -list-avds
Pixel_4_API_29

# If you don't see any output from the command above, you haven't installed an Android image
# with Android Studio yet. Go back to step 1 and do that first.

$ emulator -avd Pixel_4_API_29
# An emulator should be started
```

### iOS

1. Follow the docs to install the [xcode CLI tools](https://docs.expo.io/workflow/ios-simulator/)
1. Launch the simulator by opening the `Simulator.app` file in Finder or Spotlight Search (if not already open)
1. Choose a device to simulate (recommend using **iPhone 12**)

   ![ios-simulator](docs/ios-simulator.png)

1. Enable location mocking in the simulator by going to the menu bar and selecting `Features > Location > City Run`

## Expo on Device

Besides running simulators on your development machine, Expo allows us to connect to phones on the local network and transmit bundles over air. This means you can use your phone as a testing device. It should be noted that using a physical device is necessary to test push notifications.

Below are the steps to enable this.

1. Download the Expo Go app on the Apple/Android app store
1. Sign up for an account (free) at https://expo.io/signup
1. Open the app on your phone and sign in with your username and password from the previous step
   - The app might ask to allow permissions to the local network. You should enable this.
1. To open the app you could either...
   - Use your camera app to read the QR code from the Metro bundler process (from `yarn start`). That should open the app in Expo Go directly.
   - Or, pull down on the list of projects and it should discover your machine. Of course, make sure you're on the same network (phone is using wifi) and make sure Metro/`yarn start` is running.
1. Done! You should be able to use your phone as a test device.
   - **Tip:** To open the dev menu, you need to shake your phone physically to get it to appear.
