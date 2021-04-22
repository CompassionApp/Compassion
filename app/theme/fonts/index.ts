import * as Font from "expo-font"

export const initFonts = async () => {
  // Refer to ./assets/fonts/custom-fonts.md for instructions.
  // ...
  // Welcome back! Just uncomment this and replace/append with your font file names!
  // ⬇
  await Font.loadAsync({
    "Quicksand-Bold": require("./Quicksand-Bold.ttf"),
    "Quicksand-Light": require("./Quicksand-Light.ttf"),
    "Quicksand-Medium": require("./Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("./Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("./Quicksand-SemiBold.ttf"),
  })
}
