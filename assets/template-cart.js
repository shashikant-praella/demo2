const selectors = {
    cartCheckout: document.querySelector('#cart-checkoutbtn'),
    checkoutSticky: document.querySelector('.checkoutbtn-sticky')
};

class templateCartJS {
    constructor() {
        this.stickyCheckout();
    }

    // Sticky checkout container on oage scroll
    stickyCheckout(){
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    selectors.checkoutSticky.classList.remove('active');
                } else {
                    selectors.checkoutSticky.classList.add('active');
                }
            })
        });
            
        observer.observe(selectors.cartCheckout);
    }
      /**
  * Detect fraud:  
  * Disable checkout button and show the snotify messages when:
  * vm.probability = 1
  * automationTool.probability = 1
  * browserSpoofing.probability = 1
  * searchEngine.probability = 1
  */
//   fraudDetect() {​
//     var requestId;
//     const APIHeader = {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       'X-Shop': 'battlboxllc.myshopify.com',
//     };
//     // Initialize an agent at application startup.
//     const botdPromise = import('https://openfpcdn.io/botd/v0.1')
//       .then( Botd => Botd.load({ publicKey: 'public_api_key' }))
//     botdPromise.then(botd => botd.detect())
//       .then(function(result) { 
//         // We will have requestId here in result, and we will have to make API call to API Manager 
//         // with this requestId and if we receive possibility as 1 for any of these four (https://d.pr/i/iq4mch) then we have to disable checkout & cart buttons. ​
//         requestId = result.requestId;
//         const config = {
//           url: '/verify',
//           method: 'POST',
//           data: {
//             requestId: requestId,
//           },
//         };
//         fetch('https://api-manager.praella.app/api/fingerprintjs/common', {
//           method: 'POST',
//           headers: APIHeader,
//           body: JSON.stringify(config),
//         })
//         .then(response => response.json())
//         .then(data => {
//           if (data.vm.probability == 1 || data.bot.automationTool.probability == 1 || data.bot.browserSpoofing.probability == 1 || data.bot.searchEngine.probability == 1) {
//             document.querySelector('[data-redirect_checkout]').setAttribute('disabled', true);
//             document.querySelector('[data-redirect_checkout]').classList.add('btn-disabled');​
//             document.querySelector('#additional-checkout').classList.add('d-none');
//          /* Here we have used custom notification. This can be replaced by other notification methods */
//             notificationEle.updateNotification('Error', 'There seems to be an issue with your browser. Please contact out customer support at questions@battlbox.com', {
//                type: 'error',
//                timeout: 3000
//             });
//           } 
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//       })
//     .catch(error => console.error(error))
//   }

}

typeof templateCartJS !== 'undefined' && new templateCartJS();
