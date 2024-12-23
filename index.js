const seekBar = document.getElementById('seekBar');
// play control
const touchAreaPrev = document.getElementById('touchArea-prev');
const touchAreaPlay = document.getElementById('touchArea-play');
const touchAreaNext = document.getElementById('touchArea-next');
const time = document.getElementById('time');
const title = document.getElementById('title');
let src_video;
let isSeeking = false;

let played = false;

let src_canvas;
let src_ctx;

// タイマーのID
let interval_id;

src_canvas = document.getElementById("SrcCanvas");
src_ctx = src_canvas.getContext("2d");

src_video = document.getElementById("SrcVideo");

// 停止
function stopMovie() {
    src_video.pause();
}

function playMovie() {
    try {
        if (!played) {
            src_video.play();
            played = true;
            drawFrame();
        } else {
            src_video.pause();
            played = false;
        }
    } catch (e) {
        failalert('no file selected!');
    }
}


// ユーザーによりファイルが追加された  
function onAddFile(event) {
    var files;
    var filename;

    if (event.target.files) {
        files = event.target.files;
    } else {
        files = event.dataTransfer.files;
    }

    if (files[0] != undefined) {
        filename = files[0].name;
        title.innerHTML = filename;
        // 拡張子の取得 
        var ext = filename.split('.');
        ext = ext[ext.length - 1].toUpperCase();

        // 動画が再生できる状態になった時
        src_video.onloadeddata = function () {

            src_canvas.width = src_video.videoWidth;
            src_canvas.height = src_video.videoHeight;
            seekBar.max = src_video.duration;
            // 再生      
            drawFrame();
            console.log();
        };

        src_video.onerror = function (e) {
            alert('このファイルは読み込めません。');
        };

        // 以前のURLオブジェクトを削除する
        if (src_video.src) {
            src_video.pause();
            window.URL.revokeObjectURL(src_video.src);
        }

        // MIMEを指定して動画を読み込む
        var mime = "video/mp4";
        if (ext == "WEBM") {
            mime = "video/webm";
        } else if (ext == "OGG" || ext == "OGX" || ext == "OGV") {
            mime = "video/ogg";
        }
        src_video.src = URL.createObjectURL(new Blob([files[0]], { type: mime }));
    } else {
    }
    document.getElementById("inputfile").value = '';
}
seekBar.addEventListener('input', () => {
    isSeeking = true;
    src_video.currentTime = seekBar.value;
});

seekBar.addEventListener('change', () => {
    isSeeking = false;
    drawFrame();
});
function getImage() {
    const filedate = new Date();
    const h = filedate.getHours();
    const m = filedate.getMinutes();
    const s = filedate.getSeconds();
    if (src_video) {
        const dataURL = src_canvas.toDataURL('image/png'); // PNG形式でデータURLを取得
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `screenshot-${h}${m}${s}.png`; // ファイル名を指定
        link.click(); // リンクをクリックしてダウンロード
    } else {
        failalert('no file selected!');
    }
};

touchAreaPrev.addEventListener('touchend', function (event) {
    event.preventDefault();
    if (src_video) {
        src_video.currentTime -= 10;
    }
});


touchAreaPlay.addEventListener('touchend', function (event) {
    event.preventDefault();
    playMovie();
})

touchAreaNext.addEventListener('touchend', function (event) {
    event.preventDefault();
    if (src_video) {
        src_video.currentTime += 10;
    }
});

touchAreaPrev.addEventListener('click', function (event) {
    event.preventDefault();
    if (src_video) {
        src_video.currentTime -= 10;
    }
});


touchAreaPlay.addEventListener('click', function (event) {
    event.preventDefault();
    playMovie();
})

touchAreaNext.addEventListener('click', function (event) {
    event.preventDefault();
    if (src_video) {
        src_video.currentTime += 10;
    }
});

function drawFrame() {
    if (src_video && !src_video.paused && !isSeeking) {
        src_ctx.drawImage(src_video, 0, 0, src_canvas.width, src_canvas.height);
        seekBar.value = src_video.currentTime;
        requestAnimationFrame(drawFrame);
    }
}

function failalert(msg) {
    alert(msg);
}