const video = document.querySelector('.videos');


async function loadModels() {
  const MODEL_URL = '/models' //model directory
  await faceapi.nets.loadSsdMobilenetv1Model.loadFromUri(MODEL_URL)
  await faceapi.nets.loadFaceLandmarkModel.loadFromUri(MODEL_URL) // model to detect face landmark
  await faceapi.nets.loadFaceRecognitionModel.loadFromUri(MODEL_URL) //model to Recognise Face
  await faceapi.nets.loadFaceExpressionModel.loadFromUri(MODEL_URL) //model to detect face expression

}


loadModels()

navigator.getUserMedia(
  { video: {} },
  async (stream) => {
    video.srcObject = stream
  },
  error => { console.log(error) }
)



video.addEventListener('play', () => {
  const video = document.querySelector('.videos');
  const canvas = document.querySelector('.canvas');
  faceapi.matchDimensions(canvas, video) // canvas & video of same size

  setInterval(async () => {
    let faceDescriptions = await faceapi.detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions()


    faceDescriptions = faceapi.resizeResults(faceDescriptions, video)

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)// clear canvas slate before drawing

    faceapi.draw.drawDetections(canvas, faceDescriptions) //to draw box around detection
    faceapi.draw.drawFaceLandmarks(canvas, faceDescriptions) //to draw face landmarks
    faceapi.draw.drawFaceExpressions(canvas, faceDescriptions) //to mention face expression

    // console.log(faceDescriptions)
  }, 500)
})
