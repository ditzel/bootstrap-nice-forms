document.addEventListener("DOMContentLoaded", function () {

    NiceFormsInit();
  
  });
  
  function NiceFormsInit() {
    let selects = document.getElementsByClassName("nice-forms-select");
    for (let i = 0; i < selects.length; i++) {
      // @ts-ignore
      if (!selects.item(i).hasAttribute("nice-forms-select-init")) {
        new NiceFormsSelect(selects.item(i));
      }
    }
  }
  
  function NiceFormsSelect(element) {
    this.selectContainer = element;
    this.selectContainer.setAttribute("nice-forms-select-init", "");
  
    let selects = this.selectContainer.getElementsByTagName("select");
    if (selects.length == 0 || selects[0].hasAttribute("multiple"))
      return;
    else
      this.select = selects[0];
  
    //add a div
    this.open = false;
    this.selectPopup = document.createElement('div');
    this.selectContainer.append(this.selectPopup);
    this.selectPopupSearch = document.createElement('input');
    this.selectPopup.append(this.selectPopupSearch);
    this.selectPopupUl = document.createElement('ul');
    this.selectPopup.append(this.selectPopupUl);
  
    this.buildSelect();
    this.buildSelectPopup();
  
  
    this.refresh();
  }
  
  NiceFormsSelect.prototype = {
  
  
    /**
     * @param {UIEvent} e
     */
    onSelectOpen: function (e) {
      let that = this;
      e.preventDefault();
  
      if (this.select.hasAttribute("readonly"))
        return;
  
      that.open = true;
  
      that.selectPopup.style.display = "block";
  
      that.refresh();
      that.select.blur();
      that.selectPopupSearch.focus();
    },
  
    /**
     * @param {UIEvent} e
     */
    onSelectClose: function (e) {
      let that = this;
  
      that.open = false;
      e.preventDefault();
      that.refresh();
      that.selectPopupSearch.value = "";
      that.selectPopupSearch.blur();
      that.select.focus();
    },
  
    buildSelect: function () {
      let that = this;
  
      that.selectPopup.className = "nice-forms-select-popup";
  
      that.selectPopupUl.className = "list-group";
      that.selectPopupSearch.setAttribute("type", "text");
      that.selectPopupSearch.setAttribute("class", "form-control");
      that.selectPopupSearch.setAttribute("placeholder", "Search");
      that.selectPopupSearch.onkeyup = function (e) {
        if (e.key === "Enter" || e.key === "Escape") {
          if (e.key === "Enter")
            that.select.selectedIndex = that.optionHighlight;
          that.onSelectClose(e);
        } else {
          that.refresh();
        }
      }
      that.selectPopupSearch.onblur = function(e) {
        that.blur(e);
      }
  
      that.select.onmousedown = function(e) {
        if (!that.open)
          that.onSelectOpen(e);
        else
          that.onSelectClose(e);
  
      };
      that.select.onkeydown = function(e) {
        let value = String.fromCharCode(e.keyCode);
        if (value.match("[A-Za-z0-9 ]")) {
          that.selectPopupSearch.value = value.trim();
          that.onSelectOpen(e);
        }
      }
  
  
      that.select.onselect = function(e) { e.preventDefault(); };
    },
  
  
    blur: function (e) {
      let that = this;
  
      let elem = e.relatedTarget || document.activeElement;
      // @ts-ignore
      let i = 0;
      while (elem.parentElement !== undefined && elem.parentElement !== null && i++ < 100) {
  
        //focus still on an element in the container?
        if (elem == this.selectContainer)
          return;
  
        // @ts-ignore
        elem = elem.parentElement;
      }
      that.onSelectClose(e);
  
    },
  
    buildSelectPopup: function () {
      let that = this;
  
      while (that.selectPopupUl.firstChild) {
        that.selectPopupUl.removeChild(that.selectPopupUl.firstChild);
      }
      that.options = new Array();
      let searchActive = that.selectPopupSearch.value != "";
      let firstActive = false;
      that.optionHighlight = that.select.selectedIndex;
  
      for (let i = 0; i < that.select.options.length; i++) {
        that.options[i] = document.createElement("li");
        that.selectPopupUl.append(that.options[i]);
  
        //create options
        that.options[i].className = "list-group-item";
        if (that.select.selectedIndex == i && !searchActive) {
          that.options[i].className = "list-group-item ssactive";
        }
  
        //filter options
        that.options[i].display = "block";
        if (that.selectPopupSearch.value != "") {
          if (!that.select.options[i].label.replace(/ /g, '').toLowerCase().includes(that.selectPopupSearch.value.replace(/ /g, '').toLowerCase())) {
            that.options[i].style.display = "none";
          } else {
            if (!firstActive) {
              firstActive = true;
              that.options[i].className = "list-group-item ssactive";
              that.optionHighlight = i;
            }
          }
        }
  
        that.options[i].onmousedown = function(e) {
          that.select.selectedIndex = i;
          that.onSelectClose(e);
        };
  
        that.options[i].innerHTML = that.select.options[i].label;
      }
    },
  
    refresh: function () {
      let that = this;
      that.selectPopup.style.display = that.open ? "block" : "none";
      that.buildSelectPopup();
    }
  };
  
  /*
  * ts export
  */
  if (typeof module !== 'undefined' && module)
    module.exports = { NiceFormsInit: NiceFormsInit, NiceFormsSelect: NiceFormsSelect };
  