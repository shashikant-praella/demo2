class SearchFilters extends HTMLElement {
    constructor() {
      super();

      const _this = this;
      this.accordionType = this.dataset.accordiontype;
      this.filterParent = this.closest('#filtersCollapse');
      this.onActiveFilterClick = this.onActiveFilterClick.bind(this);
      this.filterForm = this.querySelector('form');
      this.filterType = this.dataset.filtertype;

      const toggleBtns = this.querySelectorAll('.filter__toggle');
      toggleBtns.forEach(button => button.addEventListener('click', this.toggleFilterBlock.bind(this)));
  
      /*********** Open Drawer on Filter or SortBy button click. Close Drawer on close button click *************/
      this.openFilterDrawer = document.getElementById('filter-drawer');
      if(this.openFilterDrawer) this.openFilterDrawer.addEventListener('click', this.toggleFilterDrawer.bind(this));
  
      this.openSortbyDrawer = document.getElementById('sortby-drawer');
      if(this.openSortbyDrawer) this.openSortbyDrawer.addEventListener('click', this.toggleFilterDrawer.bind(this));
  
      this.closeFilterDrawer = this.filterParent.querySelector('.search-filters-close');
      if(this.closeFilterDrawer) this.closeFilterDrawer.addEventListener('click', this.toggleFilterDrawer.bind(this));
  
      if(this.filterType == 'horizontal-filters'){
        document.body.addEventListener('click', (event)=>{
          const openFilters = document.querySelectorAll('.filter__container.open');
          openFilters.forEach((target) => {
            target.querySelector('.filter__toggle').click();
          })
        });
    
        const filterContainers = document.querySelectorAll('.filter__container');
        filterContainers.forEach((target) => {
          target.addEventListener('click', (event)=>{
            event.stopPropagation();
          });
        });
      }
      /*********** End of Open Drawer on Filter or SortBy button click. Close Drawer on close button click ********/
  
      this.sortby_values = document.querySelectorAll('[data-sortby] .sortby_options');
      this.sortby_values.forEach(input => input.addEventListener('change', this.updateSortBy.bind(this)));
  
      this.filterParent.addEventListener('keyup', (event) => {
        if (event.code.toUpperCase() === 'ESCAPE'){ this.closeFilterDrawer.dispatchEvent(new Event('click')); }
      });
  
      this.debouncedOnSubmit = Utility.debounce((event) => {
        this.onSubmitHandler(event);
      }, 500);
  
      if(this.filterForm){
        this.filterForm.addEventListener('input', this.debouncedOnSubmit.bind(this));
        this.filterForm.addEventListener('submit', this.debouncedOnSubmit.bind(this));
        window.addEventListener('popstate', this.onHistoryChange.bind(this));
      }
  
      const applyBtn = this.querySelector('[data-applyFilters]');
      if(applyBtn){
        applyBtn.addEventListener('click', () => {
          this.filterForm.dispatchEvent(new Event('submit', {'bubbles' : true, 'cancelable' : true }));
          setTimeout(() => {
            this.closeFilterDrawer.dispatchEvent(new Event('click'));
          }, 1000);
        });
      }
  
      const paginationLinks = document.querySelectorAll('[data-pagination]');
      paginationLinks.forEach(link => link.addEventListener('click', this._managePagination.bind(this)));
  
      this.bindActiveFilterButtonEvents();
      this.addAccessibilityAttributes(toggleBtns);
      this.colorOptionsStyling();
    }
  
    /**
     * Filter Block Toggle event
     * @param {NodeList} toggleBtns Open filter block buttons
     */
    addAccessibilityAttributes(toggleBtns) {
      toggleBtns.forEach(element => {
        element.setAttribute('role', 'button');
        element.setAttribute('aria-expanded', false);
        element.setAttribute('aria-controls', element.nextElementSibling.id);
      });
    }
  
    /**
     * Search filter form Input event
     * @param {event} event Event Instance
     */
    onSubmitHandler(event) {
      event.preventDefault();
      if(event.type == 'input' && this.filterParent.classList.contains('filter-active')){
        return;
      }
  
      let closestForm = document.getElementById('SearchFiltersForm');
      if(event.target && event.target.closest('form')){ closestForm = event.target.closest('form'); }
      if(!closestForm) return;
  
      const searchParams = this._finalQueryString(closestForm)
      this.renderPage(searchParams, event);
    }
  
    /**
     * click event To Remove current selections
     * @param {element} form Search page filter form
     */
     _finalQueryString(form){
      const formData = new FormData(form);
      let searchParams = '';
      formData.forEach((val, key) => {
        if(key.indexOf('price-list') >= 0){
          searchParams += '&' + val;
        }else if(key.indexOf('custom_sort_by') >= 0){
          //  Code for SortBy
        }else if(val != null && val.length > 0){
          if(searchParams === ''){ searchParams = key + '=' + val;}
          else{ searchParams += '&' + key + '=' + val; }
        }
      });
      return searchParams;
    }
  
    /**
     * Add background color in label of Color options
     */
    colorOptionsStyling(){
      const colorSwatchContainer = this.querySelector('[data-colorFilter]');
      if(colorSwatchContainer){
        const colorSwatches = colorSwatchContainer.querySelectorAll('.color-options');
        colorSwatches.forEach(swatch => {
          let colorHandle = swatch.querySelector('input[type="checkbox"]').dataset.handle;
          let swatchStyle = Utility.getSwatchStyle(colorHandle);
          swatch.querySelector('.option-label').setAttribute('style', swatchStyle);
        });
      }
    }
  
    /**
     * click event To Remove current selections
     * @param {event} event Event Instance
     */
    onActiveFilterClick(event) {
      event.preventDefault();
      let currentTarget = event.target;
      if(!currentTarget.classList.contains('filter-option-clear')){ currentTarget = event.target.closest('.filter-option-clear')};
      this.renderPage(new URL(currentTarget.href).searchParams.toString());
    }
  
     /**
     * Update Window URL as per active filters
     * @param {event} event Event Instance
     */
    onHistoryChange(event) {
      const searchParams = event.state?.searchParams || '';
      this.renderPage(searchParams, null, false);
    }
  
    renderPage(searchParams, event, updateURLHash = true) {
      document.getElementById('search-product-grid').querySelector('#template-search').classList.add('loading');
  
      const url = `${window.location.pathname}?${searchParams}`;
      this.renderGridFromFetch(url, 'filter');
  
      if (updateURLHash) this.updateURLHash(searchParams);
    }
  
    renderGridFromFetch(url, type) {
      if(!url) return;
      fetch(url)
        .then(response => response.text())
        .then((responseText) => {
          const html = responseText;
          this.renderProductGrid(html, type);
        });
    }
  
    renderProductGrid(html, type) {
      const innerHTML = new DOMParser().parseFromString(html, 'text/html');
      let paginationType = 'numbers';
      if(document.querySelector('[data-pagination]')){
        paginationType = document.querySelector('[data-pagination]').dataset.type || 'numbers';
      }
      if(type == 'filter'){
        const gridHTML = innerHTML.getElementById('search-product-grid').innerHTML;
        document.getElementById('search-product-grid').innerHTML = gridHTML;
      }else{
        const gridHTML = innerHTML.getElementById('search-product-grid').innerHTML;
        document.getElementById('search-product-grid').innerHTML = gridHTML;
      }
  
      const openFilters = document.querySelectorAll('.filter__container.open');
      const filterInnerHTML = innerHTML.getElementById('main-search-filters').innerHTML;
      document.getElementById('main-search-filters').innerHTML = filterInnerHTML;
  
      if(this.filterType != 'horizontal-filters'){
        // reopen filter blocks which are active before HTML update
        openFilters.forEach(openFilter => {
          if(openFilter.querySelector('.filter__toggle')){
            openFilter.querySelector('.filter__toggle').setAttribute('aria-expanded', true);
          }
          let filterBlock = document.querySelector('.filter__container[data-index="'+openFilter.dataset.index+'"]');
          filterBlock.classList.add('open');
          filterBlock.querySelector('.filter__block').classList.add('open');
        });
      }
  
      const totalProducts = innerHTML.querySelector('[data-totalProducts]');
      if(totalProducts) document.querySelector('[data-totalProducts]').innerHTML = totalProducts.innerHTML;
  
      const activeFilters = innerHTML.querySelector('[data-activeFilters]');
      if(activeFilters) document.querySelector('[data-activeFilters]').innerHTML = activeFilters.innerHTML;
      this.bindActiveFilterButtonEvents();
    }
  
    bindActiveFilterButtonEvents() {
      document.querySelectorAll('.filter-option-clear').forEach((element) => {
        element.addEventListener('click', this.onActiveFilterClick, { once: true });
      });
    }
  
    updateURLHash(searchParams) {
      history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
    }
  
    updateSortBy(event){
      let _this = event.currentTarget;
      let sortBy = document.querySelector('[data-sortby] [name="custom_sort_by_mobile"]:checked');
      if(_this.name == 'custom_sort_by_desktop'){
        sortBy = document.querySelector('[data-sortby] [name="custom_sort_by_desktop"]:checked');
      }
      
      let currentvalue = sortBy.value;
      this.querySelector('[name="sort_by"]').value = currentvalue;
      this.querySelector('[name="sort_by"]').dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true,
      }));
    }
  
    _managePagination(event){
      event.preventDefault();
      let _this = event.currentTarget;
      const nextPageLink = _this.href;
      this.renderGridFromFetch(nextPageLink, 'pagination');
  
      setTimeout(() => {
        history.pushState({}, '', nextPageLink);
      }, 500);
    }
  
    toggleFilterDrawer(event){
      event.preventDefault();
      let button = event.currentTarget;
      if(button.id == 'filter-drawer' || button.id == 'sortby-drawer'){
        this.filterParent.classList.add('filter-active');
        button.setAttribute('aria-expanded', true);
        button.setAttribute('tabindex', '-1');
  
        if(button.id == 'sortby-drawer'){ this.filterParent.classList.add('sortby-drawer'); }
        else{ this.filterParent.classList.remove('sortby-drawer'); }
  
        Utility.trapFocus(this.filterParent);
        Utility.forceFocus(this.closeFilterDrawer);
        siteOverlay.prototype.showOverlay();
      }else{
        this.filterParent.classList.remove('filter-active');
        this.filterParent.classList.remove('sortby-drawer');
        if(this.openFilterDrawer){
          this.openFilterDrawer.setAttribute('aria-expanded', false);
          this.openFilterDrawer.removeAttribute('tabindex');
        }if(this.openSortbyDrawer){
          this.openSortbyDrawer.setAttribute('aria-expanded', false);
          this.openSortbyDrawer.removeAttribute('tabindex');
        }
  
        Utility.removeTrapFocus(this.filterParent);
        siteOverlay.prototype.hideOverlay();
      }
    }
  
    toggleFilterBlock(event) {
      event.preventDefault();
      const toggleFilterBtn = event.currentTarget;
      const filterContainer = toggleFilterBtn.parentNode;
      const isOpen = filterContainer.classList.contains('open');
      isOpen ? this.closeFilterBlock(toggleFilterBtn) : this.openFilterBlock(toggleFilterBtn);
    }
  
    openFilterBlock(toggleFilterBtn){
      let filterContainer = toggleFilterBtn.parentNode;
      toggleFilterBtn.setAttribute('aria-expanded', true);
      Utility.toggleElement(filterContainer, 'open');
      if(this.accordionType == 'single'){
        let siblingBlocks = filterContainer.parentNode.querySelectorAll('.filter__container');
        siblingBlocks.forEach(element => {
          if(element == filterContainer){ return; }
          element.classList.remove('open');
          element.querySelector('.filter__block').classList.remove('open');
          element.querySelector('.filter__toggle').setAttribute('aria-expanded', false);
        });
      }
      Utility.trapFocus(filterContainer);
    }
  
    closeFilterBlock(toggleFilterBtn){
      const filterContainer = toggleFilterBtn.parentNode;
      toggleFilterBtn.setAttribute('aria-expanded', false);
      Utility.toggleElement(filterContainer, 'close');
      Utility.removeTrapFocus(filterContainer);
    }
  }
  customElements.define('search-filters', SearchFilters);

  class PriceRange extends HTMLElement {
    constructor() {
      super();
      this.querySelectorAll('input')
        .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));
  
      this.setMinAndMaxValues();
    }
  
    onRangeChange(event) {
      this.adjustToValidValues(event.currentTarget);
      this.setMinAndMaxValues();
    }

    setMinAndMaxValues() {
      const inputs = this.querySelectorAll('input');
      const minInput = inputs[0];
      const maxInput = inputs[1];
      if (maxInput.value) minInput.setAttribute('max', maxInput.value);
      if (minInput.value) maxInput.setAttribute('min', minInput.value);
      if (minInput.value === '') maxInput.setAttribute('min', 0);
      if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
    }

    adjustToValidValues(input) {
      const value = Number(input.value);
      const min = Number(input.getAttribute('min'));
      const max = Number(input.getAttribute('max'));
      if (value < min) input.value = min;
      if (value > max) input.value = max;
    }
  }
  customElements.define('price-range', PriceRange);