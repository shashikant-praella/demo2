/**
 * Addons Form Components
 *
 */
class AddonsForm extends HTMLElement {
    constructor() {
    super();
        this.form = this
    }
}
customElements.define('addons-form', AddonsForm);

class AddonsVariantSelects extends HTMLElement {
    constructor() {
    super();
        this.form = this.closest('addons-form');
        this.addOnSelection = this.form.querySelector('[data-addon-selection]');
        this.variant_json = this.form.querySelector('[data-addons-variantJSON]');
        this.variantPicker = this.dataset.type;
        this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantChange() {
        this.setCurrentVariant();
        if (!this.currentVariant) {
            this.toggleAddButton('disable');
            let options = this.form.querySelectorAll('[data-addons-optionindex]');
            options.forEach(option => {
                let lableID = 'option'+option.dataset.optionindex;
                const selectedValue = option.querySelector('input[type="radio"]:checked');
                const lable = option.querySelector('.selected-option');
                if(!lable || !lableID || !selectedValue) return;
                lable.innerHTML = selectedValue.value;
            });
        }else{
            const productGrid = this.closest('[data-product-grid]');
            this.renderProductInfo(this.currentVariant, productGrid);
            this.updateID(this.currentVariant);
            this.toggleAddButton('enable');
        }
    }

    _getOptionsFromSelect() {
        let options = [];
        this.querySelectorAll('.addons-variant_selector').forEach((selector)=>{
            options.push(selector.value);
        });
        return options;
    }

    _getOptionsFromRadio() {
        const fieldsets = Array.from(this.querySelectorAll('fieldset'));
        const options = fieldsets.map((fieldset) => {
            return Array.from(fieldset.querySelectorAll('input[type="radio"]')).find((radio) => radio.checked).value;
        });
        return options;
    }

    setCurrentVariant() {
        this.currentVariant = false;
        let options = (this.variantPicker == 'variant-select') ? this._getOptionsFromSelect() : this._getOptionsFromRadio();

        let variantsArray = this._getVariantData();
        variantsArray.find((variant) => {
            let mappedValues = variant.options.map((option, index) => {
                return options[index] === option;
            });
            if(!mappedValues.includes(false)){
                this.currentVariant = variant;
                return;
            }
        });
    }

    updateID(currentVariant) {
        if (!currentVariant) return;
        const input = this.form.querySelector('input.variant--id');
        input.value = currentVariant.id;
    }

    renderProductInfo(currentVariant, container) {
        if(!currentVariant || !container) return;

        // Price Update
        let price = Shopify.formatMoney(currentVariant.price, window.globalVariables.money_format);
        let priceElement = container.querySelector('[data-addons-currentPrice]');
        if(priceElement) priceElement.innerHTML = price;

        // Variant name update
        let options = this.form.querySelectorAll('[data-addons-optionindex]');
        options.forEach(option => {
            let lableID = 'option'+option.getAttribute('data-addons-optionindex');
            const lable = option.querySelector('.selected-option');
            if(!lable || !lableID) return;
            lable.innerHTML = currentVariant[lableID];
        });

        if(!currentVariant.featured_image) return;
        const featuredImage = container.querySelector('[data-addons-feauredImage]');
        let updatedSrc = currentVariant.featured_image.src;
        if(updatedSrc && featuredImage){
            featuredImage.src = updatedSrc;
            featuredImage.srcset = updatedSrc;
        }
    }

    toggleAddButton(status) {
        if (status == 'disable' || (this.currentVariant && !this.currentVariant.available)) {
            this.addOnSelection.disabled = true;
        }else{
            this.addOnSelection.disabled = false;
        };
    }

    _getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.variant_json.textContent);
        return this.variantData;
    }
}
customElements.define('addons-variant-selects', AddonsVariantSelects);

class AddonsVariantRadios extends AddonsVariantSelects {
    constructor() {
    super();
        this.form = this.closest('addons-form');
        const colorSwatchContainer = this.querySelector('.color-swatch');
        if(colorSwatchContainer){
            const colorSwatches = colorSwatchContainer.querySelectorAll('.swatch');
            colorSwatches.forEach(swatch => {
                let colorHandle = swatch.querySelector('input[type="radio"]').dataset.handle;
                let swatchStyle = Utility.getSwatchStyle(colorHandle);
                swatch.querySelector('.swatch-label').setAttribute('style', swatchStyle);
            });
        }
    }
}
customElements.define('addons-variant-radios', AddonsVariantRadios);