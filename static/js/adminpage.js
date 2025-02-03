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
		await fetch("/api/sections/saveSection", {
			method: "POST",
			body: JSON.stringify({
				id: section.parentElement.querySelector(
					".section-id",
				).value,
				name:
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

document.querySelectorAll(".delete-section").forEach((section) => {
	section.addEventListener("click", async (e) => {
		await fetch("/api/sections/deleteSection", {
			method: "POST",
			body: JSON.stringify({
				id: section.parentElement.querySelector(
					".section-id",
				).value,
			}),
		});
		window.location.reload();
	});
});
