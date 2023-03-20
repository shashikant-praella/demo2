const json = document.querySelector('[data-login-json]').innerHTML;
const loginHelper = JSON.parse(json);

function _submitLoginHelperForm() {
    var customerEmail = document.querySelector('[name="customer[email]"]').value;
    var customerPassword = document.querySelector('[name="customer[password]"]').value;
    if(customerEmail != undefined && customerEmail.length > 0){
        const validateEmail = Utility.validateEmail(customerEmail);
        if(validateEmail == null){
            document.querySelector("[data-login-alert]").innerHTML = `<p>Provide Valid Email Address.</p>`;
            document.querySelector("[data-login-alert]").classList.remove("d-none");
            setTimeout(() => {
                document.querySelector("[data-login-alert]").innerHTML = ``;
                document.querySelector("[data-login-alert]").classList.add("d-none");
            }, 3000);
            return;
        }

        var data = JSON.stringify({
            "url": "/customers/search.json",
            "method": "GET",
            "data": {
                "email": customerEmail
            }
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("load", function() {
            const response = JSON.parse(xhr.responseText);
            var message = '';
            if(response == undefined || response == null) return;
            if(response.customers.length == 1){
                if(response.customers[0].state == "disabled"){
                    var msg = unescape(loginHelper.settings.account_disable).split('.');
                    msg.forEach((x)=>{
                        message += x +'.';
                    });
                    var dataI = JSON.stringify({
                        "url": `/customers/${response.customers[0].id}/send_invite.json`,
                        "method": "POST",
                        "data": {
                            "customer_invite": {
                            "to": `${response.customers[0].email}`,
                            "from": "sanjay@wolfpointagency.com",
                            "bcc": [],
                            "subject": "Customer account activation",
                            "custom_message": `Hi ${response.customers[0].first_name}, you've created a new customer account at Frank Webb Home. All you have to do is activate it.`
                            }
                        },
                    });

                    var xhrI = new XMLHttpRequest();
                    xhrI.withCredentials = true;
                    xhrI.addEventListener("load", function(){});
                    xhrI.open("POST", "https://api-manager.hulkcode.com/api/shopify/common");
                    xhrI.setRequestHeader("Accept", "application/json");
                    xhrI.setRequestHeader("Content-Type", "application/json");
                    xhrI.send(dataI);
                }else if(response.customers[0].state == "invited"){
                    var msg = unescape(loginHelper.settings.account_invited).split('.');
                        msg.forEach((x)=>{
                        message += x +'.';
                    });
                }else if(response.customers[0].state == "enabled"){            
                    var msg = unescape(loginHelper.settings.account_enable).split('.');
                        msg.forEach((x)=>{
                        message += x +'.';
                    });
                }else if(response.customers[0].state == "declined"){
                    var msg = unescape(loginHelper.settings.account_declined).split('.');
                    msg.forEach((x)=>{
                        message += x +'.';
                    });
                }
                loginHelper.status = response.customers[0].state;
                loginHelper.message = message;
                }else {
                    var msg = unescape(loginHelper.settings.account_not_found).split('.');
                    msg.forEach((x)=>{
                        message += x +'.<br/>';
                    });
                    loginHelper.status = 'other';
                    loginHelper.message = message;
                }
                document.querySelector("[data-login-alert]").innerHTML = `<p>${loginHelper.message}</p>`;
                document.querySelector("[data-login-alert]").classList.remove("d-none");
                if (customerPassword && customerPassword.length > 0) {
                    formEl.submit();
                } else {
                    document.querySelector('[data-password-wrap]').classList.remove('d-none');
                }
        });

        xhr.open("POST", "https://api-manager.hulkcode.com/api/shopify/common");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }else{
        document.querySelector("[data-login-alert]").innerHTML = `<p>Provide Email Address.</p>`;
        document.querySelector("[data-login-alert]").classList.remove("d-none");
        setTimeout(() => {
            document.querySelector("[data-login-alert]").innerHTML = ``;
            document.querySelector("[data-login-alert]").classList.add("d-none");
        }, 3000);
    }
}

document.querySelector("[data-login-submit]").addEventListener("click", function(event){
    event.preventDefault();
    _submitLoginHelperForm();
});