
const myIpEl = document.getElementById('my-ip');
const refreshBtn = document.getElementById('refresh-ip');
const searchBtn = document.getElementById('search-ip');
const ipInput = document.getElementById('ip-input');
const resultSection = document.getElementById('result-section');
const resultPre = document.getElementById('result');
const downloadBtn = document.getElementById('download-report');

const { jsPDF } = window.jspdf;

async function fetchMyIP() {
  myIpEl.textContent = "Chargement...";
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    myIpEl.textContent = data.ip;
  } catch (e) {
    myIpEl.textContent = "Erreur lors du chargement";
  }
}

async function lookupIP(ip) {
  try {
    resultPre.textContent = "Chargement...";
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,continent,country,regionName,city,isp,query`);
    const data = await res.json();
    if(data.status === "fail") {
      resultPre.textContent = "Erreur : " + data.message;
      return null;
    }
    resultPre.textContent = JSON.stringify(data, null, 2);
    resultSection.style.display = 'block';
    return data;
  } catch (e) {
    resultPre.textContent = "Erreur réseau";
    return null;
  }
}

function downloadPDF(data) {
  if(!data) return;
  const doc = new jsPDF();
  doc.setTextColor(0, 255, 153);
  doc.setFontSize(18);
  doc.text("Rapport IP Lookup", 10, 20);
  doc.setFontSize(12);
  const content = `
IP Recherchée : ${data.query}
Continent : ${data.continent}
Pays : ${data.country}
Région : ${data.regionName}
Ville : ${data.city}
Fournisseur : ${data.isp}
  `;
  doc.text(content, 10, 40);
  doc.save(`rapport-ip-${data.query.replace(/\./g,'-')}.pdf`);
}

refreshBtn.addEventListener('click', () => {
  fetchMyIP();
});

searchBtn.addEventListener('click', async () => {
  const ip = ipInput.value.trim();
  if(!ip) {
    alert("Entrez une IP valide");
    return;
  }
  const data = await lookupIP(ip);
  downloadBtn.disabled = !data;
});

downloadBtn.addEventListener('click', () => {
  const data = JSON.parse(resultPre.textContent);
  downloadPDF(data);
});

window.onload = () => {
  fetchMyIP();
  downloadBtn.disabled = true;
};
