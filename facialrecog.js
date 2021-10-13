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

    // faceapi.draw.drawDetections(canvas, faceDescriptions) //to draw box around detection
    // faceapi.draw.drawFaceLandmarks(canvas, faceDescriptions) //to draw face landmarks
    // faceapi.draw.drawFaceExpressions(canvas, faceDescriptions) //to mention face expression

    // detection part 

    const Images = ['monish']

    const LabeledFaceDescriptors = await Promise.all(Images?.map(async label => {
      const imgUrl = `img/${label}.jpg`
      const img = await faceapi.fetchImage(imgUrl)

      const faceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()


      const faceDescriptors = [faceDescription?.descriptor]

      return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
    }))

    const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.9)

    const results = faceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))

    results.forEach((bestMatch, i) => {
      const box = faceDescriptions[i].detection.box
      const text = bestMatch.toString()
      const drawBox = new faceapi.draw.DrawBox(box, { label: text })
      drawBox.draw(canvas)
    })

  }, 500)
})
