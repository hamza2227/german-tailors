// ----------- VARIABLES ----------
let selectedId = null;

// Field IDs
const fields = [
  "name","mobile","address","length","sleeves","shoulder","neck",
  "chest","waist","hip","trouserLength","trouserBottom",
  "cuff","shoulderSize","notes"
];

const banCheckbox = document.getElementById("ban");
const collarCheckbox = document.getElementById("collar");
const roundDamanCheckbox = document.getElementById("roundDaman");
const straightDamanCheckbox = document.getElementById("straightDaman");
const customerTable = document.getElementById("customerTable");

// ----------- FUNCTIONS -----------

async function saveCustomer() {
  let data = {};
  fields.forEach(f => data[f] = document.getElementById(f).value);

  data.ban = banCheckbox.checked;
  data.collar = collarCheckbox.checked;
  data.roundDaman = roundDamanCheckbox.checked;
  data.straightDaman = straightDamanCheckbox.checked;

  if (selectedId) {
    await db.collection("customers").doc(selectedId).set(data);
  } else {
    await db.collection("customers").add(data);
  }

  resetForm();
  loadCustomers();
}

async function loadCustomers() {
  const snapshot = await db.collection("customers").get();
  customerTable.innerHTML = "";
  snapshot.forEach((doc, index) => {
    const c = doc.data();
    const id = doc.id;
    customerTable.innerHTML += `
      <tr onclick="loadCustomer('${id}')">
        <td>${index+1}</td>
        <td>${c.name}</td>
        <td>${c.mobile}</td>
        <td><button onclick="event.stopPropagation(); deleteCustomer('${id}')">❌</button></td>
      </tr>
    `;
  });
}

async function loadCustomer(id) {
  selectedId = id;
  const doc = await db.collection("customers").doc(id).get();
  const c = doc.data();
  fields.forEach(f => document.getElementById(f).value = c[f] || "");
  banCheckbox.checked = c.ban;
  collarCheckbox.checked = c.collar;
  roundDamanCheckbox.checked = c.roundDaman;
  straightDamanCheckbox.checked = c.straightDaman;
  window.scrollTo({top:0, behavior:'smooth'});
}

async function deleteCustomer(id) {
  if (!confirm("Delete this customer?")) return;
  await db.collection("customers").doc(id).delete();
  loadCustomers();
}

function resetForm() {
  selectedId = null;
  fields.forEach(f => document.getElementById(f).value = "");
  banCheckbox.checked = collarCheckbox.checked = roundDamanCheckbox.checked = straightDamanCheckbox.checked = false;
}

// SEARCH FUNCTION
document.getElementById("searchInput").addEventListener("input", async () => {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const snapshot = await db.collection("customers").get();
  customerTable.innerHTML = "";
  snapshot.forEach((doc, index) => {
    const c = doc.data();
    const id = doc.id;
    const combined = Object.values(c).join(" ").toLowerCase();
    if (combined.includes(q)) {
      customerTable.innerHTML += `
        <tr onclick="loadCustomer('${id}')">
          <td>${index+1}</td>
          <td>${c.name}</td>
          <td>${c.mobile}</td>
          <td><button onclick="event.stopPropagation(); deleteCustomer('${id}')">❌</button></td>
        </tr>
      `;
    }
  });
});

// BUTTON
document.getElementById("saveBtn").onclick = saveCustomer;

// INITIAL LOAD
loadCustomers();
