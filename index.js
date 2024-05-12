const fileInput = document.getElementById('fileInput');
const canvasElement = document.getElementById('myCanvas');
const ctx = canvasElement.getContext('2d');
const seekBar = document.getElementById('seekBar');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const screenshotButton = document.getElementById('screenshotButton');
const pre10s = document.getElementById('pre10s');
const next10s = document.getElementById('next10s');

let video;
let isSeeking = false;

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        if (video) {
            video.pause();
            video = null;
        }
        video = document.createElement('video');
        video.src = URL.createObjectURL(file);

        video.addEventListener('loadeddata', () => {
            seekBar.max = video.duration;
            drawFrame()
        });
    }
});

seekBar.addEventListener('input', () => {
    isSeeking = true;
    video.currentTime = seekBar.value;
});

seekBar.addEventListener('change', () => {
    isSeeking = false;
    drawFrame();
});

startButton.addEventListener('click', () => {
    video.play();
    drawFrame();
});

stopButton.addEventListener('click', () => {
    video.pause();
    drawFrame();
});

function drawFrame() {
    if (video && !video.paused && !isSeeking) {
        ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        seekBar.value = video.currentTime;
        requestAnimationFrame(drawFrame);
    }
}

screenshotButton.addEventListener('click', () => {
    const filedate = new Date();
    const h = filedate.getHours();
    const m = filedate.getMinutes();
    const s = filedate.getSeconds();
  if (video) {
    const dataURL = canvasElement.toDataURL('image/png'); // PNG形式でデータURLを取得
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `screenshot-${h},${m},${s}.png`; // ファイル名を指定
    link.click(); // リンクをクリックしてダウンロード
  }
});

pre10s.addEventListener('click', () => {
    if (video) {
        video.currentTime -= 10;
    }
});   

next10s.addEventListener('click', () => {
    if (video) {
        video.currentTime += 10;
    }
});
