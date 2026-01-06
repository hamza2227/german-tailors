// -------------------- VARIABLES --------------------
let selectedId = null;

const fields = [
  "name","mobile","address","length","sleeves","shoulder","neck",
  "chest","waist","hip","trouserLength","trouserBottom",
  "cuff","shoulderSize","notes"
];

const banCheckbox = document.getElementById("ban");
const collarCheckbox = document.getElementById("collar");
const roundDamanCheckbox = document.getElementById("roundDaman");
const straightDamanCheckbox = document.getElementById("straightDaman");
const customerTable = document.getElementById("customerTable").getElementsByTagName("tbody")[0];

// -------------------- FUNCTIONS --------------------

// Save or Update Customer
async function saveCustomer() {
  let data = {};
  fields.forEach(f => data[f] = document.getElementById(f).value);

  data.ban = banCheckbox.checked;
  data.collar = collarCheckbox.checked;
  data.roundDaman = roundDamanCheckbox.checked;
  data.straightDaman = straightDamanCheckbox.checked;

  try {
    if (selectedId) {
      await db.collection("customers").doc(selectedId).set(data);
    } else {
      await db.collection("customers").add(data);
    }
    alert("Customer saved successfully!");
    resetForm();
    loadCustomers();
  } catch (error) {
    console.error("Error saving customer:", error);
    alert("Error saving customer. Check console.");
  }
}

// Load all customers
async function loadCustomers() {
  try {
    const snapshot = await db.collection("customers").get();
    customerTable.innerHTML = "";
    let index = 1;
    snapshot.forEach(doc => {
      const c = doc.data();
      const id = doc.id;
      const row = customerTable.insertRow();
      row.onclick = () => loadCustomer(id);

      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);

      cell1.innerText = index++;
      cell2.innerText = c.name || "";
      cell3.innerText = c.mobile || "";
      cell4.innerHTML = `<button onclick="event.stopPropagation(); deleteCustomer('${id}')">❌</button>`;
    });
  } catch (error) {
    console.error("Error loading customers:", error);
  }
}

// Load single customer for editing
async function loadCustomer(id) {
  try {
    selectedId = id;
    const doc = await db.collection("customers").doc(id).get();
    const c = doc.data();
    fields.forEach(f => document.getElementById(f).value = c[f] || "");
    banCheckbox.checked = c.ban || false;
    collarCheckbox.checked = c.collar || false;
    roundDamanCheckbox.checked = c.roundDaman || false;
    straightDamanCheckbox.checked = c.straightDaman || false;

    // Open collapsible sections automatically on mobile
    const contents = document.getElementsByClassName("content");
    for (let content of contents) content.style.display = "block";

    window.scrollTo({top:0, behavior:'smooth'});
  } catch (error) {
    console.error("Error loading customer:", error);
  }
}

// Delete Customer
async function deleteCustomer(id) {
  if (!confirm("Are you sure you want to delete this customer?")) return;
  try {
    await db.collection("customers").doc(id).delete();
    loadCustomers();
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
}

// Reset form
function resetForm() {
  selectedId = null;
  fields.forEach(f => document.getElementById(f).value = "");
  banCheckbox.checked = collarCheckbox.checked = roundDamanCheckbox.checked = straightDamanCheckbox.checked = false;
}

// -------------------- SEARCH --------------------
document.getElementById("searchInput").addEventListener("input", async () => {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const snapshot = await db.collection("customers").get();
  customerTable.innerHTML = "";
  let index = 1;
  snapshot.forEach(doc => {
    const c = doc.data();
    const id = doc.id;
    const combined = Object.values(c).join(" ").toLowerCase();
    if (combined.includes(q)) {
      const row = customerTable.insertRow();
      row.onclick = () => loadCustomer(id);

      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);

      cell1.innerText = index++;
      cell2.innerText = c.name || "";
      cell3.innerText = c.mobile || "";
      cell4.innerHTML = `<button onclick="event.stopPropagation(); deleteCustomer('${id}')">❌</button>`;
    }
  });
});

// -------------------- BUTTON EVENTS --------------------
document.getElementById("saveBtn").onclick = saveCustomer;

// -------------------- INITIAL LOAD --------------------
loadCustomers();
