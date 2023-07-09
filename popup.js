function setDefaultVolume() {
  let number = document.querySelector("#musescore-volume-input").valueAsNumber;
  if (Number.isInteger(number)) {
    if (number > 100) {
      number = 100;
    } else if (number < 0) {
      number = 0;
    }

    browser.storage.local
      .set({ musescoreDefaultVolume: number })
      .then(() => {
        document.querySelector("#volume-set").textContent = number;
        document.querySelector(".volume-error").classList.add("hidden");
        document.querySelector(".volume-confirm").classList.remove("hidden");

        browser.tabs.query({ url: "*://*.musescore.com/*/*/scores/*" }).then((tabs) => {
          for (let tab of tabs) {
            browser.tabs.sendMessage(tab.id, { message: "DefaultVolumeChange" });
          }
        });
      })
      .catch((e) => {
        document.querySelector(".volume-confirm").classList.add("hidden");
        document.querySelector(".volume-error").classList.remove("hidden");
      });
  } else {
    document.querySelector(".volume-error").classList.remove("hidden");
  }
}

async function getDefaultVolume() {
  let number = await browser.storage.local.get("musescoreDefaultVolume");

  if (Number.isInteger(number.musescoreDefaultVolume)) {
    document.querySelector("#musescore-volume-input").value = number.musescoreDefaultVolume;
  } else {
    browser.storage.local
      .set({ musescoreDefaultVolume: 10 })
      .then(() => (document.querySelector("#musescore-volume-input").value = number.musescoreDefaultVolume));
  }
}

document.querySelector("#musescore-set-button").addEventListener("click", setDefaultVolume);

getDefaultVolume();
