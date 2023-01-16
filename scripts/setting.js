"use strict";

const valueArray = [5, 30, 10, 20, 50, 100, 200, 500];
const defaultPrizes = [
  {
    color: "#8DCBE6",
    value: 10,
    rate: 40,
  },

  {
    color: "#FFEA20",
    value: 5,
    rate: 20,
  },

  {
    color: "#9DF1DF",
    value: 20,
    rate: 20,
  },

  {
    color: "#E3F6FF",
    value: 50,
    rate: 5,
  },
  {
    color: "#C97064",
    value: 30,
    rate: 15,
  },
];
const defaultSetting = defaultPrizes;
class Setting {
  constructor(parentElement, onSave) {
    this._settings = {};
    this.loadSetting();
    this._onSave = onSave;
    this.parentElement = parentElement;
  }

  loadSetting() {
    try {
      this._settings =
        JSON.parse(localStorage.getItem("spin_settings")) || defaultSetting;
    } catch (error) {
      this._settings = defaultSetting;
    }
  }

  saveToStorage() {
    localStorage.setItem("spin_settings", JSON.stringify(this._settings));
  }

  createColorInput = (defaultValue) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("control");
    const input = document.createElement("input");
    input.style.width = "50px";
    input.classList.add("input");
    input.type = "color";
    input.value = defaultValue;
    wrapper.append(input);
    return wrapper;
  };

  createSelect = (defaultValue) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("control", "is-expanded");
    const span = document.createElement("span");
    span.classList.add("select", "is-fullwidth");
    const select = document.createElement("select");
    const options = valueArray.map((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.innerText = this.formatValueToText(value * 1000);
      return option;
    });
    select.append(...options);
    select.value = defaultValue;
    span.append(select);
    wrapper.append(span);
    return wrapper;
  };

  createInput(defaultValue) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("control");
    const input = document.createElement("input");
    input.classList.add("input");
    input.type = "number";
    input.placeholder = "Tỉ lệ";
    input.min = 1;
    input.max = 100;
    input.step = 5;
    input.value = defaultValue;
    wrapper.append(input);
    return wrapper;
  }

  formatPrize(value) {
    //input: string format 1.000.000 usd
    //output: number value
    return value.replace(/\D/g, "");
  }

  formatValueToText(value) {
    //input: number value
    //output: string format 1.000.000 usd
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  validateSetting(settings) {
    const totalRate = settings.reduce((acc, cur) => acc + +cur.rate, 0);
    console.log(totalRate);
    if (totalRate !== 100) {
      return false;
    }
    return true;
  }

  resetSetting() {
    this._settings = defaultSetting;
    this.renderSettingUI();
    this.saveToStorage();
    alert("Luu thanh cong");
    this._onSave();
  }

  createSaveButtons() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("field", "mt-5", "has-text-right");
    const saveButton = document.createElement("button");
    saveButton.classList.add("button", "save-setting");
    saveButton.innerText = "Lưu";
    saveButton.addEventListener("click", () => this.saveSetting());
    const resetButton = document.createElement("button");
    resetButton.classList.add("button", "reset-setting", "is-danger", "mr-2");
    resetButton.innerText = "Reset";
    resetButton.addEventListener("click", () => this.resetSetting());
    wrapper.append(resetButton, saveButton);
    return wrapper;
  }

  renderSettingUI() {
    const parentElement = this.parentElement;
    parentElement.innerHTML = "";
    const fields = [];
    const prizes = this._settings;
    for (let i = 0; i < prizes.length; i++) {
      const field = document.createElement("div");
      field.classList.add("field", "has-addons");
      const lable = document.createElement("label");
      lable.classList.add("label");
      lable.innerText = `${i + 1}`;
      const select = this.createSelect(prizes[i].value);
      field.append(select);
      const input = this.createInput(prizes[i].rate);
      field.append(input);
      const colorInput = this.createColorInput(prizes[i].color);
      field.append(colorInput);
      fields.push(lable, field);
    }
    parentElement.append(...fields);
    const saveButton = this.createSaveButtons();
    parentElement.append(saveButton);
  }

  saveSetting() {
    const fields = document.querySelectorAll(".field.has-addons");
    const newSettings = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = +field.querySelector(".select select").value;
      const rate = +field.querySelector(".input").value;
      const color = field.querySelector(".input[type=color]").value;
      newSettings.push({
        color,
        value,
        rate,
      });
    }

    const isValidRate = this.validateSetting(newSettings);
    if (!isValidRate) {
      alert("Tỉ lệ phần thưởng không hợp lệ");
      return;
    } else {
      alert("Lưu thành công");
      this._settings = newSettings;
      this.saveToStorage();
      this._onSave();
    }
  }

  getSettings() {
    return this._settings.filter((setting) => setting.rate > 0);
  }
}

export default Setting;
