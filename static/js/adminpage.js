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
});

document.querySelectorAll(".save-section").forEach((section) => {
	section.addEventListener("click", async (e) => {
		console.log(section.parentElement);
		await fetch("/api/saveSection", {
			method: "POST",
			body: JSON.stringify({
				currentName: section.parentElement.querySelector(
					".section-current-name",
				).value,
				sectionName:
					section.parentElement.querySelector(".section-name").value,
				position: parseInt(
					section.parentElement.querySelector(".section-position")
						.value,
				),
			}),
		});
		window.location.reload();
	});
});
