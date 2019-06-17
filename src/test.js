console.log("...PDFConverter");

let pdfFileName = null;
let detailMaskTop = null;
let headerMaskHeight = null;
const saveNewPDF = false;
let pdfDoc = null;
const scale = 1;
const newPdf = new jsPDF('p', 'pt','a4',true); // loaded by script tag

// renderPage()
function renderPage(num) {
  return new Promise((resolve, reject) => {
    // addNewCanvasToHTMLPage()
    const element = document.createElement("canvas");
    element.setAttribute("id", `the-canvas-${num}`);
    element.setAttribute("class", `the-canvas`);
    document.body.appendChild(element);

    // renderPageIntoCanvas()
    let canvas = document.getElementById(`the-canvas-${num}`);
    const ctx = canvas.getContext("2d");
    pdfDoc.getPage(num).then(function(page) {
      const viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      const renderTask = page.render(renderContext);
      // mask()
      renderTask.promise.then(function() {
        ctx.fillStyle = "white";
        // ctx4.fillStyle = "red";
        // maskHeaderInCanvas()
        ctx.fillRect(0, 0, 2000, headerMaskHeight);
        if (num === 1) {
          // maskDetailInCanvas()
          ctx.fillRect(0, detailMaskTop, 2000, 2000);
        }
        // Add the masked canvas as a new page into the pdf document
        // addMaskedCanvasToNewPDF
        newPdf.addImage(
          document.getElementById(`the-canvas-${num}`).toDataURL("image/png"),
          "PNG",
          0,
          0,
          viewport.width,
          viewport.height,
          '',
          'FAST'
        );
        resolve();
      });
    });
  });
}

const inputElement = document.getElementById("input");
inputElement.addEventListener("change", handleFile, false);

function handleFile() {
  const fileList = this.files; /* now you can work with the file list */
  console.log(fileList);
  console.log("file name = ", fileList[0].name);
  pdfFileName = fileList[0].name;
  renderPages();
}
console.log("inputElement...", inputElement);

const renderAgainButton = document.getElementById("render-again");
renderAgainButton.addEventListener("click", handleRenderAgain, false);

function handleRenderAgain() {
  document.querySelectorAll(".the-canvas").forEach(d => {
    console.log(d);
    d.remove();
  });
  document.getElementById("save-button").remove();
  renderPages();
}

function renderPages() {
  const path2pdf = `./src/doc/${pdfFileName}`;

  const maskTop = document.getElementById("detail_mask_top");
  console.dir(maskTop);
  console.log("valueAsNumber", maskTop.valueAsNumber);
  detailMaskTop = maskTop.valueAsNumber;

  const headerMask = document.getElementById("header_mask_height");
  console.log(headerMask);
  headerMaskHeight = headerMask.valueAsNumber;

  /**
   * Asynchronously downloads PDF.
   */
  // run()
  pdfjsLib.getDocument(path2pdf).promise.then(async doc => {
    pdfDoc = doc;
    console.log("total number of pages = ", pdfDoc.numPages);
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      await renderPage(i);
      i !== pdfDoc.numPages ? newPdf.addPage() : null;
    }
    const button = document.createElement("button");
    button.setAttribute("id", `save-button`);
    button.innerHTML = "Save PDF Now";
    document.body.appendChild(button);
    button.addEventListener("click", handleSave, false);
    function handleSave() {
      newPdf.save(`${pdfFileName}`);
    }
  });
}
