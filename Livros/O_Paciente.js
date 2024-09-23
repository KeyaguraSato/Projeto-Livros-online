const url = 'O_Paciente.pdf'; 
let pdfDoc = null;
let currentPage = 1;

const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');

const renderPage = (num) => {
    pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };
        page.render(renderContext);
    });
};

const loadPdf = async () => {
    pdfDoc = await pdfjsLib.getDocument(url).promise;
    renderPage(currentPage);
    updatePageInfo();
};

const updatePageInfo = () => {
    const pageInfo = document.getElementById('page-info');
    pageInfo.textContent = `Página ${currentPage} de ${pdfDoc.numPages}`;
};

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        updatePageInfo();
        window.scrollTo(0, 0);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < pdfDoc.numPages) {
        currentPage++;
        renderPage(currentPage);
        updatePageInfo();
        window.scrollTo(0, 0);
    }
});

loadPdf();
