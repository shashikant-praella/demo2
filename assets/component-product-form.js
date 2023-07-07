/**
 * Product Form Components
 *
 */
class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartElement = document.querySelector('ajax-cart');

    this.qtyBtns = this.querySelectorAll('[data-qty-btn]');
    this.qtyBtns.forEach(qtyBtn => qtyBtn.addEventListener('click', this.manageQtyBtn.bind(this)));
  }

  /**
   * Product Form Submit event
   *
   * @param {evt} Event instance
   * @param {string} -  zipcode_wrapper, zip_code_value, submitBtn, userZipcodeForm
   * zipcode_wrapper - use for get outer div form of zipcode form, 
   * zip_code_value - get zip value enter by user, 
   * submitBtn - zipcode form submit button, 
   * userZipcodeForm - html section of zipcode form
   * @param {json} - localZipCode
   * 
   */
  onSubmitHandler(evt) {
    evt.preventDefault();
    let addItems = [];
    const submitButton = this.querySelector('[type="submit"]');
    const qtyInput = this.querySelector('[data-qty-input]');
    const pdpContainer = this.closest('.product-details-wrapper');
    const userZipcodeForm = this.querySelector('user-zipcode-form');

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');
  
    // function when warranty features functionality 
    if(userZipcodeForm) {
      let CookiesZipcode = Utility.getCookie('cookiesZipcode');
      if(CookiesZipcode && CookiesZipcode != undefined) {
        let zipcode_wrapper = document.querySelector("zipcode-wrapper");
        let zip_code_value = document.querySelector("[zip-code-value]");
        if(zipcode_wrapper && zip_code_value) {
          zip_code_value.innerText = CookiesZipcode;
          zipcode_wrapper.classList.remove('d-none');
        }
        let localZipCode = window?.warranty_features?.locallocal_zip_code;
        if(localZipCode) if(localZipCode.indexOf(CookiesZipcode) === -1) {
          let popupWarranty =  document.getElementById('PopupModal-warranty');
          let modalWarranty = popupWarranty.querySelector('.modal');
          if(modalWarranty) {
            modalWarranty.classList.add('open');
            siteOverlay.prototype.showOverlay();
            Utility.trapFocus(popupWarranty);
            Utility.forceFocus(popupWarranty.querySelector('[id^="ModalClose-"]'));
          }
          // let submitBtn = document.querySelector('[name="add"]');
          // if(submitBtn) submitBtn.classList.add('d-none');
          // userZipcodeForm.classList.remove('d-none');
          return false;
        }
        else {
          alert("You Local user can add warrenty product offline")
        }
      }
      else {
        let submitBtn = document.querySelector('[name="add"]');
        if(submitBtn) submitBtn.classList.add('d-none');
        userZipcodeForm.classList.remove('d-none');
        return false;
      }
    }
    // funtion when addon product functionality available
    if(pdpContainer){
      let addOnItemsEle = pdpContainer.querySelectorAll('[data-addon-selection]:checked');
      let mainProductId = this.querySelector('[name="id"]').value; //get main product id
      let budnleProductIDArray = [];  //array for store bundle product id value
      let mainProductQty = this.querySelector('[name="quantity"]').value; //get main product quantity  
      let randomValue = Math.random().toFixed(4);
      if(addOnItemsEle.length > 0) {
        addOnItemsEle.forEach((addOn)=> {
          if(!addOn.disabled){
            let addOnParent = addOn.closest('addons-form');
            let addonVaraintId = addOnParent.querySelector('.variant--id').value;
            let addOnJSON = {
              id: addonVaraintId,
              quantity: mainProductQty,
              properties:{'bundle product id': mainProductId, 'Random Value': randomValue}
            }
            addItems.push(addOnJSON);
            budnleProductIDArray.push(addonVaraintId)
          }
        });
      } 
      // when bundle product grather than 0 line item property add on main product
      if(budnleProductIDArray.length > 0) this.querySelector('[properies-addon]').innerHTML = `
      <input type="hidden" name="properties[Random Value]" value="${randomValue}">
      <input type="hidden" name="properties[Bundle Products]" value="${budnleProductIDArray}">`
      addItems.push(JSON.parse(serializeForm(this.form)))
      addItems = addItems.reverse();
    }
    else {
      addItems.push(JSON.parse(serializeForm(this.form)));
    }

    const body = JSON.stringify({
      items: addItems
    });
    
    fetch(`${routes.cart_add_url}`, { ...fetchConfig(), body })
      .then((response) => response.json())
      .then(() => {
        if(document.querySelector('#PopupModal-quickshop')){
          document.querySelector('#PopupModal-quickshop .close-quickshop').dispatchEvent(new Event('click'))
        }
        this.cartElement.getCartData('open_drawer');
        if (qtyInput) qtyInput.value = 1;
        if (pdpContainer) {
          let addonSelection = pdpContainer.querySelectorAll('[data-addon-selection]:checked');
          if(addonSelection.length > 0){
            addonSelection.forEach(checkboxSelection => {
              checkboxSelection.removeAttribute('checked');
            });
          }
          if(addonSelection.length > 0) {
            document.querySelectorAll('.addon-add-btn').forEach((AddOnBtns) => {
              AddOnBtns.innerText = 'Add';
            });
          }
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');
      });
  }

  /**
   * Product Form Quantity Input update action
   *
   * @param {event} Event instance
   */
  manageQtyBtn(event) {
    event.preventDefault();
    let currentTarget = event.currentTarget;
    let action = currentTarget.dataset.for || 'increase';
    let $qtyInput = currentTarget.closest('[data-qty-container]').querySelector('[data-qty-input]');
    let currentQty = parseInt($qtyInput.value) || 1;
    let finalQty = 1;

    if(action == 'decrease' && currentQty <= 1){
        return false;
    }else if(action == 'decrease'){
        finalQty = currentQty - 1;
    }else{
        finalQty = currentQty + 1;
    }

    $qtyInput.value = finalQty;
  }
}
customElements.define('product-form', ProductForm);

/**
 * Dropdown selection for options
 */
class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.form = this.closest('form') || this.closest('.form-element');
    this.formType = this.form.dataset.format;
    this.addBtn = this.form.querySelector('[name="add"]');
    this.variant_json = this.form.querySelector('[data-variantJSON]');
    this.variantPicker = this.dataset.type;

    if(this.formType == 'product-page') this.onVariantChange('load');
    this.addEventListener('change', this.onVariantChange.bind(this));
  }

  /**
   * Trigger this function variant is changed
   * @param {event} _event 
   */
  onVariantChange(_event) {
    this.setCurrentVariant();
    if(this.formType == 'product-page') window.globalVariables.product.currentVariant = this.currentVariant;

    if (!this.currentVariant) {
      this.toggleAddButton('disable');
      // Variant name update
      let options = this.form.querySelectorAll('[data-optionindex]');
      options.forEach(option => {
        let lableID = 'option'+option.dataset.optionindex;
        const selectedValue = option.querySelector('input[type="radio"]:checked');
        const lable = option.querySelector('.selected-option');
        if(!lable || !lableID || !selectedValue) return;
        lable.innerHTML = selectedValue.value;
      });
    } else {
      if(this.formType == 'grid'){
        const productGrid = this.closest('[data-product-grid]');
        this.renderProductInfo(this.currentVariant, productGrid);
        this._updateLinks(productGrid); 
      }else{
        const productPage = this.closest('[data-product-container]');
        this.renderProductInfo(this.currentVariant, productPage);
      }
      this.updateURLandID(this.currentVariant);
      this.toggleAddButton('enable');
    }
  }

  /**
   * Change product variant url link in product card when variant is being updated
   * @param {element} productGrid 
   */
  _updateLinks(productGrid){
    if(!this.currentVariant || !productGrid) return;
    const variantURL = '?variant=' + this.currentVariant.id;
    const formLinks = productGrid.querySelectorAll('.product-link');
    formLinks.forEach(link => {
      let href = link.href.split('?')[0];
      link.href = href + variantURL;
    });
  }

  /**
   * Fetch selected options from dropdown
   */
  _getOptionsFromSelect() {
    let options = [];
    this.querySelectorAll('.variant_selector').forEach((selector)=>{
      options.push(selector.value);
    });
    return options;
  }

  /**
   * Fetch selected options from radio
   */
  _getOptionsFromRadio() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset:not(.addon-fieldset)'));
    return fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input:not(.addon-swatch)')).find((radio) => radio.checked).value;
    });
  }

  /**
   * change value of currentVariant when variant being changed 
   */
  setCurrentVariant() {
    // get all current values from selectors
    this.currentVariant = false;
    let options = (this.variantPicker == 'variant-select') ? this._getOptionsFromSelect() : this._getOptionsFromRadio();

    let variantsArray = this._getVariantData();
    variantsArray.find((variant) => {
      // get true or false based on options value presented in variant
      // value format would be [true/false,true/fasle,true/false] boolean value based on options present or not
      let mappedValues = variant.options.map((option, index) => {
        return options[index] === option;
      });

      // assign variant details to this.currentVariant if all options are present
      if(!mappedValues.includes(false)){
        this.currentVariant = variant;
      }
    });
  }

  /**
   * Update URL on variant change event
   * @param {JSON} currentVariant 
   */
  updateURLandID(currentVariant) {
    if (!currentVariant) return;

    // update query string with latest variant ID
    if(this.formType == 'product-page') window.history.replaceState({ }, '', `${this.dataset.url}?variant=${currentVariant.id}`);

    // update variant input with currentVariant Id
    const input = this.form.querySelector('input[name="id"]');
    input.value = currentVariant.id;
  }

  /**
   * Render Product data based on current variant
   * @param {event} currentVariant 
   * @param {element} container 
   */
  renderProductInfo(currentVariant, container) {
    if(!currentVariant || !container) return;

    // Price Update
    let price = Shopify.formatMoney(currentVariant.price, window.globalVariables.money_format);
    let compare_price = Shopify.formatMoney(currentVariant.compare_at_price, window.globalVariables.money_format);
    let priceElement = container.querySelector('[data-currentPrice]');
    let comparePriceElement = container.querySelector('[data-comparePrice]');

    if(priceElement) priceElement.innerHTML = price;
    if(comparePriceElement) {
      comparePriceElement.innerHTML = compare_price;
      if(currentVariant.compare_at_price <= 0){
        comparePriceElement.style.display = 'none';
      }else{
        comparePriceElement.style.display = 'block';
      }
    }
   
    // Grid Image Update on variant selection
    if(this.formType == 'grid'){
      if(!currentVariant.featured_image) return;
      const featuredImage = container.querySelector('[data-feauredImage]');
      let updatedSrc = currentVariant.featured_image.src;
      if(updatedSrc){
        featuredImage.src = updatedSrc;
        featuredImage.srcset = updatedSrc;
      }
    }else{
      if(!currentVariant.featured_image) return;
      let imageID = currentVariant.featured_media.id;
      let imageSlide = document.querySelector(`.product--media[data-mediaID="${imageID}"]`);
      if(this.formType == 'quickshop'){
        imageSlide = document.querySelector(`.quickshop-slider .product--media[data-mediaID="${imageID}"]`);
      }
      if(!imageSlide) return;
      let slideIndex = Array.from(imageSlide.parentNode.children).indexOf(imageSlide);
      if(quickShopSlider) quickShopSlider.slideTo(slideIndex, 2000, true);
      else if(productSlider)  productSlider.slideTo(slideIndex, 2000, true);
    }

    // Variant name update
    let options = this.form.querySelectorAll('[data-optionindex]');
    options.forEach(option => {
      let lableID = 'option'+option.dataset.optionindex;
      const lable = option.querySelector('.selected-option');
      if(!lable || !lableID) return;
      lable.innerHTML = currentVariant[lableID];
    });
  }

  /**
   * Toggle the button based on product availability ( add to cart / soldOut )
   * @param {*} status enable / disable
   */
  toggleAddButton(status) {
    if (!this.addBtn) return;

    if (status == 'disable') {
      this.addBtn.setAttribute('disabled', true);
      if(this.addBtn.querySelector('.add-text'))
        this.addBtn.querySelector('.add-text').textContent = window.variantStrings.unavailable;
    } else if(this.currentVariant && !this.currentVariant.available) {
      this.addBtn.setAttribute('disabled', true);
      if(this.addBtn.querySelector('.add-text'))
        this.addBtn.querySelector('.add-text').textContent = window.variantStrings.soldOut;
    } else {
      this.addBtn.removeAttribute('disabled');
      if(this.form.classList.contains('cart-upsell-form')){
        this.addBtn.querySelector('.add-text').textContent = window.variantStrings.upsellAddText;
      }else{
        this.addBtn.querySelector('.add-text').textContent = window.variantStrings.addToCart;
      }
    }
  }

  /**
   * Store the all the variants json
   */
  _getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.variant_json.textContent);
    return this.variantData;
  }
}
  
  customElements.define('variant-selects', VariantSelects);
  
  /**
   * Radio Button swatch
   */
  class VariantRadios extends VariantSelects {
    constructor() {
      super();

      this.form = this.closest('form') || this.querySelector('.form-element');
      this.formType = this.form.dataset.format;
      
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
  customElements.define('variant-radios', VariantRadios);