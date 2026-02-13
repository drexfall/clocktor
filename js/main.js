let display_wrapper = document.querySelector(".display-wrapper");
let clock_style = getComputedStyle(document.querySelector(":root"));

let d_no = 1;
for (let d1 = 0; d1 < 3; d1++) {
    let display_container = document.createElement("div");
    display_container.id = `display_no_${d1 + 1}`;
    display_container.classList.add("display-container");
    display_wrapper.appendChild(display_container);
    for (let d2 = 1; d2 < 3; d2++) {
        let clock_container = document.createElement("div");
        clock_container.id = `clock_no_${d_no}`;
        clock_container.setAttribute("update", "enabled");
        clock_container.classList.add("clock-container");
        display_container.appendChild(clock_container);

        d_no += 1;

        for (let i = 0; i < clock_style.getPropertyValue("--rows"); i++) {
            for (let j = 0; j < clock_style.getPropertyValue("--cols"); j++) {
                clock_container.innerHTML += clock_struct;
            }
        }
    }

}

function zero_padd(i) {
    if (0 <= i && i < 10) {
        i = (property.preferences.zero_pad ? "0" : "~") + i;
    } // add zero in front of numbers < 10
    return i.toString();
}

function difference(array1, array2) {
    let diff = [];
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            diff.push(i);
        }
    }
    return diff;
}
let prevTime = [];

async function change_time() {
    const date = new Date();
    let time = [];
    ["Hours", "Minutes", "Seconds"].forEach((func) => {
        let value = eval(`date.get${func}()`);
        if (func === "Hours" && property.preferences.twelve_hour && value > 12) {
            value -= 12
        }
        document.querySelector(`#${func.toLowerCase()}_toggle p`).textContent = (zero_padd(value)).replaceAll("~", "")
        let clock = document.querySelector(`#${func.toLowerCase()}_toggle`)
        if (!clock.classList.contains("selected")) {
            value = "~~"
        }
        time = time.concat(
            zero_padd(value)
            .toString()
            .split("")
        );
    });

    difference(time, prevTime).forEach((index) => {
                let category;
                if ([0, 1].includes(index)) {
                    category = "hours"
                } else if ([2, 3].includes(index)) {
                    category = "minutes"
                } else {
                    category = "seconds"
                }
                c = 0;
                let clock = document.getElementById(`clock_no_${index + 1}`)

                clock.querySelectorAll(`.hand-wrapper`)
                    .forEach((hand) => {
                            hand.animate(
                                    [{
                                            transform: `rotate(${(time[index] === "~"||clock.getAttribute("update")==="disabled")
							? 0
							: hand_rotation[`clock${time[index]}`][c]
							}deg)`,
					},
					],
					{
						duration: property.data[category].speed,
						easing: "cubic-bezier(0,.38,.13,1.13)",
						fill: "forwards",
					}
				);
				c += 1;
			});
	});
	prevTime = time;
	setTimeout(change_time, 1000);
}

// function setTheme(mode) {

//     if (document.body.getAttribute("data-theme") == "dark") {
//         mode = "light"
//     }

//     document.body.setAttribute("data-theme", mode)
// }
// window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", (e) => {
//     let mode = 'light';

//     if (e["matches"]) {
//         mode = 'dark'
//     }
//     setTheme(mode)
// })
// if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//     setTheme("dark")
// }
window.addEventListener("load", change_time);
Array.from(document.getElementsByTagName("header")).forEach((header) => {
	header.addEventListener("dblclick", (e) => {
		document.querySelector(".main-content").scrollTop = 0;
	});
});