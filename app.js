document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL LIENZO, CURSOR Y ESTAMPADOS
    // ==========================================
    const archivos = ["barferroprusiato.png", "obelisco.png", "cenicero.png", "ceniceros.png", "circus.png", "cubiertos.png", "flecha.png", "florlampara.png", "lamparaatalaya.png", "oreja.png", "radio.png", "silla twist.png", "silla.png", "vaso.png", "vestido.png"];
    let indiceActual = 0;
    
    const cursorObjeto = document.createElement('div');
    cursorObjeto.id = 'cursor-objeto';
    cursorObjeto.style.backgroundImage = `url('assets/${archivos[indiceActual]}')`;
    document.body.appendChild(cursorObjeto);

    window.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.globo-conservador') && !e.target.closest('.cat')) {
            indiceActual = (indiceActual + 1) % archivos.length;
            cursorObjeto.style.backgroundImage = `url('assets/${archivos[indiceActual]}')`;
        }
    });

    let estampados = [];
    window.addEventListener('pointermove', (e) => {
        cursorObjeto.style.left = (e.clientX - 100) + 'px';
        cursorObjeto.style.top = (e.clientY - 100) + 'px';
        
        if (window.scrollY < window.innerHeight) {
            if (Math.random() > 0.9) {
                estampados.push({ 
                    x: e.clientX, 
                    y: e.clientY + window.scrollY, 
                    rot: Math.random() * 360, 
                    img: archivos[indiceActual], 
                    alpha: 1, 
                    size: Math.random() * 150 + 100 
                });
            }
        }
    });

    const mensajes = [
        "sé coherente", "sigue la grilla", "sé rentable", "lo funcional", "menos es más",
        "estandariza", "respeta la norma", "optimiza tiempos", "cuestión de lógica", 
        "orden y progreso", "evita el exceso", "mide el impacto", "es pragmático", "mantén la estructura"
    ];

    function spawnGlobo() {
        const globo = document.createElement('div');
        globo.className = 'globo-conservador';
        globo.style.top = Math.random() * 50 + 'vh';
        globo.style.left = Math.random() * 70 + 'vw';
        const span = document.createElement('span');
        span.innerText = mensajes[Math.floor(Math.random() * mensajes.length)];
        globo.appendChild(span);
        document.getElementById('escenario').appendChild(globo);

        let isDragging = false, startX, startY, moved = false;

        globo.addEventListener('mousedown', (e) => {
            isDragging = true; moved = false;
            startX = e.clientX; startY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                moved = true;
                globo.style.left = (globo.offsetLeft + dx) + 'px';
                globo.style.top = (globo.offsetTop + dy) + 'px';
                startX = e.clientX; startY = e.clientY;
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDragging && !moved) {
                globo.style.transition = 'all 0.2s';
                globo.style.transform = 'scale(2)';
                globo.style.opacity = '0';
                setTimeout(() => { globo.remove(); setTimeout(spawnGlobo, 8000); }, 200);
            }
            isDragging = false;
        });
    }
    for(let i = 0; i < 5; i++) spawnGlobo();

    const canvas = document.getElementById('lienzo');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    
    let indiceColor = 0;
    const pantallaInicial = document.querySelector('.pantalla-inicial');
    const paleta = ['#1200D4', '#531B5D', '#BBFF01', '#FF01E6'];
    
    setInterval(() => { pantallaInicial.style.backgroundColor = paleta[indiceColor++ % paleta.length]; }, 800);

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        estampados.forEach((obj, i) => {
            ctx.globalAlpha = obj.alpha;
            const img = new Image(); img.src = `assets/${obj.img}`;
            ctx.save(); 
            ctx.translate(obj.x, obj.y); 
            ctx.rotate(obj.rot * Math.PI / 180);
            ctx.drawImage(img, -obj.size/2, -obj.size/2, obj.size, obj.size); 
            ctx.restore();
            
            obj.alpha -= 0.001; 
            if (obj.alpha <= 0) estampados.splice(i, 1);
        });
        requestAnimationFrame(animar);
    }
    animar();

    // ==========================================
    // 2. SISTEMA UNIFICADO DE CARRUSELES
    // ==========================================
    
    // Esta función crea un carrusel en cualquier parte de tu página
    function crearCarrusel(selectorContenedor, selectorSlides, autoplayMs) {
        const contenedor = document.querySelector(selectorContenedor);
        if (!contenedor) return; // Si no existe el contenedor, no hace nada

        const slides = contenedor.querySelectorAll(selectorSlides);
        const puntos = contenedor.querySelectorAll('.punto');
        const btnAnt = contenedor.querySelector('.ant');
        const btnSig = contenedor.querySelector('.sig');
        let indiceActual = 0;

        function cambiarSlide(nuevoIndice) {
            // Limpiar activos
            slides.forEach(slide => slide.classList.remove('activa'));
            puntos.forEach(punto => punto.classList.remove('activo'));
            
            // Calcular nuevo índice en loop
            indiceActual = (nuevoIndice + slides.length) % slides.length;
            
            // Asignar activos
            slides[indiceActual].classList.add('activa');
            if(puntos[indiceActual]) puntos[indiceActual].classList.add('activo');
        }

        // Clics en las flechas
        if (btnAnt) btnAnt.addEventListener('click', () => cambiarSlide(indiceActual - 1));
        if (btnSig) btnSig.addEventListener('click', () => cambiarSlide(indiceActual + 1));

        // Clics en los puntitos
        puntos.forEach((punto, i) => {
            punto.addEventListener('click', () => cambiarSlide(i));
        });

        // Si se le pasa un tiempo (ej: 5000ms), se mueve solo
        if (autoplayMs > 0) {
            setInterval(() => cambiarSlide(indiceActual + 1), autoplayMs);
        }
    }

    // Activamos el Carrusel del Evento (Sin movimiento automático, pasamos 0)
    crearCarrusel('.carrusel-evento', '.slide', 0);

    // Activamos el Carrusel de Caprichismo/Afiches (Con movimiento automático cada 5 seg)
    crearCarrusel('.carrusel-afiches', '.slide-afiche', 5000);
// Activamos los dos nuevos mini-carruseles de Newsletters (Sin movimiento automático)

    crearCarrusel('.carrusel-news1', '.slide-news', 0);
    crearCarrusel('.carrusel-news2', '.slide-news', 0);


});