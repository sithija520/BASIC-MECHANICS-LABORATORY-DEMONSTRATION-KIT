    // js/script.js

    document.addEventListener('DOMContentLoaded', function() {

        console.log('Mechanism Kit Website Script Loaded');
        const langToggleButton = document.getElementById('lang-toggle-btn');

        // Function to set the language
        function setLanguage(lang) {
            // Select all elements that have language data attributes
            const elements = document.querySelectorAll('[data-lang-en]');

            elements.forEach(el => {
                // Temporarily reduce opacity for transition effect
                el.style.opacity = '0';

                setTimeout(() => {
                    // Get the text for the selected language
                    const text = el.getAttribute(`data-lang-${lang}`);
                    if (text !== null) {
                        // Always use innerHTML to correctly render HTML tags within the translated text
                        el.innerHTML = text;
                    }
                    // Restore opacity
                    el.style.opacity = '1';
                }, 150); // Match half the transition duration approx.
            });

            // Update the HTML lang attribute
            document.documentElement.lang = lang;

            // Update the toggle button text/state
            if (langToggleButton) {
                if (lang === 'en') {
                    langToggleButton.textContent = 'සිංහල'; // Show option to switch to Sinhala
                    langToggleButton.setAttribute('data-switch-to', 'si');
                } else {
                    langToggleButton.textContent = 'English'; // Show option to switch to English
                    langToggleButton.setAttribute('data-switch-to', 'en');
                }
            }

            // Save preference to localStorage
            try {
                localStorage.setItem('preferredLang', lang);
            } catch (e) {
                console.error("LocalStorage is not available or full:", e);
                // Handle the error gracefully, maybe show a message to the user
            }

            console.log(`Language set to: ${lang}`);
        }

        // Event listener for the toggle button
        if (langToggleButton) {
            langToggleButton.addEventListener('click', function() {
                const switchToLang = langToggleButton.getAttribute('data-switch-to');
                if (switchToLang) {
                    setLanguage(switchToLang);
                }
            });
        }

        // Initial language load
        let preferredLang = 'en'; // Default to English
        try {
            const storedLang = localStorage.getItem('preferredLang');
            if (storedLang && (storedLang === 'en' || storedLang === 'si')) {
                preferredLang = storedLang;
            }
        } catch (e) {
            console.error("Could not read from LocalStorage:", e);
            // Stick to default 'en'
        }

        setLanguage(preferredLang); // Set the initial language based on preference or default

        // Function to set the current year in the footer
        function setFooterYear() {
            const yearSpans = document.querySelectorAll('.current-year');
            if (yearSpans) {
                yearSpans.forEach(span => {
                    span.textContent = new Date().getFullYear();
                });
            }
        }

        setFooterYear(); // Call the function to set the year when the page loads

        // Note: The chart-related JavaScript (addDataToChartM) seems incomplete or misplaced
        // as it's outside the main DOMContentLoaded listener and references 'camMonitorChart'
        // which is not defined in this provided script.
        // Ensure camMonitorChart is initialized before this function is called.
        // Example:
        // let camMonitorChart;
        // function initializeChart() { /* ... chart initialization code ... */ }
        // initializeChart();
    });

    // The following chart-related code was outside the DOMContentLoaded listener.
    // It should ideally be within it or managed carefully regarding variable scope and execution timing.
    // For now, I'm leaving it as it was, but it might need review based on your full project structure.

    const MAX_DATA_POINTS = 150; // ප්‍රස්තාරයේ එකවර පෙන්වන උපරිම දත්ත ලක්ෂ්‍ය ගණන (අවශ්‍ය පරිදි සකසන්න)

    // This function assumes 'camMonitorChart' is a globally accessible Chart.js instance.
    // Ensure 'camMonitorChart' is initialized before this function is called.
    function addDataToChartM(timeOrSample, displacement) { 
        if (typeof camMonitorChart === 'undefined' || !camMonitorChart) {
            console.error("camMonitorChart is not initialized.");
            return;
        }
        
        const labels = camMonitorChart.data.labels;
        const dataPoints = camMonitorChart.data.datasets[0].data;

        labels.push(timeOrSample);
        dataPoints.push(displacement);

        while (labels.length > MAX_DATA_POINTS) {
            labels.shift(); 
            dataPoints.shift(); 
        }
        
        camMonitorChart.update('none'); 
    }






    /* Preloader Logic */
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return; // preloader එක නොමැති නම්, script එක නවත්වන්න

    const loaderIconEl = preloader.querySelector('.loader-icon i');

    // එක් එක් පිටුවට අදාළ icon එක මෙහි define කරන්න
    const pageIcons = {
        'default': 'fas fa-spinner',
        'index.html': 'fas fa-home',
        'assembly.html': 'fas fa-wrench',
        'mechanisms': 'fas fa-cogs',
        'experiments.html': 'fas fa-flask',
        'Monitor.html': 'fas fa-chart-line',
        'Tension display.html': 'fas fa-tachometer-alt',
        'about.html': 'fas fa-info-circle',
        'Electronics.html': 'fas fa-microchip'
    };

    // Preloader එක trigger කල යුතු සියලුම links තෝරාගන්න
    const triggerLinks = document.querySelectorAll('a:not([data-bs-toggle="modal"]):not([data-bs-toggle="dropdown"])');

    triggerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const destinationUrl = this.getAttribute('href');
            
            // පිටුවක් වෙත යන link එකක් පමණක් දැයි පරීක්ෂා කරන්න
            if (destinationUrl && destinationUrl !== '#' && !destinationUrl.startsWith('javascript:')) {
                e.preventDefault(); // link එකේ ක්ෂණික ක්‍රියාව නැවැත්වීම

                let iconClass = pageIcons.default; // Default icon
                // URL එකට ගැලපෙන icon එක සොයාගැනීම
                for (const pageKey in pageIcons) {
                    if (destinationUrl.includes(pageKey)) {
                        iconClass = pageIcons[pageKey];
                        break;
                    }
                }

                // අදාළ icon එක යොදා preloader එක පෙන්වීම
                if (loaderIconEl) {
                    loaderIconEl.className = iconClass;
                }
                preloader.classList.add('show');

                // animation එක පෙන්වීමට තත්පර 0.6ක් ලබා දී පිටුවට පිවිසීම
                setTimeout(() => {
                    window.location.href = destinationUrl;
                }, 600); 
            }
        });
    });

    // පිටුව සම්පූර්ණයෙන් load වූ පසු preloader එක සඟවන්න
    window.addEventListener('pageshow', function(event) {
        // 'persisted' property එකෙන් back/forward button එකෙන් ආවේ දැයි දැනගත හැක
        if (event.persisted) {
            preloader.classList.remove('show');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const mainHeading = document.querySelector('.hero-section-frosted h1');
    
    if (mainHeading) {
        // This makes sure the animation is applied only to the English version
        const englishText = "Mechanism Demonstrator Kit!";
        if (mainHeading.textContent.includes(englishText)) {
            const newHTML = mainHeading.innerHTML.replace(
                englishText, 
                `<span class="animated-gold-text">${englishText}</span>`
            );
            mainHeading.innerHTML = newHTML;
        }

        // You might need to add similar logic if you want the Sinhala text animated too
        // For example:
        // const sinhalaText = "යාන්ත්‍රණ නිරූපණ කට්ටලයට";
        // if (mainHeading.textContent.includes(sinhalaText)) {
        //     const newHTML = mainHeading.innerHTML.replace(
        //         sinhalaText, 
        //         `<span class="animated-gold-text">${sinhalaText}</span>`
        //     );
        //     mainHeading.innerHTML = newHTML;
        // }
    }
    
    // ... (Your other script.js code like preloader, etc. should remain here)
});










/* === Logic for 3D Model Gallery (with In-Modal Loader) === */
document.addEventListener('DOMContentLoaded', function() {
    const modelGalleryModal = document.getElementById('modelGalleryModal');
    if (!modelGalleryModal) return;

    const modalLoader = modelGalleryModal.querySelector('.modal-loader');
    const modelSelectButtons = modelGalleryModal.querySelectorAll('.model-select-btn');
    const modalTitle = modelGalleryModal.querySelector('#modal-main-title');
    
    // Wrappers
    const singleViewerWrapper = modelGalleryModal.querySelector('#single-viewer-wrapper');
    const splitViewerWrapper = modelGalleryModal.querySelector('#split-viewer-wrapper');

    // Viewers
    const mainModelViewer = modelGalleryModal.querySelector('#main-model-viewer');
    const leftViewer = modelGalleryModal.querySelector('#left-viewer');
    const rightViewer = modelGalleryModal.querySelector('#right-viewer');
    const leftViewerTitle = modelGalleryModal.querySelector('#left-viewer-title');
    const rightViewerTitle = modelGalleryModal.querySelector('#right-viewer-title');

    modelSelectButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Show loader immediately
            if (modalLoader) modalLoader.classList.add('is-loading');

            const viewType = this.getAttribute('data-view-type');
            const mainTitle = this.getAttribute('data-main-title') || this.textContent.trim();

            modelSelectButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if(modalTitle) modalTitle.textContent = mainTitle;

            if (viewType === 'split') {
                singleViewerWrapper.classList.add('d-none');
                splitViewerWrapper.classList.remove('d-none');

                const leftTitle = this.getAttribute('data-left-title');
                const leftSrc = this.getAttribute('data-left-src');
                const rightTitle = this.getAttribute('data-right-title');
                const rightSrc = this.getAttribute('data-right-src');
                
                if (leftViewerTitle) leftViewerTitle.textContent = leftTitle;
                if (leftViewer) leftViewer.src = leftSrc;
                if (rightViewerTitle) rightViewerTitle.textContent = rightTitle;
                if (rightViewer) rightViewer.src = rightSrc;

                // Wait for BOTH models to finish loading
                Promise.all([leftViewer.updateComplete, rightViewer.updateComplete]).then(() => {
                    if (modalLoader) modalLoader.classList.remove('is-loading');
                });

            } else { // Single View
                splitViewerWrapper.classList.add('d-none');
                singleViewerWrapper.classList.remove('d-none');

                const newSrc = this.getAttribute('data-model-src');
                
                // Hide loader only when the new model is fully loaded
                mainModelViewer.addEventListener('load', () => {
                    if (modalLoader) modalLoader.classList.remove('is-loading');
                }, { once: true }); // Use {once: true} to prevent this from firing multiple times

                if (mainModelViewer) mainModelViewer.src = newSrc;
            }
        });
    });
});














/* ==========================================================
   Animation Logic for Opening the 3D Model Modal
   ========================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const openModelBtn = document.getElementById('openModelViewerBtn');
    const preloader = document.getElementById('preloader');

    // Make sure both the button and the preloader exist
    if (openModelBtn && preloader) {
        openModelBtn.addEventListener('click', function() {
            const loaderIcon = preloader.querySelector('.loader-icon i');

            // 1. Show the preloader with a specific icon for 3D models
            if (loaderIcon) {
                loaderIcon.className = 'fas fa-cubes fa-spin';
            }
            preloader.classList.add('show');

            // 2. Hide the preloader after a short delay to create the animation effect
            // The modal is already opened in the background by Bootstrap's default action.
            setTimeout(function() {
                preloader.classList.remove('show');
            }, 700); // 0.7 second delay
        });
    }
});