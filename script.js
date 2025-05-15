
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

function downloadTXT(data) {
  if (!data) return;

  const asciiArt = `
__/\\\\\\_____/\\\\\\_____/\\\\\\\\\\\\\\\\\\___/\\\\\\________/\\\\\\____/\\\\\\\\\\\\\\\\\\________________/\\\\\\____        
 _\\/\\\\\\\\\\___\\/\\\\\\___/\\\\\\///////\\\\\\_\\/\\\\\\_____/\\\\\\//___/\\\\\\///////\\\\\\____________/\\\\\\\\\\____       
  _\\/\\\\\\/\\\\\\__\\/\\\\\\__\\///______/\\\\\\__\\/\\\\\\__/\\\\\\//_____\\/\\\\\\_____\\/\\\\\\__________/\\\\\\/\\\\\\____      
   _\\/\\\\\\//\\\\\\_\\/\\\\\\_________/\\\\\\//___\\/\\\\\\\\\\\\//\\\\\\_____\\/\\\\\\\\\\\\\\\\\\\\\\/_________/\\\\\\/\\\\\\\\\\____     
    _\\/\\\\\\\\//\\\\\\\\/\\\\\\________\\////\\\\\\__\\/\\\\\\//_\\//\\\\\\____\\/\\\\\\//////\\\\\\_______/\\\\\\/__\\/\\\\\\____    
     _\\/\\\\\\_\\//\\\\\\/\\\\\\___________\\//\\\\\\_\\/\\\\\\____\\//\\\\\\___\\/\\\\\\____\\//\\\\\\____/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_   
      _\\/\\\\\\__\\//\\\\\\\\\\\\__/\\\\\\______/\\\\\\__\\/\\\\\\_____\\//\\\\\\__\\/\\\\\\_____\\//\\\\\\__\\///////////\\\\\\//__  
       _\\/\\\\\\___\\//\\\\\\\\\\_\\///\\\\\\\\\\\\\\\\\\/___\\/\\\\\\______\\//\\\\\\_\\/\\\\\\______\\//\\\\\\___________\\/\\\\\\____ 
        _\\///_____\\/////____\\/////////_____\\///________\\///__\\///________\\///____________\\///_____

IP Recherchée : ${data.query}
Continent     : ${data.continent}
Pays          : ${data.country}
Région        : ${data.regionName}
Ville         : ${data.city}
Fournisseur   : ${data.isp}

https://github.com/n3kr4-1337/ip-lookup
@N3KR4
`.trim();

  const blob = new Blob([asciiArt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const filename = `${data.query}-N3KR4-rapport.txt`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
  downloadTXT(data);
});

window.onload = () => {
  fetchMyIP();
  downloadBtn.disabled = true;
};
