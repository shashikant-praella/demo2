const quizSelectors = {
    nextStepBtns: document.querySelectorAll('#recommendation-quiz [data-next]'),
    backStepBtns: document.querySelectorAll('#recommendation-quiz [data-back]'),
    steps: document.querySelectorAll('#recommendation-quiz [data-step-container]'),
    showResults: document.querySelector('#recommendation-quiz [data-showResults]'),
    resultContainer: document.querySelector('#recommendation-quiz [data-resultContainer]'),
    retakeQuiz: document.querySelector('#recommendation-quiz [data-retake-quiz]')
};

class templateQuizJS {
    constructor() {
        quizSelectors.nextStepBtns.forEach((nextBtn)=>{
            nextBtn.addEventListener('click', (event)=>{
                this._gotToNext(event);
            });
        });

        quizSelectors.backStepBtns.forEach((backBtn)=>{
            backBtn.addEventListener('click', (event)=>{
                this._goBack(event);
            });
        });

        quizSelectors.showResults.addEventListener('click', (event)=>{
            this._showResults(event);
        });

        quizSelectors.retakeQuiz.addEventListener('click', (event)=>{
            this._retakeQuiz(event);
        });
    }

    _gotToNext(event){
        event.preventDefault();
        let currentTarget = event.currentTarget;
        let stepContainer = currentTarget.closest('[data-step-container]');
        let stepCount = parseInt(stepContainer.getAttribute('data-stepIndex'));
        let nextStepContainer = document.querySelector(`[data-step-container][data-stepIndex="${stepCount + 1}"]`);

        let selectedOption = stepContainer.querySelectorAll('.quiz-option-selection:checked');
        if(stepCount > 1 && selectedOption.length <= 0){
            alert('Choose Atleat one option');
            return;
        }

        if(nextStepContainer){
            stepContainer.classList.add('d-none');
            nextStepContainer.classList.remove('d-none');
        }
    }

    _goBack(event){
        event.preventDefault();
        let currentTarget = event.currentTarget;
        let stepContainer = currentTarget.closest('[data-step-container]');
        let stepCount = parseInt(stepContainer.getAttribute('data-stepIndex'));
        if(stepCount <= 1) return;

        let prevStepContainer = document.querySelector(`[data-step-container][data-stepIndex="${stepCount - 1}"]`);
        if(prevStepContainer){
            stepContainer.classList.add('d-none');
            prevStepContainer.classList.remove('d-none');
        }
    }

    async _showResults(event){
        event.preventDefault();
        // let selectedTags = '';
        // quizSelectors.steps.forEach((step, index)=>{
        //     let stepIndex = index + 1;
        //     let selectedOptions = step.querySelectorAll('.quiz-option-selection:checked');
        //     if(selectedOptions.length > 1){
        //         let tagString = '(';
        //         selectedOptions.forEach((option, i)=>{
        //             let optionIndex = i + 1;
        //             if(option.value.length > 0){
        //                 tagString += `tag:'${option.value}'`;
        //                 if(optionIndex < selectedOptions.length) tagString += ' OR ';
        //             }
        //         });
        //         tagString += ')';
        //         if(stepIndex < quizSelectors.steps.length) tagString += ' AND ';
        //         selectedTags += tagString;
        //     }else if(selectedOptions[0] && selectedOptions[0].value.length > 0){
        //         selectedTags += `(tag:'${selectedOptions[0].value}')`;
        //         if(stepIndex < quizSelectors.steps.length) selectedTags += ' AND ';
        //     }
        // });
        let selectedTags = null;
        quizSelectors.steps.forEach((step, _index)=>{
            let selectedOption = step.querySelector('.quiz-option-selection:checked');
            if(selectedOption) {
                if(selectedTags != null){selectedTags += `+${selectedOption.value}`}
                else{ selectedTags = `${selectedOption.value}`}
            }
        });

        // const body = JSON.stringify({
        //     query: `{
        //         products(first: 250, query: "${selectedTags}"){
        //             edges {
        //                 node {
        //                     id
        //                     title
        //                     handle
        //                     priceRange {
        //                         minVariantPrice {
        //                             amount
        //                         }
        //                     }
        //                     images(first: 2) {
        //                         edges {
        //                             node {
        //                                 altText
        //                                 src
        //                             }
        //                         }
        //                     }
        //                     tags
        //                 }
        //             }
        //         }
        //     }`
        // });

        // fetch('/api/2023-04/graphql.json', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "Access-Control-Origin": "*",
        //         'X-Shopify-Storefront-Access-Token': "be3096405f964869ce58b06a26176ecf"
        //     },
        //     body: body,
        // })

        
        
        // await fetch(`/collections/all?constraint=${selectedTags}&view=product-selector`, {
        //     method: 'GET'
        // })
        // .then((response) => response.json())
        // .then((data) => { });

            // const resultProducts = data.data.products.edges;
            let requestURL = `/collections/all?constraint=${selectedTags}&view=product-selector&sections=template-collection-selector`;
            const response = await fetch(requestURL);
            const resultProductsJson = await response.json();
            let QuizeHTML = new DOMParser().parseFromString(resultProductsJson['template-collection-selector'], 'text/html');
            let resultProductsHtml =QuizeHTML.getElementById('shopify-section-template-collection-selector').innerHTML;      
            let resultProducts = JSON.parse(resultProductsHtml); 
          console.log(resultProducts)
            // const resultProducts = data;
            quizSelectors.steps.forEach((step)=>{
                step.classList.add('d-none');
            });
            quizSelectors.resultContainer.classList.remove('d-none');
            if(resultProducts.length > 0){
                const productListing = quizSelectors.resultContainer.querySelector('.result-products')
                quizSelectors.resultContainer.classList.add('results--loading');
                quizSelectors.resultContainer.querySelector('[data-listProducts]').classList.remove('d-none');

                let listProducts = '';
                resultProducts.forEach((item)=>{
                    let product = item;
                    console.log(product);
                    listProducts += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 my-3 d-flex align-items-stretch justify-content-around">
                    <div class="card card-product card-product-style-1 text-start rounded-0 border-0">
                    <div class="card-img card-search-item ">
                        <a href="/products/${product.handle}" title="${product.title}">
                            <img class="img-fluid" src="${product.featured_image}" loading="lazy" alt="${product.title}">
                        </a>
                    </div>
                    <div class="card-body px-0">
                        <div class="row">
                        <div class="col-8">
                            <h6 class="card-title m-0"><a href="/products/${product.handle}" title="${product.title}">${product.title}</a></h6>
                        </div>
                        <div class="col-4 text-end">
                            <span class="m-0 p-0">${Shopify.formatMoney(product.price, window.globalVariables.money_format)}</span>
                        </div>
                        </div>
                    </div>
                    </div>
                  </div>`
                });
                productListing.innerHTML = listProducts;
                quizSelectors.resultContainer.classList.remove('results--loading');
            }else{
                quizSelectors.resultContainer.querySelector('[data-no-product]').classList.remove('d-none');
            }
       
    }

    _retakeQuiz(event){
        event.preventDefault();
        quizSelectors.resultContainer.classList.add('d-none');
        quizSelectors.resultContainer.querySelector('[data-listProducts]').classList.add('d-none');
        quizSelectors.resultContainer.querySelector('[data-no-product]').classList.add('d-none');
        quizSelectors.resultContainer.querySelector('.result-products').innerHTML = '';
        quizSelectors.steps[0].classList.remove('d-none');
        quizSelectors.steps.forEach((step, index)=>{
            let optionInputs = step.querySelectorAll('input.quiz-option-selection');
            if(optionInputs.length > 0){
                optionInputs.forEach(input => {
                    input.checked = false;
                });
                step.querySelector('input.quiz-option-selection').checked = true;
            }
        });
    }
}

typeof templateQuizJS !== 'undefined' && new templateQuizJS();
