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

// -------------------- SAVE / UPDATE CUSTOMER --------------------
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
  } catch (err) {
    console.error("Error saving customer:", err);
    alert("Error saving customer. Check console.");
  }
}

// -------------------- LOAD ALL CUSTOMERS --------------------
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
      row.innerHTML = `
        <td>${index++}</td>
        <td>${c.name||""}</td>
        <td>${c.mobile||""}</td>
        <td><button onclick="event.stopPropagation(); deleteCustomer('${id}')">❌</button></td>
      `;
    });
  } catch (err) { console.error(err); }
}

// -------------------- LOAD SINGLE CUSTOMER --------------------
async function loadCustomer(id) {
  try {
    selectedId = id;
    const doc = await db.collection("customers").doc(id).get();
    const c = doc.data();
    fields.forEach(f => document.getElementById(f).value = c[f]||"");
    banCheckbox.checked = c.ban||false;
    collarCheckbox.checked = c.collar||false;
    roundDamanCheckbox.checked = c.roundDaman||false;
    straightDamanCheckbox.checked = c.straightDaman||false;

    // Auto-show first step (Customer Info)
    document.querySelectorAll(".step-tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".step-card").forEach(card => card.style.display="none");
    document.querySelector(".step-tab[data-step='1']").classList.add("active");
    document.querySelector(".step-card[data-step='1']").style.display="block";

    window.scrollTo({top:0, behavior:'smooth'});
  } catch (err) { console.error(err); }
}

// -------------------- DELETE CUSTOMER --------------------
async function deleteCustomer(id) {
  if(!confirm("Are you sure you want to delete this customer?")) return;
  try {
    await db.collection("customers").doc(id).delete();
    loadCustomers();
  } catch(err) { console.error(err); }
}

// -------------------- RESET FORM --------------------
function resetForm() {
  selectedId = null;
  fields.forEach(f => document.getElementById(f).value = "");
  banCheckbox.checked = collarCheckbox.checked = roundDamanCheckbox.checked = straightDamanCheckbox.checked = false;
}

// -------------------- SEARCH FUNCTION --------------------
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
      row.innerHTML = `
        <td>${index++}</td>
        <td>${c.name||""}</td>
        <td>${c.mobile||""}</td>
        <td><button onclick="event.stopPropagation(); deleteCustomer('${id}')">❌</button></td>
      `;
    }
  });
});

// -------------------- BUTTON EVENTS --------------------
document.getElementById("saveBtn").onclick = saveCustomer;

// -------------------- INITIAL LOAD --------------------
loadCustomers();
