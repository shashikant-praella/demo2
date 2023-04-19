  // Ajax cart JS for Drawer and Cart Page
  const drawerSelectors = {
    cartIcons: document.querySelectorAll('.header__icon--cart'),
    cartIconDesktop: document.querySelector('#cart-icon-desktop'),
    cartIconMobile: document.querySelector('#cart-icon-mobile'),
  };
  var cartJson;
  cartJson = document.querySelector('[data-cartScriptJSON]').innerHTML;
  cartJson =  JSON.parse(cartJson);

  console.log(cartJson,"cartJsoncartJsoncartJsoncartJsoncartJsoncartJson")
  class AjaxCart extends HTMLElement {
      constructor() {
        super();

        this.openeBy = drawerSelectors.cartIcons;
        this.isOpen =  this.classList.contains('open--drawer');
        this.bindEvents();
        this.cartNoteInput();
        this.querySelectorAll('.close-ajax--cart').forEach(button => button.addEventListener('click', this.closeCartDrawer.bind(this)));

        if(window.globalVariables.template != 'cart'){
          this.addAccessibilityAttributes(this.openeBy);
          this.getCartData();
        }else{
          this.style.visibility = 'visible';
        }

        if (navigator.platform === 'iPhone') document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      }

      /**
       * Add accessibility attributes to Open Drawer buttons
       * 
       * @param {Node Array} openDrawerButtons Cart Icons
       */
      addAccessibilityAttributes(openDrawerButtons) {
        let _this = this;
        openDrawerButtons.forEach(element => {
          element.setAttribute('role', 'button');
          element.setAttribute('aria-expanded', false);
          element.setAttribute('aria-controls', _this.id);
        });
      }

      /**
       * Escape Click event to close drawer when focused within Cart Drawer
       *
       * @param {event} Event instance
       */
      onKeyUp(event) {
        if(event.code.toUpperCase() !== 'ESCAPE') return;
        this.querySelector('.close-ajax--cart').dispatchEvent(new Event('click'));
      }

      /**
       * bind dclick and keyup event to Cart Icons
       * bind keyUp event to Cart drawer component
       * bind Other inside element events
       *
       */
      bindEvents() {
        if(window.globalVariables.template != 'cart'){
          this.openeBy.forEach(cartBtn => cartBtn.addEventListener('click', this.openCartDrawer.bind(this)));
          this.addEventListener('keyup', this.onKeyUp.bind(this));
        }
        this.updateEvents();
      }

      /**
       * bind Other inside element events to DOM
       *
       */
      updateEvents(){
        this.querySelectorAll('[data-itemRemove]').forEach(button => button.addEventListener('click', this.removeItem.bind(this)));
        this.querySelectorAll('[data-qty-btn]').forEach(button => button.addEventListener('click', this.manageQtyBtn.bind(this)));
        this.querySelectorAll('[data-qty-input]').forEach(button => button.addEventListener('change', this.onQtyChange.bind(this)));
      }

      /**
       * Open Cart drawer and add focus to drawer container
       *
       * @param {event} Event instance
       */
      openCartDrawer(event) {
        if(!window.globalVariables.cart_drawer){
           window.location.href = window.routes.cart_fetch_url || '/cart';
          return;
        }

        if(document.querySelector('#mobile-menu-drawer').classList.contains('opened-drawer')){
          document.querySelector('.close-mobile--navbar').dispatchEvent(new Event('click'));
        }

        this.classList.add('opened-drawer');
        siteOverlay.prototype.showOverlay();
        Utility.forceFocus(this.querySelector('.cart-title'));
        let closeBtn = this.querySelector('.close-ajax--cart');
        Utility.trapFocus(this, closeBtn);

        if(event){
          event.preventDefault();
          let openBy = event.currentTarget;
          openBy.setAttribute('aria-expanded', true);
        }
      }

      /**
       * Close Cart drawer and Remove focus from drawer container
       *
       * @param {event} Event instance
       */
      closeCartDrawer(event, elementToFocus = false) {
        if (event !== undefined) {
          event.preventDefault();
          this.classList.remove('opened-drawer');
          siteOverlay.prototype.hideOverlay();
          let openByEle = event.currentTarget;
          openByEle.setAttribute('aria-expanded', false);
          Utility.removeTrapFocus(elementToFocus);

          let actionBtn = drawerSelectors.cartIconDesktop;
          if(window.innerWidth < 1024){
            actionBtn = drawerSelectors.cartIconMobile;
          }
          Utility.forceFocus(actionBtn);
        }
      }

      /**
       * Fetch latest cart data 
       *
       */
      getCartData(){
          let cardBody = document.querySelector('[data-lineItemsWrapper]');
          let cart_total = Shopify.formatMoney(cartJson.original_total_price , window.globalVariables.money_format)
          let lineItemsWrapper = '';
          // this.freeshippingBar(cartJson);
          cartJson.items.forEach( (item,index) => {
            lineItemsWrapper += `<div class="cart-items py-4 px-md-3 border-bottom"  data-cart-item data-variant-id="${item.variant_id}">
            <div class="row align-items-center cart-item">
                <div class="col-12 mb-3 mb-md-0 col-md-6 cart-product-img">
                    <div class="d-flex align-items-center">
                        <div class="cart-img me-3 me-lg-4">
                            <img class="img-fluid item-img"
                            src="${item.image}"
                            alt="${item.title}"
                            loading="lazy"
                            width=75
                            height=75
                            >
                        </div>
                        <div class="cart-item-text">
                              <p class="caption-with-letter-spacing light">${item.vendor}</p>
                               <a href="${item.url}" class="card-title"> ${item.title} </a>
                                 ${this._getOptionsHtml(item)}
                        </div>
                    </div>
                </div>
                <div class="col-4 col-md-2 text-md-center cart-price">
                   ${this._getPriceHtml(item)}
                </div>
                <div class="col-5 col-md-2 quantity-box">
                    <div class="d-flex align-items-center justify-content-center">
                    ${this._getQtyHtml(item,index+1)}
                    </div>
                </div>
                <div class="col-3 col-md-2 text-end cart-total-price">
                  ${this._getLinePriceHtml(item)}
                </div>
            </div>
            </div>`
          })


          cardBody.innerHTML = lineItemsWrapper;
          console.log(this.querySelector('[data-cartTotal]'));
          this.querySelector('[data-cartTotal]').innerHTML = `<span class="money">${cart_total}</span>`
          this.updateEvents();
       }

       /**
        * 
        * @param {item} - line item  
        * @returns  - Varinats and options of product HTML
        */
       _getOptionsHtml = (item) => {
         let optionHTML = '';
         if(!item.product_has_only_default_variant){
           item.options_with_values.forEach( option => {
             optionHTML += `<li>
             <span class="text-muted small text-capitalize">${option.name}:</span>
             <span class="text-muted small text-capitalize"> ${option.value }</span>
           </li>`
           })
          }
          let html = `<ul class="list-unstyled">${optionHTML}</ul>`;
        return html;
       }

       /**
        * 
        * @param {item } - line items 
        * @returns - returns a product price HTML
        */
       _getPriceHtml = (item) => {
          let priceHtml = '';
          if((item.properties!= null && item.properties['promo_product'] != null) || item.original_price == 0 ){
            priceHtml = ` <span class="m-0 p-0">free</span>`
          } 
          else if( item.price == 0 ){
            priceHtml=  `<span class="text-muted m-0 p-0">${Shopify.formatMoney(item.original_price, window.globalVariables.money_format)}</span>`;
          }
          else{
            priceHtml = `<span class="text-muted m-0 p-0">${Shopify.formatMoney(item.original_price, window.globalVariables.money_format)}</span>`;
          }
          return priceHtml;
       }

       /**
        * 
        * @param {item} - cart line item 
        * @returns -line item total price HTML 
        */
       _getLinePriceHtml = (item) => {
        let priceHtml = '';
        if((item.properties != null && item.properties['promo_product'] != null) || item.original_price == 0 ){
                 priceHtml = ` <span class="m-0 p-0">free</span>`
          } 
        else{
          priceHtml = `<span class="m-0 p-0">${Shopify.formatMoney(item.line_price , window.globalVariables.money_format)}</span>`;
        }
          return priceHtml;
       }

       /**
        * 
        * @param {item}  - cart line item 
        * @param {index}   - index for line item for change purpose
        * @returns - quantity html to append 
        */
       _getQtyHtml = (item,index) => {
        let input = '';
        if((item.properties!= null && item.properties['promo_product'] != null) || item.original_price == 0 ){
          input =  `<input type="hidden" name="updates[]" id="updates_${item.key}" 
          value="${item.quantity}" step="1" min="1" pattern="[0-9]*" inputmode="numeric" data-qty-input class="quantity form-control text-center">`
        }
        else{
          input = `<div class="quantity-wrapper mx-auto" data-qty-container>
          <label for="{{ 'templates.cart.quantity.label' | t }}" title="{{ 'templates.cart.quantity.label' | t }}">{{ 'templates.cart.quantity.label' | t }}</label>
          <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                  <a href="#" class="input-group-text py-2 px-3 h-100" rel="nofollow" aria-label="${item.title}" title="${item.title}" data-for="decrease" data-qty-btn>
                      <span class="btn-decrease d-flex h-100 align-items-center"><span class="icon-minus"></span></span>
                      <span class="visually-hidden">${item.title}</span>
                  </a>
              </div>
              <input type="number" name="updates[]" id="updates_${ item.key }" aria-label="${item.title}" value="${ item.quantity }" step="1" min="1" inputmode="numeric" data-qty-input data-index="${index}" class="quantity form-control text-center px-2 py-1" readonly>
              <div class="input-group-append">
                  <a href="#" class="input-group-text py-2 px-3 h-100" rel="nofollow" aria-label="${item.title}" title="${item.title}" data-for="increase" data-qty-btn>
                      <span class="btn-increase d-flex h-100 align-items-center"><span class="icon-plus"></span></span>
                      <span class="visually-hidden">${item.title}</span>
                  </a>
              </div>
          </div>
      </div>
      <a class="my-0 text-danger ms-3"
          href="#"
          title="{{ 'templates.cart.remove' | t }}"
          aria-label="{{ 'templates.cart.remove' | t }}"
          data-toggle="tooltip"
          data-itemRemove data-index="${index}"
          data-placement="left">
          <span class="icon-close"></span>
      </a>`
        }
        return input;
       }

       /**
        * 
        * sale motivator - free shipping bar
        */
      //  freeshippingBar = () => {
      //   let free_shipping_value , left_amount,left_amount_txt , free_shipping_text;
      //   let total_price = (cartJson.total_price/100)
      //    free_shipping_value = window.freeshipping.free_shipping_value;
      //         if(total_price >= free_shipping_value){
      //           free_shipping_text = window.freeshipping.free_shipping_text;
      //             if (document.querySelector('[data-cartShippingBar] .freeshippingbar') != null ) {
      //               document.querySelector('[data-cartShippingBar] .freeshippingbar').innerHTML = free_shipping_text
      //             }
      //           }
      //           else{
      //           left_amount = free_shipping_value - total_price ; 
      //           left_amount = Shopify.formatMoney(left_amount, window.globalVariables.money_format)
      //           left_amount_txt = ` you are ${left_amount} away for free delivery`;
      //             if (document.querySelector('[data-cartShippingBar] .freeshippingbar') != null) { 
      //               document.querySelector('[data-cartShippingBar] .freeshippingbar').innerHTML =  left_amount_txt ;
      //             }
      //           }
      //  }

       /**
       * Update Quantity API call 
       *
       * @param {string} line Line Index value of cart Item (Starts from 1)
       * @param {integer} quantity Quantity to update
       */
      updateItemQty(line, quantity){
          let lineItem = document.querySelectorAll('[data-cart-item]')[line-1];
          if(lineItem){ lineItem.classList.add('updating'); }
          const body = JSON.stringify({
              line,
              quantity
          });

          fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body }})
          .then((response) => {
              return response.json();
          })
          .then((data) => {
            cartJson  = data;
            this.getCartData();
            setTimeout(() => {
              if(lineItem){ lineItem.classList.remove('updating'); }
            }, 1000);
          }).catch((error) => {
            setTimeout(() => {
              if(lineItem){ lineItem.classList.remove('updating'); }
            }, 1000);
          });
      }

      /**
       * Remove Item Event
       *
       * @param {event} Event instance
       */
      removeItem(event){
        event.preventDefault();
        let currentTarget = event.currentTarget;
        let itemIndex = currentTarget.dataset.index || null;
        if(itemIndex != null){
            this.updateItemQty(itemIndex, 0);
        }
      }

      /**
       * Cart Item Qunatity Increment/Decrement Button event
       *
       * @param {event} Event instance
       */
      manageQtyBtn(event){
        event.preventDefault();
        let currentTarget = event.currentTarget;
        let action = currentTarget.dataset.for || 'increase';
        let $qtyInput = currentTarget.closest('[data-qty-container]').querySelector('[data-qty-input]');
        let itemIndex = $qtyInput.dataset.index || 1;
        let currentQty = parseInt($qtyInput.value) || 1;
        let finalQty = 1;

        if(action == 'decrease' && currentQty <= 1){
            return false;
        }else if(action == 'decrease'){
            finalQty = currentQty - 1;
        }else{
            finalQty = currentQty + 1;
        }
        this.updateItemQty(itemIndex, finalQty);
      }

      /**
       * Cart Item Qunatity Input change event
       *
       * @param {event} Event instance
       */
      onQtyChange(event){
        const $qtyInput = event.currentTarget;
        const qtyValue = $qtyInput.value;
        const itemIndex = $qtyInput.dataset.index || null;
        if(itemIndex) this.updateItemQty(itemIndex, qtyValue);
      }

      /**
       * Manage Cart Notes
       */
      cartNoteInput(){
        const cartNoteEle = document.querySelector('[data-cartNote] [name="note"]');
        if(!cartNoteEle) return;

        const cartNoteSave = document.querySelector('[data-saveNote]');
        let cartNoteEvents = ['input', 'paste'];
        cartNoteEvents.forEach((eventName)=>{
          cartNoteEle.addEventListener( eventName, ()=> {
            const defaultNote = cartNoteEle.dataset.default;
            if(defaultNote != cartNoteEle.value){
                cartNoteSave.style.display = 'block';
            }else{
                cartNoteSave.style.display = 'none';
            }
          }, false);
        });

        //  Cart Note Change event
        cartNoteSave.addEventListener( "click", e => {
          e.preventDefault();
          const currentTarget = e.currentTarget;
          const cartNoteContainer = currentTarget.closest('[data-cartNote]');
          const cartNote = cartNoteContainer.querySelector('[name="note"]').value.trim();
          if(cartNote.length <= 0){
            alert('Add Note before proceeding');
            return;
          }
          const submitBtn = cartNoteContainer.querySelector('[data-saveNote]');
          const waitText = (submitBtn.dataset.adding_txt) ? submitBtn.dataset.adding_txt : 'Saving...';
          submitBtn.innerHTML = waitText;
          submitBtn.disabled = true;
          this.updateCartNote(cartNoteContainer);
        });
      }

      /**
       * Update Cart Note
       * @param {element} cartNoteContainer 
       */
      updateCartNote(cartNoteContainer){
        const _this = this;
        const cartNoteEle = cartNoteContainer.querySelector('[name="note"]');
        const cartNote = cartNoteEle.value.trim();
        const resultEle = cartNoteContainer.querySelector('[data-resultMsg]');
        const submitBtn = cartNoteContainer.querySelector('[data-saveNote]');
        const defaultText = (submitBtn.dataset.default) ? submitBtn.dataset.default : 'Save';

        let body = JSON.stringify({
          note: cartNote
        });
        fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body }
        }).then(function (data) {
          if (data.status == 200) {
            if(resultEle){
              resultEle.innerText = 'Added note to Order!';
              _this.manageResponseText(resultEle);
            }
            if(cartNoteEle){
              cartNoteEle.dataset.default = cartNote;
            }
            submitBtn.style.display = 'none';
            submitBtn.innerHTML = defaultText;
            submitBtn.disabled = false;
          }
          else {
            console.error('Request returned an error', data);
            if(resultEle){
              resultEle.innerText = data;
              _this.manageResponseText(resultEle);
            }
            submitBtn.innerHTML = defaultText;
            submitBtn.disabled = false;
          }
        }).catch(function (error) {
            console.error('Request failed', error);
            if(resultEle){
              resultEle.innerText = error;
              _this.manageResponseText(resultEle);
            }
            submitBtn.innerHTML = defaultText;
            submitBtn.disabled = false;
        });
      }

      /**
       * fade effect on reponse
       * @param {element} element 
       */
      manageResponseText(element){
        Utility.fadeEffect(element, 'fadeIn');
        setTimeout(() => {
            Utility.fadeEffect(element, 'fadeOut');
        }, 3000);
      }
  }
  customElements.define("ajax-cart", AjaxCart);