console.log("...testing ok");

// Loaded via <script> tag, create shortcut to access PDF.js exports.
let pdfjs = window["pdfjs-dist/build/pdf"];

// The workerSrc property shall be specified.
// pdfjs.GlobalWorkerOptions.workerSrc =
//   "//mozilla.github.io/pdf.js/build/pdf.worker.js";

let pdfDoc = null;
let scale = 1;

function renderPage(num) {
  return new Promise((resolve, reject) => {
    let element = document.createElement("canvas");
    element.setAttribute("id", `the-canvas-${num}`);
    document.body.appendChild(element);

    let canvas = document.getElementById(`the-canvas-${num}`);
    let ctx = canvas.getContext("2d");
    pdfDoc.getPage(num).then(function(page) {
      const viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);

      renderTask.promise.then(function() {
        let ctx4 = document
          .getElementById(`the-canvas-${num}`)
          .getContext("2d");
        // console.log(`${num}....ctx4`, ctx4);
        ctx4.fillStyle = "white";
        ctx4.fillRect(0, 0, 2000, 130);
        // now resolve the promise
        resolve();
      });
    });
  });
}

let url = "./src/doc/chemistry.pdf";
/**
 * Asynchronously downloads PDF.
 */
pdfjsLib.getDocument(url).promise.then(async function(doc) {
  pdfDoc = doc;
  console.log("total number of pages = ", pdfDoc.numPages);
  for (let i = 1; i <= 9; i++) {
    await renderPage(i);
  }
});
