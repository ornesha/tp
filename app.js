document.addEventListener('DOMContentLoaded', () => {
    const archivos = ["barferroprusiato.png", "obelisco.png", "cenicero.png", "ceniceros.png", "circus.png", "cubiertos.png", "flecha.png", "florlampara.png", "lamparaatalaya.png", "oreja.png", "radio.png", "silla twist.png", "silla.png", "vaso.png", "vestido.png"];
    let indiceActual = 0;
    
    const cursorObjeto = document.createElement('div');
    cursorObjeto.id = 'cursor-objeto';
    // Hacemos que la imagen aparezca desde el primer momento
    cursorObjeto.style.backgroundImage = `url('assets/${archivos[indiceActual]}')`;
    document.body.appendChild(cursorObjeto);

    // RESTAURADO: Lógica de clic para cambiar el objeto
    window.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.globo-conservador') && !e.target.closest('.cat')) {
            indiceActual = (indiceActual + 1) % archivos.length;
            cursorObjeto.style.backgroundImage = `url('assets/${archivos[indiceActual]}')`;
        }
    });

    // RESTAURADO: Lógica de movimiento para crear los estampados
    window.addEventListener('mousemove', (e) => {
        cursorObjeto.style.left = (e.clientX - 100) + 'px';
        cursorObjeto.style.top = (e.clientY - 100) + 'px';
        
        // Solo estampamos si estamos en la primera pantalla (para no manchar el fondo blanco de abajo)
        if (window.scrollY < window.innerHeight) {
            if (Math.random() > 0.9) {
                // Sumamos window.scrollY para que el estampado caiga justo donde está el mouse, incluso si bajaste un poquito
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
    
    let estampados = [], indiceColor = 0;
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
});

// --- LÓGICA DEL CARRUSEL DE EVENTO ---
    const slides = document.querySelectorAll('.slide');
    const puntos = document.querySelectorAll('.punto');
    const btnAnt = document.querySelector('.carrusel-btn.ant');
    const btnSig = document.querySelector('.carrusel-btn.sig');
    let slideActual = 0;

    if (slides.length > 0) {
        function cambiarSlide(indice) {
            // Quitamos la clase activa a todos
            slides.forEach(slide => slide.classList.remove('activa'));
            puntos.forEach(punto => punto.classList.remove('activo'));
            
            // Calculamos el índice para que haga un "loop" infinito
            slideActual = (indice + slides.length) % slides.length;
            
            // Ponemos la clase activa al que corresponde
            slides[slideActual].classList.add('activa');
            puntos[slideActual].classList.add('activo');
        }

        // Eventos de las flechas
        btnAnt.addEventListener('click', () => cambiarSlide(slideActual - 1));
        btnSig.addEventListener('click', () => cambiarSlide(slideActual + 1));

        // Eventos de los puntitos de abajo
        puntos.forEach(punto => {
            punto.addEventListener('click', (e) => {
                const indice = parseInt(e.target.getAttribute('data-indice'));
                cambiarSlide(indice);
            });
        });
    }