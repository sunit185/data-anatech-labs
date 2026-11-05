/**
 * Data Anatech Labs - Enterprise Interactive Script
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
   3. Chart.js Implementations (Hero, BI Preview, Forecast)
   ========================================================================== */
let heroChartInstance = null;
let biDashboardChartInstance = null;

function initCharts() {
  initHeroChart();
  initBiDashboardChart();
}

function initHeroChart() {
  const canvas = document.getElementById('heroChartCanvas');
  if (!canvas || !window.Chart) return;

  const isLight = document.body.classList.contains('light-theme');
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';

  const ctx = canvas.getContext('2d');
  
  // Teal gradient
  const tealGradient = ctx.createLinearGradient(0, 0, 0, 260);
  tealGradient.addColorStop(0, 'rgba(0, 229, 201, 0.45)');
  tealGradient.addColorStop(1, 'rgba(0, 229, 201, 0.0)');

  // Purple gradient
  const purpleGradient = ctx.createLinearGradient(0, 0, 0, 260);
  purpleGradient.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
  purpleGradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');

  heroChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Data ROI Growth ($M)',
          data: [4.2, 5.1, 6.4, 7.8, 9.2, 10.9, 12.1, 13.5, 14.8, 16.4],
          borderColor: '#00e5c9',
          borderWidth: 3,
          backgroundColor: tealGradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00e5c9',
          pointRadius: 4,
          pointHoverRadius: 7
        },
        {
          label: 'Data Pipeline Efficiency (%)',
          data: [65, 71, 78, 84, 88, 92, 95, 97, 98.4, 99.2],
          borderColor: '#a855f7',
          borderWidth: 2,
          backgroundColor: purpleGradient,
          borderDash: [5, 5],
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#a855f7',
          pointRadius: 3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: textColor,
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
            boxWidth: 12
          }
        },
        tooltip: {
          backgroundColor: isLight ? '#ffffff' : '#0f172a',
          titleColor: isLight ? '#0f172a' : '#f8fafc',
          bodyColor: isLight ? '#334155' : '#cbd5e1',
          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: "'Plus Jakarta Sans', sans-serif" } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, callback: (v) => `$${v}M` }
        },
        y1: {
          position: 'right',
          grid: { display: false },
          ticks: { color: textColor, callback: (v) => `${v}%` },
          min: 50,
          max: 100
        }
      }
    }
  });

  // Timeframe buttons toggle
  const timeBtns = document.querySelectorAll('.hero-timeframe-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      timeBtns.forEach(b => b.classList.remove('bg-teal-500/20', 'text-teal-400', 'border-teal-500/40'));
      e.target.classList.add('bg-teal-500/20', 'text-teal-400', 'border-teal-500/40');
      
      const frame = e.target.getAttribute('data-frame');
      if (frame === '1M') {
        heroChartInstance.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        heroChartInstance.data.datasets[0].data = [14.2, 14.8, 15.6, 16.4];
        heroChartInstance.data.datasets[1].data = [96, 97.2, 98.1, 99.2];
      } else if (frame === '3M') {
        heroChartInstance.data.labels = ['Month 1', 'Month 2', 'Month 3'];
        heroChartInstance.data.datasets[0].data = [12.1, 14.8, 16.4];
        heroChartInstance.data.datasets[1].data = [94.5, 97.8, 99.2];
      } else {
        heroChartInstance.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
        heroChartInstance.data.datasets[0].data = [4.2, 5.1, 6.4, 7.8, 9.2, 10.9, 12.1, 13.5, 14.8, 16.4];
        heroChartInstance.data.datasets[1].data = [65, 71, 78, 84, 88, 92, 95, 97, 98.4, 99.2];
      }
      heroChartInstance.update();
    });
  });
}

function initBiDashboardChart() {
  const canvas = document.getElementById('biDashboardCanvas');
  if (!canvas || !window.Chart) return;

  const isLight = document.body.classList.contains('light-theme');
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';

  const ctx = canvas.getContext('2d');

  biDashboardChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'],
      datasets: [
        {
          label: 'Actual Revenue ($M)',
          data: [28.4, 19.8, 22.3, 11.2, 8.9],
          backgroundColor: '#00e5c9',
          borderRadius: 6
        },
        {
          label: 'Target KPI ($M)',
          data: [25.0, 18.0, 20.0, 10.0, 8.0],
          backgroundColor: 'rgba(56, 189, 248, 0.45)',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor, font: { family: "'Plus Jakarta Sans', sans-serif" } }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, callback: (v) => `$${v}M` }
        }
      }
    }
  });
}

function updateChartThemes(isLight) {
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';

  [heroChartInstance, biDashboardChartInstance].forEach(chart => {
    if (!chart) return;
    if (chart.options.scales.x) {
      chart.options.scales.x.grid.color = gridColor;
      chart.options.scales.x.ticks.color = textColor;
    }
    if (chart.options.scales.y) {
      chart.options.scales.y.grid.color = gridColor;
      chart.options.scales.y.ticks.color = textColor;
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
        `Thank you for asking! Data Anatech Labs helps organizations turn complex data into measurable revenue through <strong>Analytics, Data Engineering, Automation, and Custom AI</strong>. Let's discuss your specific goals during a free consultation.`,
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
    let body = "Hello Data Anatech Labs Team,\n\nI have submitted an inquiry from your website:\n\n";
    for (const [k, v] of Object.entries(fields)) {
      if (!k.startsWith('_') && k !== 'form-name' && k !== 'bot-field' && v) {
        body += `${k.replace(/_/g, ' ').toUpperCase()}: ${v}\n`;
      }
    }
    body += "\n---\nSent via Data Anatech Labs Website";
    return `mailto:kamblesunit7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // Helper to send email inquiry to kamblesunit7@gmail.com
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
        submitBtn.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> Routing to kamblesunit7@gmail.com...';
      }

      await sendEnquiryEmail(inlineForm, 'New Website Inquiry - Data Anatech Labs', 'inlineDirectMailtoLink', () => {
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
      desc: 'OmniRetail suffered from fragmented multi-brand sales data, taking 14 days after month-end to generate executive reports. Data Anatech Labs built a centralized data warehouse in Microsoft Fabric and deployed interactive Power BI dashboards with real-time basket analysis and inventory forecasting.',
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
      desc: 'Unpredictable customer churn and volatile demand caused excess warehouse overhead and lost revenue. Data Anatech Labs created custom gradient-boosted ML pipelines on Databricks with PySpark, predicting customer churn 60 days in advance and forecasting product demand with high accuracy.',
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
