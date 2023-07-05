/**
 * zipcode form functionality manage zipcode from this function
 * with main products
 */
/**
 * Get started details about Addons/bundle products
 @param {string} -  this.form , this.userZipcodeForm ,this.warrentyAddToCartBtn , this.warrentyPopupCloseBtn 
        this.warrentyPopupCloseIcon, this.popupWarranty, this.modalWarranty,
        this.warranty_product_id, this.warrantyProductAddCheckbox
    this.form - , 
    this.userZipcodeForm - geting zipcode for html,
    this.warrentyAddToCartBtn - geting addto cart button html,
    this.warrentyPopupCloseBtn  geting close button html-
    this.warrentyPopupCloseIcon - geting close icon html,
    this.popupWarranty - get warranty popup html, 
    this.modalWarranty - get warranty popup model,
@param {boolean} - this.addWarranty
     this.addWarranty - check warranty product add or not 
 */

class user_zipcode_form extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
        this.userZipcodeForm = document.querySelector('user-zipcode-form');
        if(this.form) this.form.addEventListener('submit', this.checkUserFromZipCode.bind(this));
        this.warrentyAddToCartBtn = document.querySelector('[warrenty_add_to_cart]');
        this.warrentyPopupCloseBtn = document.querySelector('[warrenty_popup_close]');
        this.warrentyPopupCloseIcon = document.getElementById('ModalClose-warranty');
        this.popupWarranty =  document.getElementById('PopupModal-warranty');
        this.addWarranty = false;
        this.modalWarranty = null;
        if(this.popupWarranty ) this.modalWarranty = this.popupWarranty.querySelector('.modal');
        this.warranty_product_id = this.warrentyAddToCartBtn.getAttribute('warranty_product_id');
        this.warrantyProductAddCheckbox = document.querySelector('[warranty_product_add_checkbox]');
     
        if(this.warrentyPopupCloseBtn) this.warrentyPopupCloseBtn.addEventListener('click', this.submitProduct.bind(this));
        if(this.warrentyPopupCloseIcon) this.warrentyPopupCloseIcon.addEventListener('click', this.submitProduct.bind(this));
        if(this.warrentyAddToCartBtn) this.warrentyAddToCartBtn.addEventListener('click', this.addWarrantyProduct.bind(this));

    }
    // function for check user input zipcode value
    checkUserFromZipCode(event) {
        event.preventDefault();
        let zipCodeValue = null
        let zipCodeInput = this.querySelector('[name="user_zipcode"]');
        if(zipCodeInput) zipCodeValue = zipCodeInput.value;
        if(zipCodeValue) Utility.setCookie('cookiesZipcode', zipCodeValue, 1) 
        let localZipCode = window?.warranty_features?.locallocal_zip_code;
        if(localZipCode) if(localZipCode.indexOf(zipCodeValue) < 0) this.showPopupWarranty();
        else this.submitProduct();
    }
    // function for show warranty popup
    showPopupWarranty() {
        if(this.popupWarranty) {
            if(this.modalWarranty) {
                this.modalWarranty.classList.add('open');
                siteOverlay.prototype.showOverlay();
                Utility.trapFocus(this.popupWarranty);
                Utility.forceFocus(this.popupWarranty.querySelector('[id^="ModalClose-"]'));
            }
        }
           
    }
    // function for add main product when close or thank you button click on popup
    submitProduct() {
        let addItems = [];
        let productForm = document.querySelector('[data-product-container]');
        let formSubmitProduct = productForm.querySelector('form');
        let submitButton = productForm.querySelector('[name="add"]');
        let qtyInput = productForm.querySelector('[data-qty-input]');
    
        submitButton.setAttribute('disabled', true);
        submitButton.classList.add('loading');
        addItems.push(JSON.parse(serializeForm(formSubmitProduct)));
     
        const body = JSON.stringify({
          items: addItems
        });
        
        fetch(`${routes.cart_add_url}`, { ...fetchConfig(), body })
          .then((response) => response.json())
          .then(() => {
            if(document.querySelector('#PopupModal-quickshop')) {
              document.querySelector('#PopupModal-quickshop .close-quickshop').dispatchEvent(new Event('click'))
            }
            let cartElement = document.querySelector('ajax-cart')
            if(cartElement) cartElement.getCartData('open_drawer');
            if (qtyInput) qtyInput.value = 1;
            let submitBtn = document.querySelector('[name="add"]');
            if(submitBtn) submitBtn.classList.remove('d-none');
            if(this.userZipcodeForm) this.userZipcodeForm.classList.add('d-none');

          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            submitButton.classList.remove('loading');
            submitButton.removeAttribute('disabled');
            this.addWarranty = false;

            document.body.classList.remove('overflow-hidden');
            this.modalWarranty.classList.remove('open');
            siteOverlay.prototype.hideOverlay();
            Utility.removeTrapFocus(this.popupWarranty.querySelector('[id^="ModalClose-"]'));
          });
    }
    // function for add warranty product when click add warranty button
    addWarrantyProduct() {
        let productForm = document.querySelector('[data-product-container]');
        let mainProductId = productForm.querySelector('[name="id"]').value;
        if(this.warranty_product_id) {
            const body = JSON.stringify({
                id: this.warranty_product_id,
                quantity: 1,
                properties: {
                  'Product Type': 'Warrenty',
                  'Main Product': mainProductId
                }
            });
            let fetchCart = fetch(`${routes.cart_add_url}`, { ...fetchConfig(), ...{ body }});
            fetchCart.then(response => {
                return response.json();
            }).then(async (response) => {
                this.addWarranty = true;
                await this.submitProduct();
            }).catch((e) => {
                console.error(e);
            });
        }
    }

}
customElements.define('user-zipcode-form', user_zipcode_form);

/**
 * zipcode hide/show whenclick add to cart manage from this function
 * @param {string} -  CookiesZipcode, openZipcodeForm, zipcode_wrapper, zip_code_value, submitBtn
 * CookiesZipcode - store zipcode value in cookies, 
 * openZipcodeForm - zip code form html, 
 * zipcode_wrapper - zipcode form outer html, 
 * zip_code_value - store zip code value, 
 * submitBtn -  main product submit button html 
 */
class zipcodeWrapper extends HTMLElement {
    constructor() {
        super();
        this.CookiesZipcode = Utility.getCookie('cookiesZipcode');
        this.openZipcodeForm = this.querySelector('[open-zipcode-form]');
        if(this.CookiesZipcode && this.CookiesZipcode != undefined) this.UpadteZipcodeDeatils(this.CookiesZipcode);
        if(this.openZipcodeForm) this.openZipcodeForm.addEventListener('click', this.openFromZipCode.bind(this));
    }
    // function for updat ezipcode value
    UpadteZipcodeDeatils(CookiesZipcode) {
        let zipcode_wrapper = document.querySelector("zipcode-wrapper");
        let zip_code_value = document.querySelector("[zip-code-value]");
        if(zipcode_wrapper && zip_code_value) {
            zip_code_value.innerText = CookiesZipcode;
            zipcode_wrapper.classList.remove('d-none');
        }
    }
    // function for open zipcode form
    openFromZipCode() {
        let submitBtn = document.querySelector('[name="add"]');
        if(submitBtn) submitBtn.classList.add('d-none');
        this.classList.add('d-none');
        document.querySelector('user-zipcode-form').classList.remove('d-none');
    }

}
customElements.define('zipcode-wrapper', zipcodeWrapper);

/**
 * update warrwnty product on cart and cart drawer
 * with main products
 */
/**
 * Get started details about Addons/bundle products
 @param {string} -  this.warrantyProductAddCheckbox, this.warranty_product_add_label, this.warranty_product_id_Checkbox
 * this.warrantyProductAddCheckbox - html of cart page warranty product add when click on checkbox, 
    this.warranty_product_add_label -  html of chekcbox cart page warranty product add when click on checkbox, 
    this.warranty_product_id_Checkbox - warranty product id
 */

 class cart_warranty_product extends HTMLElement {
    constructor() {
        super();
        this.warrantyProductAddCheckbox = document.querySelector('[warranty_product_add_checkbox]');
        this.warranty_product_add_label = document.querySelector('[warranty_product_add_label]');
        this.warranty_product_id_Checkbox = null
        if(this.warrantyProductAddCheckbox) this.warranty_product_id_Checkbox = this.warrantyProductAddCheckbox.value;
        if(this.warranty_product_add_label) this.warranty_product_add_label.addEventListener('click', this.addWarrantyProductToCart.bind(this));
        // check zipcode and based on it show checkbox on cart show/hide warranty product checkbox form
        let CookiesZipcode = Utility.getCookie('cookiesZipcode');
        if(CookiesZipcode && CookiesZipcode != undefined) {
          let localZipCode = window?.warranty_features?.locallocal_zip_code;
          if(localZipCode) if(localZipCode.indexOf(CookiesZipcode) == -1) {
            let cartItems = document.querySelectorAll('.cart-body .cart-items');
            if(cartItems.length > 0 ) {
              cartItems.forEach((cartItem) => {
                let cartWarranty = cartItem.querySelector('cart-warranty-product');
                if(cartWarranty) cartWarranty.classList.remove('d-none')
              });
            }
          }
        }

    }
    addWarrantyProductToCart() {
        document.querySelector('cart-warranty-product').classList.add('disabled');
        let mainProductId = this.warrantyProductAddCheckbox.getAttribute('item-id-main');
        let mainProductQty = this.warrantyProductAddCheckbox.getAttribute('item-qty-main');
        if(mainProductId && mainProductId != undefined && mainProductId != null && 
            mainProductQty && mainProductQty != undefined && mainProductQty != null && 
            this.warranty_product_id_Checkbox != null && this.warranty_product_id_Checkbox != undefined ) {
            const body = JSON.stringify({
                id: this.warranty_product_id_Checkbox,
                quantity: mainProductQty,
                properties: {
                  'Product Type': 'Warrenty',
                  'Main Product': mainProductId
                }
            }); 

            fetch(`${routes.cart_add_url}`, { ...fetchConfig(), body })
            .then((response) => response.json())
            .then(() => {
                let cartElement = document.querySelector('ajax-cart');
                if(cartElement) cartElement.getCartData('open_drawer');
            })
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {});
        }
    }

}
customElements.define('cart-warranty-product', cart_warranty_product);