const video = document.querySelector('.video');
const canvas = document.getElementsByClassName('canvas');

video.style.background = "green"

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./face-api.js/weights"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./face-api.js/weights"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./face-api.js/weights"),
  faceapi.nets.faceExpressionNet.loadFromUri("./face-api.js/weights"),
]).then(e => startVideo())

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => { video.srcObject = stream },
    error => { console.error(error); }
  )
}

video.addEventListener('play', () => {

})