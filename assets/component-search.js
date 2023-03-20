/**
 * Search Modal Component
 *
 */
class SearchModal extends HTMLElement {
  constructor() {
    super();

    let _this = this;
    this.openSearchModal = document.querySelectorAll('.open-searchform');
    this.searchFormContainer = this.querySelector('.searchform');
    this.searchresults = this.querySelector('.predictive-search');
    this.searchQuery = this.querySelector('form[action="/search"] [name="q"]');

    this.searchFormContainer.addEventListener('keyup', (event) => {
      event.code.toUpperCase() === 'ESCAPE' && this.close()
    });

    this.openSearchModal.forEach(toggleBtn =>{
      toggleBtn.addEventListener('click', function(event){
        _this.onToggleBtnClick(event);
      });
      toggleBtn.setAttribute('role', 'button');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
    this.querySelector('.search-modal__close-button').addEventListener('click', this.close.bind(this));

    this.typingTimer;
    this.searchQuery.addEventListener('input', this.queryInput.bind(this));
    this.searchQuery.addEventListener('keydown', () => {
      clearTimeout(this.typingTimer);
    });
  }

  /**
   * To check if search modal is open or closed
   * 
   * @returns {boolean} true/false
   */
  isOpen() {
    return this.searchFormContainer.hasAttribute('open');
  }

  /**
   * Toggle Search Modal on search Icon click
   *
   * @param {event} Event instance
   */
  onToggleBtnClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.searchFormContainer.hasAttribute('open')
      ? this.close()
      : this.open(event);
  }

  /**
   * Close Search Modal on body click if not within the Modal
   *
   * @param {event} Event instance
   */
  onBodyClick(event) {
    if (!this.contains(event.target)) this.close(false);
  }

  /**
   * lazyload the API call for fetch search suggestion on user Input
   *
   * @param {event} Event instance
   */
  queryInput(event){
    let _this = this;
    let inputEle = event.currentTarget;
    let queryValue = inputEle.value.trim();
    clearTimeout(_this.typingTimer);
    _this.typingTimer = setTimeout(function() {
      _this._queryChange(queryValue);
    }, 1000);
  }

  /**
   * lazyload the API call for fetch search suggestion on user Input
   *
   * @param {string} queryValue Search form query
   */
  _queryChange(queryValue){
    if(queryValue.length <= 0 || queryValue == null){
      return;
    }
    let searchType = this.searchFormContainer.querySelector('[name="type"]').value;
    fetch(`${routes.predictive_searh}?q=${queryValue}&resources[type]=${searchType}&resources[options][unavailable_products]=last`)
    .then(response => {
        return response.json();
      }).then(response => {
        const searchResults = response.resources.results;
        let productsList = '';
        if(searchResults.products.length > 0){
          searchResults.products.forEach((product)=>{
            const productPrice = Shopify.formatMoney(product.price * 100, window.globalVariables.money_format);;
            let resultUI = `<div class="col-sm-6 px-2"><div class="predictive-search-product my-2 mx-n2 row">
                <div class="col-3 px-2">
                    <a href="${product.url}"><img src="${product.image}" alt="${product.title}"></a>
                </div>
                <div class="col-9 px-2">
                    <h6 class="product-title"><a href="${product.url}">${product.title}</a></h6>
                    <p class="product-price">${productPrice}</p>
                </div>
            </div></div>`;
            productsList += resultUI;
          });
          if(this.searchresults){
            this.searchresults.querySelector('.predictive-search-product-list').innerHTML = productsList;
            this.searchresults.querySelector('.predictive-search-footer a').href = `/search?q=${queryValue}&resources[type]=${searchType}`;
            this.searchresults.style.display = 'block';
          }
        }else{
          if(this.searchresults){
            this.searchresults.querySelector('.predictive-search-product-list').innerHTML = '';
            this.searchresults.style.display = 'none';
          }
        }
      }).catch((e) => {
        console.error(e);
      }).finally(() => {
        // Search JSON fetch done
      });
  }

  /**
   * Open Search Modal and add attributes, class and Events in DOM
   *
   * @param {event} Event instance
   */
  open(event) {
    this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
    this.searchFormContainer.setAttribute('open', true);
    this.classList.add('open__modal');
    this.removeAttribute('style');
    document.body.addEventListener('click', this.onBodyClickEvent);

    Utility.trapFocus(this);
    Utility.forceFocus(document.getElementById('Search-In-Modal'))
  }

  /**
   * Close Search Modal and remove attributes, class and Events in DOM
   *
   * @param {event} Event instance
   */
  close(focusToggle = true) {
    Utility.removeTrapFocus();
    this.searchFormContainer.removeAttribute('open');
    this.classList.remove('open__modal');
    document.body.removeEventListener('click', this.onBodyClickEvent);

    if(this.searchresults){
      this.searchresults.querySelector('.predictive-search-product-list').innerHTML = '';
      this.searchresults.style.display = 'none';
    }
  }
}
customElements.define('search-modal', SearchModal);