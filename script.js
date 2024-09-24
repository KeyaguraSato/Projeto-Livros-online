const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const updateTotalTimeDisplay = () => {
    const savedTotalTime1 = localStorage.getItem('totalActiveTime');
    const savedTotalTime2 = localStorage.getItem('livro2_totalActiveTime');
    
    const totalActiveTime1 = savedTotalTime1 ? parseInt(savedTotalTime1) : 0;
    const totalActiveTime2 = savedTotalTime2 ? parseInt(savedTotalTime2) : 0;

    const formattedTime1 = formatTime(totalActiveTime1);
    const formattedTime2 = formatTime(totalActiveTime2);
    
    document.getElementById('total-time-info').textContent = `Tempo lido: ${formattedTime1}`;
    document.getElementById('total-time-info-livro2').textContent = `Tempo lido: ${formattedTime2}`;

    const totalActiveTime = totalActiveTime1 + totalActiveTime2;
    document.querySelector('.times span').textContent = formatTime(totalActiveTime);
};

document.addEventListener('DOMContentLoaded', updateTotalTimeDisplay);

const resetTimes = () => {
    localStorage.removeItem('totalActiveTime');
    updateTotalTimeDisplay();
};

const resetTimesLivro2 = () => {
    localStorage.removeItem('livro2_totalActiveTime');
    updateTotalTimeDisplay();
};

document.addEventListener('DOMContentLoaded', () => {
    updateTotalTimeDisplay();

    document.getElementById('reset-time').addEventListener('click', resetTimes);
    document.getElementById('reset-time-livro2').addEventListener('click', resetTimesLivro2);
});
