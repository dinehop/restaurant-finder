const stops = [
  { name: "Northline Coffee", area: "Canal Quarter", time: "18:30" },
  { name: "Cedar & Salt", area: "Old Foundry", time: "19:15" },
  { name: "The Lantern Room", area: "Riverside Walk", time: "21:00" },
];

const stopList = document.querySelector("#stop-list");
const addStopForm = document.querySelector("#add-stop-form");
const exportButton = document.querySelector("#export-button");

function actionButton(label, text, onClick, disabled = false) {
  const button = document.createElement("button");
  button.className = "icon-button";
  button.type = "button";
  button.textContent = text;
  button.setAttribute("aria-label", label);
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
}

function moveStop(index, offset) {
  const target = index + offset;
  if (target < 0 || target >= stops.length) return;
  [stops[index], stops[target]] = [stops[target], stops[index]];
  renderStops();
}

function renderStops() {
  stopList.replaceChildren();

  stops.forEach((stop, index) => {
    const item = document.createElement("li");
    item.className = "stop-card";

    const number = document.createElement("span");
    number.className = "stop-number";
    number.textContent = String(index + 1);

    const details = document.createElement("div");
    const name = document.createElement("p");
    name.className = "stop-name";
    name.textContent = stop.name;
    const meta = document.createElement("p");
    meta.className = "stop-meta";
    meta.textContent = `${stop.time} · ${stop.area}`;
    details.append(name, meta);

    const actions = document.createElement("div");
    actions.className = "stop-actions";
    actions.append(
      actionButton(`Move ${stop.name} earlier`, "↑", () => moveStop(index, -1), index === 0),
      actionButton(`Move ${stop.name} later`, "↓", () => moveStop(index, 1), index === stops.length - 1),
      actionButton(`Remove ${stop.name}`, "×", () => {
        stops.splice(index, 1);
        renderStops();
      }),
    );

    item.append(number, details, actions);
    stopList.append(item);
  });

  exportButton.disabled = stops.length === 0;
}

addStopForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(addStopForm);
  stops.push({
    name: String(formData.get("venueName")).trim(),
    area: String(formData.get("venueArea")).trim(),
    time: String(formData.get("venueTime")),
  });
  addStopForm.reset();
  document.querySelector("#venue-time").value = "20:30";
  renderStops();
});

exportButton.addEventListener("click", () => {
  const lines = [
    "# Canal-side food Hop",
    "",
    ...stops.map((stop, index) => `${index + 1}. **${stop.time}** · ${stop.name}, ${stop.area}`),
    "",
    "Planned with the public DineHop Hop example: https://dinehop.app",
  ];
  const file = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "canal-side-food-hop.md";
  link.click();
  URL.revokeObjectURL(url);
});

renderStops();
