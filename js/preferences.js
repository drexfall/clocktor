let palettes = document.getElementsByName("color_picker");
let body = document.querySelector("html");
let body_style = getComputedStyle(body);

function save() {
    localStorage.setItem("property", JSON.stringify(property))
}

function hex_to_rgba(hex, alpha = true) {
    hex = hex.replace("#", "");
    let r = hex.slice(0, 2);
    let g = hex.slice(2, 4);
    let b = hex.slice(4, 6);

    let rgb = [r, g, b];
    if (alpha) {
        let a = "ff";
        if (hex.length > 6) {
            a = hex.slice(6, 8);
        }
        rgb.concat(a);
    }

    return rgb.map((hue) => {
        return parseInt(hue, 16);
    });
}

function tint_shade(color, delta) {
    return hex_to_rgba(color, false)
        .map((hue) => {
            let value = hue + delta;
            if (delta < 0) {
                value = Math.max(value, 0).toString(16);
            } else {
                value = Math.min(value, 255).toString(16);
            }

            return "0x" + value > 15 ? value : "0" + value;
        })
        .join("");
}

for (let c = 0; c < palettes.length; c++) {
    let elem = palettes[c];
    let colors = [
        body_style.getPropertyValue("--primary-color"),
        body_style.getPropertyValue("--accent-color"),
        body_style.getPropertyValue("--background"),
    ];
    elem.value = colors[c].slice(1);

    elem.addEventListener("input", (e) => {

        if (e.data) {
            let color_value = e.target.value;
            let css_var =
                "--" +
                elem
                .getAttribute("id")
                .replaceAll("_", "-")
                .replace("-picker", "");
            if (!e.target.value.match("^([a-fA-F0-9]){1,6}$")) {
                e.target.value = color_value.slice(0, color_value.length - 1);
            }
            console.log(css_var, e.target.value)
            if (css_var === "--primary-color") {
                body.style.setProperty(
                    "--shadow",
                    "#" + tint_shade(color_value, -160)
                );
                body.style.setProperty(
                    "--glow",
                    "#" + tint_shade(color_value, -50)
                );
            }
            if(css_var === "--accent-color"){

            }
            if (css_var === "--background") {
                body.style.setProperty(
                    "--top-gradient",
                    "#" + tint_shade(color_value, +10)
                );
                body.style.setProperty(
                    "--bottom-gradient",
                    "#" + tint_shade(color_value, -10)
                );
            }
            property.theme[page_theme][css_var] = "#" + color_value
            body.style.setProperty(css_var, "#" + color_value);
        }
    });
}

for (const [key, value] of Object.entries(property.data)) {
    let display_settings = document.createElement("div");
    display_settings.classList.add("display-settings");
    let toggle_box = document.createElement("div");

    toggle_box.className =
        "drex-toggle-box" + (value.selected ? " selected" : "");
    toggle_box.id = key + "_toggle";
    toggle_box.setAttribute("alt-text", value.altText);
    toggle_box.setAttribute("title", value.title);

    let toggle_text = document.createElement("p");
    if (key === "special") {
        toggle_text.textContent = "♡";
    }
    let slider = document.createElement("input");

    slider.classList.add("drex-slider");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", 0);
    slider.setAttribute("max", value.max);
    slider.value = value.speed;
    slider.id = key + "_speed";

    toggle_box.appendChild(toggle_text);
    display_settings.appendChild(toggle_box);
    display_settings.appendChild(slider);
    document
        .querySelector(".display-toggle-wrapper")
        .appendChild(display_settings);
}
for (const [key, value] of Object.entries(property.preferences)) {
    if (["twelve_hour", "zero_pad"].includes(key)) {
        document.getElementById(`${key}_check`).checked = value

    } else {
        document.getElementById(`${value}_radio`).checked = true
    }
}
document.querySelectorAll(".display-settings").forEach((parent) => {
    let slider = parent.children[1];
    let toggle_box = parent.children[0];
    slider.addEventListener("input", (e) => {
        const key = e.target.id.replace("_speed", "");
        property.data[`${key}`].speed = parseInt(e.target.value);
    });
    save()
    toggle_box.addEventListener("click", (e) => {
        let display_no = [];
        e.target.classList.toggle("selected");

        switch (e.target.id.replace("_toggle", "")) {
            case "hours":
                display_no = [1, 2];
                break;
            case "minutes":
                display_no = [3, 4];
                break;
            case "seconds":
                display_no = [5, 6];
                break;
            case "special":
                display_no = [7];
                break;
        }

        if (!e.target.classList.contains("selected")) {
            display_no.forEach((no) => {
                document.getElementById(`clock_no_${no}`).setAttribute("update", "disabled");

            });
            slider.classList.add("disabled");
            slider.setAttribute("disabled", true);
        } else {
            display_no.forEach((no) => {
                document
                    .getElementById(`clock_no_${no}`)
                    .setAttribute("update", "enabled");
            });
            slider.classList.remove("disabled");
            slider.removeAttribute("disabled");
        }
        save()
    })


})
document.querySelectorAll(".options-list .drex-checkbox").forEach(check => {
    check.addEventListener("click", (e) => {
        if (e.target.matches("input")) {
            property.preferences[`${e.target.id.replace("_check", "")}`] = e.target.checked
            save()
        }
    })
})
document.querySelectorAll(".style-type-list .drex-radio").forEach(check => {
    check.addEventListener("click", (e) => {
        if (e.target.matches("input")) {
            property.preferences.page_style = `${e.target.id.replace("_radio", "")}`
            save()
        }
    })
})