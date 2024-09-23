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

let sessionStartTime;
let totalActiveTime = 0;
let lastSessionTime = 0;

const loadTimes = () => {
    const savedTotalTime = localStorage.getItem('totalActiveTime');
    totalActiveTime = savedTotalTime ? parseInt(savedTotalTime) : 0;
    updateTotalTimeDisplay();

    const savedLastSessionTime = localStorage.getItem('lastSessionTime');
    lastSessionTime = savedLastSessionTime ? parseInt(savedLastSessionTime) : 0;
    updateLastSessionTimeDisplay();
};

const updateTotalTimeDisplay = () => {
    const formattedTime = formatTime(totalActiveTime);
    document.getElementById('total-time-info').textContent = `Tempo total: ${formattedTime}`;
};

const updateLastSessionTimeDisplay = () => {
    const formattedTime = formatTime(lastSessionTime);
    document.getElementById('last-session-info').textContent = `Tempo da última sessão: ${formattedTime}`;
};

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const saveTotalTime = () => {
    localStorage.setItem('totalActiveTime', totalActiveTime);
};

const saveLastSessionTime = (duration) => {
    localStorage.setItem('lastSessionTime', duration);
};

const startSessionTimer = () => {
    sessionStartTime = Date.now();
};

const endSessionTimer = () => {
    const sessionEndTime = Date.now();
    const sessionDuration = Math.floor((sessionEndTime - sessionStartTime) / 1000);
    
    totalActiveTime += sessionDuration;
    saveTotalTime();

    lastSessionTime = sessionDuration;
    saveLastSessionTime(lastSessionTime);

    updateTotalTimeDisplay();
    updateLastSessionTimeDisplay();
};

const resetTimes = () => {
    localStorage.removeItem('totalActiveTime');
    localStorage.removeItem('lastSessionTime');
    totalActiveTime = 0;
    lastSessionTime = 0;
    updateTotalTimeDisplay();
    updateLastSessionTimeDisplay();
};

document.addEventListener('DOMContentLoaded', () => {
    loadTimes();
    startSessionTimer();

    setInterval(() => {
        const currentTime = Math.floor((Date.now() - sessionStartTime) / 1000);
        document.getElementById('time-info').textContent = `Tempo desta sessão: ${formatTime(currentTime)}`;
    }, 1000);

    window.addEventListener('beforeunload', endSessionTimer);

    document.getElementById('reset-time').addEventListener('click', resetTimes);
});

