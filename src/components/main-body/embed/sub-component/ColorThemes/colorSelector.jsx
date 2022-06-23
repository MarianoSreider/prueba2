import React from "react";
import "./container.css";
import "./dropdown.css";
import "./header.css";
import "./report.css";
import { jsonDataColors, themes } from "./themes";

// Build the theme palette
export function buildThemePalette(report1) {
     // Create Theme switcher
     buildThemeSwitcher();

     // Create separator
     buildSeparator();

     // Building the data-colors list
     for (let i = 0; i < jsonDataColors.length; i++) {
          themesList.append(buildDataColorElement(i));
     }
}

// Build the theme switcher with the theme slider
function buildThemeSwitcher() {
     // Div wrapper element
     let divElement = document.createElement("div");
     divElement.setAttribute("class", "theme-element-container");
     divElement.setAttribute("role", "menuitem");

     let spanElement = document.createElement("span");
     spanElement.setAttribute("class", "theme-switch-label");
     spanElement.setAttribute("id", "dark-label-text");
     let textNodeElement = document.createTextNode("Dark mode");
     spanElement.appendChild(textNodeElement);
     divElement.appendChild(spanElement);

     // Build the checkbox slider
     let checkboxElement = document.createElement("label");
     checkboxElement.setAttribute("class", "switch");
     checkboxElement.setAttribute("aria-labelledby", "dark-label-text");

     let inputCheckboxElement = document.createElement("input");
     inputCheckboxElement.setAttribute("id", "theme-slider");
     inputCheckboxElement.setAttribute("type", "checkbox");
     inputCheckboxElement.setAttribute("onchange", "toggleTheme()"); // check report1

     let sliderElement = document.createElement("span");
     sliderElement.setAttribute("class", "slider round");

     checkboxElement.appendChild(inputCheckboxElement);
     checkboxElement.appendChild(sliderElement);

     // Attach the checox slider to text label
     divElement.appendChild(checkboxElement);

     // Append the element to the dropdown
     themesList.append(divElement);
}

// Build horizontal separator between the theme switcher and data color elements
function buildSeparator() {
     // Build the separator between theme-switcher and data-colors
     let separatorElement = document.createElement("div");
     separatorElement.setAttribute("class", "dropdown-separator");
     separatorElement.setAttribute("role", "separator");
     themesList.append(separatorElement);
}

// Build data-colors list based on the JSON object
function buildDataColorElement(id) {
     // Div wrapper element for the data-color
     let divElement = document.createElement("div");
     divElement.setAttribute("class", "theme-element-container");
     divElement.setAttribute("role", "group");

     let inputElement = document.createElement("input");
     inputElement.setAttribute("role", "menuitemradio");
     inputElement.setAttribute("type", "radio");
     inputElement.setAttribute("name", "data-color");
     inputElement.setAttribute("id", "datacolor" + id);
     inputElement.setAttribute(
          "aria-label",
          jsonDataColors[id].name + " color theme"
     );
     inputElement.setAttribute("onclick", "onDataColorWrapperClicked(this);"); // check
     divElement.appendChild(inputElement);

     // Text-element based on the JSON object
     let secondSpanElement = document.createElement("span");
     secondSpanElement.setAttribute("class", "data-color-name");
     secondSpanElement.setAttribute(
          "onclick",
          "onDataColorWrapperClicked(this)"
     ); // check

     let radioTitleElement = document.createTextNode(jsonDataColors[id].name);
     secondSpanElement.appendChild(radioTitleElement);
     divElement.appendChild(secondSpanElement);

     // Div for displaying data-colors based on the JSON object
     let colorsDivElement = document.createElement("div");
     colorsDivElement.setAttribute("class", "theme-colors");
     colorsDivElement.setAttribute(
          "onclick",
          "onDataColorWrapperClicked(this)"
     ); // check

     const dataColors = jsonDataColors[id].dataColors;
     for (let i = 0; i < dataColors.length; i++) {
          let dataColorElement = document.createElement("div");
          dataColorElement.setAttribute("class", "data-color");
          dataColorElement.setAttribute(
               "style",
               "background:#" + dataColors[i].substr(1)
          );
          colorsDivElement.appendChild(dataColorElement);
     }

     // Add the colors div to the label element
     divElement.appendChild(colorsDivElement);

     return divElement;
}

// Apply the selected data-color to the report from the wrapper element
function onDataColorWrapperClicked(element) {
     // Deselect the previously selected data-color
     $("input[name=data-color]:checked", "#theme-dropdown").prop(
          "checked",
          false
     );

     // Set the respective data-color as active from the wrapper element
     $(element.parentElement.firstElementChild).prop("checked", true);

     // Apply the theme to the report based on the data-color and the background
     applyTheme();
}

// Apply the theme based on the mode and the data-color selected
async function applyTheme() {
     // Get active data-color id
     activeDataColorId = Number(
          $("input[name=data-color]:checked", "#theme-dropdown")[0]
               .getAttribute("id")
               .slice(-1)
     );

     // Get the theme state from the slider toggle
     let activeThemeSlider = $("#theme-slider").get(0);

     // Get the index of the theme based on the state of the slider
     // 1 => Dark theme
     // 0 => Light theme
     const themeId = activeThemeSlider.checked ? 1 : 0;

     // Create new theme object
     let newTheme = {};

     // Append the data-colors and the theme
     $.extend(newTheme, jsonDataColors[activeDataColorId], themes[themeId]);

     // Apply the theme to the report
     // await themesShowcaseState.themesReport.applyTheme({ themeJson: newTheme });
     await report1.applyTheme({ themeJson: newTheme });
}

// Apply theme to the report and toggle dark theme for the UI elements
async function toggleTheme() {
     // Apply the theme in the report
     await applyTheme();

     // Toggle the dark theme for all UI elements
     toggleDarkThemeOnElements();
}

// Toggle dark theme for the UI elements
function toggleDarkThemeOnElements() {
     // Toggle theme for all the UI elements
     allUIElements.forEach((element) => {
          element.toggleClass("dark");
     });
}

export function selectColors(paletteIndex) {}
