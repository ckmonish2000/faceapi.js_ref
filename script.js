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
  setInterval(async () => {
    const video = document.querySelector('.videos');
    let faceDescriptions = await faceapi.detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions()
    console.log(faceDescriptions)
  }, 100)
})
