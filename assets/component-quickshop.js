// Ajax cart JS for Drawer and Cart Page
class quickShop extends HTMLElement {
    constructor() {
      super();

      this.closeBy = this.querySelector('.close-quickshop');
      this.bindEvents();
      // this.updateEvents();

      if (navigator.platform === 'iPhone') document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    }
  
    /**
     * Escape Click event to close drawer when focused within Cart Drawer
     *
     * @param {event} Event instance
     */
    onKeyUp(event) {
      if(event.code.toUpperCase() !== 'ESCAPE') return;
      this.querySelector('.close-quickshop').dispatchEvent(new Event('click'));
    }

    /**
     * bind click and keyup event to Cart Icons
     * bind keyUp event to Cart drawer component
     * bind Other inside element events
     *
     */
    bindEvents() {
      this.openeBy = document.querySelectorAll('.quickshop--button');
      this.openeBy.forEach(btn => btn.addEventListener('click', this.openQuickShop.bind(this)));
      this.addEventListener('keyup', this.onKeyUp.bind(this));
    }
  
    updateEvents(){
      this.openeBy = document.querySelectorAll('.quickshop--button');
      if(this.openeBy) this.openeBy.forEach(btn => btn.addEventListener('click', this.openQuickShop.bind(this)));
    }

    async _loadQuickShop(handle){
      let requestURL = `/products/${handle}?view=quickshop&sections=template-product-quickshop`;
      const response = await fetch(requestURL);
      const quickShopData = await response.json();
      return quickShopData['template-product-quickshop'];
    }

    /**
     * Open QuickShop modal and add focus to modal container
     *
     * @param {event} Event instance
     */
    openQuickShop(event) {
      event.preventDefault();
      const _this = event.currentTarget;
      const handle = _this.dataset.handle
      if(!handle) return;
      
      this._loadQuickShop(handle).then(quickShopData => {
        console.log('Add HTML to DOM')
        this.innerHTML = quickShopData;
        this.querySelector('.modal').classList.add('open');
        siteOverlay.prototype.showOverlay();

        if(this.querySelector('.product-title')) Utility.forceFocus(this.querySelector('.product-title'));
        this.closeBy = this.querySelector('.close-quickshop');
        if(this.closeBy) this.closeBy.addEventListener('click', this.closeQuickShop.bind(this));
        Utility.trapFocus(this, this.closeBy);

        if(event){
          _this.setAttribute('aria-expanded', true);
        }
      });
    }
  
    /**
     * Open QuickShop and Remove focus from modal container
     *
     * @param {event} Event instance
     */
    closeQuickShop(event, elementToFocus = false) {
      if (event !== undefined) {
        event.preventDefault();
        this.innerHTML = '';
        quickShopSlider = null;
        
        siteOverlay.prototype.hideOverlay();
        let openByEle = document.querySelector('.quickshop--button[aria-expanded="true"]');
        openByEle.setAttribute('aria-expanded', false);
        Utility.removeTrapFocus(elementToFocus);
        Utility.forceFocus(openByEle);
      }
    }

    manageVariantSlider(variant){
      const mediaJSON = JSON.parse(document.querySelector('#PopupModal-quickshop [data-productMedia]').innerHTML)
      const productContainer = document.querySelector('#PopupModal-quickshop .product-details-wrapper');
      const productSliderType = productContainer.dataset.slider_type;

      if(productSliderType == 'color-based'){
          const currentVariant = variant;
          const colorName = currentVariant.option1.toLowerCase();
          const colorMedia = [];
          mediaJSON.forEach(media => {
              let mediaAlt = media.alt;
              if(mediaAlt) mediaAlt = mediaAlt.toLowerCase();
              if(mediaAlt == colorName) colorMedia.push(media);
          });

          const sliderParent = document.querySelector('#PopupModal-quickshop [data-main-slider]');
          if(!sliderParent || colorMedia.length <= 0) return;

          let slidesHTML = '';
          colorMedia.forEach(function(i,v){
              let imageAlt = i.alt.toLowerCase();
              if(imageAlt == colorName){
                  if(i.media_type == "external_video"){
                    slidesHTML+= `<div class="swiper-slide carousel-cell d-flex align-items-center product--media" data-mediaID="${i.id}" role="treeitem">
                        <div class="custom-video-container">
                            <custom-video class="placement--grid" data-video-type="${i.host}" data-video-id="${i.external_id}" data-placement="grid" data-autoplay="true" data-controls="true">
                                <div class="cta-btn" data-aos="hero">
                                    <button class="play__button btn btn-primary" data-trigger-video aria-label="Play Video">
                                        <i class="icon-play text-body"></i>
                                    </button>
                                    <button class="pause__button btn btn-primary" data-pause-video aria-label="Pause Video">
                                        <i class="icon-pause"></i>
                                    </button>
                                </div>
                                <div class="content-section">
                                    <div class="poster-image">
                                        <img class="img-fluid"
                                        src="${i.preview_image.src}"
                                        alt="${i.alt}"/>
                                    </div>
                                </div>
                                <div class="video-section" tabindex="0"></div>
                            </custom-video>
                        </div>
                    </div>`;
                  }else if(i.media_type == "video"){
                    slidesHTML+= `<div class="swiper-slide carousel-cell d-flex align-items-center product--media" data-mediaID="${i.id}" role="treeitem">
                        <div class="custom-video-container">
                            <custom-video class="placement--grid" data-video-type="local" data-video-id="${i.sources[0].url}" data-placement="grid" data-autoplay="true" data-controls="true">
                                <div class="cta-btn">
                                    <button class="play__button btn btn-primary" data-trigger-video aria-label="Play Video">
                                        <i class="icon-play text-body"></i>
                                    </button>
                                    <button class="pause__button btn btn-primary" data-pause-video aria-label="Pause Video">
                                        <i class="icon-pause"></i>
                                    </button>
                                </div>
                                <div class="content-section">
                                    <div class="poster-image">
                                        <img class="img-fluid"
                                        src="${i.preview_image.src}"
                                        alt="${i.alt}"/>
                                    </div>
                                </div>
                                <div class="video-section" tabindex="0"></div>
                            </custom-video>
                        </div>
                    </div>`;
                  }else{
                    slidesHTML+= `<div class="swiper-slide carousel-cell d-flex align-items-center product--media" data-mediaID="${i.id}" role="treeitem">
                        <img class="img-fluid"
                        src="${i.preview_image.src}"
                        alt="${i.alt}"/>
                    </div>`;
                  }
              }
          });

          let finalHTML = `<slider-element class="swiper-container carousel">
                              <div class="swiper swiper-slider product-carousel quickshop-carousel"
                                  data-slider='{
                                          "loop": false,
                                          "slidesPerView": "1",
                                          "spaceBetween": 15,
                                          "grabCursor": true,
                                          "navigation": {
                                              "nextEl": ".swiper-button-next",
                                              "prevEl": ".swiper-button-prev"
                                          },
                                          "pagination": {
                                              "el": ".swiper-pagination"
                                          }
                                      }' role="tree">
                                  <div class="swiper-wrapper" >${slidesHTML}</div>
                                  <div class="swiper-pagination"></div>
                              </div>
                          </slider-element>`;
          sliderParent.innerHTML= finalHTML;
      }
  }
}
customElements.define("quick-shop", quickShop);
  