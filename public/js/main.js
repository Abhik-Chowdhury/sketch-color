const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillcolor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImage = document.querySelector(".save-img"),
    ctx = canvas.getContext("2d",{willReadFrequently:true});
// Global value with default value 
    let preMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushwidth = 5,
    selectedColor = "#000"

// set the canvas Background in dowload time it will be white
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selecteColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // setting canvas width height offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

// Draw the Rectangnle
const drawRect = (e) => {
    // if fillcolor isn't checked draw a rectangle with border else draw rectangle with background
    if (!fillcolor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, prevMouseY - e.offsetY);

}
// Draw the Circle
const drawCircle = (e) => {
    ctx.beginPath(); //creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((preMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(preMouseX, prevMouseY, radius, 0, 2 * Math.PI); //creating circle according to the mouse pointer
    fillcolor.checked ? ctx.fill() : ctx.stroke();
}

// Draw Triangle

const drawTriangle = (e) => {
    ctx.beginPath(); //creating new path to draw triangle
    ctx.moveTo(preMouseX, prevMouseY);//moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);//creating first line according to mouse pointer
    ctx.lineTo(preMouseX * 2 - e.offsetX, e.offsetY);// creating bottom line of triangle
    ctx.closePath();// closing the path a triangle so the third line draw automatically 
    fillcolor.checked ? ctx.fill() : ctx.stroke(); //if fillcolor is checked fill triangle else draw border
}
const startDraw = (e) => {
    isDrawing = true;
    preMouseX = e.offsetX;//passing current mousex position as preMouseY value
    prevMouseY = e.offsetY;//passing current mouseY position as preMouseY value
    ctx.beginPath(); //creating new path to draw
    ctx.lineWidth = brushwidth;
    ctx.strokeStyle =  selectedColor; // passing selected Color as stroke syle
    ctx.fillStyle = selectedColor; // passing selected color as fill style
    // Copying canvas data & passing as snapshot value this avoids draggring the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas
    if (selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool eraser then get then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
        ctx.lineTo(e.offsetX, e.offsetY);//creating line according to the mouse pointer
        ctx.stroke();//Drawing fillin line with color
    } else if (selectedTool === "rectangle") {
        drawRect(e)
    } else if (selectedTool === "circle") {
        drawCircle(e)
    } else if (selectedTool === "triangle") {
        drawTriangle(e)
    }else if(selectedTool === "select"){

    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // adding the click event to all tools
        // removing active class from the previous and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => brushwidth = sizeSlider.value);//passing slider value as brush size
// Color palate
colorBtns.forEach(colorbtn => {
    colorbtn.addEventListener("click", () => {
        // adding the click event to color palate
        // removing selected class from the previous and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        colorbtn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor =window.getComputedStyle(colorbtn).getPropertyValue("background-color");
    });
});

// Color picker 
colorPicker.addEventListener("change",() => {
    // passing picked color value from color picker to last btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// Clear the whole canvas
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0,0,canvas.width,canvas.height); // Clearing whole canvas
    setCanvasBackground();
});

// Download the image
saveImage.addEventListener("click", () => {
    const link = document.createElement("a") // creating the a element
    link.download = `${Date.now()}.jpg`; // passing the data as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image 
});

canvas.addEventListener('pointerdown',startDraw);
canvas.addEventListener('pointermove',drawing);
canvas.addEventListener('pointerup', () => isDrawing = false);