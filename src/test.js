console.log("...PDFConverter");

let pdfDoc = null;
const scale = 1.5;

const doc2 = new jsPDF(); // loaded by script tag

function renderPage(num) {
  return new Promise((resolve, reject) => {
    const element = document.createElement("canvas");
    element.setAttribute("id", `the-canvas-${num}`);
    document.body.appendChild(element);

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

      renderTask.promise.then(function() {
        let ctx4 = document
          .getElementById(`the-canvas-${num}`)
          .getContext("2d");
        // console.log(`${num}....ctx4`, ctx4);
        ctx4.fillStyle = "white";
        // ctx4.fillStyle = "red";
        ctx4.fillRect(0, 0, 2000, 130);
        if (num === 1) {
          // mask the heading as well
          ctx4.fillRect(0, 440, 2000, 2000);
        }
        // now resolve the promise
        doc2.addImage(
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

const url = "./src/doc/chemistry.pdf";
/**
 * Asynchronously downloads PDF.
 */
pdfjsLib.getDocument(url).promise.then(async doc => {
  pdfDoc = doc;
  console.log("total number of pages = ", pdfDoc.numPages);
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    await renderPage(i);
    i !== pdfDoc.numPages ? doc2.addPage() : null;
  }
  doc2.save("converted3.pdf");
});
