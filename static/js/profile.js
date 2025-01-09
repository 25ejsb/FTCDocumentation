const input = document.querySelector('input[type="file"]');
input.addEventListener("change", () => {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.querySelector("img");
      if (img) {
        img.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("profileBtn").onclick = function() {
  document.getElementById("profilePicture").click();
}