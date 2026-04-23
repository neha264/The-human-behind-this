// get the current site's host name
const host = window.location.host.replace(/^www\./, "").toLowerCase();

// try to find a matching host in siteData dataset
const match = SITE_DATA.find((entry) =>
  entry.domains.some((domain) => matchesDomain(host, domain))
);

// show pop-up if matches
if (match) {
  showPopup(match);
}

// check if the current host matches a given domain
function matchesDomain(hostnhostame, domain) {
  const cleanedDomain = String(domain)
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");

  // for google specifically, want subdomains (maps.google.com, docs.google.com)
  if (cleanedDomain === "google.com") {
    return host === "google.com" || host.endsWith(".google.com");
  }

  return host === cleanedDomain || host.endsWith("." + cleanedDomain);
}

// pop-up UI
function showPopup(match) {
  // Prevent duplicate popups if script runs multiple times
  if (document.getElementById("ghost-popup")) return;

  const popup = document.createElement("div");
  popup.id = "ghost-popup";

  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.zIndex = "2147483647";
  popup.style.background = "#b5d2dc";
  popup.style.color = "#111";
  popup.style.padding = "16px";
  popup.style.borderRadius = "12px";
  popup.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
  popup.style.fontFamily = "-apple-system, BlinkMacSystemFont, sans-serif";
  popup.style.maxWidth = "360px";
  popup.style.border = "1px solid #e5e5e5";
  popup.style.opacity = "0";
  popup.style.transition = "opacity 0.3s ease";
  popup.style.borderLeft = "3px solid #000";

  // short fade in
  setTimeout(() => {
    popup.style.opacity = "1";
  }, 50);

  // convert sources URLs into readable website
  const sourcesHTML = (match.sources || [])
    .map((url) => {
      try {
        const host = new URL(url).host.replace("www.", "");
        return `<a href="${url}" target="_blank" style="color:#0b57d0; text-decoration: underline;">${host}</a>`;
      } catch {
        // If URL parsing fails, just skip it
        return "";
      }
    })
    .filter(Boolean)
    .join(", ");

  // popup content
  popup.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:start;">
      <div style="font-weight:600; font-size:15px;">
         The Human Behind This
      </div>
      <button id="close-popup" style="
        background:none;
        border:none;
        font-size:18px;
        cursor:pointer;
        line-height:1;
      ">×</button>
    </div>

    <div style="margin-top:10px; font-size:14px; line-height:1.4;">
      <strong>${match.company}</strong> appears to rely on hidden human labor to support systems it presents as autonomous.
    </div>

    <div style="margin-top:12px; font-size:13px;">
      Reporting on this: ${sourcesHTML || '<span style="color:#666;">No sources available.</span>'}
    </div>
  `;

  document.body.appendChild(popup);

  // x out button
  document.getElementById("close-popup").onclick = () => popup.remove();
}