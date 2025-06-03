const videoPlayer = document.getElementById('videoPlayer');
videoPlayer.controls = false;
videoPlayer.autoplay = true;
videoPlayer.loop = true;
videoPlayer.muted = true;

// Create an image element
const imageElement = document.createElement('img');
imageElement.id = 'imageDisplay';
imageElement.style.display = 'none';
document.querySelector('.video-container').appendChild(imageElement);

let mediaFiles = [];
let currentIndex = 0;
let isLoading = false;

// Initialize the media player
function initMediaPlayer() {
    loadMedia();
    setupKeyboardControls();
}

// Load media files from a single directory
function loadMedia() {
    // Check if we're running via http-server
    if (window.location.protocol === 'file:') {
        showMessage("Please run this site using a web server (http-server, etc.)");
        return;
    }

    // Load all media from a single folder
    loadMediaFromDirectory('media/')
        .then(files => {
            // Process files and determine their type
            mediaFiles = files.map(file => {
                const ext = file.split('.').pop().toLowerCase();
                const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
                
                return {
                    type: isVideo ? 'video' : 'image',
                    path: 'media/' + file,
                    name: file
                };
            }).sort((a, b) => a.name.localeCompare(b.name));
            
            if (mediaFiles.length > 0) {
                playMedia(0);
            } else {
                showMessage("No media files found. Add videos and images to the 'media' folder.");
            }
        })
        .catch(error => {
            console.error("Error loading media:", error);
            showMessage("Error loading media. Make sure you're running this through a web server with directory listing enabled.");
        });
}

// Load files from a directory
function loadMediaFromDirectory(directory) {
    return fetch(directory)
        .then(response => response.text())
        .then(html => {
            // Parse HTML to extract files
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'));
            
            // Filter for appropriate file types
            return links
                .map(link => link.href)
                .filter(href => {
                    const ext = href.split('.').pop().toLowerCase();
                    return ['mp4', 'webm', 'ogg', 'mov', 'jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
                })
                .map(href => {
                    // Extract just the filename
                    const parts = href.split('/');
                    return parts[parts.length - 1];
                });
        })
        .catch(error => {
            console.warn(`Directory ${directory} might not exist or has no files:`, error);
            return [];
        });
}

function showMessage(message) {
    const instructions = document.createElement('div');
    instructions.textContent = message;
    instructions.style.position = 'fixed';
    instructions.style.top = '40px';
    instructions.style.left = '10px';
    instructions.style.zIndex = '100';
    instructions.style.background = 'rgba(0,0,0,0.7)';
    instructions.style.color = 'white';
    instructions.style.padding = '10px';
    document.body.appendChild(instructions);
}

// Play the media at the specified index
function playMedia(index) {
    if (mediaFiles.length === 0) return;
    if (isLoading) return;
    
    isLoading = true;
    currentIndex = index;
    const media = mediaFiles[index];
    
    console.log(`Playing ${media.type}: ${media.path}`);
    
    // Hide both elements first
    videoPlayer.style.display = 'none';
    imageElement.style.display = 'none';
    
    if (media.type === 'video') {
        // Show and play video
        videoPlayer.src = media.path;
        videoPlayer.style.display = 'block';
        
        videoPlayer.oncanplay = () => {
            isLoading = false;
            videoPlayer.play().catch(err => {
                console.error("Error playing video:", err);
                setTimeout(() => videoPlayer.play().catch(e => console.error(e)), 1000);
            });
        };
        
        videoPlayer.onerror = (e) => {
            console.error("Video error:", videoPlayer.error);
            isLoading = false;
            showMessage(`Error playing video: ${media.name}. Trying next media...`);
            setTimeout(playNextMedia, 2000);
        };
    } else {
        // Show image
        imageElement.src = media.path;
        imageElement.style.display = 'block';
        isLoading = false;
    }
}

// Play the next media in the list
function playNextMedia() {
    if (isLoading) return;
    const nextIndex = (currentIndex + 1) % mediaFiles.length;
    playMedia(nextIndex);
}

// Set up keyboard controls
function setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent space from scrolling the page
            playNextMedia();
        }
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMediaPlayer();
});