       // Variables for pagination
       let currentPage = 1;
       const lessonsPerPage = 100;
       let filteredGames = [];
       let searchQuery = '';
       
       // Load a lesson
       function loadGame(lessonId) {
           // Find the lesson data
           const lesson = lessonsData.find(g => g.lesson === lessonId);
           if (!lesson) return;
           
           // Update iframe src
           document.getElementById('lessonFrame').src = `https://classroom.mathify.space/lessons/${lesson.lesson}`;
           
           // Update lesson title
           document.getElementById('lesson-title').textContent = lesson.name;
           
           // Show lesson window
           const lessonWindow = document.getElementById('lessonWindowRow');
           lessonWindow.style.display = 'flex';
           
           // Add visible class after a small delay (for animation)
           setTimeout(() => {
               lessonWindow.classList.add('visible');
           }, 50);
           
           // Scroll to lesson window
           lessonWindow.scrollIntoView({ behavior: 'smooth', block: 'start' });
           
           // Make lesson window sticky after scrolling
           setTimeout(() => {
               document.querySelector('.card').classList.add('fixed-lesson');
           }, 500);
       }
       
       // Search lessons
       function searchGames(query) {
           searchQuery = query.toLowerCase();
           currentPage = 1;
           applyFilters();
       }
       
       // Apply search filters
       function applyFilters() {
           // Hide lesson window when filters change
           document.getElementById('lessonWindowRow').style.display = 'none';
           document.getElementById('lessonWindowRow').classList.remove('visible');
           
           // Clear existing lessons
           const lessonsGrid = document.getElementById('lessonsGrid');
           lessonsGrid.innerHTML = '';
           
           // Filter lessons data
           filteredGames = lessonsData.filter(lesson => {
               const lessonTitle = lesson.name.toLowerCase();
               return searchQuery === '' || lessonTitle.includes(searchQuery);
           });
           
           // Show first batch of lessons
           renderGames();
           
           // Show/hide load more button
           const loadMoreBtn = document.getElementById('loadMoreBtn');
           if (filteredGames.length > currentPage * lessonsPerPage) {
               loadMoreBtn.classList.remove('d-none');
           } else {
               loadMoreBtn.classList.add('d-none');
           }
           
           // Show "no lessons found" message if needed
           if (filteredGames.length === 0) {
               const messageDiv = document.createElement('div');
               messageDiv.className = 'col-12';
               messageDiv.innerHTML = '<div class="alert alert-info">No lessons found matching your criteria.</div>';
               lessonsGrid.appendChild(messageDiv);
           }
       }
       
       // Render lessons for current page
       function renderGames() {
           const lessonsGrid = document.getElementById('lessonsGrid');
           const template = document.getElementById('lesson-item-template');
           
           // Calculate start and end indices for current page
           const startIndex = 0;
           const endIndex = currentPage * lessonsPerPage;
           
           // Get lessons for current page
           const lessonsToShow = filteredGames.slice(startIndex, endIndex);
           
           // Render each lesson
           lessonsToShow.forEach(lesson => {
               // Clone template
               const lessonItem = template.content.cloneNode(true);
               
               // Set lesson data
               const card = lessonItem.querySelector('.lesson-card');
               card.dataset.lessonId = lesson.lesson;
               card.dataset.lessonUrl = lesson.url;
               card.dataset.lessonName = lesson.name;
               
               // Set image
               const img = lessonItem.querySelector('img');
               img.src = `https://classroom.mathify.space/lessons-img/${lesson.lesson}.webp`;
               img.alt = lesson.name;
               
               // Add event listener
               lessonItem.querySelector('.lesson-card').addEventListener('click', function() {
                   loadGame(this.dataset.lessonId);
               });
               
               // Append to grid
               lessonsGrid.appendChild(lessonItem);
           });
           
           // Lazy load images
           lazyLoadImages();
       }
       
       // Load more lessons
       function loadMoreGames() {
           currentPage++;
           renderGames();
           
           // Hide load more button if no more lessons
           if (filteredGames.length <= currentPage * lessonsPerPage) {
               document.getElementById('loadMoreBtn').classList.add('d-none');
           }
       }
       
       // Lazy load images
       function lazyLoadImages() {
           const lazyImages = document.querySelectorAll('.lazy-load:not(.loaded)');
           
           lazyImages.forEach(img => {
               if (isInViewport(img)) {
                   img.classList.add('loaded');
               }
           });
       }
       
       // Check if element is in viewport
       function isInViewport(element) {
           const rect = element.getBoundingClientRect();
           return (
               rect.top >= 0 &&
               rect.left >= 0 &&
               rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
               rect.right <= (window.innerWidth || document.documentElement.clientWidth)
           );
       }
       
       // Close lesson window
       function closeGameWindow() {
           const lessonWindow = document.getElementById('lessonWindowRow');
           lessonWindow.classList.remove('visible');
           
           // Hide after animation
           setTimeout(() => {
               lessonWindow.style.display = 'none';
               document.getElementById('lessonFrame').src = '';
               document.querySelector('.card').classList.remove('fixed-lesson');
           }, 500);
       }
       
       // Fullscreen functionality
       function toggleFullscreen() {
           const lessonContainer = document.querySelector('.lesson-container');
           
           if (!document.fullscreenElement) {
               if (lessonContainer.requestFullscreen) {
                   lessonContainer.requestFullscreen();
               } else if (lessonContainer.mozRequestFullScreen) { /* Firefox */
                   lessonContainer.mozRequestFullScreen();
               } else if (lessonContainer.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                   lessonContainer.webkitRequestFullscreen();
               } else if (lessonContainer.msRequestFullscreen) { /* IE/Edge */
                   lessonContainer.msRequestFullscreen();
               }
           } else {
               if (document.exitFullscreen) {
                   document.exitFullscreen();
               } else if (document.mozCancelFullScreen) { /* Firefox */
                   document.mozCancelFullScreen();
               } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
                   document.webkitExitFullscreen();
               } else if (document.msExitFullscreen) { /* IE/Edge */
                   document.msExitFullscreen();
               }
           }
       }
       
       // Reload current lesson
       function reloadGame() {
           const iframe = document.getElementById('lessonFrame');
           iframe.src = iframe.src;
       }
       
       // Handle scroll events for lazy loading
       function handleScroll() {
           // Lazy load images
           lazyLoadImages();
           
           // Auto-load more lessons when scrolling near bottom
           if (document.getElementById('loadMoreBtn').classList.contains('d-none')) return;
           
           const scrollPos = window.scrollY + window.innerHeight;
           const pageHeight = document.body.offsetHeight;
           const loadMoreThreshold = pageHeight - 500;
           
           if (scrollPos >= loadMoreThreshold) {
               loadMoreGames();
           }
       }
       
       // Event Listeners
       document.addEventListener('DOMContentLoaded', function() {
           // Initialize by showing first batch of lessons
           applyFilters();
           
           // Search form submit
           document.getElementById('searchForm').addEventListener('submit', function(e) {
               e.preventDefault();
               const query = document.getElementById('searchInput').value;
               searchGames(query);
           });
           
           // Search input live search
           document.getElementById('searchInput').addEventListener('input', function() {
               searchGames(this.value);
           });
           
           // Load more button
           document.getElementById('loadMoreBtn').addEventListener('click', loadMoreGames);
           
           // Close lesson buttons
           document.getElementById('closeGameBtn').addEventListener('click', closeGameWindow);
           document.getElementById('mobileCloseBtn').addEventListener('click', closeGameWindow);
           
           // Scroll event for lazy loading
           window.addEventListener('scroll', handleScroll);
       });