const video = document.querySelector('.videos');
console.log(video)

navigator.getUserMedia(
  { video: {} },
  stream => { video.srcObject = stream },
  error => { console.log(error) }
)