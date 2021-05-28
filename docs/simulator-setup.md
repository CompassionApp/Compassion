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

## iOS

1. Follow the docs to install the [xcode CLI tools](https://docs.expo.io/workflow/ios-simulator/)
1. Launch the simulator by opening the `Simulator.app` file in Finder or Spotlight Search (if not already open)
1. Choose a device to simulate (recommend using **iPhone 12**)

   ![ios-simulator](docs/ios-simulator.png)

1. Enable location mocking in the simulator by going to the menu bar and selecting `Features > Location > City Run`
