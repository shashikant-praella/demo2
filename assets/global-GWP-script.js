var GWP = {};
var GWPObserver = null;
const GWPSchema = document.querySelector('[data-GWP-schema]');
if(GWPSchema){
  GWP = JSON.parse(GWPSchema.innerHTML);
}

class customGWPJS {
    constructor() {
        this.ajaxCart = document.querySelector('ajax-cart');
    }
  
    cartGWP(){
        this.ajaxCart = document.querySelector('ajax-cart');
        const cart = window.globalVariables.cart;
        let  GWPGift = false;
        let threashouldValue = null;
        let existedFreeProduct = null;
        let existedFreeProductLine = null;
    
        let finalThreshouldAmount = null;
        let originalThreshouldAmount = null;
        let updateQty = false;
    
        let eligibleThreshould = null;
        let eligibleFreeProduct = null;
        let eligibleFreeProductJSON = null;
        let cartTotal = 0;

        cart.items.forEach((product, index)=>{
            if(product.properties && product.properties['product_type'] == 'GWP Gift'){
                GWPGift = true;
                existedFreeProductLine = index + 1;
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

        var removeProduct = JSON.stringify({
            line: existedFreeProductLine,
            quantity: 0
        });

        if((GWP == undefined || eligibleThreshould == null) && GWPGift == true) {
            this.updateGWPvariant(removeProduct, (response)=>{
                // console.log('Removed GWP From Cart====>', response);
                if(this.ajaxCart) this.ajaxCart.getCartData();
            });
        }else if(threashouldValue != null && threashouldValue != eligibleThreshould && eligibleFreeProduct != null){
            this.updateGWPvariant(removeProduct, (response)=>{
                // console.log('Removed GWP From Cart====>', response);
                if(GWP.auto_add == true){
                    this.addFreeProToCart(originalThreshouldAmount, finalThreshouldAmount, eligibleFreeProductJSON);
                }else{
                    this.showFreeProduct(originalThreshouldAmount, finalThreshouldAmount, eligibleFreeProductJSON);
                }
            });
        }else if(existedFreeProduct != null && existedFreeProduct != eligibleFreeProduct){
            this.updateGWPvariant(removeProduct, (response)=>{
                // console.log('Removed GWP From Cart====>', response);
                if(GWP.auto_add == true){
                    this.addFreeProToCart(originalThreshouldAmount, finalThreshouldAmount, eligibleFreeProductJSON);
                }else{
                    this.showFreeProduct(originalThreshouldAmount, finalThreshouldAmount, eligibleFreeProductJSON);
                }
            });
        }else if(updateQty == true){
            var updateProduct = JSON.stringify({
                line: existedFreeProductLine,
                quantity: 1
            });
            this.updateGWPvariant(updateProduct, (response)=>{
                // console.log('Updated GWP From Cart====>', response);
                if(this.ajaxCart) this.ajaxCart.getCartData();
            });
        }else if(eligibleThreshould != null && eligibleFreeProduct != null && GWPGift == false){
            if(GWP.auto_add == true){
                this.addFreeProToCart(originalThreshouldAmount, finalThreshouldAmount, eligibleFreeProductJSON);
            }else{
                this.showFreeProduct(originalThreshouldAmount, finalThreshouldAmount, eligibleFreeProductJSON);
            }
        }
    }

    updateGWPvariant(body, callback){
        let fetchCart = fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body }});
        fetchCart.then(response => {
          return response.json();
        }).then(response => {
          if (typeof callback == "function") return callback(response);
        }).catch((e) => {
          console.error(e);
          return callback(e);
        })
    }

    addFreeProToCart(originalThreshouldAmount, finalThreshouldAmount, eligibleFreeProductJSON){
        // console.log('eligibleFreeProductJSON=======>', eligibleFreeProductJSON);
        if(eligibleFreeProductJSON == null){
            return;
        }

        const body = JSON.stringify({
            id: eligibleFreeProductJSON.variants[0].id,
            quantity: 1,
            properties: {
              product_type: 'GWP Gift',
              spend_over: originalThreshouldAmount
            }
        });
        let fetchCart = fetch(`${routes.cart_add_url}`, { ...fetchConfig(), ...{ body }});
        fetchCart.then(response => {
            return response.json();
        }).then(response => {
            // console.log('Product Added=====>', response);
            if(this.ajaxCart) this.ajaxCart.getCartData();
        }).catch((e) => {
            console.error(e);
        });
    }

    showFreeProduct(originalThreshouldAmount, finalThreshouldAmount, eligibleFreeProductJSON){
        if(eligibleFreeProductJSON == null){
            return;
        }
        let freeProductHTML = `<div class="row no-gutter align-items-center cart-item py-4 px-3"><div class="col-12 gift_prod_heading">
                <div class="general-text mb-3 text-center">You are eligible for Free Gift for spent over ${Shopify.formatMoney(finalThreshouldAmount, window.globalVariables.money_format)}</div>
            </div>
            <div class="col-12 mb-3 mb-md-0 cart-product-img">
                <div class="row no-gutter align-items-center gwp-product">
                    <div class="cart-img col-md-4">
                        <a href="/products/${eligibleFreeProductJSON.handle}">
                            <img class="gift_img" src="${eligibleFreeProductJSON.featured_image}" loading="lazy" width="75" height="95" />
                        </a>
                    </div>
                    <div class="cart-item-text col-md-8 ps-4">
                        <a href="/products/${eligibleFreeProductJSON.handle}" class="card-title fw-medium">${eligibleFreeProductJSON.title}</a>

                        <div class="cart-price">
                            <span class="orgi_price ajaxcart__price">$0 | <del>${Shopify.formatMoney(eligibleFreeProductJSON.price, window.globalVariables.money_format)}</del></span>
                        </div>
                        <div class="quantity-box mt-3">
                            <button type="button" name="add" class="btn btn-dark btn-sm add-to-cart" data-originalThreshouldAmount="${originalThreshouldAmount}" data-addID="${eligibleFreeProductJSON.variants[0].id}" data-addFreeItem><span>Add to cart</span></button>
                        </div>

                    </div>
                </div>
            </div>
        </div>`;

        const freeGiftParent = document.querySelector('[data-freeGift]');
        if(freeGiftParent){
            freeGiftParent.innerHTML = freeProductHTML;
            freeGiftParent.style.display = 'block';
        }

        const addItemBtns = document.querySelector('[data-addFreeItem]');
        if(addItemBtns == null) return;
        addItemBtns.addEventListener('click', (event)=>{
            event.preventDefault();
            const currentTarget = event.currentTarget;
            const body = JSON.stringify({
                id: currentTarget.getAttribute('data-addid'),
                quantity: 1,
                properties: {
                    product_type: 'GWP Gift',
                    spend_over: currentTarget.getAttribute('data-originalThreshouldAmount')
                }
            });
            let fetchCart = fetch(`${routes.cart_add_url}`, { ...fetchConfig(), ...{ body }});
            fetchCart.then(response => {
                return response.json();
            }).then(response => {
                // console.log('Product Added=====>', response);
                if(this.ajaxCart) this.ajaxCart.getCartData();
            }).catch((e) => {
                console.error(e);
            });
        });
    }
}

typeof customGWPJS !== 'undefined' && new customGWPJS();

