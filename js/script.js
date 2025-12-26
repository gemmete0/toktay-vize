document.addEventListener('DOMContentLoaded', function () {
    // AOS (Animate On Scroll) Başlatma
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Language Switching Logic (Custom Dropdown)
    const langSelector = document.getElementById('lang-selector-btn');
    const langText = document.querySelector('.lang-text');
    const langOptions = document.querySelectorAll('.lang-dropdown li');

    if (langSelector) {
        // Toggle dropdown on click
        langSelector.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately
            langSelector.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!langSelector.contains(e.target)) {
                langSelector.classList.remove('active');
            }
        });

        // Handle option selection
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const selectedLang = option.getAttribute('data-lang');

                // Update text
                if (langText) {
                    langText.innerText = selectedLang.toUpperCase();
                }

                // Change Site Language
                changeLanguage(selectedLang);

                // Close dropdown logic handled by bubble propagation or auto close
            });
        });
    }

    function changeLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        // Update Flatpickr locale
        if (typeof flatpickr !== 'undefined') {
            flatpickr.localize(flatpickr.l10ns[lang]);
        }
    }

    // Navbar Scroll Efekti
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Yumuşak Kaydırma (Smooth Scroll) - Sayfa içi linkler için
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentIndex = 0;
    const galleryItems = document.querySelectorAll('.gallery-item');
    const totalItems = galleryItems.length;

    // Open Lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (img) {
                currentIndex = index;
                openLightbox(img.src);
            }
        });
    });

    function openLightbox(src) {
        lightbox.classList.add('active');
        lightboxImg.src = src;
    }

    // Navigation Functions
    function showNext() {
        currentIndex = (currentIndex + 1) % totalItems;
        const nextImg = galleryItems[currentIndex].querySelector('img');
        lightboxImg.src = nextImg.src;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        const prevImg = galleryItems[currentIndex].querySelector('img');
        lightboxImg.src = prevImg.src;
    }

    // Event Listeners for Nav
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    // Close Logic
    closeBtn.addEventListener('click', function () {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', function (e) {
        if (e.target !== lightboxImg && e.target !== nextBtn && e.target !== prevBtn && e.target.closest('.lightbox-nav') === null) {
            lightbox.classList.remove('active');
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });

    // İletişim Formu Gönderimi (Basit Alert - Backend bağlanabilir)
    const contactForm = document.querySelector('.contact-form-container form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
            this.reset();
        });
    }

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items (optional, keep for accordion effect)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Cascade Calculator Logic
    const visaList = document.getElementById('visa-list');
    const addVisaBtn = document.getElementById('add-visa-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('calc-result');
    let visas = [];

    // Initialize Flatpickr
    flatpickr("#visa-start", {
        locale: "tr",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d F Y", // Görünecek format: 25 Aralık 2025
        theme: "dark"
    });

    flatpickr("#visa-end", {
        locale: "tr",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d F Y",
        theme: "dark"
    });

    if (addVisaBtn) {
        addVisaBtn.addEventListener('click', () => {
            const start = document.getElementById('visa-start').value;
            const end = document.getElementById('visa-end').value;
            const country = document.getElementById('visa-country').value;
            const type = document.getElementById('visa-type').value;

            if (!start || !end || !country) {
                alert('Lütfen tüm alanları doldurunuz.');
                return;
            }

            const visa = {
                id: Date.now(),
                start,
                end,
                country,
                type
            };

            visas.push(visa);
            renderVisas();

            // Clear inputs
            document.getElementById('visa-start').value = '';
            document.getElementById('visa-end').value = '';
            document.getElementById('visa-country').value = '';
        });

        calculateBtn.addEventListener('click', () => {
            if (visas.length === 0) {
                alert('Lütfen önce geçmiş vizelerinizi ekleyin.');
                return;
            }

            const prediction = calculateCascade(visas);
            showResult(prediction);
        });
    }

    function renderVisas() {
        visaList.innerHTML = '';
        if (visas.length === 0) {
            visaList.innerHTML = '<li class="empty-list">Henüz vize eklenmedi.</li>';
            return;
        }

        visas.forEach(visa => {
            const li = document.createElement('li');
            // Basit gün farkı ile süre hesaplama (Görsel amaçlı)
            const diffTime = Math.abs(new Date(visa.end) - new Date(visa.start));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            li.innerHTML = `
                <div>
                    <strong>${visa.country}</strong>
                    <span style="font-size: 13px; color: #aaa; margin-left: 10px;">${reformatDate(visa.start)} - ${reformatDate(visa.end)}</span>
                    <span style="font-size: 12px; background: #333; padding: 2px 6px; border-radius: 4px; margin-left: 10px;">${diffDays} Gün</span>
                </div>
                <i class="fas fa-trash delete-visa" onclick="removeVisa(${visa.id})"></i>
            `;
            visaList.appendChild(li);
        });

        // Delete event delegation
        document.querySelectorAll('.delete-visa').forEach(btn => {
            btn.addEventListener('click', function () {
                // onclick inline is simpler for dynamic elements here, but let's assume global scope or direct attachment.
                // Since this is inside a module/closure, inline onclick wont find calculateCascade easily unless attached to window.
                // Instead, using the ID passed in closure would be better, but let's stick to re-render.
            });
        });
    }

    // Helper to format date YYYY-MM-DD to DD.MM.YYYY
    function reformatDate(dateStr) {
        const [y, m, d] = dateStr.split('-');
        return `${d}.${m}.${y}`;
    }

    // Expose remove function to window for the inline onclick handler (simplest way here)
    window.removeVisa = function (id) {
        visas = visas.filter(v => v.id !== id);
        renderVisas();
    }

    function calculateCascade(visaHistory) {
        const now = new Date();
        const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
        const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());

        // Helper to get duration in days
        const getDuration = (v) => {
            const start = new Date(v.start);
            const end = new Date(v.end);
            return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        };

        // Helper to check if visa is within a specific date range
        const isWithin = (v, dateLimit) => {
            return new Date(v.end) >= dateLimit;
        };

        // Rule 3: 5-Year Visa Eligibility
        // Requirement: Validly used a multiple-entry visa with a validity of at least two years within the previous three years.
        const hasTwoYearVisa = visaHistory.some(v =>
            isWithin(v, threeYearsAgo) && getDuration(v) >= 700 // Approx 2 years
        );

        if (hasTwoYearVisa) {
            return {
                result: "5 Yıl (Multi)",
                reason: "Son 3 yıl içinde en az 2 yıllık bir vizeniz bulunduğu için, bir sonraki vizeniz genellikle 5 yıllık verilir."
            };
        }

        // Rule 2: 2-Year Visa Eligibility
        // Requirement: Validly used a multiple-entry visa with a validity of at least one year within the previous two years.
        const hasOneYearVisa = visaHistory.some(v =>
            isWithin(v, twoYearsAgo) && getDuration(v) >= 360 // Approx 1 year
        );

        if (hasOneYearVisa) {
            return {
                result: "2 Yıl (Multi)",
                reason: "Son 2 yıl içinde en az 1 yıllık bir vizeniz bulunduğu için, sonraki vizeniz 2 yıllık olabilir."
            };
        }

        // Rule 1: 1-Year Visa Eligibility
        // Requirement: Obtained and lawfully used three short-stay visas within the previous two years.
        const recentVisas = visaHistory.filter(v => isWithin(v, twoYearsAgo));

        if (recentVisas.length >= 3) {
            return {
                result: "1 Yıl (Multi)",
                reason: "Son 2 yıl içinde 3 adet vizeniz bulunduğu için, Cascade kuralına göre 1 yıllık vizeye hak kazanıyorsunuz."
            };
        }

        // Fallbacks
        if (recentVisas.length >= 2) {
            return {
                result: "6 Ay - 1 Yıl",
                reason: "Cascade kuralı için 3 vize gerekiyor ancak geçmiş 2 vizeniz olumlu bir referans oluşturacaktır."
            };
        } else if (recentVisas.length === 1) {
            return {
                result: "3 Ay - 6 Ay",
                reason: "Henüz yeterli vize yoğunluğu yok, ancak referansınız var. Genellikle kısa süreli çok girişli verilir."
            };
        } else {
            return {
                result: "İlk Kez / Kısa Süreli",
                reason: "Son 2 yılda yeterli vize geçmişi görünmüyor. Genellikle seyahat süreniz kadar veya kısa süreli verilir."
            };
        }
    }

    function showResult(prediction) {
        resultDiv.innerHTML = `
            <h3>Tahmini Vize Süresi</h3>
            <p>${prediction.reason}</p>
            <span>${prediction.result}</span>
            <p style="font-size: 12px; margin-top: 15px; color: #888;">*Bu hesaplama resmi "Schengen Visa Code" kurallarına dayanmaktadır. Kesin sonuç konsolosluğa bağlıdır.</p>
        `;
        resultDiv.className = 'calc-result success';

        // Auto scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

});

