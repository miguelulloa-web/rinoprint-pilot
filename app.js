/* ==========================================================================
   INTERACTIVE LOGIC: RinoPrint Regalos - Premium Light & Organic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Global Quote Cart State
    let quoteCart = [];

    // Elements
    const siteHeader = document.getElementById('siteHeader');
    const searchInput = document.getElementById('searchInput');
    const productGrid = document.getElementById('productGrid');
    const productCards = document.querySelectorAll('.product-card');
    
    // Sidebar Category Elements
    const sidebarPanel = document.getElementById('sidebarPanel');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const btnCategoriesTrigger = document.getElementById('btnCategoriesTrigger');
    const btnSidebarClose = document.getElementById('btnSidebarClose');
    const catHeaders = document.querySelectorAll('.cat-header');

    // Hero Slider Elements
    const slides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const btnSliderPrev = document.getElementById('btnSliderPrev');
    const btnSliderNext = document.getElementById('btnSliderNext');
    let currentSlide = 0;
    let sliderInterval = null;

    // Cart Drawer Elements
    const drawerPanel = document.getElementById('drawerPanel');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const btnCartPill = document.getElementById('btnCartPill');
    const btnDrawerClose = document.getElementById('btnDrawerClose');
    const quoteItemsContainer = document.getElementById('quoteItemsContainer');
    const quoteForm = document.getElementById('quoteForm');
    const cartBadge = document.getElementById('cartBadge');

    // WhatsApp Elements
    const whatsappWidget = document.getElementById('whatsappWidget');
    const whatsappBubble = document.getElementById('whatsappBubble');

    /* --------------------------------------------------------------------------
       1. Header Scroll Shrink (CSS-Only / Completamente delegado a style.css)
       -------------------------------------------------------------------------- */

    /* --------------------------------------------------------------------------
       2. Sidebar Categories Flyout (Accordion)
       -------------------------------------------------------------------------- */
    function openSidebar() {
        sidebarPanel.classList.add('active');
        sidebarBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebarPanel.classList.remove('active');
        sidebarBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (btnCategoriesTrigger) btnCategoriesTrigger.addEventListener('click', openSidebar);
    if (btnSidebarClose) btnSidebarClose.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    // Accordion Toggle
    catHeaders.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetChildren = document.getElementById(targetId);
            
            // Toggle active arrow and class
            btn.classList.toggle('active');
            
            if (targetChildren) {
                if (btn.classList.contains('active')) {
                    targetChildren.style.maxHeight = targetChildren.scrollHeight + 'px';
                } else {
                    targetChildren.style.maxHeight = '0px';
                }
            }
        });
    });

    /* --------------------------------------------------------------------------
       3. Hero Cinematic Slider (Zoom & Fade)
       -------------------------------------------------------------------------- */
    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        sliderDots[currentSlide].classList.remove('active');
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        sliderDots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSliderTimer() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
    }

    if (btnSliderNext) btnSliderNext.addEventListener('click', () => { nextSlide(); startSliderTimer(); });
    if (btnSliderPrev) btnSliderPrev.addEventListener('click', () => { prevSlide(); startSliderTimer(); });

    // Connect slider dots
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startSliderTimer();
        });
    });

    // Start Slider on load
    startSliderTimer();

    /* --------------------------------------------------------------------------
       4. Real-time Catalog Search & Tab Filters (View Transitions API)
       -------------------------------------------------------------------------- */
    // Tab Filter
    const tabButtons = document.querySelectorAll('.btn-tab');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const selectedTab = btn.getAttribute('data-tab');
            triggerFilterWithTransition(selectedTab, searchInput.value);
        });
    });

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const activeTab = document.querySelector('.btn-tab.active').getAttribute('data-tab');
            triggerFilterWithTransition(activeTab, searchInput.value);
        });
    }

    function triggerFilterWithTransition(category, query) {
        // Asignar view-transition-names dinámicos a las tarjetas visibles actuales
        const visibleCards = Array.from(productCards).filter(c => c.style.display !== 'none');
        visibleCards.forEach((card) => {
            card.style.viewTransitionName = `card-${card.getAttribute('data-id')}`;
        });
        
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                filterProducts(category, query);
                
                // Actualizar view-transition-names de las nuevas tarjetas visibles
                const newVisible = Array.from(productCards).filter(c => c.style.display !== 'none');
                newVisible.forEach((card) => {
                    card.style.viewTransitionName = `card-${card.getAttribute('data-id')}`;
                });
            });
        } else {
            filterProducts(category, query);
        }
    }

    function filterProducts(category, query) {
        const cleanedQuery = query.toLowerCase().trim();
        
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardName = card.getAttribute('data-name').toLowerCase();
            
            const matchesCategory = (category === 'todos' || cardCategory === category);
            const matchesQuery = !cleanedQuery || cardName.includes(cleanedQuery);
            
            if (matchesCategory && matchesQuery) {
                card.style.display = 'flex';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    }

    /* --------------------------------------------------------------------------
       5. Interactive Cotización (Cart) System
       -------------------------------------------------------------------------- */
    function openCartDrawer() {
        drawerPanel.classList.add('active');
        drawerBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCartDrawer() {
        drawerPanel.classList.remove('active');
        drawerBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (btnCartPill) btnCartPill.addEventListener('click', openCartDrawer);
    if (btnDrawerClose) btnDrawerClose.addEventListener('click', closeCartDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeCartDrawer);

    // Add to Cart Handlers
    const btnAddQuotes = document.querySelectorAll('.btn-add-quote');
    btnAddQuotes.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const code = btn.getAttribute('data-code');
            const img = btn.getAttribute('data-img');
            
            // Check if product is already in cart
            const existingItem = quoteCart.find(item => item.id === id);
            
            if (existingItem) {
                // Increment corporate quantity (default corporate quote step is 50 units!)
                existingItem.qty += 50;
            } else {
                quoteCart.push({ id, name, code, img, qty: 50 });
            }
            
            // Trigger visual feedback
            updateCartUI();
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
            btn.style.background = 'var(--color-accent)';
            btn.style.color = '#ffffff';
            
            setTimeout(() => {
                btn.innerHTML = 'Cotizar';
                btn.style.background = '';
                btn.style.color = '';
            }, 1800);
        });
    });

    // Favorites Heart Toggle
    const btnFavs = document.querySelectorAll('.btn-fav');
    btnFavs.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (btn.classList.contains('active')) {
                icon.className = 'fa-solid fa-heart';
            } else {
                icon.className = 'fa-regular fa-heart';
            }
        });
    });

    function updateCartUI() {
        // Update badges
        const totalItemsCount = quoteCart.reduce((sum, item) => sum + 1, 0);
        cartBadge.innerText = totalItemsCount;
        
        // Badge pop animation
        cartBadge.classList.add('pop');
        setTimeout(() => cartBadge.classList.remove('pop'), 300);

        // Render Cart items in drawer
        if (quoteCart.length === 0) {
            quoteItemsContainer.innerHTML = `
                <div class="quote-empty-state">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>Tu cotización está vacía.<br>Agrega regalos del catálogo para cotizar.</p>
                </div>
            `;
            quoteForm.style.display = 'none';
        } else {
            quoteForm.style.display = 'block';
            quoteItemsContainer.innerHTML = '';
            
            quoteCart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'quote-item';
                itemEl.innerHTML = `
                    <img src="${item.img}" class="quote-item-img" alt="${item.name}">
                    <div class="quote-item-details">
                        <div>
                            <div class="quote-item-name">${item.name}</div>
                            <div class="quote-item-code">${item.code}</div>
                        </div>
                        <div class="quote-item-controls">
                            <div class="quantity-control">
                                <button type="button" class="btn-qty btn-minus" data-id="${item.id}">-</button>
                                <span class="qty-val">${item.qty}</span>
                                <button type="button" class="btn-qty btn-plus" data-id="${item.id}">+</button>
                            </div>
                            <button type="button" class="btn-remove-item" data-id="${item.id}">Eliminar</button>
                        </div>
                    </div>
                `;
                quoteItemsContainer.appendChild(itemEl);
            });

            // Re-bind click handlers for quantities inside Drawer
            document.querySelectorAll('.btn-plus').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    const target = quoteCart.find(item => item.id === id);
                    if (target) {
                        target.qty += 25; // add 25 more
                        updateCartUI();
                    }
                });
            });

            document.querySelectorAll('.btn-minus').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    const target = quoteCart.find(item => item.id === id);
                    if (target) {
                        if (target.qty > 25) {
                            target.qty -= 25;
                        } else {
                            quoteCart = quoteCart.filter(item => item.id !== id);
                        }
                        updateCartUI();
                    }
                });
            });

            document.querySelectorAll('.btn-remove-item').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    quoteCart = quoteCart.filter(item => item.id !== id);
                    updateCartUI();
                });
            });
        }
    }

    // Submit Quote Form
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('quoteName').value;
            const company = document.getElementById('quoteCompany').value;
            
            // Show sleek custom feedback
            alert(`¡Muchas gracias, ${name}! Hemos recibido tu solicitud para ${company}.\n\nUn ejecutivo de RinoPrint se contactará contigo en menos de 2 horas con los bocetos digitales personalizados.`);
            
            // Reset
            quoteCart = [];
            updateCartUI();
            quoteForm.reset();
            closeCartDrawer();
        });
    }

    /* --------------------------------------------------------------------------
       6. Intelligent WhatsApp Floating Button (Draggable & Pulse)
       -------------------------------------------------------------------------- */
    // Bubble automatic reveal after 4 seconds
    setTimeout(() => {
        if (whatsappBubble) whatsappBubble.classList.add('show');
    }, 4000);

    // Draggable operational logic
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let hasMoved = false;
    const STORAGE_KEY = 'wa_widget_pos_light';

    // Load saved pos if any
    try {
        const savedPos = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (savedPos && whatsappWidget) {
            whatsappWidget.style.right = 'auto';
            whatsappWidget.style.bottom = 'auto';
            whatsappWidget.style.left = savedPos.left + 'px';
            whatsappWidget.style.top = savedPos.top + 'px';
        }
    } catch (err) {}

    function getCoords(e) {
        return e.touches ? {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        } : {
            x: e.clientX,
            y: e.clientY
        };
    }

    function onDragStart(e) {
        // Skip drag on links click
        if (e.target.closest('a')) return;
        
        isDragging = true;
        hasMoved = false;
        
        const coords = getCoords(e);
        startX = coords.x;
        startY = coords.y;
        
        const rect = whatsappWidget.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        whatsappWidget.style.right = 'auto';
        whatsappWidget.style.bottom = 'auto';
        whatsappWidget.style.left = startLeft + 'px';
        whatsappWidget.style.top = startTop + 'px';
        whatsappWidget.style.cursor = 'grabbing';
        
        // Hide message bubble during drag for cleanliness
        if (whatsappBubble) whatsappBubble.classList.remove('show');
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const coords = getCoords(e);
        const dx = coords.x - startX;
        const dy = coords.y - startY;
        
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
            hasMoved = true;
        }

        let newLeft = startLeft + dx;
        let newTop = startTop + dy;

        // Boundaries checks
        newLeft = Math.max(10, Math.min(window.innerWidth - 70, newLeft));
        newTop = Math.max(10, Math.min(window.innerHeight - 70, newTop));

        whatsappWidget.style.left = newLeft + 'px';
        whatsappWidget.style.top = newTop + 'px';
    }

    function onDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        whatsappWidget.style.cursor = 'grab';

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                left: parseFloat(whatsappWidget.style.left),
                top: parseFloat(whatsappWidget.style.top)
            }));
        } catch (err) {}

        if (hasMoved) {
            e.preventDefault();
        }
    }

    if (whatsappWidget) {
        whatsappWidget.addEventListener('mousedown', onDragStart);
        whatsappWidget.addEventListener('touchstart', onDragStart, { passive: true });
        
        document.addEventListener('mousemove', onDragMove, { passive: false });
        document.addEventListener('touchmove', onDragMove, { passive: false });
        
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchend', onDragEnd);
    }
});
