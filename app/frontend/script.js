const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const mainCard = document.getElementById('mainCard');
const processingFileName = document.getElementById('processingFileName');
const downloadBtn = document.getElementById('downloadBtn');
const errorMessage = document.getElementById('errorMessage');

// Drag and Drop Events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false); // Prevent browser default on body too
});

// Click to upload (covers the whole area including the button)
dropzone.addEventListener('click', () => fileInput.click());

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropzone.classList.add('dragover');
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
    }
}

function unhighlight(e) {
    dropzone.classList.remove('dragover');
}

dropzone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

fileInput.addEventListener('change', function () {
    handleFiles(this.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        uploadFile(files[0]);
    }
}

function uploadFile(file) {
    if (file.type !== 'application/pdf') {
        showError('Please select a valid PDF file.');
        return;
    }

    // Update UI to processing state
    mainCard.classList.add('processing');
    mainCard.classList.remove('success', 'error');
    processingFileName.textContent = file.name;

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/clean', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.detail || 'Processing failed'); });
            }

            // Get the filename from the header if possible, or default
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'cleaned_' + file.name;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            return response.blob().then(blob => ({ blob, filename }));
        })
        .then(({ blob, filename }) => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            downloadBtn.href = url;
            downloadBtn.download = filename;

            // Update UI to success state
            mainCard.classList.remove('processing');
            mainCard.classList.add('success');
        })
        .catch(error => {
            console.error('Error:', error);
            showError(error.message || 'An error occurred while processing the PDF.');
        });
}

function showError(message) {
    mainCard.classList.remove('processing', 'success');
    mainCard.classList.add('error');
    errorMessage.textContent = message;
}

function resetApp() {
    mainCard.classList.remove('processing', 'success', 'error');
    fileInput.value = ''; // Clear input
}
