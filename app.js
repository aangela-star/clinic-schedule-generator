const DAYS = ["週一", "週二", "週三", "週四", "週五", "週六"];
const SLOTS = [
  { key: "早診", label: "早診\n8:30-11:30" },
  { key: "午診", label: "午診\n14:30-17:30" },
  { key: "晚診", label: "晚診\n18:30-20:30" },
];

const DOCTOR_COLOR_MAP = {
  劉晉瑋: "var(--doctor-liu)",
  莊逸玟: "var(--doctor-zhuang)",
  王文達: "var(--doctor-wang)",
  薛琇方: "var(--doctor-xue)",
  蔡玉麟: "var(--doctor-cai)",
  輪班: "var(--doctor-shift)",
};

async function loadSchedule() {
  const response = await fetch("./data/schedule.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("無法讀取班表資料");
  }

  return response.json();
}

function createClinicCard(clinic) {
  const card = document.createElement("section");
  card.className = "clinic-card";

  const header = document.createElement("div");
  header.className = `clinic-header theme-${clinic.theme}`;
  header.textContent = clinic.name;

  const table = document.createElement("table");
  table.className = "clinic-table";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>時段 / 星期</th>
      ${DAYS.map((day) => `<th>${day}</th>`).join("")}
    </tr>
  `;

  const tbody = document.createElement("tbody");

  SLOTS.forEach((slot) => {
    const tr = document.createElement("tr");

    const slotHeader = document.createElement("th");
    slotHeader.innerText = slot.label;
    tr.appendChild(slotHeader);

    DAYS.forEach((day) => {
      const td = document.createElement("td");
      const doctor = clinic.schedule?.[day]?.[slot.key] ?? "●";

      const span = document.createElement("span");
      span.className = doctor === "●" ? "doctor-empty" : "doctor-name";
      span.textContent = doctor;
      span.style.color = DOCTOR_COLOR_MAP[doctor] ?? "#111827";

      td.appendChild(span);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  card.append(header, table);
  return card;
}

function renderPoster(data) {
  document.getElementById("poster-title").textContent = data.title;
  document.getElementById("poster-note").textContent = data.note;

  const clinicsContainer = document.getElementById("clinics-container");
  clinicsContainer.innerHTML = "";
  data.clinics.forEach((clinic) => clinicsContainer.appendChild(createClinicCard(clinic)));

  const changesList = document.getElementById("changes-list");
  changesList.innerHTML = "";
  data.changes.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    changesList.appendChild(li);
  });
}

async function downloadPoster() {
  const poster = document.getElementById("poster");
  const canvas = await html2canvas(poster, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  });

  const link = document.createElement("a");
  link.download = "115年4月_雙院區醫師門診表.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function init() {
  try {
    const data = await loadSchedule();
    renderPoster(data);
  } catch (error) {
    alert(`載入失敗：${error.message}`);
  }

  document.getElementById("download-btn").addEventListener("click", downloadPoster);
}

init();