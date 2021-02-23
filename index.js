// import AgoraRTC from "agora-rtc-sdk-ng"

// const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

var rtc = {
  // For the local client.
  client: null,
  // For the local audio track.
  localAudioTrack: null,
};

var options = {
  // Pass your app ID here.
  appId: null,
  // Set the channel name.
  channel: "demo_channel_name",
  // Pass a token if your project enables the App Certificate.
  token: null,
};

async function startBasicCall() {
  /**
   * Put the following code snippets here.
   */
  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  rtc.client.on("user-published", async (user, mediaType) => {
    // Subscribe to a remote user.
    await rtc.client.subscribe(user, mediaType);
    console.log("subscribe success");

    // If the subscribed track is audio.
    if (mediaType === "audio") {
      // Get `RemoteAudioTrack` in the `user` object.
      const remoteAudioTrack = user.audioTrack;
      // Play the audio track. No need to pass any DOM element.
      remoteAudioTrack.play();
    }
  });

  rtc.client.on("user-unpublished", user => {
    // Get the dynamically created DIV container.
    const playerContainer = document.getElementById(user.uid);
    // Destroy the container.
    playerContainer.remove();
  });

  // Create an audio track from the audio sampled by a microphone.
  rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // Publish the local audio track to the channel.
  await rtc.client.publish([rtc.localAudioTrack]);

  console.log("publish success!");
}

async function leaveCall() {
  // Destroy the local audio and track.
  rtc.localAudioTrack.close();

  // Leave the channel.
  await rtc.client.leave();
}

startBasicCall();
