let customers = JSON.parse(localStorage.getItem("customers")) || [];
let selectedIndex = null;

const fields = [
  "name","mobile","address","length","sleeves","shoulder","neck",
  "chest","waist","hip","trouserLength","trouserBottom",
  "cuff","shoulderSize","notes"
];

function saveCustomer() {
  let data = {};
  fields.forEach(f => data[f] = document.getElementById(f).value);

  data.ban = ban.checked;
  data.collar = collar.checked;
  data.roundDaman = roundDaman.checked;
  data.straightDaman = straightDaman.checked;

  if (selectedIndex !== null) {
    customers[selectedIndex] = data;
  } else {
    customers.push(data);
  }

  localStorage.setItem("customers", JSON.stringify(customers));
  resetForm();
  renderTable();
}

function renderTable(list = customers) {
  customerTable.innerHTML = "";
  list.forEach((c, i) => {
    customerTable.innerHTML += `
      <tr onclick="loadCustomer(${i})">
        <td>${i+1}</td>
        <td>${c.name}</td>
        <td>${c.mobile}</td>
        <td>
          <button onclick="event.stopPropagation(); deleteCustomer(${i})">❌</button>
        </td>
      </tr>`;
  });
}

function loadCustomer(i) {
  selectedIndex = i;
  let c = customers[i];
  fields.forEach(f => document.getElementById(f).value = c[f] || "");
  ban.checked = c.ban;
  collar.checked = c.collar;
  roundDaman.checked = c.roundDaman;
  straightDaman.checked = c.straightDaman;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteCustomer(i) {
  if (!confirm("Delete this customer?")) return;
  customers.splice(i, 1);
  localStorage.setItem("customers", JSON.stringify(customers));
  renderTable();
}

function resetForm() {
  fields.forEach(f => document.getElementById(f).value = "");
  ban.checked = collar.checked = roundDaman.checked = straightDaman.checked = false;
  selectedIndex = null;
}

searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  renderTable(customers.filter(c =>
    Object.values(c).join(" ").toLowerCase().includes(q)
  ));
});

saveBtn.onclick = saveCustomer;
renderTable();

/* 🌙 DAY / NIGHT */
let dark = localStorage.getItem("dark") === "true";
modeToggle.onclick = () => {
  dark = !dark;
  document.body.classList.toggle("dark", dark);
  localStorage.setItem("dark", dark);
};
document.body.classList.toggle("dark", dark);
