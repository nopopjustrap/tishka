document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.querySelector('.header');
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const cursor = document.querySelector('.cursor');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                nav.classList.remove('nav--open');
                burger.classList.remove('burger--open');
            }
        });
    });

    burger?.addEventListener('click', () => {
        nav.classList.toggle('nav--open');
        burger.classList.toggle('burger--open');
    });

    document.addEventListener('mousemove', (e) => {
        if (!cursor || window.innerWidth <= 760) return;
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('a, button, .draggable-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!cursor || window.innerWidth <= 760) return;
            cursor.style.transform = 'translate(-50%, -50%) scale(1.4)';
            cursor.style.borderColor = 'rgba(255,255,255,.95)';
        });
        el.addEventListener('mouseleave', () => {
            if (!cursor || window.innerWidth <= 760) return;
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'rgba(186, 215, 151, 0.9)';
        });
    });

    const quizOptions = document.querySelectorAll('.quiz-option');
    const generateBtn = document.getElementById('generate-shirt');
    const shirtColorLayer = document.getElementById('shirtColorLayer');
    const generatedResult = document.getElementById('generatedResult');
    const preview = document.getElementById('vibeShirtPreview');
    let selectedVibe = null;

    const vibeMap = {
        cherry: {
            gradient: 'linear-gradient(145deg, #670626 0%, #8B1E3F 48%, #201218 100%)',
            color: '#670626'
        },
        matcha: {
            gradient: 'linear-gradient(145deg, #BAD797 0%, #7AA77C 52%, #1B1015 100%)',
            color: '#BAD797'
        },
        lime: {
            gradient: 'linear-gradient(145deg, #D2DE76 0%, #BAD797 55%, #3A3420 100%)',
            color: '#D2DE76'
        },
        pink: {
            gradient: 'linear-gradient(145deg, #FFC3CC 0%, #C892A7 55%, #670626 100%)',
            color: '#FFC3CC'
        },
        dark: {
            gradient: 'linear-gradient(145deg, #1B1015 0%, #670626 50%, #BAD797 100%)',
            color: '#1B1015'
        }
    };

    quizOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            quizOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedVibe = opt.dataset.vibe;
            generateBtn.disabled = false;
        });
    });

    generateBtn?.addEventListener('click', () => {
        if (!selectedVibe || !preview) return;
        preview.style.background = vibeMap[selectedVibe]?.gradient || vibeMap.cherry.gradient;
        generatedResult.style.display = 'block';
    });

    document.getElementById('addToConstructor')?.addEventListener('click', () => {
        if (!selectedVibe) return;
        shirtColorLayer.style.backgroundColor = vibeMap[selectedVibe]?.color || '#670626';
        document.getElementById('constructor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const draggableItems = document.getElementById('draggableItems');
    let itemCounter = 0;

    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            shirtColorLayer.style.backgroundColor = dot.dataset.color;
        });
    });

    function createDraggableItem(content, type) {
        itemCounter++;
        const item = document.createElement('div');
        item.className = 'draggable-item';
        item.id = `item-${itemCounter}`;
        item.innerHTML = content;
        item.style.left = `${Math.random() * 58 + 18}%`;
        item.style.top = `${Math.random() * 58 + 18}%`;
        item.setAttribute('data-type', type);

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        item.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = item.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            item.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const containerRect = document.querySelector('.shirt-preview').getBoundingClientRect();
            let newX = e.clientX - containerRect.left - offsetX;
            let newY = e.clientY - containerRect.top - offsetY;

            newX = Math.max(0, Math.min(newX, containerRect.width - item.offsetWidth));
            newY = Math.max(0, Math.min(newY, containerRect.height - item.offsetHeight));

            item.style.left = `${newX}px`;
            item.style.top = `${newY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            item.style.cursor = 'move';
        });

        item.addEventListener('dblclick', () => item.remove());

        return item;
    }

    document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pattern = btn.dataset.pattern;
            const contentMap = {
                heart: '❤️',
                star: '✦',
                circle: '●',
                square: '■',
                triangle: '▲',
                stripe: '════',
                dot: '•',
                flower: '✿'
            };
            const item = createDraggableItem(contentMap[pattern] || '✦', pattern);
            draggableItems.appendChild(item);
        });
    });

    document.getElementById('addTextBtn')?.addEventListener('click', () => {
        const input = document.getElementById('customText');
        const text = input.value.trim();
        if (!text) return;

        const item = createDraggableItem(text, 'text');
        item.style.fontSize = '20px';
        item.style.fontWeight = '800';
        item.style.fontFamily = '"Space Grotesk", sans-serif';
        item.style.letterSpacing = '0.04em';
        item.style.textTransform = 'uppercase';
        item.style.color = '#120b10';
        item.style.background = 'linear-gradient(135deg, rgba(186,215,151,.96), rgba(255,255,255,.92))';
        item.style.padding = '10px 16px';
        item.style.borderRadius = '999px';
        item.style.border = '1px solid rgba(255,255,255,.7)';
        draggableItems.appendChild(item);
        input.value = '';
    });

    document.getElementById('resetConstructor')?.addEventListener('click', () => {
        shirtColorLayer.style.backgroundColor = '#670626';
        draggableItems.innerHTML = '';
        document.getElementById('customText').value = '';
    });

    document.getElementById('saveDesign')?.addEventListener('click', () => {
        alert('Концепт сохранён. Это уже выглядит как сильный merch-drop.');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(36px)';
        section.style.transition = 'opacity .8s ease, transform .8s ease';
        observer.observe(section);
    });

    const onScroll = () => {
        if (!header) return;
        header.style.background = window.scrollY > 20 ? 'rgba(10, 8, 10, 0.78)' : 'rgba(10, 8, 10, 0.58)';
    };

    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});
