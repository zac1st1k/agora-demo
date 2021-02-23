// import AgoraRTC from "agora-rtc-sdk-ng"

var rtc = {
  // For the local client.
  client: null,
  // For the local audio track.
  localAudioTrack: null,
};

var options = {
  // Pass your app ID here.
  appId: "",
  // Set the channel name.
  channel: "",
  // Pass a token if your project enables the App Certificate.
  token: "",
};

function startBasicCall() {
  /**
   * Put the following code snippets here.
   */
  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  rtc.client
    .join(options.appId, options.channel, options.token, null)
    .then(uid => {
      document.getElementById('message').innerHTML += uid;
      // Create an audio track from the audio sampled by a microphone.
      AgoraRTC
        .createMicrophoneAudioTrack()
        .then(localAudioTrack => {
          rtc.localAudioTrack = localAudioTrack;
          rtc.client
            .publish([localAudioTrack])
            .then(() => document.getElementById('message').innerHTML += "<br>publish success!");
        })
    });

  rtc.client.on("user-published", (user, mediaType) => {
    // Subscribe to a remote user.
    rtc.client
      .subscribe(user, mediaType)
      .then(() => {
        document.getElementById('message').innerHTML += "<br>subscribe success"
        // If the subscribed track is audio.
        if (mediaType === "audio") {
          // Get `RemoteAudioTrack` in the `user` object.
          const remoteAudioTrack = user.audioTrack;
          // Play the audio track. No need to pass any DOM element.
          remoteAudioTrack.play();
        }
      });
  });

  rtc.client.on("user-unpublished", user => {
    // Get the dynamically created DIV container.
    const playerContainer = document.getElementById(user.uid);
    // Destroy the container.
    playerContainer.remove();
  });
}

function leaveCall() {
  // Destroy the local audio and track.
  rtc.localAudioTrack.close();

  // Leave the channel.
  rtc.client.leave();
}

startBasicCall();
