const selectors = {
    productContainer: document.querySelector('.product-details-wrapper'),
    reviewratingEle: document.querySelector('.product-details-wrapper [data-hulkapps-reviews]'),
    productMedia: document.querySelector('[data-productMedia]'),
    zoomBtns: document.querySelectorAll('[data-productZoom]')
  };

  const mediaJSON = JSON.parse(selectors.productMedia.innerHTML);
  window.productMedia = mediaJSON;
  class templateProductJS {
    constructor() {
        if(selectors.reviewratingEle){
            selectors.reviewratingEle.addEventListener('click', (event)=>{
                event.preventDefault();
                const reviewSection = document.querySelector('#hulk__product-review');
                if(reviewSection) reviewSection.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            });
        }

        selectors.zoomBtns.forEach((btn)=>{
            btn.addEventListener('click', (event)=>{
                let currentTarget = event.target;
                this.manageZoom(currentTarget);
            })
        });
    }

    manageVariantSlider(variant){
        const productJSON = window.globalVariables.product;
        const productSliderType = selectors.productContainer.dataset.slider_type;

        if(productSliderType == 'color-based' && productJSON.options && productJSON.options.includes('Color') || productJSON.options.includes('color') || productJSON.options.includes('COLOR')){
            const currentVariant = variant || window.globalVariables.product.currentVariant;
            const colorName = currentVariant.option1.toLowerCase();
            const colorMedia = [];
            mediaJSON.forEach(media => {
                let mediaAlt = media.alt;
                if(mediaAlt) mediaAlt = mediaAlt.toLowerCase();
                if(mediaAlt == colorName) colorMedia.push(media);
            });
            window.productMedia = colorMedia;

            if(window.globalVariables.templateSuffix == 'layout2'){
                const imagesParent = document.querySelector('[data-productImagesContainer]');
                console.log('imagesParent====>', imagesParent)
                if(!imagesParent || colorMedia.length <= 0) return;
                let slidesHTML = '';
                colorMedia.forEach(function(i,v){
                    let imageAlt = i.alt.toLowerCase();
                    if(imageAlt == colorName){
                        if(i.media_type == "external_video"){
                            slidesHTML+= `<div class="product--media col-6 my-md-2 my-1 px-md-2 px-1 position-relative" data-mediaID="${i.id}" role="treeitem">
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
                            slidesHTML+= `<div class="product--media col-6 my-md-2 my-1 px-md-2 px-1 position-relative" data-mediaID="${i.id}" role="treeitem">
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
                            slidesHTML+= `<div class="product--media col-6 my-md-2 my-1 px-md-2 px-1 position-relative" data-mediaID="${i.id}" role="treeitem">
                            <div data-productZoom class="product-zoom"><i class="icon-zoom icon-size-18"></i></div>
                                <img class="img-fluid"
                                src="${i.preview_image.src}"
                                alt="${i.alt}"/>
                            </div>`;
                        }
                    }
                });
                imagesParent.innerHTML= slidesHTML;
            }else{
                const thumbParent = document.querySelector('[data-thumbSlider]');
                const sliderParent = document.querySelector('[data-main-slider]');
    
                if(!thumbParent || !sliderParent || colorMedia.length <= 0) return;
    
                let thumbnailsHTML = '';
                let slidesHTML = '';
                colorMedia.forEach(function(i,v){
                    let imageAlt = i.alt.toLowerCase();
                    if(imageAlt == colorName){
                        if(i.media_type == "external_video"){
                            thumbnailsHTML+= `<div class="swiper-slide product-thumb--image media--video" data-mediaID="${i.id}" role="treeitem">
                            <img class="img-fluid"
                                src="${i.preview_image.src}"
                                alt="${i.alt}"/>
                                <i class="icon-play position-absolute"></i>
                            </div>`;
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
                            thumbnailsHTML+= `<div class="swiper-slide product-thumb--image media--video" data-mediaID="${i.id}" role="treeitem">
                            <img class="img-fluid"
                                src="${i.preview_image.src}"
                                alt="${i.alt}"/>
                                <i class="icon-play position-absolute"></i>
                            </div>`;
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
                            thumbnailsHTML+= `<div class="swiper-slide product-thumb--image" data-mediaID="${i.id}" role="treeitem">
                                <img class="img-fluid"
                                src="${i.preview_image.src}"
                                alt="${i.alt}"/>
                            </div>`;
                            slidesHTML+= `<div class="swiper-slide carousel-cell d-flex align-items-center product--media" data-mediaID="${i.id}" role="treeitem">
                                <div data-productZoom class="product-zoom"><i class="icon-zoom icon-size-18"></i></div>
                                <img class="img-fluid"
                                src="${i.preview_image.src}"
                                alt="${i.alt}"/>
                            </div>`;
                        }
                    }
                });
    
                let navDirection = thumbParent.dataset.direction || 'horizontal';
                let finalnavHTML = `
                    <div class="swiper-slider product-thumbnails" role="tree" 
                            data-slider='{
                                "direction": "${navDirection}",
                                "loop": false,
                                "slidesPerView": "6",
                                "spaceBetween": 15,
                                "grabCursor": true,
                                "slideToClickedSlide": true
                            }' >
                        <div class="swiper-wrapper">${thumbnailsHTML}</div>
                    </div>`;
                thumbParent.innerHTML= finalnavHTML;
    
                let finalHTML = `<slider-element class="swiper-container carousel">
                                    <div class="swiper swiper-slider product-carousel pdp-carousel" data-nav="product-thumbnails"
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
            
            selectors.zoomBtns = document.querySelectorAll('[data-productZoom]');
            selectors.zoomBtns.forEach((btn)=>{
                btn.addEventListener('click', (event)=>{
                    let currentTarget = event.target;
                    this.manageZoom(currentTarget);
                })
            });
        }
    }

    manageZoom(currentTarget){
        let currentSlide = currentTarget.closest('.product--media');
        let currentSlideIndex = 1;
        if(currentSlide) currentSlideIndex = Array.from(currentSlide.parentNode.children).indexOf(currentSlide);
        
        let zoomSlider = '';
        window.productMedia.forEach(i => {
            if(i.media_type == "external_video"){
                zoomSlider += `<div class="swiper-slide carousel-cell d-flex align-items-center justify-content-center zoom--product-image" data-mediaID="${i.id}" role="treeitem">
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
                zoomSlider += `<div class="swiper-slide carousel-cell d-flex align-items-center product--media" data-mediaID="${i.id}" role="treeitem">
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
            }else if(i.media_type == "image"){
                zoomSlider+= `<div class="swiper-slide carousel-cell d-flex align-items-center justify-content-center zoom--product-image" data-mediaID="${i.id}" role="treeitem">
                    <img class="img-fluid"
                    src="${i.preview_image.src}"
                    alt="${i.alt}"/>
                </div>`;
            }
        });
        let finalHTML = `<slider-element class="swiper-container carousel">
            <div class="swiper swiper-slider zoom--product-images"
                data-slider='{
                        "loop": false,
                        "observer": true,
                        "observeParents": true,
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
                <div class="swiper-wrapper" >${zoomSlider}</div>
                <div class="swiper-pagination"></div>

                <div class="swiper-button-prev icon-previous"></div>
                <div class="swiper-button-next icon-next"></div>

            </div>
        </slider-element>`;

        const zoomContainer = document.getElementById('PopupModal-zoom');
        if(zoomContainer){
            zoomContainer.querySelector('.modal-body').innerHTML = finalHTML;
            zoomContainer.show();
            if(productZoomSlider) productZoomSlider.slideTo(currentSlideIndex, 2000, true);
        }
    }
}

typeof templateProductJS !== 'undefined' && new templateProductJS();
