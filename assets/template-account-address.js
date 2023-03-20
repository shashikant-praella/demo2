 /**
    * Bind function to element
    *
    * @param {function} fn - Function to bind
    * @param {element} scope - Element function binds to
    */
Shopify.bind = function(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  }
};

Shopify.setSelectorByValue = function(selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function(target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
};

Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  this.countryEl         = document.getElementById(country_domid);
  this.provinceEl        = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function(e) {
    var opt       = this.countryEl.options[this.countryEl.selectedIndex];
    var raw       = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

const selectors = {
    customerAddresses: '[data-customer-addresses]',
    addressCountrySelect: '[data-address-country-select]',
    toggleAddressButton: '[data-edit-address]',
    cancelAddressButton: '[data-reset-address]',
    deleteAddressButton: '[data-confirm-message]'
};
  
class CustomerAddresses {
    constructor() {
      this.elements = this._getElements();
      if (Object.keys(this.elements).length === 0) return;

      
      this._setupCountries();
      this._setupEventListeners();
    }
  
    _getElements() {
      const container = document.querySelector(selectors.customerAddresses);
      return container ? {
        container,
        newAddressForm: document.querySelector(selectors.newAddressButton),
        editAddressToggle: document.querySelectorAll(selectors.toggleAddressButton),
        cancelButtons: container.querySelectorAll(selectors.cancelAddressButton),
        deleteButtons: container.querySelectorAll(selectors.deleteAddressButton),
        countrySelects: container.querySelectorAll(selectors.addressCountrySelect)
      } : {};
    }
  
    _setupCountries() {
      if (Shopify && Shopify.CountryProvinceSelector) {
        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
          hideElement: 'AddressProvinceContainerNew'
        });
        this.elements.countrySelects.forEach((select) => {
          const formId = select.dataset.formId;
          if(!document.getElementById(`AddressCountry_${formId}`)) return;
          // eslint-disable-next-line no-new
          new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
            hideElement: `AddressProvinceContainer_${formId}`
          });
        });
      }
    }
  
    _setupEventListeners() {
        this.elements.editAddressToggle.forEach((element) => {
            element.addEventListener('click', this._handleToggleForm.bind(this));
        });
        this.elements.cancelButtons.forEach((element) => {
            element.addEventListener('click', this._handleCancelButtonClick.bind(this));
        });
        this.elements.deleteButtons.forEach((element) => {
            element.addEventListener('click', this._handleDeleteButtonClick);
        });
    }

    _handleToggleForm = (event) => {
        event.preventDefault();
        let formToggleContainer = document.querySelector('[data-editAddressContainer]');
        const addNewAddress = document.querySelector('[data-newAddressContainer]');
        const currentTarget = event.currentTarget;
        const targetFormID = currentTarget.dataset.target;
        const targetForm = document.querySelector(targetFormID);
        const formType = currentTarget.dataset.for;
        if(formType == 'add_address') formToggleContainer = addNewAddress;
        
        if(!targetForm) return;

        let isOpen = targetForm.classList.contains('open');
        if(isOpen){
            Utility.toggleElement(formToggleContainer, 'close');
            currentTarget.setAttribute('aria-expanded', false);
            targetForm.removeAttribute('data-type');
        }else{
            this._hideOpenforms();
            setTimeout(() => {
                currentTarget.setAttribute('aria-expanded', true);
                targetForm.setAttribute('data-type', 'content');
                Utility.toggleElement(formToggleContainer, 'open');
            }, 500);
        }
    }

    _hideOpenforms(){
        // Close Opened Edit Address Forms
        const container = document.querySelector('[data-editAddressContainer]');
        let allForms = container.querySelectorAll('.customer-form.open');
        let toggleButtons = document.querySelectorAll('[data-edit-address][aria-expanded="true"]');
        toggleButtons.forEach(button => { button.setAttribute('aria-expanded', false); })
        allForms.forEach(form => { Utility.toggleElement(container, 'close'); form.removeAttribute('data-type'); });

        // Close Add new Address Forms
        let newAddForm = document.querySelector('[data-newAddressContainer]');
        Utility.toggleElement(newAddForm, 'close');
    }

    _handleCancelButtonClick = (event) => {
        event.preventDefault();
        this._hideOpenforms();
    }

    _handleDeleteButtonClick = ({ currentTarget }) => {
      // eslint-disable-next-line no-alert
      if (confirm(currentTarget.getAttribute('data-confirm-message'))) {
        Shopify.postLink(currentTarget.dataset.target, {
          parameters: { _method: 'delete' },
        });
      }
    }
}
typeof CustomerAddresses !== 'undefined' && new CustomerAddresses();
