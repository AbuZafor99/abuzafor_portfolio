window.addEventListener('DOMContentLoaded', (event) => {
    var cvBtns = [
        document.getElementById('downloadCvBtn'),
        document.getElementById('navCvBtn'),
        document.getElementById('mobCvBtn')
    ].filter(Boolean);

    var toast = document.getElementById('toast');
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 3000);
    }

    function downloadPDF(e) {
        e.preventDefault();
        
        showToast('Downloading your CV...');

        try {
            // Create a hidden link element and trigger download
            var link = document.createElement('a');
            link.href = 'Abu_Zafor_CV_FlutterDeveloper.pdf';
            link.download = 'Abu_Zafor_CV_FlutterDeveloper.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('CV downloaded successfully!');
        } catch(err) {
            console.error(err);
            showToast('Error downloading CV. Please try again.');
        }
    }

    cvBtns.forEach(btn => btn.addEventListener('click', downloadPDF));
});