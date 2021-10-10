const video = document.querySelector('.video');
const canvas = document.getElementsByClassName('canvas');

video.style.background = "green"

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => { video.srcObject = stream },
    error => { console.error(error); }
  )
}

startVideo()


video.addEventListener('play', () => {
  console.log("started")
})