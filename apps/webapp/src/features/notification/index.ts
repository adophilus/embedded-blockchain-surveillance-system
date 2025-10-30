import Backend from "../backend";

namespace NotificationService {
  export const arrayBufferToBase64 = (buf: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(buf)));

  export const register = async () => {
    if (!("Notification" in window)) {
      alert(
        "This browser does not support web push notification. This Demo has failed for you.  :'-( ",
      );
      return;
    }

    Notification.requestPermission(function(status) {
      console.log("Notification Permissiong status:", status);
    });

    if (Notification.permission === "denied") {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registrations = await navigator.serviceWorker.getRegistrations();

    for (let registration of registrations) {
      registration.unregister();
    }

    const vapidPublicKeyRes = await Backend.Client.client.request(
      "get",
      "/notification/vapid",
    );
    if (vapidPublicKeyRes.error) {
      return;
    }

    const vapidPublicKey = vapidPublicKeyRes.data.data.publicKey;

    const register = await navigator.serviceWorker.register(
      "./serviceworker.js",
      { scope: "/" },
    );
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    });

    const authKey = subscription.getKey("auth");
    if (!authKey) return;

    const p256dhKey = subscription.getKey("p256dh");
    if (!p256dhKey) return;

    const registerTokenDetailsRes = await Backend.Client.client.request(
      "post",
      "/notification/token/register",
      {
        body: {
          endpoint: subscription.endpoint,
          keys: {
            auth: arrayBufferToBase64(authKey),
            p256dh: arrayBufferToBase64(p256dhKey),
          },
          supported_content_encodings: Array.from(
            PushManager.supportedContentEncodings,
          ),
        },
      },
    );

    if (registerTokenDetailsRes.error) {
      return;
    }
  };
}

export default NotificationService;
