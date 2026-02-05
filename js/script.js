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
    const endDatePicker = flatpickr("#visa-end", {
        locale: "tr",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d F Y",
        theme: "dark"
    });

    const startDatePicker = flatpickr("#visa-start", {
        locale: "tr",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d F Y",
        theme: "dark",
        onChange: function (selectedDates, dateStr, instance) {
            endDatePicker.set('minDate', dateStr);

            // Eğer seçili bitiş tarihi yeni başlangıç tarihinden küçükse temizle
            const endDate = endDatePicker.selectedDates[0];
            if (endDate && endDate < selectedDates[0]) {
                endDatePicker.clear();
            }
        }
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

            // Clear inputs properly using Flatpickr instances
            startDatePicker.clear();
            endDatePicker.clear();
            document.getElementById('visa-country').value = ''; // Reset select
            document.getElementById('visa-type').selectedIndex = 0; // Reset type
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
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

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

        // Hide result if list is empty
        if (visas.length === 0) {
            resultDiv.style.display = 'none';
        }
    }

    function calculateCascade(visaHistory) {
        const now = new Date();
        const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
        const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());

        // Filter for C Type visas only (Exclude D Type)
        const cTypeVisas = visaHistory.filter(v => v.type === 'C');

        // If no C type visas are present (e.g. only D types or empty)
        if (cTypeVisas.length === 0) {
            return {
                type: 'warning',
                message: "Mevcut vize geçmişiniz, Cascade Kuralıyla uzun süreli vize verilmesi için aranan kriterleri henüz karşılamamaktadır. (D tipi vizeler hesaplamaya dahil edilmemektedir.)"
            };
        }

        // Sort visas by end date descending to find the latest reference
        const sortedVisas = [...cTypeVisas].sort((a, b) => new Date(b.end) - new Date(a.end));
        const lastVisa = sortedVisas[0];
        const lastVisaEndDate = new Date(lastVisa.end);

        // Calculate result validity date (1 year after the last visa's end date)
        const validityDate = new Date(lastVisaEndDate);
        validityDate.setFullYear(validityDate.getFullYear() + 1);

        // Helper to get duration in days (Inclusive: Start and End days count)
        const getDuration = (v) => {
            const start = new Date(v.start);
            const end = new Date(v.end);
            const diffTime = Math.abs(end - start);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        };

        // Helper to check if visa is within a specific date range
        const isWithin = (v, dateLimit) => {
            return new Date(v.end) >= dateLimit;
        };

        let result = {
            duration: "kısa süreli",
            reason: "Yeterli vize geçmişiniz bulunmuyor.",
            validUntil: validityDate // Pass the calculated date
        };

        // Kural 3: 5 Yıllık (Son 3 yılda 2 yıllık vize varsa)
        const hasTwoYearVisa = cTypeVisas.some(v =>
            isWithin(v, threeYearsAgo) && getDuration(v) >= 700
        );

        if (hasTwoYearVisa) {
            result.duration = "5 yıllık";
            result.reason = "Son 3 yıl içinde en az 2 yıllık bir vizeniz bulunduğu için.";
            return result;
        }

        // Kural 2: 2 Yıllık (Son 2 yılda 1 yıllık vize varsa)
        const hasOneYearVisa = cTypeVisas.some(v =>
            isWithin(v, twoYearsAgo) && getDuration(v) >= 360
        );

        if (hasOneYearVisa) {
            result.duration = "2 yıllık";
            result.reason = "Son 2 yıl içinde en az 1 yıllık bir vizeniz bulunduğu için.";
            return result;
        }

        // Kural 1: 1 Yıllık (Son 2 yılda 3 adet vize varsa)
        const recentVisas = cTypeVisas.filter(v => isWithin(v, twoYearsAgo));

        if (recentVisas.length >= 3) {
            result.duration = "1 yıllık";
            result.reason = "Son 2 yıl içinde 3 adet vizeniz bulunduğu için.";
            return result;
        }

        // Diğer Durumlar (Referans siteye göre güncellendi)
        if (recentVisas.length === 2) {
            result.duration = "1 yıllık";
            result.reason = "Son 2 yılda 2 adet geçmiş vizeniz olduğu için.";
            return result;
        } else if (recentVisas.length === 1) {
            result.duration = "6 aylık";
            result.reason = "Son 2 yılda 1 adet geçmiş vizeniz olduğu için.";
            return result;
        }

        return result;
    }

    function showResult(prediction) {
        // Handle warning case (e.g. only D-Type visas)
        if (prediction.type === 'warning') {
            resultDiv.innerHTML = `
                <div class="result-warning-text">
                    <p>${prediction.message}</p>
                </div>
            `;
            resultDiv.className = 'calc-result warning-container';
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Format the validUntil date from prediction
        const formattedDate = prediction.validUntil.toLocaleDateString('tr-TR');

        resultDiv.innerHTML = `
            <div class="result-success-text">
                <p>
                    Pasaportunuzun süresinin uygun olması koşuluyla <strong>${formattedDate}</strong> tarihine dek yapacağınız başvurularda <strong>${prediction.duration}</strong> vize alma hakkına sahipsiniz.
                </p>
            </div>

            <div class="result-info-box">
                <a href="#contact" style="text-decoration: none; color: inherit;">
                    Size en uygun ülkeyi seçme ve randevu alma konusunda çağrı merkezimizle görüşme yapmak için kayıt bırakabilirsiniz.
                </a>
            </div>

            <div class="result-disclaimer">
                <p>Bu hesaplama, Avrupa Komisyonu'nun <strong>Visa Code Handbook I (26.06.2024)</strong> ve Türkiye'ye özel olarak uyarlanmış <strong>uygulama kararlarına (15.07.2025)</strong> dayanmaktadır. Sonuçlar yalnızca tavsiye niteliğindedir. Nihai vize kararı ve süresi, konsolosluğun takdirindedir.</p>
                <p class="warning-text"><strong>Önemli:</strong> Pasaportunuzun geçerlilik süresinin, talep ettiğiniz vize bitiş tarihinden itibaren en az 3 ay daha uzun olması gerektiğini unutmayın.</p>
            </div>
        `;

        resultDiv.className = 'calc-result success-container';
        resultDiv.style.display = 'block';

        // Auto scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

});


