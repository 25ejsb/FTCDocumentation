const newsection = document.getElementById("new-section");
const sectionform = document.getElementById("new-section-form");

newsection.addEventListener("click", (e) => {
    if (sectionform.classList.contains("flex")) {
        sectionform.classList.remove("flex");
        sectionform.classList.add("hidden");
    } else {
        sectionform.classList.remove("hidden");
        sectionform.classList.add("flex");
    }
})