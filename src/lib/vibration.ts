export const triggerVibration = () => {
  if (typeof window !== "undefined" && window.navigator.vibrate) {
    window.navigator.vibrate(50); // 50ms vibration
  }
};
