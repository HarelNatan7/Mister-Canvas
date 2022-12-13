let gElCanvas
let gCtx
let gCurrShape = 'line'
let gCurrColor = 'black'
let gStartPos
let isDrag = false
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInIt() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    addListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
    })
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function getEvPos(ev) {
    // Gets the offset pos , the default pos
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    // Check if its a touch ev
    if (TOUCH_EVS.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    isDrag = true
}

function onMove(ev) {
    if (!isDrag) return
    const pos = getEvPos(ev)
    const x = pos.x
    const y = pos.y
    draw(x, y)
}

function onUp() {
    isDrag = false
}

function drawLine(x, y, xEnd = x + 50, yEnd = y + 50) {
    gCtx.lineWidth = 2
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.strokeStyle = gCurrColor
    gCtx.stroke()
}

function drawTriangle(x, y) {
    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.moveTo(x, y)
    gCtx.lineTo(x + 50, y + 50)
    gCtx.lineTo(x - 50, y + 50)
    gCtx.closePath()
    gCtx.strokeStyle = gCurrColor
    gCtx.stroke()
}

function drawRect(x, y) {
    gCtx.beginPath()
    gCtx.strokeStyle = gCurrColor
    gCtx.strokeRect(x, y, 70, 70)
}

function drawArc(x, y) {
    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.arc(x, y, 50, 0, 2 * Math.PI)
    gCtx.strokeStyle = gCurrColor
    gCtx.stroke()
}

function drawText(text, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = gCurrColor
    gCtx.fillStyle = 'black'
    gCtx.font = "30px arial";
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth - 20
    gElCanvas.height = elContainer.offsetHeight - 70
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function setShape(shape) {
    gCurrShape = shape
}

function draw(offsetX, offsetY) {
    switch (gCurrShape) {
        case 'triangle':
            drawTriangle(offsetX, offsetY)
            break
        case 'rect':
            drawRect(offsetX, offsetY)
            break
        case 'arc':
            drawArc(offsetX, offsetY)
            break
        case 'text':
            drawText('WoW', offsetX, offsetY)
            break
        case 'line':
            drawLine(offsetX, offsetY)
            break
    }
}

function onSetColor() {
    gCurrColor = document.getElementById("color").value
    console.log('gCurrColor:', gCurrColor)
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data 
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    // After we read the file
    reader.onload = (event) => {
        let img = new Image() // Create a new html img element
        img.src = event.target.result // Set the img src to the img file we read
        // Run the callBack func, To render the img on the canvas
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}

function renderImg(img) {
    // Draw the img on the canvas
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onUploadImg() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg') // Gets the canvas content as an image format

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        // Encode the instance of certain characters in the url
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }
    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)
    // Send a post req with the image to the server
    fetch('//ca-upload.com/here/upload.php', { method: 'POST', body: formData })
        .then(res => res.text())
        .then(url => {
            console.log('url:', url)
            onSuccess(url)
        })
}