document.addEventListener("DOMContentLoaded", function () {

    let selects = document.getElementsByClassName("superselect");
    for (let i = 0; i < selects.length; i++) {
        // @ts-ignore
        new SuperSelect(selects.item(i));
    }

});

class SuperSelect {
    /**
     * @param {HTMLElement} e
     */
    constructor(e) {
        this.selectContainer = e;
        let selects = this.selectContainer.getElementsByTagName("select");
        if(selects.length == 0 || selects[0].hasAttribute("multiple"))
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

    /**
     * @param {UIEvent} e
     */
    onSelectOpen(e) {
        e.preventDefault();

        if(this.select.hasAttribute("readonly"))
            return;

        this.open = true;

        this.selectPopup.style.display = "block";

        this.refresh();
        this.select.blur();
        this.selectPopupSearch.focus();
    }

    /**
     * @param {UIEvent} e
     */
    onSelectClose(e) {
        this.open = false;
        e.preventDefault();
        this.refresh();
        this.selectPopupSearch.value = "";
        this.selectPopupSearch.blur();
        this.select.focus();
    }

    buildSelect() {
        this.selectPopup.className = "superselect_popup";

        this.selectPopupUl.className = "list-group";
        this.selectPopupSearch.setAttribute("type", "text");
        this.selectPopupSearch.setAttribute("class", "form-control");
        this.selectPopupSearch.setAttribute("placeholder", "Search");
        this.selectPopupSearch.onkeyup = (e) => {
            if(e.key === "Enter" || e.key === "Escape"){
                if(e.key === "Enter")
                    this.select.selectedIndex = this.optionHighlight;
                this.onSelectClose(e);
            }else{
                this.refresh();
            }
        }
        this.selectPopupSearch.onblur = (e) => {
            this.blur(e);
        }

        this.select.onmousedown = (e) => {
            if (!this.open)
                this.onSelectOpen(e);
            else
                this.onSelectClose(e);

        };
        this.select.onkeyup = (e) => {
            let value = String.fromCharCode(e.keyCode);
            if(value.match("[A-Za-z0-9]")){
                this.selectPopupSearch.value = value;
                this.onSelectOpen(e);
            }
        }


        this.select.onselect = (e) => { e.preventDefault(); };
    }

    /**
     * @param {FocusEvent} e
     */
    blur(e) {
        let elem = e.relatedTarget||document.activeElement;
        // @ts-ignore
        while(elem.parentElement !== undefined && elem.parentElement !== null   ){

            //focus still on an element in the container?
            if(elem == this.selectContainer)
                return;

            // @ts-ignore
            elem = elem.parentElement;
        }
        this.onSelectClose(e);

    }

    buildSelectPopup() {

        while (this.selectPopupUl.firstChild) {
            this.selectPopupUl.removeChild(this.selectPopupUl.firstChild);
        }
        this.options = new Array();
        let searchActive = this.selectPopupSearch.value != "";
        let firstActive = false;
        this.optionHighlight = this.select.selectedIndex;

        for (let i = 0; i < this.select.options.length; i++) {
            this.options[i] = document.createElement("li");
            this.selectPopupUl.append(this.options[i]);

            //create options
            this.options[i].className = "list-group-item";
            if (this.select.selectedIndex == i && !searchActive){
                this.options[i].className = "list-group-item ssactive";
            }

            //filter options
            this.options[i].display = "block";
            if(this.selectPopupSearch.value != ""){
                if(!this.select.options[i].label.replace(/ /g,'').toLowerCase().includes(this.selectPopupSearch.value.replace(/ /g,'').toLowerCase())){
                    this.options[i].style.display = "none";
                }else{
                    if(!firstActive){
                        firstActive = true;
                        this.options[i].className = "list-group-item ssactive";
                        this.optionHighlight = i;
                    }
                }
            }

            this.options[i].onmousedown = (e) => {
                this.select.selectedIndex = i;
                this.onSelectClose(e);
            };

            this.options[i].innerHTML = this.select.options[i].label;
        }
    }

    refresh() {
        this.selectPopup.style.display = this.open ? "block" : "none";
        this.buildSelectPopup();
    }
}