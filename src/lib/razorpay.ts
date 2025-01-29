declare global {
  interface Window {
    Razorpay: typeof Razorpay;
  }
}

export const loadRazorpay = (): Promise<typeof Razorpay> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error('Razorpay not loaded'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay'));
    };

    document.body.appendChild(script);
  });
};
