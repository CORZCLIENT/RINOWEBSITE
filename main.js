// main.js - All interactive functionality

// ---- Background particles ----
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const count = 120;
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.5 + 0.5,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    // Draw lines between nearby particles
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---- Toast system ----
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className =
    'toast fixed bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg px-6 py-3 text-white text-sm z-50 shadow-2xl';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3500);
}

// ---- Download buttons ----
function downloadApp() {
  showToast('🙏 Thanks for the support! Download starting...');
  const url = 'https://raw.githubusercontent.com/CORZCLIENT/RINOEXECTOR/main/RINO.exe';
  
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'RINO.exe';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      // Zeige Tutorial nach kurzer Zeit
      setTimeout(() => {
        showTutorial();
      }, 1000);
    })
    .catch(err => {
      console.error('Download error:', err);
      showToast('❌ Download error - trying alternative...');
    });
}

// ---- Tutorial Modal ----
function showTutorial() {
  const modal = document.getElementById('tutorialModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeTutorial() {
  const modal = document.getElementById('tutorialModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// ---- Editor buttons ----
function executeScript() {
  const consoleDiv = document.getElementById('console-log');
  const time = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = 'text-green-400/70 mt-1';
  entry.innerText = `[${time}] [✓] Script executed successfully (no errors)`;
  consoleDiv.appendChild(entry);
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
  showToast('✅ Script executed! Check the console.');
}

function clearScript() {
  const consoleDiv = document.getElementById('console-log');
  consoleDiv.innerHTML = `
    <div class="text-white/20">[System]</div>
    <div class="text-yellow-400/70">[!] Console cleared</div>
  `;
  showToast('🧹 Console cleared.');
}

function saveScript() {
  showToast('💾 Script saved locally (mock action)');
}

function openFile() {
  showToast('📂 File picker opened (mock action)');
}

// ---- FAQ Accordion ----
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      // Close all others
      document.querySelectorAll('.faq-answer').forEach(el => el.classList.remove('open'));
      if (!isOpen) {
        answer.classList.add('open');
      }
    });
  });
});

// ---- Expose functions to global scope for inline onclick attributes ----
window.downloadApp = downloadApp;
window.executeScript = executeScript;
window.clearScript = clearScript;
window.saveScript = saveScript;
window.openFile = openFile;
window.showTutorial = showTutorial;
window.closeTutorial = closeTutorial;
