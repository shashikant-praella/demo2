// Ajax cart JS for Drawer and Cart Page
const drawerSelectors = {
  cartIcons: document.querySelectorAll('.header__icon--cart'),
  cartIconDesktop: document.querySelector('#cart-icon-desktop'),
  cartIconMobile: document.querySelector('#cart-icon-mobile'),
};
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
     * Observe attribute of component
     * 
     * @returns {array} Attributes to Observe
     */
    static get observedAttributes() {
      return ['updating'];
    }
  
    /**
     * To Perform operation when attribute is changed
     * Calls attributeChangedCallback() with params when attribute value is updated
     * 
     * @param {string} name attribute name
     * @param {string} oldValue attribute Old value
     * @param {string} newValue attribute latest value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
      // called when one of attributes listed above is modified
      if(name == 'updating' && newValue == 'false'){
        this.updateEvents();
      }
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
     * Update cart HTML and Trigger Open Drawer event
     *
     * @param {string} cartHTML String formatted response from fetch cart.js call
     * @param {string} action Open Drawer as value if need to Open Cart drawer
     */
    _updateCart(response, action){
      this.setAttribute('updating', true);

      // Convert the HTML string into a document object
      let cartHTML = '';
      if(window.globalVariables.template != 'cart') {
        cartHTML = response['template-cart-drawer'];
      }else{
        cartHTML = response['template-cart'];
      }

      if(cartHTML == null) return;
      let parser = new DOMParser();
      cartHTML = parser.parseFromString(cartHTML, 'text/html');

      let cartJSONEle = cartHTML.querySelector('[data-cartScriptJSON]');
      if(cartJSONEle != undefined && cartJSONEle != null){
        window.globalVariables.cart = JSON.parse(cartJSONEle.textContent);
      }

      let cartElement = cartHTML.querySelector('ajax-cart form');
      if(this.querySelector('form')){ this.querySelector('form').innerHTML = cartElement.innerHTML; }
      if(this.querySelector('[data-carttotal] span.money')){ 
        this.querySelector('[data-carttotal] span.money').innerHTML = Shopify.formatMoney(window.globalVariables.cart.total_price, window.globalVariables.money_format);
      }

      let elements = this.querySelectorAll('[data-checkoutBtns], [data-cartnote], [data-cartupsell]');
      if(window.globalVariables.cart.item_count <= 0){
        elements.forEach((div)=>{
          div.classList.add('d-none');
        });
      }else{
        elements.forEach((div)=>{
          div.classList.remove('d-none');
        });
      }
      this.setAttribute('updating', false);

      let headerHTML = new DOMParser().parseFromString(response['header'], 'text/html');
      let cartIcon = headerHTML.getElementById('cart-icon-desktop');
      if(drawerSelectors.cartIconDesktop) drawerSelectors.cartIconDesktop.innerHTML = cartIcon.innerHTML;
      if(drawerSelectors.cartIconMobile) drawerSelectors.cartIconMobile.innerHTML = cartIcon.innerHTML;

      if(window.globalVariables.cart_drawer && action == 'open_drawer' && window.globalVariables.template != 'cart'){
          this.openCartDrawer();
      }
      //  this.cartGWP();
       this.calculateFreeGift()
      // this.cartGWPSingleTier();
    }

    /**
     * Fetch latest cart data 
     *
     * @param {string} action Open Drawer as value if need to Open Cart drawer or else let it be empty
     */
    getCartData(action){
        let cartRoute = `${routes.cart_fetch_url}?sections=template-cart,header`;
        if(window.globalVariables.template != 'cart'){
          cartRoute = `${routes.cart_fetch_url}?sections=template-cart-drawer,header`;
        }

        fetch(cartRoute).then(response => {
          return response.json();
        }).then(response => {
            this._updateCart(response, action);
        }).catch((e) => {
            console.error(e);
        }).finally(() => {
            // Cart HTML fetch done
        });
    }
  
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
            return response.text();
        })
        .then((_state) => {
          this.getCartData();
          setTimeout(() => {
            if(lineItem){ lineItem.classList.remove('updating'); }
          }, 1000);
        }).catch((error) => {
          setTimeout(() => {
            if(lineItem){ lineItem.classList.remove('updating'); }
          }, 1000);
          console.log(error);
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
    // 1) Cart actions: add/remove
    async cartAction(type, items) {
      console.log(type, items)
      if(type == 'add'){
        const response = await fetch(`/cart/add.js`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
          body :  JSON.stringify({ items: items })
        });

        if (response.ok) {
          console.log('Update cart UI');
          this.getCartData(); // If you are using fluid framework 2 then use this function for avoiding page reload
          
          /*
            window.location.href = '/cart'; // Redirect to cart page for non fluid theme
          */
        }else{
          console.log('Error - ajax update quantity',response);
        }
      }else if(type == 'update'){
        const response = await fetch(`/cart/update.js`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
          body :  JSON.stringify({ updates: items })
        });
        
        if (response.ok) {
          this.getCartData(); // If you are using fluid framework 2 then use this function for avoiding page reload
          /*
            window.location.href = '/cart'; // Redirect to cart page for non fluid theme
          */
        }else{
          console.log('Error - ajax update quantity');
        }
      }else if(type == 'change'){
        const response = await fetch(`/cart/change.js`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': `application/json` },
          body :  JSON.stringify(items)
        });
        
        if (response.ok) {
          this.getCartData(); // If you are using fluid framework 2 then use this function for avoiding page reload
          /*
            window.location.href = '/cart'; // Redirect to cart page for non fluid theme
          */
        }else{
          console.log('Error - ajax update quantity');
        }
      }
    }
    // 2) Get Cart JSON from alternate cart template
    async cartJSON() {
      let finalResponse;
      const response = await fetch(`/cart.json`,
      {
        method: 'GET'
      });
      var data = await response.json();
      
      // Added onetime addon
      if (response.ok) {
        finalResponse = data;
      }else{
        console.log('search.json Request Failed: ');
      }
      return finalResponse;
    }
    // 3) Main Function which has GWP code
    // You can remove the unwanted code if found any. Also call this function on page load and Cart update action
    async cartGWPSingleTier() {
      let cartJSON = await this.cartJSON();
      if(cartJSON == undefined){
        cartJSON = {};
      }
      
      const cartItems = cartJSON.items;
      let addProductsArray = [];
      let finalQtyArray = [];
      let updateGiftFound = false;
      
      // GWP Data
      let cartGWPEle = document.querySelector('[data-GWP-schema_single]'); //GWP settings Object from DOM
      let GWPCartItems = {}; // to gather all GWP cart Items
      let cartGWPEleJSON = {};
      if(cartGWPEle != null){
        cartGWPEleJSON = cartGWPEle.innerHTML;
        if(cartGWPEleJSON != undefined && cartGWPEleJSON != null){
          cartGWPEleJSON = JSON.parse(cartGWPEleJSON);
        }
      }
      let originalThreshouldAmount = cartGWPEleJSON.amount;
      let GWPaddPropertie = {
        "product_type": "GWP Gift",
        spend_over: originalThreshouldAmount
      }
      
      /*** Starting of Get GWP Object from DOM and Store JSON data in var ***/
      if(cartGWPEle != null){
        cartGWPEleJSON = cartGWPEle.innerHTML;
        if(cartGWPEleJSON != undefined && cartGWPEleJSON != null){
          cartGWPEleJSON = JSON.parse(cartGWPEleJSON);
        }
      }
      if(cartGWPEleJSON.gwp_pro1 != null && cartGWPEleJSON.gwp_pro1 != undefined){
        GWPCartItems[cartGWPEleJSON.gwp_pro1] = false;
      }
      /*** End of Get GWP Object from DOM and Store JSON data in var ***/
      
      cartItems.forEach((item) => {
        if(item.properties && item.properties['product_type'] == 'GWP Gift'){
          if(GWPCartItems[item.id] != undefined){
            GWPCartItems[item.id] = true;
          }
          if(GWPCartItems[item.id] == undefined || cartGWPEle.length == 0 || cartJSON.total_price < cartGWPEleJSON.amount){
            updateGiftFound = true;
            finalQtyArray.push(0);
          } else if(item.quantity > 1){
            updateGiftFound = true;
            finalQtyArray.push(1);
          } else {
            finalQtyArray.push(item.quantity);
          }
        }else{
          finalQtyArray.push(item.quantity);
        }
      })
      // Create GWP Final Add Product Array
      if(cartGWPEle != null && cartJSON.total_price >= cartGWPEleJSON.amount){
        Object.keys(GWPCartItems).forEach( function(key) {
          let keyValue = GWPCartItems[key];
          if(keyValue == false){
            let addProObject = {
              quantity: 1,
              id: key,
              properties: GWPaddPropertie
            }
            addProductsArray.push(addProObject);
          }
        })
      }

      // Update Cart 
      if(finalQtyArray.length > 0 && updateGiftFound == true){
          this.cartAction('update', finalQtyArray);
      }
      // add Products for GWP
      if(addProductsArray.length > 0){
        this.cartAction('add', addProductsArray);
      }
    }

    async cartGWPmultitier() {
      let  GWP = {};
      let cartGWPEle = document.querySelector('[data-GWP-schema]'); 
      if(cartGWPEle){
        GWP = JSON.parse(cartGWPEle.innerHTML);
      }
      let cartJSON = await this.cartJSON();
      var GWPGift = false;
      var threashouldValue = null;
      var existedFreeProduct = null;  
      var existedFreeProductLine = null;
    
      let originalThreshouldAmount = null;
      let updateQty = false;
    
      var eligibleThreshould = null;
      var eligibleFreeProduct = null;
      let eligibleFreeProductJSON = null;
      let finalThreshouldAmount = false;
      let cartTotal = 0;
      let addProObjectArray = [];
      let updateProObjectArray = [];
      //Check for Free Gift in Cart Items
      const cartItems = cartJSON.items;
      if(cartJSON.total_price > 0) {
        cartItems.forEach((product, index) => {    
          existedFreeProductLine = index + 1;
          if(product.properties['product_type'] == 'GWP Gift'){

            GWPGift = true;
          
            existedFreeProduct = product.variant_id;
          
            if(product.quantity > 1){
              updateQty = true;
            }
          
            if(product.variant_id == GWP.threashould_1['gwp_pro']){
              threashouldValue = 1;              
            }else if(product.variant_id == GWP.threashould_2['gwp_pro']){
              threashouldValue = 2;
            }else if(product.variant_id == GWP.threashould_3['gwp_pro']){             
              threashouldValue = 3;
            }
          }else{
            if(product.product_type != 'Gift Card'){
              cartTotal = cartTotal + product.final_line_price;
            }
          }
        }); 

        //Check for Eligible offer for Cart
      if(GWP.enable == 'true'){
        if(GWP.threashould_3['enable'] == true && cartTotal >= GWP.threashould_3['amount']){
          eligibleThreshould = 3;
          eligibleFreeProduct = GWP.threashould_3['gwp_pro'];
          finalThreshouldAmount = GWP.threashould_3['amount'];            
          eligibleFreeProductJSON = GWP.threashould_3['gwp_pro_JSON']; 
          originalThreshouldAmount = GWP.threashould_3['original_amount'];
        }else if(GWP.threashould_2['enable'] == true && cartTotal >= GWP.threashould_2['amount']){
          eligibleThreshould = 2;
          eligibleFreeProduct = GWP.threashould_2['gwp_pro'];
          finalThreshouldAmount = GWP.threashould_2['amount'];            
          eligibleFreeProductJSON = GWP.threashould_2['gwp_pro_JSON'];    
          originalThreshouldAmount = GWP.threashould_2['original_amount'];
        }else if(GWP.threashould_1['enable'] == true && cartTotal >= GWP.threashould_1['amount']){
          eligibleThreshould = 1;
          eligibleFreeProduct = GWP.threashould_1['gwp_pro'];
          finalThreshouldAmount = GWP.threashould_1['amount'];            
          eligibleFreeProductJSON = GWP.threashould_1['gwp_pro_JSON'];      
          originalThreshouldAmount = GWP.threashould_1['original_amount'];
        }
      }
      
      let removeProduct = {
        quantity: 0,
        line: existedFreeProductLine
      }  

      let updateProduct = {
        quantity: 1,
        line: existedFreeProductLine
      }     

      let properties = {
        product_type: 'GWP Gift',
        spend_over: originalThreshouldAmount
      }
      let addProObject ={}
      if(eligibleFreeProductJSON ){
        addProObject = {
          id: eligibleFreeProductJSON.variants[0].id,
          quantity: 1,
          properties: properties
        }
    }
      
      addProObjectArray.push(addProObject)
      updateProObjectArray.push(updateProduct)

      if((GWP == undefined || eligibleThreshould == null) && GWPGift == true || cartJSON.total_price <= 0) {
        await this.cartAction('change', removeProduct);
      }else if(threashouldValue != null && threashouldValue != eligibleThreshould && eligibleFreeProduct != null){
        await this.cartAction('change', removeProduct);
        await this.cartAction('add', addProObjectArray);         
      }else if(existedFreeProduct != null && existedFreeProduct != eligibleFreeProduct){
        this.cartAction('change', removeProduct);
        this.cartAction('add', addProObjectArray); 
      }else if(updateQty == true){
        await this.cartAction('update', updateProObjectArray);
      }else if(eligibleThreshould != null && eligibleFreeProduct != null && GWPGift == false){
        await this.cartAction('add', addProObjectArray); 
      }
      }else {
        cartItems.forEach((product, index) => {     
            let removeProduct = {
              quantity: 0,
              line: index + 1
            } 
            if(cartItems.length === 1) this.cartAction('change', removeProduct); return false;
          
        })
      } 
    }

    async ManageFreeProInCart (originalAmount, finalAmount, totalFreeGiftsQty, freeGiftQty, eligibleFreeProducts, giftType) {
      if(eligibleFreeProducts == null && finalAmount > 0 && freeGiftQty > 0){
          return;
      }
      document.querySelector(".free-giftText").innerHTML = `You are eligible for ${freeGiftQty} Free ${((freeGiftQty > 1) ? `Gifts` : `Gift`)} . ${((giftType == 'multiple') ? `One Gift for each` : `Gift for`)} spent over ${Shopify.formatMoney(finalAmount, window.globalVariables.money_format)}`;
      let freeProductHTML = '';
      eligibleFreeProducts.map((eligibleFreeProductJSON, index) => {
      freeProductHTML += `<div class="product--item"><div class="gift_prod_heading">'
      + '<div class="general-text gwp-product" style="display: none !important">You are eligible for ${freeGiftQty} Free ${((freeGiftQty > 1) ? `Gifts` : `Gift`)} . One Gift for each spent over ${Shopify.formatMoney(finalAmount, window.globalVariables.money_format)}</div>
         </div>
          <div class="gift_prod_details grid"><div class="gift_prod_img grid__item one-third"><a href="javascript:void(0)" class="gift_prod_imgwrapper ajaxcart__product-image">
          <img class="gift_img" src="${eligibleFreeProductJSON.featured_image}" /></a> </div>
         <div class="gift_prod_content grid__item two-thirds"><a href="javascript:void(0)" class="ajaxcart__product-name">${eligibleFreeProductJSON.title}</a>
          <p class="gift_prod_price"><span class="orgi_price ajaxcart__price">$0 | <del>${Shopify.formatMoney(eligibleFreeProductJSON.price, window.globalVariables.money_format)}</del></span>`;
      let freeProductHTMLButtom = ``;
      if(eligibleFreeProductJSON.variants[0].available == true){
          freeProductHTMLButtom = `<button type="button" name="add" class="btn add-to-cart" data-addid="${eligibleFreeProductJSON.variants[0].id}" data-addFreeItem>Add to cart</button>`;
          }else{
          freeProductHTMLButtom = `<button type="button" name="add" class="btn add-to-cart disabled" disabled><span>Sold Out</span></button>`;
          }
          freeProductHTML += `</p></div></div>${freeProductHTMLButtom}</div>`;
      });
      document.querySelector("[data-freeGift]").innerHTML = freeProductHTML
      document.querySelector("[data-freeGift]").classList.remove('d-none');
      
      // $('.cart--page.gift_products').slick({
      //     dots: true,
      //     arrows: true,
      //     slidesToShow: 3,
      //     infite: false,
      //     responsive: [
      //         {
      //             breakpoint: 1200,
      //             settings: {
      //                 slidesToShow: 2,
      //                 slidesToScroll: 1
      //             }
      //         },
      //         {
      //             breakpoint: 480,
      //             settings: {
      //                 slidesToShow: 1,
      //                 slidesToScroll: 1
      //             }
      //         }
      //     ]
      // }); 
      // $('.ajax--cart.gift_products').slick({
      //     dots: true,
      //     arrows: true,
      //     slidesToShow: 1,
      //     infite: false,
      //     responsive: [
      //         {
      //         breakpoint: 480,
      //         settings: {
      //             slidesToShow: 1,
      //             slidesToScroll: 1
      //         }
      //         }
      //     ]
      // }); 
      
      let SpendOver = ((totalFreeGiftsQty-freeGiftQty) + 1) * parseInt(originalAmount);
      
      document.querySelector("[data-freeGift]").addEventListener('click', async (event) => {
      event.preventDefault();

      let varID = event.target.getAttribute('data-addid');
       let productArray = []
            let properties = {
                product_type: 'GWP Gift',
                spend_over: SpendOver,
                baseThreshold: originalAmount,
            }
            let data={
                id: varID,
                quantity: 1,
                properties: properties
            }
            productArray.push(data)
            await this.cartAction('add', productArray);
            document.querySelector('[data-addFreeItem]').classList.add('disabled');
            document.querySelector('[data-addFreeItem]').setAttribute('disabled','disabled');
            if(giftType == 'single'){
              let isGift = false;
              let cartJSON = await this.cartJSON();
              const cartItems = cartJSON.items;
      
              cartItems.forEach((item, i) => {
                  if(item.properties['product_type'] == 'GWP Gift'){
                      isGift = true;
                  }
              });
              if(isGift) location.href = '/cart';
            }

      });
    }

    async removeFreeProductFromCart(type, GiftThreashouldAmount, cartTotal, cartElements, freeProducts, giftType) {
        cartTotal = cartTotal / 100;
        cartTotal = Math.floor(cartTotal);
        GiftThreashouldAmount = GiftThreashouldAmount / 100;
        
        let cartQty = [];
        let cartJSON = await this.cartJSON();
        const cartItems = cartJSON.items;

        cartItems.forEach((item, i) => {
            if(item.type == 'Gift' || item.properties['product_type'] == 'GWP Gift'){
                let spendAmount = parseInt(item.spendOver);
                let baseThreshold = parseInt(item.baseThreshold);
                
                if(type == 'removeExpired' && freeProducts.includes(item.id) != true){
                  cartQty.push(0);
                }else if(giftType == 'single' && spendAmount > baseThreshold){
                  cartQty.push(0);
                }else if(spendAmount > cartTotal || baseThreshold != GiftThreashouldAmount){
                  cartQty.push(0);
                }else if(item.quantity > 1){
                  cartQty.push(1);
                }else if(cartItems.length == 1){
                  cartQty.push(0);
                }else if(cartItems.length == 1){
                  cartQty.push(item.quantity);
                }
            }else{
                cartQty.push(item.quantity);
            }
        });
        
        await this.cartAction('update', cartQty);
    }

   async cartGWP() {

      let  GWP = {};
      let cartGWPEle = document.querySelector('[data-GWP-schema]'); 
      if(cartGWPEle){
        GWP = JSON.parse(cartGWPEle.innerHTML);
      }
      let freeProducts = [];
      if(GWP && GWP.threashould_1){
      freeProducts.push(GWP.threashould_1.gwp_pro);
      freeProducts.push(GWP.threashould_1.gwp_pro2);
      freeProducts.push(GWP.threashould_1.gwp_pro3);
      }

      let cartJSON = await this.cartJSON();
      const cartItems = cartJSON.items;
      let finalGWPAddedCount = 0;
      let finalQty;
      let cartTotal = 0;
      let cartElements = [];
      let removeExpiredGifts = false;
      let updateGifts = false;


      cartItems.forEach((product, index) => {  
        if(product.properties['product_type'] == 'GWP Gift'){
          finalGWPAddedCount += product.quantity; 
          let itemData = {
              type: 'Gift',
              spendOver: product.properties['spend_over'],
              baseThreshold: product.properties['baseThreshold'],
              quantity: product.quantity,
              id: product.id
          }
          cartElements.push(itemData);
          let proThreshould = parseInt(product.properties['baseThreshold']);
          let GWPThreshould = parseInt(GWP.threashould_1.original_amount);
          if(proThreshould != GWPThreshould){
              updateGifts = true;
          }

          let itemID = product.id;
          if(freeProducts.includes(itemID) != true){
              removeExpiredGifts = true;
          }
        }else{
          let itemData = {
              type: 'Regular',
              quantity: product.quantity,
              id: product.id
          }
          cartElements.push(itemData);
          if(product.product_type != 'Gift Card'){
              cartTotal = cartTotal + product.final_line_price;
          }
        }
      });

      // Calculate Final Qty for Free Product
      let GiftThreashouldAmount = 0;
        if(GWP && GWP.enable == true && GWP.threashould_1 && GWP.threashould_1.amount && parseInt(GWP.threashould_1.amount) != NaN && cartTotal > GWP.threashould_1.amount){
            if(GWP.type == 'single' && cartTotal > GWP.threashould_1.amount){
            finalQty = 1;
            }else{
            finalQty = cartTotal / parseInt(GWP.threashould_1.amount);
            }
            GiftThreashouldAmount = GWP.threashould_1.amount;
        }else{
            finalQty = 0;
        }
        finalQty = Math.floor(finalQty);
        if((GWP == undefined || GWP['enable'] != true || finalQty <= 0) && finalGWPAddedCount > 0){
           await this.removeFreeProductFromCart('removeNoteligible', GiftThreashouldAmount, cartTotal, cartElements, freeProducts, GWP.type);
        }else if(removeExpiredGifts == true){
          await this.removeFreeProductFromCart('removeExpired', GiftThreashouldAmount, cartTotal, cartElements, freeProducts, GWP.type);
        }else if(GWP.enable == true && (updateGifts == true || finalGWPAddedCount > finalQty)){
          await this.removeFreeProductFromCart('removeNoteligible', GiftThreashouldAmount, cartTotal, cartElements, freeProducts, GWP.type);
        }else if(GWP.enable == true && finalQty > 0 && finalGWPAddedCount < finalQty){
            let freeGiftQty = finalQty - finalGWPAddedCount;
            let freeProducts = [];
            if(GWP && GWP.threashould_1){
            if(GWP.threashould_1.gwp_pro_JSON){
                freeProducts.push(GWP.threashould_1.gwp_pro_JSON);
            }if(GWP.threashould_1.gwp_pro2_JSON){
                freeProducts.push(GWP.threashould_1.gwp_pro2_JSON);
            }if(GWP.threashould_1.gwp_pro3_JSON){
                freeProducts.push(GWP.threashould_1.gwp_pro3_JSON);
            }
            this.ManageFreeProInCart(GWP.threashould_1.original_amount, GWP.threashould_1.amount, finalQty, freeGiftQty, freeProducts, GWP.type);
            }
        }else if(cartItems.length == 1){
          await this.removeFreeProductFromCart('removeNoteligible', GiftThreashouldAmount, cartTotal, cartElements, freeProducts, GWP.type);
        }
    }

    // 3) Final Calculative Function
    // Run this function on page load and Cart Update
    async calculateFreeGift() {
      let cartJSON = {};
      let  GWP = {};
      let cartGWPEle = document.querySelector('[data-GWP-schema]'); 
      if(cartGWPEle){
        GWP = JSON.parse(cartGWPEle.innerHTML);
      }

      cartJSON = await this.cartJSON();
      const cartItems = cartJSON.items;

      let addProductsArray = [];
      let updateGiftFound = false;
      let GWPaddPropertie = {
          "product_type": "GWP Gift"
      }
      if(cartItems.length == 1 && cartItems[0].properties['product_type'] == 'GWP Gift'){
        let removeData = {
            line: 1,
            quantity: 0
        }
        await this.cartAction('change', removeData);
        return false;
      }
      if((GWP.enable_gwp == false || GWP.freeGiftEligibleQty <= 0 || cartJSON.total_price <= 0) && GWP.freeGiftFound != null){
      let removeData = {
          line: GWP.freeGiftFound,
          quantity: 0
      }
      await this.cartAction('change', removeData);
      // }else if(GWP.enable_gwp == true && GWP.updateFreeItem == true){
      // let updateData = {
      //     line: GWP.freeGiftFound,
      //     quantity: GWP.freeGiftEligibleQty
      // }
      // await this.cartAction('update', updateData);
      // location.href = '/cart';
      }else if(GWP.enable_gwp == true && GWP.freeGift && GWP.freeGiftFound == null && GWP.freeGiftEligibleQty > 0 && GWP.freeGift.available == true){
        let checkGwtAdded = false;
        cartItems.forEach((product, index) => {  
          if(product.properties['product_type'] == 'GWP Gift'){
            checkGwtAdded = true; 
          }
        });
      if(checkGwtAdded == false) {
        let addProObject = {
          quantity: GWP.freeGiftEligibleQty,
          id: GWP.freeGift.variants[0].id,
          properties: GWPaddPropertie
        }
        addProductsArray.push(addProObject);
        await this.cartAction('add', addProductsArray);
      }
      } 
    }
}
customElements.define("ajax-cart", AjaxCart);