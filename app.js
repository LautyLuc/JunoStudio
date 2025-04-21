document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const bars = document.querySelectorAll('.bar');
    const buttons = document.querySelectorAll('.slide-content button');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Función para actualizar el slider
    function updateSlider() {
        const slideWidth = slides[0].offsetWidth;
        const slideMargin = parseFloat(getComputedStyle(slides[0]).marginRight) + 
                           parseFloat(getComputedStyle(slides[0]).marginLeft);
        const totalWidth = slideWidth + slideMargin;
        
        // Centrar el slide activo con un poco de offset para mostrar el anterior y siguiente
        const offset = -currentIndex * totalWidth + (slider.offsetWidth - slideWidth) / 4;
        
        // Movemos el slider
        slider.style.transform = `translateX(${offset}px)`;
        
        // Actualizamos las clases active
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Actualizamos las barritas
        bars.forEach((bar, index) => {
            if (index === currentIndex) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
    }
    
    // Función para ir a la siguiente diapositiva
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
    
    // Función para ir a la diapositiva anterior
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // Iniciar autoplay
    function startAutoplay() {
        stopAutoplay(); // Detener si ya existe
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    // Detener autoplay
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // Event listener para el botón anterior
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prevSlide();
        // Reinicia el intervalo al interactuar
        startAutoplay();
    });
    
    // Event listener para el botón siguiente
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        nextSlide();
        // Reinicia el intervalo al interactuar
        startAutoplay();
    });
    
    // Event listeners para las barritas
    bars.forEach(bar => {
        bar.addEventListener('click', function() {
            currentIndex = parseInt(this.dataset.index);
            updateSlider();
            // Reinicia el intervalo al interactuar
            startAutoplay();
        });
    });
    
    // Event listeners para los slides (clic para navegar)
    slides.forEach((slide, index) => {
        slide.addEventListener('click', function(e) {
            // Si el clic fue en el botón, no cambiamos de slide
            if (e.target.tagName === 'BUTTON') {
                return;
            }
            
            if (index !== currentIndex) {
                currentIndex = index;
                updateSlider();
                startAutoplay();
            }
        });
    });
    
    // Event listeners para los botones dentro de los slides
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se propague al slide
            console.log('Botón clickeado:', this.textContent);
            // Aquí puedes agregar el código que se ejecutará al hacer clic en el botón
        });
    });
    
    // Soporte para navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
        }
    });
    
    // Soporte para navegación táctil (swipe)
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe izquierda (siguiente)
            nextSlide();
            startAutoplay();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe derecha (anterior)
            prevSlide();
            startAutoplay();
        }
    }
    
    // Pausar autoplay al pasar el mouse por encima
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    // Función para manejar cambios de tamaño de ventana
    function handleResize() {
        updateSlider();
    }
    
    window.addEventListener('resize', handleResize);
    
    // Inicializar el slider y comenzar autoplay
    updateSlider();
    startAutoplay();
});