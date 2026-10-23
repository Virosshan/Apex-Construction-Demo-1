const $ = id => document.getElementById(id);
const byId = Object.fromEntries(REVIEWERS.map(r => [r.id, r]));
let active = null;

function renderReviewers() {
  const box = $("reviewers");
  box.innerHTML = "";
  const all = [{ id: null, name: "All critics", outlet: RESTAURANTS.length + " restaurants" }, ...REVIEWERS];
  for (const r of all) {
    const b = document.createElement("button");
    b.className = "chip";
    b.setAttribute("aria-pressed", String(active === r.id));
    const name = document.createElement("span");
    name.textContent = r.name;
    const sub = document.createElement("small");
    sub.textContent = r.outlet;
    b.append(name, sub);
    b.onclick = () => { active = r.id; renderReviewers(); render(); };
    box.append(b);
  }
  let bio = document.getElementById("bio");
  if (!bio) { bio = document.createElement("p"); bio.id = "bio"; bio.className = "bio"; box.after(bio); }
  bio.textContent = active ? byId[active].bio : "";
}

function render() {
  const q = $("q").value.trim().toLowerCase();
  const sort = $("sort").value;
  const items = RESTAURANTS
    .filter(r => !active || r.reviewer === active)
    .filter(r => !q || [r.name, r.city, r.cuisine].some(s => s.toLowerCase().includes(q)))
    .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : b[sort] - a[sort]);
  $("count").textContent = items.length + " restaurant" + (items.length === 1 ? "" : "s");
  const list = $("list");
  list.innerHTML = "";
  if (!items.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No matches.";
    list.append(p);
    return;
  }
  for (const r of items) {
    const c = document.createElement("article");
    c.className = "card";
    const h = document.createElement("h2");
    h.textContent = r.name;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${r.cuisine} · ${r.city} · ${"$".repeat(r.price)}`;
    const stars = document.createElement("div");
    stars.className = "stars";
    stars.setAttribute("aria-label", `${r.rating} out of 5 stars`);
    stars.textContent = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
    const q2 = document.createElement("blockquote");
    q2.textContent = `“${r.quote}”`;
    const by = document.createElement("div");
    by.className = "by";
    by.textContent = `${byId[r.reviewer].name}, ${byId[r.reviewer].outlet} · ${r.year}`;
    c.append(h, meta, stars, q2, by);
    list.append(c);
  }
}

$("q").oninput = render;
$("sort").onchange = render;
renderReviewers();
render();
