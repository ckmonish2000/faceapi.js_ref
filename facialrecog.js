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


    // detection part 

    const Images = ['monish']

    const LabeledFaceDescriptors = await Promise.all(Images?.map(async label => {

      // load image
      const imgUrl = `img/${label}.jpg`
      const img = await faceapi.fetchImage(imgUrl)

      // get descriptions for the image
      const faceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

      // labelizing the results
      const faceDescriptors = [faceDescription?.descriptor]
      return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
    }))


    const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.9) //face matcher api init with descrptors of image
    const results = faceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor)) // check which label doe sthe image match in the video feed

    // plot the box
    results.forEach((bestMatch, i) => {
      const box = faceDescriptions[i].detection.box
      const text = bestMatch.toString()
      const drawBox = new faceapi.draw.DrawBox(box, { label: text })
      drawBox.draw(canvas)
    })

  }, 500)
})
