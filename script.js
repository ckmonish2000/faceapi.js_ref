const video = document.querySelector('.video');
const canvas = document.querySelector('.canvas');

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
  const canv = faceapi.createCanvasFromMedia(video)

  document.body.append(canv)

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video,
      new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
    // canv.getContext('2d').clearRect(0, 0)
    faceapi.draw.drawDetections(canv, detections)


    console.log(detections)
  }, 1000)
})