const input = document.querySelector('input[type="file"]');

function isAlphaNumeric(str) {
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (
            !(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)
        ) {
            // lower alpha (a-z)
            return false;
        }
    }
    return true;
}

input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById("profileBtn");
            if (img) {
                img.style = `background-image: url(${e.target.result}); background-size: 100%; background-position: center;`;
            }
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("profileBtn").onclick = function (e) {
    e.preventDefault();
    document.getElementById("profilePicture").click();
};

document.getElementById("submitDescription").onclick = function (e) {
    e.preventDefault();
    const description = document.getElementById("description");
    if (description.textContent.length <= 100) {
        document.getElementById("descriptionForm").submit();
    }
};
