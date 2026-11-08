/**
 * Anatech Data Labs - Enterprise Interactive Script
 * Handles Theme Toggling, Dynamic Charts, Animated Counters, 
 * Dashboard Visualizers, ROI Calculator, AI Chatbot, and Booking Modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initThemeToggle();
  initCounters();
  initCharts();
  initDashboardTabs();
  initRoiCalculator();
  initTechFilter();
  initServicesFilter();
  initPipelineSimulator();
  initChatbot();
  initBookingModal();
  initCaseStudyModal();
  initMobileMenu();
  initStickyNav();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('anatech-theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcons(true);
  } else {
    document.body.classList.remove('light-theme');
    updateThemeIcons(false);
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('anatech-theme', isLight ? 'light' : 'dark');
      updateThemeIcons(isLight);
      updateChartThemes(isLight);
    });
  });
}

function updateThemeIcons(isLight) {
  const themeIcons = document.querySelectorAll('.theme-toggle-icon');
  themeIcons.forEach(icon => {
    if (isLight) {
      icon.setAttribute('data-lucide', 'moon');
    } else {
      icon.setAttribute('data-lucide', 'sun');
    }
  });
  if (window.lucide) window.lucide.createIcons();
}

/* ==========================================================================
   2. Animated KPI Counters
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counterElements.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 2000;
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(target * easeOutProgress);
            
            el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            }
          };

          requestAnimationFrame(updateCount);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   3. Chart.js Implementations & Multi-Dashboard Showcase
   ========================================================================== */
let salesChartInstance = null;
let ecommerceChartInstance = null;
let financeChartInstance = null;
let pharmacyChartInstance = null;
let biDashboardChartInstance = null;

function initCharts() {
  initSalesChart();
  initEcommerceChart();
  initFinanceChart();
  initPharmacyChart();
  initBiDashboardChart();
  initDashboardCarousel();
  initPharmacyChatbot();
}

/* 3.1 Power BI - Sales & Marketing Chart */
function initSalesChart() {
  const canvas = document.getElementById('salesChartCanvas');
  if (!canvas || !window.Chart) return;

  const isLight = document.body.classList.contains('light-theme');
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';

  const ctx = canvas.getContext('2d');
  const amberGradient = ctx.createLinearGradient(0, 0, 0, 240);
  amberGradient.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
  amberGradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

  const tealGradient = ctx.createLinearGradient(0, 0, 0, 240);
  tealGradient.addColorStop(0, 'rgba(0, 229, 201, 0.35)');
  tealGradient.addColorStop(1, 'rgba(0, 229, 201, 0.0)');

  salesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Total Pipeline ($M)',
          data: [12.4, 15.8, 18.2, 22.5, 25.8, 29.4, 32.1, 35.6, 38.6, 42.0],
          borderColor: '#f59e0b',
          borderWidth: 3,
          backgroundColor: amberGradient,
          fill: true,
          tension: 0.38,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Marketing Spend ($M)',
          data: [3.2, 3.8, 4.1, 4.6, 5.0, 5.4, 5.8, 6.2, 6.5, 7.0],
          borderColor: '#00e5c9',
          borderWidth: 2,
          backgroundColor: tealGradient,
          borderDash: [5, 5],
          fill: true,
          tension: 0.38,
          pointBackgroundColor: '#00e5c9',
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: textColor, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: isLight ? '#ffffff' : '#0f172a',
          titleColor: isLight ? '#0f172a' : '#f8fafc',
          bodyColor: isLight ? '#334155' : '#cbd5e1',
          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          callbacks: { label: (c) => `${c.dataset.label}: $${c.raw}M` }
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, callback: (v) => `$${v}M` } }
      }
    }
  });
}

/* 3.2 Tableau - E-Commerce Chart */
function initEcommerceChart() {
  const canvas = document.getElementById('ecommerceChartCanvas');
  if (!canvas || !window.Chart) return;

  const isLight = document.body.classList.contains('light-theme');
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';

  const ctx = canvas.getContext('2d');
  const skyGradient = ctx.createLinearGradient(0, 0, 0, 240);
  skyGradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  skyGradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

  ecommerceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Gross Merch. Value ($M)',
          data: [24.5, 28.2, 31.8, 36.4, 40.2, 44.8, 48.6, 51.2, 54.2, 58.0],
          borderColor: '#38bdf8',
          borderWidth: 3,
          backgroundColor: skyGradient,
          fill: true,
          tension: 0.38,
          pointBackgroundColor: '#38bdf8',
          pointRadius: 4
        },
        {
          label: 'Cart Abandonment Recovered (%)',
          data: [22, 26, 31, 35, 41, 46, 50, 54, 58.4, 62],
          borderColor: '#c084fc',
          borderWidth: 2,
          borderDash: [4, 4],
          fill: false,
          tension: 0.38,
          pointBackgroundColor: '#c084fc',
          pointRadius: 3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: textColor, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: isLight ? '#ffffff' : '#0f172a',
          titleColor: isLight ? '#0f172a' : '#f8fafc',
          bodyColor: isLight ? '#334155' : '#cbd5e1',
          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, callback: (v) => `$${v}M` } },
        y1: {
          position: 'right',
          grid: { display: false },
          ticks: { color: textColor, callback: (v) => `${v}%` },
          min: 0,
          max: 100
        }
      }
    }
  });
}

/* 3.3 Qlik Sense - Corporate Finance Chart */
function initFinanceChart() {
  const canvas = document.getElementById('financeChartCanvas');
  if (!canvas || !window.Chart) return;

  const isLight = document.body.classList.contains('light-theme');
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';

  const ctx = canvas.getContext('2d');

  financeChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Q1 FY26', 'Q2 FY26', 'Q3 FY26', 'Q4 FY26 (Est)'],
      datasets: [
        {
          label: 'Gross Revenue ($M)',
          data: [38.4, 42.6, 47.8, 52.5],
          backgroundColor: '#10b981',
          borderRadius: 6
        },
        {
          label: 'Operating Expenses ($M)',
          data: [24.2, 26.1, 28.9, 31.2],
          backgroundColor: isLight ? '#94a3b8' : '#334155',
          borderRadius: 6
        },
        {
          label: 'Operating EBITDA ($M)',
          data: [14.2, 16.5, 18.9, 21.3],
          backgroundColor: '#00e5c9',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: textColor, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: isLight ? '#ffffff' : '#0f172a',
          titleColor: isLight ? '#0f172a' : '#f8fafc',
          bodyColor: isLight ? '#334155' : '#cbd5e1',
          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          callbacks: { label: (c) => `${c.dataset.label}: $${c.raw}M` }
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, callback: (v) => `$${v}M` } }
      }
    }
  });
}

/* 3.4 Pharmacy - Clinical Operations Chart */
function initPharmacyChart() {
  const canvas = document.getElementById('pharmacyChartCanvas');
  if (!canvas || !window.Chart) return;

  const isLight = document.body.classList.contains('light-theme');
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';

  const ctx = canvas.getContext('2d');
  const tealGrad = ctx.createLinearGradient(0, 0, 0, 240);
  tealGrad.addColorStop(0, 'rgba(0, 229, 201, 0.45)');
  tealGrad.addColorStop(1, 'rgba(0, 229, 201, 0.0)');

  pharmacyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Prescriptions Fulfilled (k/mo)',
          data: [108, 114, 122, 128, 134, 138, 142, 145, 148.2, 152],
          borderColor: '#00e5c9',
          borderWidth: 3,
          backgroundColor: tealGrad,
          fill: true,
          tension: 0.38,
          pointBackgroundColor: '#00e5c9',
          pointRadius: 4
        },
        {
          label: 'Stockout Prevention Index (%)',
          data: [99.2, 99.4, 99.6, 99.7, 99.8, 99.9, 100, 100, 100, 100],
          borderColor: '#f43f5e',
          borderWidth: 2,
          borderDash: [4, 4],
          fill: false,
          tension: 0.2,
          pointBackgroundColor: '#f43f5e',
          pointRadius: 3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: textColor, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: isLight ? '#ffffff' : '#0f172a',
          titleColor: isLight ? '#0f172a' : '#f8fafc',
          bodyColor: isLight ? '#334155' : '#cbd5e1',
          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, callback: (v) => `${v}k` } },
        y1: {
          position: 'right',
          grid: { display: false },
          ticks: { color: textColor, callback: (v) => `${v}%` },
          min: 95,
          max: 100
        }
      }
    }
  });
}

/* 3.5 Dashboard Carousel Slider Controller */
function initDashboardCarousel() {
  const track = document.getElementById('dashboardCarouselTrack');
  const slides = document.querySelectorAll('.dashboard-slide');
  const tabBtns = document.querySelectorAll('.dash-tab-btn');
  const indicatorDots = document.querySelectorAll('.carousel-indicator-dot');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const activeLabel = document.getElementById('carouselActiveIndicator');
  const container = document.querySelector('.dashboard-carousel-container');

  if (!track || slides.length === 0) return;

  let currentSlide = 0;
  let autoPlayTimer = null;
  const totalSlides = slides.length;

  const slideTitles = [
    'Dashboard 1 of 4: Power BI • Sales & Marketing',
    'Dashboard 2 of 4: Tableau • E-Commerce & Retail',
    'Dashboard 3 of 4: Qlik Sense • Corporate Finance',
    'Dashboard 4 of 4: Pharmacy Operations & AI Copilot'
  ];

  const activeTabClasses = [
    ['border-amber-500/40', 'bg-amber-500/10', 'text-amber-300'],
    ['border-sky-500/40', 'bg-sky-500/10', 'text-sky-300'],
    ['border-emerald-500/40', 'bg-emerald-500/10', 'text-emerald-300'],
    ['border-teal-500/40', 'bg-teal-500/10', 'text-teal-300']
  ];

  function setSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update slides visibility
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active-slide');
      } else {
        slide.classList.remove('active-slide');
      }
    });

    // Update tabs
    tabBtns.forEach((btn, i) => {
      btn.className = 'dash-tab-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border ';
      if (i === currentSlide) {
        btn.classList.add('active', ...activeTabClasses[i]);
      } else {
        btn.classList.add('border-transparent', 'text-slate-400', 'hover:text-white', 'hover:bg-slate-800/50');
      }
    });

    // Update dots
    indicatorDots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.className = 'carousel-indicator-dot active w-8 h-2 rounded-full bg-teal-400 cursor-pointer';
      } else {
        dot.className = 'carousel-indicator-dot w-2 h-2 rounded-full bg-slate-700 hover:bg-slate-500 cursor-pointer';
      }
    });

    if (activeLabel) {
      activeLabel.textContent = slideTitles[currentSlide];
    }

    // Refresh charts on slide change
    setTimeout(() => {
      [salesChartInstance, ecommerceChartInstance, financeChartInstance, pharmacyChartInstance].forEach(chart => {
        if (chart) chart.resize();
      });
      if (window.lucide) window.lucide.createIcons();
    }, 150);
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      setSlide(currentSlide - 1);
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      setSlide(currentSlide + 1);
      resetAutoPlay();
    });
  }

  // Tab click listeners
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-slide-index'), 10);
      setSlide(idx);
      resetAutoPlay();
    });
  });

  // Indicator dot click listeners
  indicatorDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide-index'), 10);
      setSlide(idx);
      resetAutoPlay();
    });
  });

  // Touch Swipe for Mobile
  let startX = 0;
  let endX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setSlide(currentSlide + 1);
      } else {
        setSlide(currentSlide - 1);
      }
      resetAutoPlay();
    }
  }, { passive: true });

  // Autoplay function (every 8 seconds, pauses on hover)
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      setSlide(currentSlide + 1);
    }, 8000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  if (container) {
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* 3.6 Embedded Pharmacy AI Chatbot */
function initPharmacyChatbot() {
  const form = document.getElementById('pharmacyChatForm');
  const input = document.getElementById('pharmacyChatInput');
  const messagesContainer = document.getElementById('pharmacyChatMessages');
  const promptChips = document.querySelectorAll('.pharmacy-prompt-chip');

  if (!form || !messagesContainer) return;

  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex items-start justify-end gap-2 text-right';
    msgDiv.innerHTML = `
      <div class="p-2.5 rounded-xl rounded-tr-sm bg-teal-500/20 border border-teal-500/30 text-teal-200 text-[11px] leading-relaxed max-w-[85%]">
        ${escapeHtml(text)}
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendBotMessage(html) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex items-start gap-2';
    msgDiv.innerHTML = `
      <div class="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
        <i data-lucide="bot" class="w-3 h-3"></i>
      </div>
      <div class="p-2.5 rounded-xl rounded-tl-sm bg-slate-900 border border-white/10 text-slate-200 text-[11px] leading-relaxed max-w-[90%] shadow-md">
        ${html}
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }

  function getPharmacyResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('amoxicillin') || q.includes('ozempic') || q.includes('stock')) {
      return `
        <div class="font-bold text-teal-400 mb-1 flex items-center gap-1.5">
          <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Live Pharmacy Inventory Query:
        </div>
        <div class="space-y-1.5 text-slate-300">
          <div>&bull; <strong>Amoxicillin 500mg:</strong> <span class="text-emerald-400 font-mono">4,250 units</span> (Optimal, 28 days reserve). Safety buffer SLA: Met.</div>
          <div>&bull; <strong>Ozempic 2mg/3ml:</strong> <span class="text-amber-400 font-mono">180 pens</span> (Reorder threshold triggered). Next McKesson delivery scheduled: Nov 12.</div>
          <div class="text-[10px] text-slate-400 mt-1">Status: Zero out-of-stock incidents across all 24 regional pharmacies.</div>
        </div>
      `;
    }

    if (q.includes('warfarin') || q.includes('ibuprofen') || q.includes('interaction')) {
      return `
        <div class="font-bold text-rose-400 mb-1 flex items-center gap-1.5">
          <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> High Severity Clinical Alert:
        </div>
        <div class="space-y-1.5 text-slate-300">
          <div><strong>Warfarin (Anticoagulant) + Ibuprofen (NSAID):</strong></div>
          <div class="text-rose-200">Contraindicated. Co-administration significantly increases gastrointestinal hemorrhage risk and INR volatility.</div>
          <div class="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300 font-semibold">
            Clinical Recommendation: Substitute with Acetaminophen (Tylenol) for mild-to-moderate analgesia.
          </div>
        </div>
      `;
    }

    if (q.includes('forecast') || q.includes('winter') || q.includes('demand')) {
      return `
        <div class="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
          <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> ML Refill Demand Forecast (Q4/Winter):
        </div>
        <div class="space-y-1.5 text-slate-300">
          <div>&bull; Predicted <strong>+38.5% demand surge</strong> in pediatric antibiotics (Amox/Clav & Azithromycin).</div>
          <div>&bull; Automated procurement order generated for <strong>8,500 reserve units</strong> to preserve 0% stockout SLA.</div>
          <div class="text-[10px] text-teal-400">Model Confidence: 99.4% based on 5-year regional historical epidemiological data.</div>
        </div>
      `;
    }

    return `
      <div class="text-slate-300">
        <strong>RxClinical AI:</strong> Analyzed formulary query for <em>"${escapeHtml(query)}"</em>.<br>
        Verified across FDA NDC directory and live inventory lakehouse. All 24 outlets report healthy formulary compliance (97.6%) and zero active safety recalls.
      </div>
    `;
  }

  function handleQuery(queryText) {
    if (!queryText.trim()) return;
    appendUserMessage(queryText);
    if (input) input.value = '';

    // Show typing state
    const typingDiv = document.createElement('div');
    typingDiv.id = 'pharmacyTypingIndicator';
    typingDiv.className = 'flex items-center gap-2 text-[10px] text-teal-400 font-mono py-1';
    typingDiv.innerHTML = '<span class="animate-spin inline-block">⚙️</span> RxClinical AI querying pharmacy lakehouse...';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
      const indicator = document.getElementById('pharmacyTypingIndicator');
      if (indicator) indicator.remove();
      const botResponse = getPharmacyResponse(queryText);
      appendBotMessage(botResponse);
    }, 600);
  }

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input && input.value) {
      handleQuery(input.value);
    }
  });

  // Handle prompt chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-question');
      if (q) handleQuery(q);
    });
  });
}

function updateChartThemes(isLight) {
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';

  [salesChartInstance, ecommerceChartInstance, financeChartInstance, pharmacyChartInstance, biDashboardChartInstance].forEach(chart => {
    if (!chart) return;
    if (chart.options.scales.x) {
      chart.options.scales.x.grid.color = gridColor;
      chart.options.scales.x.ticks.color = textColor;
    }
    if (chart.options.scales.y) {
      chart.options.scales.y.grid.color = gridColor;
      chart.options.scales.y.ticks.color = textColor;
    }
    if (chart.options.scales.y1) {
      chart.options.scales.y1.ticks.color = textColor;
    }
    if (chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = textColor;
    }
    chart.update();
  });
}

/* ==========================================================================
   4. Interactive Dashboard Tabs
   ========================================================================== */
function initDashboardTabs() {
  const tabs = document.querySelectorAll('.demo-tab-btn');
  const panels = document.querySelectorAll('.demo-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => {
        t.classList.remove('active', 'border-teal-400', 'text-teal-400', 'bg-teal-500/10');
        t.classList.add('text-slate-400', 'border-transparent');
      });

      tab.classList.add('active', 'border-teal-400', 'text-teal-400', 'bg-teal-500/10');
      tab.classList.remove('text-slate-400', 'border-transparent');

      panels.forEach(p => {
        if (p.id === targetId) {
          p.classList.remove('hidden');
        } else {
          p.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive ROI & Churn Forecaster
   ========================================================================== */
function initRoiCalculator() {
  const recordsSlider = document.getElementById('calc-records');
  const hoursSlider = document.getElementById('calc-hours');
  const churnSlider = document.getElementById('calc-churn');

  const recordsValText = document.getElementById('calc-records-val');
  const hoursValText = document.getElementById('calc-hours-val');
  const churnValText = document.getElementById('calc-churn-val');

  const savingsOutput = document.getElementById('calc-savings-out');
  const hoursSavedOutput = document.getElementById('calc-hours-saved-out');
  const accuracyOutput = document.getElementById('calc-accuracy-out');

  function calculate() {
    if (!recordsSlider || !hoursSlider || !churnSlider) return;

    const records = parseInt(recordsSlider.value, 10);
    const manualHours = parseInt(hoursSlider.value, 10);
    const churn = parseFloat(churnSlider.value);

    // Update value displays
    if (recordsValText) recordsValText.textContent = `${records.toLocaleString()}k`;
    if (hoursValText) hoursValText.textContent = `${manualHours} hrs/wk`;
    if (churnValText) churnValText.textContent = `${churn}%`;

    // 80% manual effort reduction at estimated $65/hr consultant/analyst rate
    const annualHoursSaved = Math.round(manualHours * 52 * 0.80);
    const laborSavings = annualHoursSaved * 65;
    
    // Efficiency savings from unified lakehouse + automated churn prevention
    const churnRetainedValue = Math.round((records * 1000) * (churn / 100) * 0.35 * 120);
    const totalAnnualSavings = laborSavings + Math.min(churnRetainedValue, 380000);

    if (savingsOutput) {
      savingsOutput.textContent = `$${totalAnnualSavings.toLocaleString()}`;
    }
    if (hoursSavedOutput) {
      hoursSavedOutput.textContent = `${annualHoursSaved.toLocaleString()} hrs/yr`;
    }
    if (accuracyOutput) {
      const predAccuracy = (92.5 + (records > 200 ? 5.5 : records * 0.02)).toFixed(1);
      accuracyOutput.textContent = `${Math.min(predAccuracy, 99.4)}%`;
    }
  }

  [recordsSlider, hoursSlider, churnSlider].forEach(slider => {
    if (slider) slider.addEventListener('input', calculate);
  });

  calculate();
}

/* ==========================================================================
   6. Technology Filter Tabs
   ========================================================================== */
function initTechFilter() {
  const filterBtns = document.querySelectorAll('.tech-filter-btn');
  const techCards = document.querySelectorAll('.tech-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-tech-filter');

      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-teal-500', 'text-slate-950', 'font-semibold');
        b.classList.add('bg-slate-800/60', 'text-slate-300');
      });

      btn.classList.add('active', 'bg-teal-500', 'text-slate-950', 'font-semibold');
      btn.classList.remove('bg-slate-800/60', 'text-slate-300');

      techCards.forEach(card => {
        const cardCat = card.getAttribute('data-tech-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   7. Core Services Filter
   ========================================================================== */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-service-filter');

      filterBtns.forEach(b => {
        b.classList.remove('active', 'border-teal-400', 'text-teal-400', 'bg-teal-500/10');
        b.classList.add('border-slate-700/60', 'text-slate-400');
      });

      btn.classList.add('active', 'border-teal-400', 'text-teal-400', 'bg-teal-500/10');
      btn.classList.remove('border-slate-700/60', 'text-slate-400');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   8. Live Data Pipeline Architecture Simulator
   ========================================================================== */
function initPipelineSimulator() {
  const triggerBtn = document.getElementById('triggerPipelineBatchBtn');
  const logContainer = document.getElementById('pipelineConsoleLogs');
  const statusBadge = document.getElementById('pipelineStatusBadge');
  const throughputCounter = document.getElementById('pipelineThroughputCounter');
  const latencyBadge = document.getElementById('pipelineLatencyBadge');

  if (!triggerBtn || !logContainer) return;

  const sampleLogs = [
    { text: '[ADF Trigger] Scheduled incremental batch initiated from 4 enterprise sources.', color: 'text-slate-400' },
    { text: '[Extract] Ingesting 142,500 records from SAP HANA & Salesforce CRM...', color: 'text-sky-400' },
    { text: '[PySpark / Databricks] Executing schema validation & deduplication matrix...', color: 'text-purple-400' },
    { text: '[Microsoft Fabric / Snowflake] Delta parquet lakehouse partition completed (2.1s).', color: 'text-teal-400' },
    { text: '[AI Inference] LangChain & ML model score computed: 0 anomalies, 99.4% confidence.', color: 'text-emerald-400' },
    { text: '[Power BI DirectLake] Semantic semantic model cache synced for 180 executive users.', color: 'text-teal-300' }
  ];

  triggerBtn.addEventListener('click', () => {
    triggerBtn.disabled = true;
    triggerBtn.innerHTML = '<span class="animate-spin inline-block mr-2">⚙️</span> Processing Data Batch...';
    if (statusBadge) {
      statusBadge.textContent = '● SYNCING BATCH';
      statusBadge.className = 'text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30';
    }

    logContainer.innerHTML = '';
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < sampleLogs.length) {
        const item = sampleLogs[currentIdx];
        const logLine = document.createElement('div');
        logLine.className = `font-mono text-xs py-1 transition-all ${item.color}`;
        const timestamp = new Date().toLocaleTimeString();
        logLine.textContent = `[${timestamp}] ${item.text}`;
        logContainer.appendChild(logLine);
        logContainer.scrollTop = logContainer.scrollHeight;
        currentIdx++;
      } else {
        clearInterval(interval);
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 inline mr-1"></i> Trigger New Pipeline Batch';
        if (window.lucide) window.lucide.createIcons();
        if (statusBadge) {
          statusBadge.textContent = '● ACTIVE & OPTIMIZED';
          statusBadge.className = 'text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        }
        if (throughputCounter) {
          throughputCounter.textContent = '1.45M rows/sec';
        }
        if (latencyBadge) {
          latencyBadge.textContent = '8.4 ms';
        }
      }
    }, 600);
  });
}

/* ==========================================================================
   9. AI Chatbot Assistant ("Anatech AI Advisor")
   ========================================================================== */
function initChatbot() {
  const toggleBtn = document.getElementById('chatbotToggleBtn');
  const closeBtn = document.getElementById('chatbotCloseBtn');
  const chatWindow = document.getElementById('chatbotWindow');
  const messagesContainer = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const suggestionChips = document.querySelectorAll('.chat-suggestion-chip');

  if (!toggleBtn || !chatWindow) return;

  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden-chat');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.add('hidden-chat');
    });
  }

  function appendMessage(text, sender = 'bot', hasCta = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`;

    const bubble = document.createElement('div');
    bubble.className = sender === 'user'
      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-slate-950 font-medium px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-md'
      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] text-sm shadow-md';

    bubble.innerHTML = text;

    if (hasCta) {
      const ctaBtn = document.createElement('button');
      ctaBtn.className = 'mt-2.5 block w-full py-1.5 px-3 bg-teal-400/20 hover:bg-teal-400/30 text-teal-300 border border-teal-400/40 rounded-lg text-xs font-semibold text-center transition-colors';
      ctaBtn.textContent = '📅 Schedule Free Consultation';
      ctaBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden-chat');
        openBookingModal();
      });
      bubble.appendChild(ctaBtn);
    }

    msgDiv.appendChild(bubble);
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function handleUserInput(input) {
    const query = input.trim();
    if (!query) return;

    appendMessage(query, 'user');
    chatInput.value = '';

    // Typing simulation
    setTimeout(() => {
      generateAiResponse(query);
    }, 600);
  }

  function generateAiResponse(query) {
    const lower = query.toLowerCase();

    if (lower.includes('power bi') || lower.includes('tableau') || lower.includes('looker') || lower.includes('bi')) {
      appendMessage(
        "Great question! We design enterprise dashboards in <strong>Power BI, Tableau, and Looker</strong>. If your stack is Microsoft-based (Azure, Fabric, 365), Power BI with DirectLake offers unmatched speed and cost efficiency. For multi-cloud visual exploration, Tableau or Looker Studio is also ideal. Would you like a 1-on-1 architecture review?",
        'bot',
        true
      );
    } else if (lower.includes('migration') || lower.includes('cloud') || lower.includes('snowflake') || lower.includes('fabric')) {
      appendMessage(
        "We specialize in <strong>zero-downtime data migration</strong> from legacy on-prem systems (SQL Server, Oracle, SAP) into <strong>Microsoft Fabric, Snowflake, and Databricks</strong>. We include automated schema translation, ETL refactoring, and data validation matrices.",
        'bot',
        true
      );
    } else if (lower.includes('automate') || lower.includes('automation') || lower.includes('rpa') || lower.includes('time')) {
      appendMessage(
        "Our business process automation leverages <strong>Power Automate & UiPath</strong> to eliminate manual Excel preparation and recurring reports—saving clients an average of <strong>80% manual hours</strong> per reporting cycle.",
        'bot',
        true
      );
    } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('generative') || lower.includes('llm') || lower.includes('churn')) {
      appendMessage(
        "We build production-ready <strong>AI & Machine Learning solutions</strong>: predictive churn modeling, demand forecasting, recommendation systems, and domain-specific GenAI/LangChain assistants with secure enterprise governance.",
        'bot',
        true
      );
    } else if (lower.includes('cost') || lower.includes('pricing') || lower.includes('consultation') || lower.includes('book') || lower.includes('call')) {
      appendMessage(
        "We offer flexible engagement models: sprint-based project delivery, dedicated data engineering pods, and fixed-scope strategy assessments. Every engagement starts with a <strong>Free Strategy Consultation</strong> to assess your architecture and ROI.",
        'bot',
        true
      );
    } else {
      appendMessage(
        `Thank you for asking! Anatech Data Labs helps organizations turn complex data into measurable revenue through <strong>Analytics, Data Engineering, Automation, and Custom AI</strong>. Let's discuss your specific goals during a free consultation.`,
        'bot',
        true
      );
    }
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => handleUserInput(chatInput.value));
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleUserInput(chatInput.value);
      }
    });
  }

  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent;
      handleUserInput(prompt);
    });
  });
}

/* ==========================================================================
   10. Booking Modal & Interactive Calendar
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.open-booking-modal-btn');
  const closeBtns = document.querySelectorAll('.close-booking-modal-btn');
  const bookingForm = document.getElementById('bookingModalForm');
  const confirmationCard = document.getElementById('bookingConfirmationCard');
  const formContainer = document.getElementById('bookingFormContainer');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeBookingModal();
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });
  }

  // Slot selector
  const slotChips = document.querySelectorAll('.calendar-slot-chip');
  const selectedTimeInput = document.getElementById('selectedTimeInput');
  slotChips.forEach(chip => {
    chip.addEventListener('click', () => {
      slotChips.forEach(c => c.classList.remove('bg-teal-500', 'text-slate-950', 'border-teal-400'));
      chip.classList.add('bg-teal-500', 'text-slate-950', 'border-teal-400');
      if (selectedTimeInput) {
        selectedTimeInput.value = chip.textContent.trim();
      }
    });
  });

  // Calendar day selector
  const dayChips = document.querySelectorAll('.calendar-day-btn');
  const selectedDateInput = document.getElementById('selectedDateInput');
  dayChips.forEach(day => {
    day.addEventListener('click', () => {
      dayChips.forEach(d => d.classList.remove('bg-teal-500', 'text-slate-950', 'font-bold'));
      day.classList.add('bg-teal-500', 'text-slate-950', 'font-bold');
      if (selectedDateInput) {
        const dayText = day.innerText.replace('\n', ' ').trim();
        selectedDateInput.value = dayText;
      }
    });
  });

  // Helper to construct mailto link
  function buildMailtoLink(subject, fields) {
    let body = "Hello Anatech Data Labs Team,\n\nI have submitted an inquiry from your website:\n\n";
    for (const [k, v] of Object.entries(fields)) {
      if (!k.startsWith('_') && k !== 'form-name' && k !== 'bot-field' && v) {
        body += `${k.replace(/_/g, ' ').toUpperCase()}: ${v}\n`;
      }
    }
    body += "\n---\nSent via Anatech Data Labs Website";
    return `mailto:anatechdatalabs@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // Helper to send email inquiry to anatechdatalabs@gmail.com
  async function sendEnquiryEmail(formElement, subject, mailtoBtnId, fallbackCallback) {
    const formData = new FormData(formElement);
    const dataObj = Object.fromEntries(formData.entries());
    const mailtoUrl = buildMailtoLink(subject, dataObj);

    const mailtoBtn = document.getElementById(mailtoBtnId);
    if (mailtoBtn) {
      mailtoBtn.href = mailtoUrl;
    }

    // 1. If running on Netlify (HTTP/HTTPS), dispatch to Netlify Forms
    if (window.location.protocol.startsWith('http')) {
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
      } catch (err) {
        console.warn('Netlify form notice:', err);
      }
    }

    // 2. If running locally on PC (file:// protocol), trigger mailto directly
    if (window.location.protocol === 'file:') {
      try {
        window.location.href = mailtoUrl;
      } catch (e) {
        // browser handled
      }
    }

    if (fallbackCallback) fallbackCallback();
    if (window.lucide) window.lucide.createIcons();
  }

  // Form submit for modal booking
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> Reserving & Notifying Consultant...';
      }

      await sendEnquiryEmail(bookingForm, 'New Consultation Appointment Booking', 'modalDirectMailtoLink', () => {
        if (formContainer && confirmationCard) {
          formContainer.classList.add('hidden');
          confirmationCard.classList.remove('hidden');
        }
      });
    });
  }

  // Handle inline contact section form
  const inlineForm = document.getElementById('inlineContactForm');
  const inlineSuccess = document.getElementById('inlineContactSuccess');
  if (inlineForm) {
    inlineForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = inlineForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> Routing to anatechdatalabs@gmail.com...';
      }

      await sendEnquiryEmail(inlineForm, 'New Website Inquiry - Anatech Data Labs', 'inlineDirectMailtoLink', () => {
        inlineForm.classList.add('hidden');
        if (inlineSuccess) {
          inlineSuccess.classList.remove('hidden');
        }
      });
    });
  }
}

function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

/* ==========================================================================
   11. Case Study Detail Modal
   ========================================================================== */
function initCaseStudyModal() {
  const modal = document.getElementById('caseStudyModal');
  const openBtns = document.querySelectorAll('.open-case-study-btn');
  const closeBtns = document.querySelectorAll('.close-case-study-modal-btn');
  const titleEl = document.getElementById('caseStudyModalTitle');
  const clientEl = document.getElementById('caseStudyModalClient');
  const descEl = document.getElementById('caseStudyModalDesc');
  const metricsEl = document.getElementById('caseStudyModalMetrics');
  const stackEl = document.getElementById('caseStudyModalStack');

  const studyData = {
    '1': {
      title: 'Enterprise Power BI Executive Reporting Suite',
      client: 'OmniRetail Global (Tier-1 Retailer)',
      desc: 'OmniRetail suffered from fragmented multi-brand sales data, taking 14 days after month-end to generate executive reports. Anatech Data Labs built a centralized data warehouse in Microsoft Fabric and deployed interactive Power BI dashboards with real-time basket analysis and inventory forecasting.',
      metrics: [
        { label: 'Revenue Uplift', value: '+25%' },
        { label: 'Reporting Lead Time', value: '14 Days ➔ 2 Mins' },
        { label: 'Stockout Reduction', value: '-34%' }
      ],
      stack: ['Power BI', 'Microsoft Fabric', 'Azure Data Factory', 'DAX', 'SQL']
    },
    '2': {
      title: 'Automated Financial & Operations Reporting',
      client: 'FinCorp Advisory Group (Financial Services)',
      desc: 'FinCorp analysts were spending over 120 manual hours each month compiling financial compliance and operational reports across multiple legacy platforms. We designed an automated RPA & Power Automate workflow that handles data ingestion, reconciliation, anomaly detection, and automated report delivery.',
      metrics: [
        { label: 'Manual Effort Reduced', value: '-80%' },
        { label: 'Annual Cost Savings', value: '$180,000' },
        { label: 'Error Rate', value: '0.0%' }
      ],
      stack: ['Power Automate', 'UiPath', 'Azure Functions', 'Excel Analytics', 'SQL Server']
    },
    '3': {
      title: 'AI Machine Learning Demand & Churn Forecasting',
      client: 'LogiTech Logistics (Supply Chain Enterprise)',
      desc: 'Unpredictable customer churn and volatile demand caused excess warehouse overhead and lost revenue. Anatech Data Labs created custom gradient-boosted ML pipelines on Databricks with PySpark, predicting customer churn 60 days in advance and forecasting product demand with high accuracy.',
      metrics: [
        { label: 'Demand Prediction Accuracy', value: '+35%' },
        { label: 'Churn Prevention ROI', value: '$2.4M Saved' },
        { label: 'Model Latency', value: '< 45ms' }
      ],
      stack: ['Databricks', 'PySpark', 'Azure AI', 'Python', 'MLflow', 'Tableau']
    }
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-study-id');
      const data = studyData[id];
      if (!data || !modal) return;

      if (titleEl) titleEl.textContent = data.title;
      if (clientEl) clientEl.textContent = data.client;
      if (descEl) descEl.textContent = data.desc;

      if (metricsEl) {
        metricsEl.innerHTML = data.metrics.map(m => `
          <div class="p-3 rounded-xl bg-slate-900/60 border border-teal-500/20 text-center">
            <div class="text-xl font-extrabold text-teal-400">${m.value}</div>
            <div class="text-xs text-slate-400 mt-0.5">${m.label}</div>
          </div>
        `).join('');
      }

      if (stackEl) {
        stackEl.innerHTML = data.stack.map(s => `
          <span class="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-teal-300 border border-slate-700/80 font-mono">${s}</span>
        `).join('');
      }

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    });
  }
}

/* ==========================================================================
   12. Mobile Menu Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggleBtn');
  const menuDrawer = document.getElementById('mobileMenuDrawer');
  const closeBtn = document.getElementById('mobileMenuCloseBtn');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !menuDrawer) return;

  toggleBtn.addEventListener('click', () => {
    menuDrawer.classList.toggle('hidden');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      menuDrawer.classList.add('hidden');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuDrawer.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   13. Sticky Navbar with Blur & Active Links
   ========================================================================== */
function initStickyNav() {
  const navbar = document.getElementById('mainNavbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('py-3', 'shadow-xl', 'bg-slate-950/80', 'backdrop-blur-md');
        navbar.classList.remove('py-5', 'bg-transparent');
      } else {
        navbar.classList.remove('py-3', 'shadow-xl', 'bg-slate-950/80', 'backdrop-blur-md');
        navbar.classList.add('py-5', 'bg-transparent');
      }
    }

    // Scrollspy for active nav link
    let currentSection = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-teal-400');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('text-teal-400');
      }
    });
  });
}
