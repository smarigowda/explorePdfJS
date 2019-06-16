console.log("...PDFConverter");

const path2pdf = "./src/doc/chemistry.pdf";
let pdfDoc = null;
const scale = 1.5;
const newPdf = new jsPDF(); // loaded by script tag

// renderPage()
function renderPage(num) {
  return new Promise((resolve, reject) => {
    // addNewCanvasToHTMLPage()
    const element = document.createElement("canvas");
    element.setAttribute("id", `the-canvas-${num}`);
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
        ctx.fillRect(0, 0, 2000, 130);
        if (num === 1) {
          // maskDetailInCanvas()
          ctx.fillRect(0, 440, 2000, 2000);
        }
        // Add the masked canvas as a new page into the pdf document
        // addMaskedCanvasToNewPDF
        newPdf.addImage(
          document.getElementById(`the-canvas-${num}`).toDataURL("image/png"),
          "PNG",
          0,
          0,
          211,
          298
        );
        resolve();
      });
    });
  });
}

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
  newPdf.save("converted3.pdf");
});
