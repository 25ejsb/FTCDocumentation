const navbar = document.getElementById("nav");
let activatedMenu = false;

setInterval(() => {
	if (globalThis.scrollY > 50 || activatedMenu) {
		navbar.style.backgroundColor = "rgba(0,0,0,0.5)";
	} else {
		navbar.style.backgroundColor = "transparent";
	}
	if (activatedMenu) {
		menuimage.src = "/images/svg/close.svg";
	} else {
		menuimage.src = "/images/svg/menu.svg";
	}
}, 1);

const menubar = document.getElementById("menu-button");
const menu = document.getElementById("menu");
const menuimage = document.getElementById("menu-button-image");

menubar.addEventListener("click", () => {
	if (menu.classList.contains("hidden")) {
		menu.classList.remove("hidden");
		menu.classList.add("flex");
		activatedMenu = true;
	} else {
		activatedMenu = false;
		menu.classList.remove("flex");
		menu.classList.add("hidden");
	}
});
