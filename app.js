const days = ["週一", "週二", "週三", "週四", "週五", "週六"];
const sessions = ["早診", "午診", "晚診"];

const state = {
  title: "115年4月 醫師門診時段表",
  clinics: [
    {
      name: "毅安診所",
      schedule: [
        ["劉晉瑋", "莊逸玟", "薛琇方", "莊逸玟", "劉晉瑋", "輪班"],
        ["莊逸玟", "劉晉瑋", "莊逸玟", "王文達", "劉晉瑋", "輪班"],
        ["劉晉瑋", "薛琇方", "王文達", "王文達", "莊逸玟", "輪班"]
      ]
    },
    {
      name: "晉安診所",
      schedule: [
        ["薛琇方", "薛琇方", "劉晉瑋", "劉晉瑋", "薛琇方", "輪班"],
        ["劉晉瑋", "王文達", "王文達", "蔡玉麟", "莊逸玟", "輪班"],
        ["莊逸玟", "王文達", "莊逸玟", "蔡玉麟", "劉晉瑋", "輪班"]
      ]
    }
  ],
  changes: "4/3（四）早診：劉晉瑋 → 王文達\n4/5（六）午診：停診",
  note: "● 黑點表示該時段無醫師看診　請於門診前五分鐘報到"
};

const colorMap = {
  "劉晉瑋": "doctor-liu",
  "莊逸玟": "doctor-chuang",
  "王文達": "doctor-wang",
  "薛琇方": "doctor-hsueh",
  "蔡玉麟": "doctor-tsai",
  "輪班": "doctor-rotation",
  "停診": "doctor-closed"
};

const titleInput = document.getElementById("titleInput");
const clinicsEditor = document.getElementById("clinicsEditor");
const changesInput = document.getElementById("changesInput");
const noteInput = document.getElementById("noteInput");
const downloadBtn = document.getElementById("downloadBtn");

const posterTitle = document.getElementById("posterTitle");
const posterClinics = document.getElementById("posterClinics");
const posterChanges = document.getElementById("posterChanges");
const posterNote = document.getElementById("posterNote");

function buildEditor() {
  clinicsEditor.innerHTML = "";
  state.clinics.forEach((clinic, clinicIndex) => {
    const wrapper = document.createElement("div");
    wrapper.className = "clinic-editor";

    const nameInput = document.createElement("input");
    nameInput.className = "clinic-name";
    nameInput.value = clinic.name;
    nameInput.addEventListener("input", (e) => {
      state.clinics[clinicIndex].name = e.target.value;
      renderPoster();
    });

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `<th>時段</th>${days.map((d) => `<th>${d}</th>`).join("")}`;
    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");
    sessions.forEach((sessionName, rowIndex) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<th>${sessionName}</th>`;
      days.forEach((_, colIndex) => {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.value = clinic.schedule[rowIndex][colIndex] ?? "";
        input.addEventListener("input", (e) => {
          state.clinics[clinicIndex].schedule[rowIndex][colIndex] = e.target.value.trim();
          renderPoster();
        });
        td.appendChild(input);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.append(thead, tbody);
    wrapper.append(nameInput, table);
    clinicsEditor.appendChild(wrapper);
  });
}

function doctorClass(name) {
  return colorMap[name] ?? "";
}

function renderPoster() {
  posterTitle.textContent = state.title || "門診時段表";
  posterChanges.textContent = state.changes;
  posterNote.textContent = state.note;
  posterClinics.innerHTML = "";

  state.clinics.forEach((clinic) => {
    const card = document.createElement("section");
    card.className = "clinic-card";
    const h4 = document.createElement("h4");
    h4.textContent = clinic.name || "未命名診所";

    const table = document.createElement("table");
    table.className = "poster-table";
    const thead = document.createElement("thead");
    thead.innerHTML = `<tr><th>時段</th>${days.map((d) => `<th>${d}</th>`).join("")}</tr>`;
    const tbody = document.createElement("tbody");

    sessions.forEach((sessionName, rowIndex) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<th>${sessionName}</th>`;
      days.forEach((_, colIndex) => {
        const td = document.createElement("td");
        const value = clinic.schedule[rowIndex][colIndex] || "";
        const span = document.createElement("span");
        span.textContent = value;
        span.className = doctorClass(value);
        td.appendChild(span);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.append(thead, tbody);
    card.append(h4, table);
    posterClinics.appendChild(card);
  });
}

async function downloadPoster() {
  const poster = document.getElementById("poster");
  downloadBtn.disabled = true;
  downloadBtn.textContent = "產生中...";
  try {
    const canvas = await html2canvas(poster, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });
    const link = document.createElement("a");
    link.download = `${state.title || "門診時段表"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = "產生圖片 / 下載 PNG";
  }
}

function bindTopInputs() {
  titleInput.value = state.title;
  changesInput.value = state.changes;
  noteInput.value = state.note;

  titleInput.addEventListener("input", (e) => { state.title = e.target.value; renderPoster(); });
  changesInput.addEventListener("input", (e) => { state.changes = e.target.value; renderPoster(); });
  noteInput.addEventListener("input", (e) => { state.note = e.target.value; renderPoster(); });
  downloadBtn.addEventListener("click", downloadPoster);
}

bindTopInputs();
buildEditor();
renderPoster();
