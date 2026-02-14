// List of all images in the src folder
const imageFiles = [
    '6089387156506873657.jpg',
    '6089387156506873658.jpg',
    '6089387156506873659.jpg',
    '6089387156506873660.jpg',
    '6089387156506873661.jpg',
    '6089387156506873662.jpg',
    '6089387156506873663.jpg',
    '6089387156506873664.jpg',
    '6089387156506873665.jpg',
    '6089387156506873666.jpg',
    '6089387156506873668.jpg',
    '6089387156506873671.jpg',
    '6089387156506873673.jpg',
    '6089387156506873674.jpg',
    '6089387156506873675.jpg',
    '6089387156506873676.jpg',
    '6089387156506873677.jpg',
    '6089387156506873678.jpg'
];

const captions = [
    'mukhang di naman delikado', 'kasi parang ngumingiti na naman ako', 'kaya ngayon di na ko mangangamba', 'kahit anong sabihin nila', 'Kung meron mang',
    'ngayong nandiyan ka na', 'di magmamadali', 'ikaw lang ang katabi', 'hanggang sa ang buhok ay pumuti',
    'di na maghahanap ng kung anong sagot sa mga tanong', 'dahil ikaw ang katiyakan ko', 'hinding-hindi na ako bibitaw', 'ngayon ikaw na ang kasayaw',
    'kung meron mang kulay', 'ang aking nagsisilbing tanglaw', 'ikaw ikaw ay dilaw', 'ikaw ay dilaw',
    'asim'
];

// Create photo objects with paths and captions
const photos = imageFiles.map((file, index) => ({
    url: `src/${file}`,
    caption: captions[index % captions.length] // Reuse captions if needed
}));

// Function to shuffle an array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Function to create polaroid frames
function createPolaroids() {
    const container = document.getElementById('polaroid-container');
    container.innerHTML = ''; // Clear any existing polaroids
    
    // Shuffle photos for initial display
    const shuffledPhotos = shuffleArray([...photos]);
    
    shuffledPhotos.forEach((photo, index) => {
        const polaroid = document.createElement('div');
        polaroid.className = 'polaroid';
        
        // Random position within the viewport
        const left = 10 + Math.random() * (window.innerWidth - 250);
        const top = 10 + Math.random() * (window.innerHeight - 300);
        
        polaroid.style.left = `${left}px`;
        polaroid.style.top = `${top}px`;
        
        // Add image and caption
        polaroid.innerHTML = `
            <img src="${photo.url}" alt="${photo.caption}">
            <div class="caption">${photo.caption}</div>
        `;
        
        // Make polaroid draggable
        makeDraggable(polaroid);
        
        container.appendChild(polaroid);
    });
}

// Function to update photos in existing frames with a global shuffled set (no duplicates per shuffle)
function shufflePolaroidPhotos() {
    const frames = document.querySelectorAll('.polaroid');
    if (frames.length === 0) return createPolaroids();

    // Create a shuffled copy of the photos
    const shuffled = shuffleArray(photos);

    frames.forEach((frame, index) => {
        const currentImg = frame.querySelector('img');
        const currentCaption = frame.querySelector('.caption');

        if (!currentImg || !currentCaption) return;

        // Pick a photo from the shuffled list, wrap around if there are more frames than photos
        const newPhoto = shuffled[index % shuffled.length];

        // Fade out frame
        frame.style.opacity = '0';
        frame.style.transition = 'opacity 0.3s ease';

        // After fade out, update the image and caption, then fade back in
        setTimeout(() => {
            frame.innerHTML = `
                <img src="${newPhoto.url}" alt="${newPhoto.caption}" style="width: 100%; height: 180px; object-fit: cover;">
                <div class="caption">${newPhoto.caption}</div>
            `;
            frame.style.opacity = '1';

            // Reattach the drag functionality
            makeDraggable(frame);
        }, 300);
    });
}

// Function to make elements draggable
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const questionCard = document.getElementById('question');
    const responseCard = document.getElementById('response');
    
    // Make the No button move away when hovered
    noBtn.addEventListener('mouseover', function() {
        const maxX = window.innerWidth - noBtn.offsetWidth - 20;
        const maxY = window.innerHeight - noBtn.offsetHeight - 20;
        
        noBtn.style.position = 'absolute';
        noBtn.style.left = Math.random() * maxX + 'px';
        noBtn.style.top = Math.random() * maxY + 'px';
    });
    
    // Handle Yes button click
    yesBtn.addEventListener('click', function() {
        questionCard.classList.add('hidden');
        responseCard.classList.remove('hidden');

        // Create polaroids the first time, then shuffle photos every click
        const existingFrames = document.querySelectorAll('.polaroid');
        if (existingFrames.length === 0) {
            createPolaroids();
        }

        // Add floating hearts and tulips animation
        createHearts();

        // Shuffle the photos in the polaroid frames
        shufflePolaroidPhotos();
    });
    
    // Handle No button click (in case they manage to click it)
    noBtn.addEventListener('click', function() {
        // Just for fun, make it a bit harder to click No
        const maxX = window.innerWidth - noBtn.offsetWidth - 20;
        const maxY = window.innerHeight - noBtn.offsetHeight - 20;
        noBtn.style.position = 'absolute';
        noBtn.style.left = Math.random() * maxX + 'px';
        noBtn.style.top = Math.random() * maxY + 'px';
    });
    
    // Create floating hearts and tulips animation
    function createHearts() {
        const colors = ['#ff6b6b', '#ff8e8e', '#ffb3b3', '#ffd8d8'];
        const container = document.querySelector('body');
        
        // Add the animation style if it doesn't exist
        if (!document.getElementById('floatAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'floatAnimationStyle';
            style.textContent = `
                @keyframes floatUp {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
                @keyframes floatUpTulip {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(180deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const isTulip = Math.random() > 0.5; // 50% chance for tulip
                const element = document.createElement('div');
                
                // Set either heart or tulip emoji
                element.innerHTML = isTulip ? '🌷' : '❤️';
                
                // Style the element
                element.style.position = 'fixed';
                element.style.left = Math.random() * 100 + 'vw';
                element.style.top = '100vh';
                element.style.fontSize = (Math.random() * 20 + 20) + 'px';
                element.style.opacity = Math.random() * 0.5 + 0.5;
                // Slightly slower float: duration ~3–6s, delay ~0–3s
                element.style.animation = `${isTulip ? 'floatUpTulip' : 'floatUp'} ${Math.random() * 3 + 3}s linear forwards`;
                element.style.animationDelay = Math.random() * 3 + 's';
                element.style.zIndex = '1'; // Ensure it stays behind the main content
                container.appendChild(element);
                
                // Remove element after animation
                setTimeout(() => {
                    element.remove();
                }, 5000);
            }, i * 100);
        }
    }
});
