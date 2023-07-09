const audioSelector = "audio.uniqueplayerclass";
const containerSelector = "#jmuse-scroller-component";

let sliderHtml = `<input type="range" name="volume" id="musescore-volume-slider" min="0" max="1" step=".01">`;

let audioEl = null;
let containerEl = null;

function waitForElement() {
  const cb = (mutations, obs) => {
    audioEl = document.querySelector(audioSelector);
    containerEl = document.querySelector(containerSelector);

    if (audioEl && containerEl) {
      obs.disconnect();
      addSlider();
    }
  };

  let mo = new MutationObserver(cb);
  mo.observe(document.body, { childList: true });
}

async function getDefaultVolume() {
  return await browser.storage.local.get("musescoreDefaultVolume");
}

function setDefaultVolume(setVolume, sliderNode) {
  audioEl.volume = setVolume;
  sliderNode.querySelector("input").value = setVolume;
}

async function addSlider() {
  let sliderNode = document.createElement("div");
  sliderNode.classList.add("volume-wrapper");
  sliderNode.innerHTML = sliderHtml;

  let volume = await getDefaultVolume();
  let setVolume = Number.isInteger(volume.musescoreDefaultVolume) ? volume.musescoreDefaultVolume / 100 : 0.1;

  setDefaultVolume(setVolume, sliderNode);

  containerEl.parentElement.appendChild(sliderNode);

  sliderNode.addEventListener("input", function (event) {
    audioEl.volume = event.target.value;
  });

  browser.runtime.onMessage.addListener(async (message) => {
    let type = message.message;

    if (type === "DefaultVolumeChange") {
      let volume = await getDefaultVolume();
      let setVolume = volume.musescoreDefaultVolume ? volume.musescoreDefaultVolume / 100 : 0.1;
      setDefaultVolume(setVolume, sliderNode);
    }
  });
}

waitForElement();
