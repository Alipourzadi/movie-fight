const autocomplete = ({ root, renderOption, onOptionSelect, fetchData }) => {
  root.innerHTML = `
    <input type="text" placeholder="Enter movie name..." class="input-section" spellCheck="false">
    <div class="dropdown card">
    </div>
    <div class="main-content"></div>
`;

  const input = root.querySelector(".input-section");
  const dropdown = root.querySelector(".dropdown");
  const mainCard = root.querySelector(".main-content");

  const onInput = async (e) => {
    const datas = await fetchData(e.target.value);
    if (!datas.length) {
      dropdown.classList.remove("show");
      return;
    }

    dropdown.innerHTML = "";
    mainCard.classList.remove("show");
    dropdown.classList.add("show");
    document.querySelector(".notif").classList.remove("show");

    for (let data of datas) {
      const div = document.createElement("div");

      div.classList.add("card-items");
      div.innerHTML = renderOption(data);

      div.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.remove("show");
        mainCard.classList.add("show");
        root.querySelector("input").value = `${data.Title} (${data.Year})`;
        onOptionSelect(data, root);
      });

      dropdown.appendChild(div);
    }
  };

  input.addEventListener("input", debounce(onInput, 500));

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });
};
