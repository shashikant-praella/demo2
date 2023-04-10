var app_url = "https://appointment.storeify.app"; var storeifyAppointmentRaws ="eyJsb2NhdGlvbnMiOnsiMTA2NCI6eyJuYW1lIjoiRGVmYXVsdCBMb2NhdGlvbiIsImFkZHJlc3MiOiIiLCJwaG9uZSI6IiIsImVtYWlsIjoic2hhc2hpa2FudEBwcmFlbGxhLmNvbSIsInNlcnZpY2VzIjpbXX19fQ=="; //begin storeify 
!(function() {
    var B64 = {
        alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        lookup: null,
        ie: /MSIE /.test(navigator.userAgent),
        ieo: /MSIE [67]/.test(navigator.userAgent),
        encode: function(a) {
            var e, f, g, b = B64.toUtf8(a),
                c = -1,
                d = b.length,
                h = [, , ];
            if (B64.ie) {
                for (var i = []; ++c < d;) e = b[c], f = b[++c], h[0] = e >> 2, h[1] = (3 & e) << 4 | f >> 4, isNaN(f) ? h[2] = h[3] = 64 : (g = b[++c], h[2] = (15 & f) << 2 | g >> 6, h[3] = isNaN(g) ? 64 : 63 & g), i.push(B64.alphabet.charAt(h[0]), B64.alphabet.charAt(h[1]), B64.alphabet.charAt(h[2]), B64.alphabet.charAt(h[3]));
                return i.join("")
            }
            for (var i = ""; ++c < d;) e = b[c], f = b[++c], h[0] = e >> 2, h[1] = (3 & e) << 4 | f >> 4, isNaN(f) ? h[2] = h[3] = 64 : (g = b[++c], h[2] = (15 & f) << 2 | g >> 6, h[3] = isNaN(g) ? 64 : 63 & g), i += B64.alphabet[h[0]] + B64.alphabet[h[1]] + B64.alphabet[h[2]] + B64.alphabet[h[3]];
            return i
        },
        decode: function(a) {
            if (a.length % 4) throw new Error("InvalidCharacterError: 'B64.decode' failed: The string to be decoded is not correctly encoded.");
            var b = B64.fromUtf8(a),
                c = 0,
                d = b.length;
            if (B64.ieo) {
                for (var e = []; d > c;) b[c] < 128 ? e.push(String.fromCharCode(b[c++])) : b[c] > 191 && b[c] < 224 ? e.push(String.fromCharCode((31 & b[c++]) << 6 | 63 & b[c++])) : e.push(String.fromCharCode((15 & b[c++]) << 12 | (63 & b[c++]) << 6 | 63 & b[c++]));
                return e.join("")
            }
            for (var e = ""; d > c;) e += b[c] < 128 ? String.fromCharCode(b[c++]) : b[c] > 191 && b[c] < 224 ? String.fromCharCode((31 & b[c++]) << 6 | 63 & b[c++]) : String.fromCharCode((15 & b[c++]) << 12 | (63 & b[c++]) << 6 | 63 & b[c++]);
            return e
        },
        toUtf8: function(a) {
            var d, b = -1,
                c = a.length,
                e = [];
            if (/^[\x00-\x7f]*$/.test(a))
                for (; ++b < c;) e.push(a.charCodeAt(b));
            else
                for (; ++b < c;) d = a.charCodeAt(b), 128 > d ? e.push(d) : 2048 > d ? e.push(192 | d >> 6, 128 | 63 & d) : e.push(224 | d >> 12, 128 | 63 & d >> 6, 128 | 63 & d);
            return e
        },
        fromUtf8: function(a) {
            var c, b = -1,
                d = [],
                e = [, , ];
            if (!B64.lookup) {
                for (c = B64.alphabet.length, B64.lookup = {}; ++b < c;) B64.lookup[B64.alphabet.charAt(b)] = b;
                b = -1
            }
            for (c = a.length; ++b < c && (e[0] = B64.lookup[a.charAt(b)], e[1] = B64.lookup[a.charAt(++b)], d.push(e[0] << 2 | e[1] >> 4), e[2] = B64.lookup[a.charAt(++b)], 64 != e[2]) && (d.push((15 & e[1]) << 4 | e[2] >> 2), e[3] = B64.lookup[a.charAt(++b)], 64 != e[3]);) d.push((3 & e[2]) << 6 | e[3]);
            return d
        }
    };

    var replacer = function(finder, element, blackList) {
        if (!finder) {
            return
        }

        var regex = (typeof finder == 'string') ? new RegExp(finder, 'g') : finder;
        var regex2 = (typeof finder == 'string') ? new RegExp(finder, 'g') : finder;

        var childNodes = element.childNodes;

        var len = childNodes.length;

        var list = typeof blackList == 'undefined' ? 'html,head,style,title,link,meta,script,object,iframe,pre,a,' : blackList;

        while (len--) {
            var node = childNodes[len];

            if (node.nodeType === 1 && true || (list.indexOf(node.nodeName.toLowerCase()) === -1)) {
                replacer(finder, node, list);
            }
            if (node.nodeType !== 3 || !regex.test(node.data)) {
                continue;
            }
            var frag = (function() {
                var wrap = document.createElement('span');
                var frag = document.createDocumentFragment();
                wrap.innerHTML = '<div class="storeify-apm" id="storeify-apm-shortcode"></div>';
                while (wrap.firstChild) {
                    frag.appendChild(wrap.firstChild);
                }
                return frag;
            })();
            //console.log(frag);       
            var parent = node.parentNode;
            parent.insertBefore(frag, node);
            parent.removeChild(node);
        }
    };
    var formatMoney = function(cents, format) {
        if (typeof cents == 'string') {
            cents = cents.replace('.', '');
        }
        var value = '';
        var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
        var formatString = (format || this.money_format);

        function defaultOption(opt, def) {
            console.log('opt'+opt+'--'+'def'+def);
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal = defaultOption(decimal, '.');

            if (isNaN(number) || number == null) {
                return 0;
            }

            number = (number / 100.0).toFixed(precision);
            console.log('number--'+number);
            var parts = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents = parts[1] ? (decimal + parts[1]) : '';

            return dollars + cents;
        }

        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
        }

        return formatString.replace(placeholderRegex, value);
    }; //end money
    var loadScript = function(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        // If the browser is Internet Explorer.
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
            // For any other browser.
        } else {
            script.onload = function() {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }; //end loadScript
    var isInBreak = function(slotTime, breakTimes) {
        return breakTimes.some((br) => {
            return slotTime >= moment(br[0], "HH:mm") && slotTime < moment(br[1], "HH:mm");
        });
    }
    var rederOptionstime_old = function(time_slot_step,startTime, endTime, nextSlot, format = "HH:mm", current, $checkCalendar,before = 0, after = 0,dateClick,cut_time,backout_nofulldate) {
        var slotTime = moment(startTime, "HH:mm");
        var endTime = moment(endTime, "HH:mm");
        var disable = 'disable';
        let times = [];
        let html = '';
        console.log(dateClick);
        nextSlot = nextSlot + before + after;
        while (slotTime <= endTime) {
            //         if (!isInBreak(slotTime, x.breakTime)) {
            //            times.push(slotTime.format("HH:mm"));
            //         }
            times.push(slotTime.format("HH:mm"));
            slotTime = slotTime.add(nextSlot, 'minutes');
        }

        if (times.length > 0) {
            jQuery.each(times, function(i, t) {
                if (i > 0) {
                    if (current == false) {
                        if (moment(dateClick +' '+ times[i - 1], "YYYY-MM-DD HH:mm") >= moment(cut_time, "YYYY-MM-DD HH:mm") && jQuery.inArray(moment(times[i - 1], "HH:mm").format("HH:mm"), $checkCalendar) == -1) {
                            disable = 'active';
                        } else {
                            disable = 'disable';
                        }

                    } else {
                        if (moment(times[i - 1], "HH:mm") <= moment(current, "HH:mm")  || moment(dateClick +' '+ times[i - 1], "YYYY-MM-DD HH:mm") <= moment(cut_time, "YYYY-MM-DD HH:mm:ss") || jQuery.inArray(moment(times[i - 1], "HH:mm").format("HH:mm"), $checkCalendar) != -1) {
                            disable = 'disable';
                        } else {
                            disable = 'active';
                        }
                    }
					jQuery.each(backout_nofulldate, function(j, v) {
						if( (moment(dateClick +' '+ times[i - 1], "YYYY-MM-DD HH:mm") < moment(v[2]+' '+v[3],"YYYY-MM-DD HH:mm") && moment(dateClick +' '+ times[i - 1], "YYYY-MM-DD HH:mm") > moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm")) || (moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm").subtract(before + after, 'minutes') < moment(v[2]+' '+v[3],"YYYY-MM-DD HH:mm") && moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm").subtract(before + after, 'minutes') > moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm")) ){
						  disable = 'disable';
						}  
					})
                    html += '<div class="item-radio-time item-' + disable + '">';
                    html += '<input id="' + i + '_' + moment(times[i - 1], "HH:mm") + '" type="radio"  name="ify_radio_time" value="' + times[i - 1] + '" data-label="Time" ' + disable + '>';
                    html += '<label for="' + i + '_' + moment(times[i - 1], "HH:mm") + '">' + moment(times[i - 1], "HH:mm").format(format) + ' - ' + moment(t, "HH:mm").subtract(before + after, 'minutes').format(format) + '</label>';
                    //html +=      '<div class="tooltip">This slot is no longer available</div>';
                    html += '</div>';

                }
            });
        }
        return html;
    }
    var rederOptionstime = function(time_slot_step,startTime, endTime, nextSlot, format = "HH:mm", current, $checkCalendar,qty=1,capacity,before = 0, after = 0,dateClick,cut_time,backout_nofulldate,employee_booking,arrayLang = []) {
        var slotTime  = moment(startTime, "HH:mm");
        var step = moment(startTime, "HH:mm");
        var endTime = moment(endTime, "HH:mm");
        var disable = 'disable';
        var times = [];
        var html = '';
        nextSlot = nextSlot + before + after;
        if(time_slot_step >= nextSlot) time_slot_step =0;
        if(moment(startTime, "HH:mm").add(nextSlot, 'minutes') > endTime){
            return html;
        }
        
        while (step <= endTime) {
            let timeItem  = slotTime.format("HH:mm");
            times.push(timeItem);
            slotTime.add(nextSlot - time_slot_step, 'minutes');
            let slot = moment(slotTime.format("HH:mm"), "HH:mm");
            step = slot.add(nextSlot, 'minutes');    
        }

        if (times.length > 0) {
            var checkedFirst = 0;
            jQuery.each(times, function(i, t) {
               let itemKey = moment(t, "HH:mm").format("X");
               let remaining = capacity;
               let checkFull = 0;
               if (itemKey in $checkCalendar){
                 remaining = $checkCalendar[itemKey] + qty;
                 if($checkCalendar[itemKey] < 0) checkFull = 1;
               }
               if (current == false) {
                    if (moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm") >= moment(cut_time, "YYYY-MM-DD HH:mm") && checkFull != 1) {
                        disable = 'active';
                    } else {
                        disable = 'disable';
                    }
                }else{
                    if (moment(t, "HH:mm") <= moment(current, "HH:mm")  || moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm") <= moment(cut_time, "YYYY-MM-DD HH:mm:ss") || checkFull == 1) {
                        disable = 'disable';
                    } else {
                        disable = 'active';
                    }
                }
                    jQuery.each(backout_nofulldate, function(j, v) {
                        if( 
						(moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm") < moment(v[2]+' '+v[3],"YYYY-MM-DD HH:mm") && moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm") > moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm")) 
						|| (moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm").add(nextSlot, 'minutes') < moment(v[2]+' '+v[3],"YYYY-MM-DD HH:mm") && moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm").add(nextSlot, 'minutes') > moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm"))
						|| (moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm").add(nextSlot, 'minutes') >= moment(v[2]+' '+v[3],"YYYY-MM-DD HH:mm") && moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm") <= moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm")) 
						){

                          disable = 'disable';
                        }  
                    })
                    jQuery.each(employee_booking, function(j, v) {
                        if((moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm") <= moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm") && moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm").add(nextSlot, 'minutes') > moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm"))  || (moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm").add(nextSlot, 'minutes') >= moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm").add(v[2], 'minutes') && moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm") < moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm").add(v[2], 'minutes')) || (moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm") <= moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm")  && moment(dateClick +' '+ t, "YYYY-MM-DD HH:mm").add(nextSlot, 'minutes') < moment(v[0]+' '+v[1],"YYYY-MM-DD HH:mm").add(v[2], 'minutes')))
                        { 
                            disable = 'disable';
                        }   
                    })
                    html += '<div class="item-radio-time item-' + disable + '">';
                    if(checkedFirst == 0 && disable == 'active'){
                        checkedFirst = 1;
                        html += '<input id="' + i + '_' + moment(t, "HH:mm") + '" type="radio"  name="ify_radio_time" value="' + t + '" data-label="Time" ' + disable + ' checked="checked">';
                    }else{
                        html += '<input id="' + i + '_' + moment(t, "HH:mm") + '" type="radio"  name="ify_radio_time" value="' + t + '" data-label="Time" ' + disable + '>';
                    }
                    html += '<label for="' + i + '_' + moment(t, "HH:mm") + '"><span class="ify-item-time">' + moment(t , "HH:mm").format(format) + ' - ' + moment(t, "HH:mm").add(nextSlot, 'minutes').format(format) + '</span>';
                    html += '<span class="ify-item-remaining" style="display:block;"> '+(remaining)+'/'+capacity+' '+arrayLang.slots_remaining+'</span></label>';
                    //html +=      '<div class="tooltip">This slot is no longer available</div>';
                    html += '</div>';
            });
        }
        return html;
    }

    var loadOptionstime = function(date, events, capacity, duration, basis) {

        if (events.length > 0) {
            timeList = [];
            jQuery.each(events, function(i, ev) {
                check = 0;
                if (date == ev.start) {
                    check = 1;
                    timeList = ev.availability;
                }
                sttDay = moment(date).format('d');
                //           console.log(String(sttDay));
                //           console.log(ev);
                //           console.log(ev.daysOfWeek);
                //           console.log(jQuery.inArray( String(sttDay) , ev.daysOfWeek ));
                if (check != 1 && jQuery.inArray(String(sttDay), ev.daysOfWeek) != -1) {
                    timeList = ev.availability;
                }
            });
            return timeList;
        }

        return false;
    };
    var startTime = function(timezone, id, format = "HH:mm") {
        const today = new Date();
        var a = moment(today).tz(timezone).format(format);
        document.getElementById(id).innerHTML = '(' + a + ')';
        //setTimeout(startTime, 1000);
    }
    var checkCalendar = function($date, $datetime, $capacity = 1,$qty = 1) {
        $result = {};
        if ($datetime == null)
            return $result;
        jQuery.each($datetime, function(i, d) {
            myArr = (d.datatime).split(" ");
            if ($date == myArr[0]) {
                $result[moment(myArr[1], "HH:mm").format("X")] = $capacity - (Number(d.total_qty) + Number(d.total_more_bring) + Number($qty));
            }
        });
        return $result;
    }
    var addtocard = function(data,redirect,callback) {
        var params = {
            type: 'POST',
            url: '/cart/add.js',
            data: data,
            dataType: 'json',
            success: function(line_item) {
                //           if ((typeof callback) === 'function') {
                //             callback(line_item);
                //           }
                //           else {
                //             dataShopify.onItemAdded(line_item);
                //           }
                jQuery.getJSON('/cart.js', function(cart, textStatus) {
                    console.log(cart);
                    if ((typeof callback) === 'function') {
                        callback(cart);
                    } else {
                        if(redirect == 1){
                            document.location.href = '/cart';
                        }else{
                            document.location.href = '/cart/checkout';
                        }
                        console.log('There are now ' + cart.item_count + ' items in the cart.');
                    }

                });

            },
            error: function(XMLHttpRequest, textStatus) {
                var data = eval('(' + XMLHttpRequest.responseText + ')');
                if (!!data.message) {
                    console.log(data.message + '(' + data.status + '): ' + data.description);
                } else {
                    console.log('Error : ' + Shopify.fullMessagesFromErrors(data).join('; ') + '.');
                }
            }
        };
        jQuery.ajax(params);
    };
    var addserviceFree = function(app_url,form,dataForm,arrayLang){
        jQuery.ajax({
            type: 'POST',
            url: app_url+'/add-free',
            data: dataForm,
            async: true,
            cache: true,
            success: function(response) {
                var html1 = '<div class="confirm-success" style="display:none;"></div>';
                var htmlDown = '';
               if(response.status == 1){
               	   var bookingSuccess = arrayLang.booking_success || '';
                    html1 = '<div class="confirm-success">'+bookingSuccess+'</div>';
                    htmlDown = '<div class="confirm-dowload">';
                    htmlDown += '<a title="download ical" class="download-ical" target="_blank" href="'+response.url+'"><i class="far fa-calendar-check ify-icon" aria-hidden="true"></i></a>';
                    htmlDown += '<a title="print" class="button-print" href="#"><i class="fas fa-print ify-icon" aria-hidden="true"></i></a>';
                    htmlDown += '</div>';
                    form.find('.ify-btn.ify-bnt-back').hide();
                    form.find('.ify-btn.ify-bnt-confirm').hide();
                    form.find('.ify-form-customer').hide().after( htmlDown );
                    form.find('.ify-appointment-customrequest-form').hide().after( htmlDown );
               }else{
                    html1 = '<div class="confirm-error">'+response.mes+'</div>';
                    form.find('.ify-confirm-form').append( html1 );
               }
               // form.find('.confirm-product').after( html1 );
               setTimeout(function() { form.removeClass('ify-loading'); }, 1000);
            }
        });
    }
    var createFormfree = function($dataForm,arrayLang,customerData){
        var formHtml = '';
        const defaultLabel = {first_name:'First Name',last_name:'Last Name',email:'Email',phone:'Phone Number'};

        jQuery.each($dataForm, function(i, d) {
        	var typeInput = 'text';
        	var fieldLabel = arrayLang['input_'+i] || defaultLabel[i];
        	if(i == 'email') typeInput = 'email';
	        	if(d.show == 1){
	            formHtml += '<div class="storeify-frm-group storeify-col-appointment storeify-frm-'+i+'">'; 
	            formHtml += '<label class="storeify-label-control" >'+fieldLabel;
	            if(d.rq == 1 ){
	                formHtml += '<span class="storeify-required-text">*</span>';
	            }
	            formHtml += '</label>';
	            formHtml += '<div class="storeify-div-input">';
	            formHtml += '<input type="'+typeInput+'" class="storeify-no-icon storeify-appointment-input-control storeify-'+typeInput+'" name="'+i+'" id="ify_apppintment_'+i+'" value="'+customerData[i]+'">';
	            formHtml += '</div>';
	            formHtml += '</div>';
	        }
        });
        return formHtml;
    }
    var createFormService = function(dataShopify,dataSer,dataApps,dataEmp,dataLocation,customForms,productData,prdId,arrayLang){

	    productCurrent = dataSer[prdId];
	    idCurrent = prdId;
	    let html = '';
	    //html = '<form method="get" class="ify-apppintment-group" id="ify_apppintment_group_' + idCurrent + '" data-step = "1" accept-charset="UTF-8">';
	    html += '<div class="ify-loader-group"><div class="loader"> '+arrayLang.loading+'.. </div></div>';
	    html += '<input type="hidden" name="domain" value="' + dataShopify.shop + '">';
	    html += '<input type="hidden" name="id" value="' + productCurrent.id + '">';
	    html += '<input type="hidden" name="product_id" class="ify_product_id_hiden" value="' + prdId + '">';
	    html += '<input type="hidden" id="ify_choose_' + idCurrent + '" class="ify-choose-variant" name="ify_choose_variant" value="' + productData.variants[0].id + '">';
	    html += '<input type="hidden" id="ify_choose_name_' + idCurrent + '" class="ify-choose-name" name="ify_choose_name" value="' + productData.variants[0].name.replaceAll('"', '&quot;') + '">';

	    $img = productData.featured_image;
	    if (productData.variants[0].featured_image != null)
	        $img = productData.variants[0].featured_image.src;
	    html += '<input type="hidden" id="ify_choose_img_' + idCurrent + '" class="ify-choose-img" name="ify_choose_img" value="' + $img + '">';

	    html += '<div class="ify-step ify-step-1 active" data-step="1">';
	    if (productData.options){
	        jQuery.each(productData.options, function(i, op) {
	            //$( "#" + i ).append( document.createTextNode( " - " + val ) );
	            if(op.name == 'Title' && op.values.length == 1)
	                html += '<div class="ify-option-product-hide ify-form-control option-product option-product-' + i + '">';
	            else
	                html += '<div class="ify-form-control option-product option-product-' + i + '">';
	            html += '<label>' + op.name + '</label>';
	            html += '<select class="ify-select" name="options">';
	            jQuery.each(op.values, function(j, val) {
                    let valS = val.replaceAll('"', '&quot;');
	                html += '<option value="' + valS + '">' + val + '</option>';
	            });
	            html += '</select></div>';
	        });
	    }

	    // if ((productCurrent.employees).length > 0 && productCurrent.availability == 1) {
        let data_limitF = 0;
	    if ((productCurrent.employees).length > 0) {
	        html += '<div class="ify-form-control option-employee">';
	        html += '<label>'+arrayLang.choose_employee+'</label>';
	        html += '<select class="ify-select" name="employee">';
	        html += '<option value="">'+ arrayLang.select_an_emp +'</option>';
	        jQuery.each(productCurrent.employees, function(e, emp) {
	            //console.log(Number(emp));
	            //console.log(dataEmp[Number(emp)]);
                if(e==0) data_limitF = dataEmp[Number(emp)].limit;
	            html += '<option value="' + emp + '" data-limit="'+dataEmp[Number(emp)].limit+'">' + dataEmp[Number(emp)].first_name + ' ' + dataEmp[Number(emp)].last_name + '</option>';
	        });
	        html += '</select></div>';
	    }
	    if ((productCurrent.locations).length > 0 && dataApps.locations_show == 1) {
	        html += '<div class="ify-form-control option-location">';
	        html += '<label>'+arrayLang.choose_location+'</label>';
	        html += '<select class="ify-select" name="location">';
	        jQuery.each(productCurrent.locations, function(e, loc) {
	            html += '<option value="' + loc + '">' + dataLocation[Number(loc)].name + '</option>';
	        });
	        html += '</select></div>';
	    }
	    html += '<div class="ify-form-control input-qty" >';
	    html += '<label>'+arrayLang.quantity+'</label>';
	    html += '<input type="text" class="ify-input ify-apm-qty" name="apm_qty" value="1">';
	    html += '</div>';
	    if(productCurrent.bring[0] == 1){
            if(data_limitF == 1)
	           html += '<div class="ify-form-control switch-bringing" style="display:none">';
            else
               html += '<div class="ify-form-control switch-bringing">'; 
	        html += '<label class="label-switch"><span>'+arrayLang.bringing_quest+'</span>';
	        html += '<label class="ify-switch"><input type="checkbox" name="bringing_enable" class="ify-toggle" value="1"><span class="ify-round"></span></label>';
	        html += '</label></div>';

	        html += '<div class="ify-form-control input-bringing" style="display:none;">';
	        var bringLabel = arrayLang.bringing_label.replace("{number}", productCurrent.bring[1]);
	        html += '<label>'+bringLabel+'</label>';
	        html += '<input type="text" class="ify-input ify-bring-more" name="bring_more" value="0" data-default="'+productCurrent.bring[1] +'" data-max="'+productCurrent.bring[1] +'">';
	        html += '<em class="ify-error ify-input-error">'+arrayLang.exceed_limit+'</em>';
	        html += '</div>';
	    }
	    if(productCurrent.free_service != 1)
	    html += '<input type="hidden" class="price_hiden" value="'+productData.variants[0].price+'">';
	    if (productData.variants[0].available) {
	        if(productCurrent.free_service != 1)
	        	html += '<div class="ify-form-control price-group"><span class="ify-label-price">'+arrayLang.price+':</span><span class="ify-price">' + formatMoney(productData.variants[0].price, dataApps.money_format) + '</span> </div>';
	        else
	        	html += '<div class="ify-form-control price-group" style="display:none;"><span class="ify-label-price">'+arrayLang.price+':</span><span class="ify-price">' + formatMoney(productData.variants[0].price, dataApps.money_format) + '</span> </div>';
	        html += '<div class="ify-form-control error-group"><span class="ify-error"><span></div>';
	        html += '<button type="button" class="ify-btn ify-bnt-continue" >'+arrayLang.continue+'</button>';
	    } else {
	        if(productCurrent.free_service != 1)
	        	html += '<div class="ify-form-control price-group"><span class="ify-label-price">'+arrayLang.price+':</span><span class="ify-price">' + formatMoney(productData.variants[0].price, dataApps.money_format) + '</span><span class="ify-sold-out">'+arrayLang.sold_out+'</span></div>';
	        else
	        	html += '<div class="ify-form-control price-group" style="display:none;"><span class="ify-label-price">'+arrayLang.price+':</span><span class="ify-price">' + formatMoney(productData.variants[0].price, dataApps.money_format) + '</span><span class="ify-sold-out">'+arrayLang.sold_out+'</span></div>';
	        html += '<div class="ify-form-control error-group"><span class="ify-error"><span></div>';
	        html += '<button type="button" class="ify-btn ify-bnt-continue ify-bnt-continue-1 ify-disable" >'+arrayLang.continue+'</button>';
	    }
	    html += '</div>'; //step-1 end
	    html += '<div class="ify-step ify-step-2" data-step="2">';
	    html += '<input type="hidden" class="choose-date" name="date" value="">';
	    html += '<input type="hidden" class="timezone_input" name="timezone" value="">';
	    html += '<input type="hidden" class="duration_input" name="duration" value="">';
        html += '<input type="hidden" class="duration_type_input" name="duration_type" value="">';
	    html += '<div class="ify-calendar" id="ify-calendar-' + idCurrent + '" ></div>';
	    html += '<div style="display:none" class="ify-calendar-clock ify-calendar-clock-' + idCurrent + '" id="ify-calendar-clock-' + idCurrent + '"><span class="ify-timezone-icon"></span><span class="ify-timezone"></span><span class="ify-current-time" id="ify-current-time-' + idCurrent + '"></span></div>';
	    html += '<div class="ify-calendar-time ify-calendar-time-' + idCurrent + '" ></div>';
	    html += '<button type="button" class="ify-btn ify-bnt-back" >'+arrayLang.back+'</button>';
	    html += '<button type="button" class="ify-btn ify-bnt-continue ify-bnt-continue-2 ify-disable" >'+arrayLang.continue+'</button>';
	    html += '</div>'; //step-2 end
	    html += '<div class="ify-step ify-step-3" data-step="3">';
	    html += '<div class="ify-confirm"></div>';
	    let class_free = 'ify-go-checkout';

	    if(productCurrent.form_id != 0){
	        jQuery.each(customForms, function(key, frm) {
	            if(productCurrent.form_id == key){
	                class_free = 'ify-has-custom-request';
	                html += '<div class="ify-custom-request-form ify-appointment-customrequest-form ify-appointment-customrequest-form-'+key+'">'+frm.html+'<div class="ify-confirm-form"></div></div>';
	            }
	        });
	    }
	    if(productCurrent.free_service == 1){
	        class_free += ' ify-free-service';
	        if(productCurrent.form_id == 0 && class_free != 'ify-has-custom-request'){
	            let customerData = dataApps.customer || {first_name:'',last_name:'',email:'',phone:''};
	            html += '<div class="ify-form-customer">'+createFormfree(dataApps.formFree,arrayLang,customerData)+'<div class="ify-confirm-form"></div></div>';
	        }
	    }
	    html += '<button type="button" class="ify-btn ify-bnt-back" >'+arrayLang.back+'</button>';
	    html += '<button type="button" class="ify-btn ify-bnt-confirm ify-disable '+class_free+'" >'+arrayLang.confirm+'</button>';
	    html += '</div>'; //step-31 end
	    //html += '</form>';
	    return html;
	}
    var storeifyappsJavaScript = function(jQuery) {
        var dataShopify = window.Shopify || {};
        var dataApps = window.storeifyAppointment || {};
        var dataMeta = window.meta || {};
        var dataRaws = JSON.parse(B64.decode(storeifyAppointmentRaws));
        var dataSer = dataRaws.services;
        var dataEmp = dataRaws.employees;
        var dataLocation = dataRaws.locations;
        var customForms = dataRaws.forms;
        var arrayLangraw = dataApps.langs;
        var arrayLang = arrayLangraw['default'];
        if(typeof arrayLangraw[dataApps.locale] !== 'undefined'){
            arrayLang = arrayLangraw[dataApps.locale];
        }
        Object.keys(arrayLang).forEach(key => {
          if (arrayLang[key] === null) {delete arrayLang[key];}
        });
        arrayLang = Object.assign(dataApps.lang_default, arrayLang);
        moment.locale(dataApps.lang_code);
        setTimeout(function() { 
            jQuery('#ify_apppintment_style_hide').remove();
        }, 500);
        //         var moment = require('moment-timezone');
        // console.log(dataShopify);
        // console.log(dataRaws);
        // console.log(dataApps);

        // if (jQuery('form[method="post"][action*="/cart/add"]').length && dataMeta.page.pageType == 'product' && (dataApps.product.id in dataSer)) {
        jQuery(document).ready(function(){
	     	var blackList;
			jQuery('body').each(function(){
				replacer('\\[storeify-apm\\]', jQuery(this).get(0), blackList);            
			});
			let htmlSv = '';
			if(Object.keys(dataSer).length > 0){
				htmlSv = '<form method="get" class="ify-apppintment-group ify_apppintment_services_shortcode" id="ify_apppintment_services_shortcode" data-step = "1" accept-charset="UTF-8">';
				htmlSv += '<div class="ify-form-control option-services">';
		        htmlSv += '<label>'+arrayLang.pl_choose_service+'</label>';
		        htmlSv += '<select class="ify-select ify_choose_service" id="ify_choose_service" name="services">';
		        htmlSv += '<option value="">'+arrayLang.choose_service+'</option>';
		        jQuery.each(dataSer, function(i, op) {
		            htmlSv += '<option value="'+op.handlePrd+'">'+op.title+'</option>';
		        });
		        htmlSv += '</select></div>';
		        htmlSv += '<div class="ify-inner-form-booking"></div>';
				htmlSv += '</form>'; 
			}

        	jQuery('.storeify-apm').html(htmlSv);
        	jQuery(document).on("change", ".ify_apppintment_services_shortcode .ify_choose_service", function() {
        		let form = jQuery(this).parent().parent();
        		let that = jQuery(this);
        		if(jQuery(this).val() != ''){
        			jQuery.ajax({
                            type: 'GET',
                            url: '/products/'+jQuery(this).val()+'.js',
                            dataType: 'html',
                            beforeSend: function() {
                                form.addClass('ify-loading');

                            }
                        }).done(function(response) {
						    	form.removeClass('ify-loading');
                            	let html = '';
                            	let productData = JSON.parse(response);
                            	let productCurrent = dataSer[productData.id];
                            	//console.log(productData);
                            	//dataApps.product = productData;
                            	html = createFormService(dataShopify,dataSer,dataApps,dataEmp,dataLocation,customForms,productData,productData.id,arrayLang);
                            	that.closest('form.ify_apppintment_services_shortcode').find('.ify-inner-form-booking').html(html);
                            	if(productCurrent.form_id != 0){
				                    let storeify_lang_cf = {
				                        autoclose: true,
				                        ignoreReadonly: true,
				                        icons: {
				                            time: 'far fa-clock',
				                            date: 'far fa-calendar',
				                            up: 'fas fa-arrow-up',
				                            down: 'fas fa-arrow-down',
				                            previous: 'fas fa-chevron-left',
				                            next: 'fas fa-chevron-right',
				                            today: 'far fa-calendar-check',
				                            clear: 'fas fa-trash',
				                            close: 'fas fa-times'
				                        },
				                        format: 'DD/MM/YYYY'
				                    };
				                    jQuery(".ify-appointment-customrequest-form .appointment-datetimepicker-input").each(function() {
				                        storeify_lang_cf.format = jQuery(this).data('format');
				                        jQuery(this).parent().datetimepicker(storeify_lang_cf);
				                    });
				                }
				            
				                if(productCurrent.free_service == 1 && productCurrent.form_id == 0 &&  form.find('.ify-has-custom-request').length == 0 ){
				                    var configValidate = {
				                        rules:{
				                            email: {email:true}
				                        },
				                        messages:{
				                            email:{email:arrayLang.field_email}
				                        }
				                    };
				                    //dataApps.formFree,arrayLang
				                    jQuery.each(dataApps.formFree, function(i, val) {

				                        if(val.rq == 1){
				                            if(i == 'email'){
				                                configValidate.rules[i] = {email:true,required:true};
				                                configValidate.messages[i] = {email:arrayLang.field_email,required:arrayLang.field_required};
				                            }else{
				                                configValidate.rules[i] = {required:true};
				                                configValidate.messages[i] = {required:arrayLang.field_required};
				                            }
				                            
				                        }
				                    });
				                    $("#ify_apppintment_services_shortcode").validate(configValidate);
				                }

                            	jQuery(document).on("change", ".ify-apppintment-group .option-product select", function() {
							            let $img = productData.featured_image;
							            let parent = jQuery(this).parent().parent().parent();
							            jQuery.each(productData.variants, function(i, val) {
							                check = 1;
							                jQuery.each(productData.options, function(j, op) {
                                                let valOption = parent.find('.option-product-' + j + ' select').val();//.replaceAll('&quot;', '"');
							                    if ( valOption != val['option' + (j + 1)]) check = 0;
							                });
							                if (check == 1) {
							                    //console.log(val.id);
							                    jQuery("#ify_apppintment_services_shortcode").find('.ify-sold-out').remove();
							                    jQuery("#ify_apppintment_services_shortcode").find('.ify-bnt-continue').removeClass('ify-disable');
							                    jQuery("#ify_choose_" + productData.id).val(val.id);
							                    jQuery("#ify_choose_name_" + productData.id).val(val.name);
							                    if (val.featured_image != null)
							                        $img = val.featured_image.src;
							                    jQuery("#ify_choose_img_" + productData.id).val($img);
							                    jQuery("#ify_apppintment_services_shortcode" + " .ify-price").html(formatMoney(val.price, dataApps.money_format));
							                    jQuery("#ify_apppintment_services_shortcode" + " .price_hiden").val(val.price);
							                    if (val.available == false) {
							                        jQuery("#ify_apppintment_services_shortcode" + " .ify-price").after('<span class="ify-sold-out">'+arrayLang.sold_out+'</span>');
							                        jQuery("#ify_apppintment_services_shortcode").find('.ify-bnt-continue').addClass('ify-disable');
							                    }

							                }
							            });
							    });
						})
						.fail(function(jqXHR, textStatus) {
						    console.log( "Request failed: " + textStatus );
						    that.parent().parent().find('.ify-inner-form-booking').html('<span style="color:red">'+arrayLang.sv_available+'</span>');
						});
        		}else{
        			that.parent().parent().find('.ify-inner-form-booking').html('');
        		}
        	});
        	
		});
		
        if (dataApps.page.type == 'product' && (dataApps.product.id in dataSer)) {
            //console.log(dataApps.product.id in dataSer);
            //jQuery('form[method="post"][action*="/cart/add"]').hide();
            //jQuery('form[method="post"][action*="/cart/add"]').after('123');
            jQuery('body').addClass('ify-apppintment-product');
            productCurrent = dataSer[dataApps.product.id];
            idCurrent = dataApps.product.id;
            if (dataApps.product.options) {
                html = '<form method="get" action="" class="ify-apppintment-group" id="ify_apppintment_group_' + dataApps.product.id + '" data-step = "1" accept-charset="UTF-8"><div class="ify-inner-form">';
                html += createFormService(dataShopify,dataSer,dataApps,dataEmp,dataLocation,customForms,dataApps.product,dataApps.product.id,arrayLang);
                html += '</div></form>';
                if(jQuery('.storeify-appointment-block').length > 0){
                    jQuery('.storeify-appointment-block').html(html).addClass('show-appoinment');
                }else{
                    jQuery('form[method="post"][action*="/cart/add"]').first().after(html);
                }
                if(productCurrent.form_id != 0){
                    let storeify_lang_cf = {
                        autoclose: true,
                        ignoreReadonly: true,
                        icons: {
                            time: 'far fa-clock',
                            date: 'far fa-calendar',
                            up: 'fas fa-arrow-up',
                            down: 'fas fa-arrow-down',
                            previous: 'fas fa-chevron-left',
                            next: 'fas fa-chevron-right',
                            today: 'far fa-calendar-check',
                            clear: 'fas fa-trash',
                            close: 'fas fa-times'
                        },
                        format: 'DD/MM/YYYY'
                    };
                    jQuery(".ify-appointment-customrequest-form .appointment-datetimepicker-input").each(function() {
                        storeify_lang_cf.format = jQuery(this).data('format');
                        jQuery(this).parent().datetimepicker(storeify_lang_cf);
                    });
                }
                if(productCurrent.free_service == 1 && productCurrent.form_id == 0 &&  jQuery("#ify_apppintment_group_"+idCurrent).find('.ify-has-custom-request').length == 0 ){
                    var configValidate = {
                        rules:{
                            email: {email:true}
                        },
                        messages:{
                            email:{email:arrayLang.field_email}
                        }
                    };
                    //dataApps.formFree,arrayLang
                    jQuery.each(dataApps.formFree, function(i, val) {

                        if(val.rq == 1){
                            if(i == 'email'){
                                configValidate.rules[i] = {email:true,required:true};
                                configValidate.messages[i] = {email:arrayLang.field_email,required:arrayLang.field_required};
                            }else{
                                configValidate.rules[i] = {required:true};
                                configValidate.messages[i] = {required:arrayLang.field_required};
                            }
                            
                        }
                    });
                    jQuery("#ify_apppintment_group_"+idCurrent).validate(configValidate);
                }
                jQuery(document).on("change", ".ify-apppintment-group select", function() {
			            var $img = dataApps.product.featured_image;
			            jQuery.each(dataApps.product.variants, function(i, val) {
			                check = 1;
			                jQuery.each(dataApps.product.options, function(j, op) {
                                let valOption = jQuery('.option-product-' + j + ' select').val();//replaceAll('&quot;', '"');
			                    if (valOption != val['option' + (j + 1)]) check = 0;
			                });
			                if (check == 1) {
			                    //console.log(val.id);
			                    jQuery("#ify_apppintment_group_" + dataApps.product.id).find('.ify-sold-out').remove();
			                    jQuery("#ify_apppintment_group_" + dataApps.product.id).find('.ify-step-1 .ify-bnt-continue').removeClass('ify-disable');
			                    jQuery("#ify_choose_" + dataApps.product.id).val(val.id);
			                    jQuery("#ify_choose_name_" + dataApps.product.id).val(val.name);
			                    if (val.featured_image != null)
			                        $img = val.featured_image.src;
			                    jQuery("#ify_choose_img_" + dataApps.product.id).val($img);
			                    jQuery("#ify_apppintment_group_" + dataApps.product.id + " .ify-price").html(formatMoney(val.price, dataApps.money_format));
			                    jQuery("#ify_apppintment_group_" + dataApps.product.id + " .price_hiden").val(val.price);
			                    if (val.available == false) {
			                        jQuery("#ify_apppintment_group_" + dataApps.product.id + " .ify-price").after('<span class="ify-sold-out">'+arrayLang.sold_out+'</span>');
			                        jQuery("#ify_apppintment_group_" + dataApps.product.id).find('.ify-step-1 .ify-bnt-continue').addClass('ify-disable');
			                    }

			                }
			            });
			    });
            }
            if(dataApps.add_to_card_show == 1){
                jQuery('form[method="post"][action*="/cart/add"]').find('.product-form__cart-submit').remove();
            }
            if(dataApps.buy_it_show == 1){
                jQuery('form[method="post"][action*="/cart/add"]').find('.shopify-payment-button').remove();
            }

        }//endif
        
        jQuery(document).on("click", ".ify-apppintment-group .ify-bnt-back", function() {
            form = jQuery(this).parent().parent().parent('form');
            form.find('.ify-step').removeClass('active');
            form.find('.ify-step-' + (Number(jQuery(this).parent().data('step')) - 1)).addClass('active');
            if (jQuery(this).parent().data('step') == 2) {
                jQuery(this).parent().find('.ify-calendar-clock').hide();
                jQuery(this).parent().find('.ify-calendar-time').html('');
                jQuery(this).parent().find('.ify-bnt-continue').addClass('ify-disable');
                form.find('.option-services').show();
            }
             if (jQuery(this).parent().data('step') == 3) {
                // calendarH.render();
                jQuery(this).parent().find('.ify-bnt-confirm').addClass('ify-disable');
            }
        });
        jQuery(document).on("change", ".ify-step-1 .ify-form-control select", function() {
        	jQuery('.ify-step-1 .ify-form-control select').removeClass('ify-error');
        	jQuery('.ify-step-1 .ify-form-control').find('.error-message').remove();
        });
        jQuery(document).on("click", ".ify-apppintment-group .ify-bnt-continue", function() {
            if (jQuery(this).hasClass('ify-disable')) {
                return false;
            }
            var step = jQuery(this).parent().data('step');
            var form = jQuery(this).parent().parent().parent('form');
            var that = jQuery(this);
            
            if (step == 1) {
            	if(form.find('.option-employee').length > 0){
                    let option_employee = form.find('.option-employee select');
            		if( option_employee.val() == ''){
            			if(!option_employee.hasClass('ify-error')){
	                      	option_employee.addClass('ify-error');
	                      	option_employee.parent().append( "<span class='error-message'>"+arrayLang.emp_req+"</span>" );
	                    }
                      return 0;
                    }
            	}
                that.parent().parent().addClass('ify-loading');
                form.find('.option-services').hide();
                jQuery.ajax({
                    type: 'GET',
                    url: app_url+'/load-appointment',
                    data: form.serialize(),
                    async: true,
                    cache: true,
                    beforeSend: function() {
                        form.addClass('ify-loading');

                    },

                    success: function(response) {
                        if(response.status == 0){
                            form.removeClass('ify-loading');
                            form.find('.error-group').show();
                            form.find('.error-group span').html('Not Data or Error.');
                            setTimeout(function(){
                                form.find('.error-group').hide();
                                form.find('.error-group span').html('');
                            }, 3000);
                        }
                        future_days = response.data.future_days;
                        var before = response.data.before;
                        var time_before = response.data.buffer_time_before;
                        var time_after = response.data.buffer_time_after;
                        var events = JSON.parse(response.data.events);
                        var capacity = response.data.capacity;
                        var duration = response.data.duration;
                        var duration_type = response.data.duration_type;
                        var basis = response.data.basis;
                        var timeZone = response.data.time_zone;
                        var datetime_count = response.data.datetime_count;
                        var time_store = response.data.time_store;
                        var backout_fulldate = response.data.backout_fulldate;
                        var backout_nofulldate = response.data.backout_nofulldate;
                        var employee_booking = response.data.employee_booking;
                        //                                           console.log(events);
                        var calendarEl = document.getElementById('ify-calendar-' + idCurrent);
                        form.find('.timezone_input').val(timeZone);
                        form.find('.duration_input').val(duration);
                        form.find('.duration_type_input').val(duration_type);
                        var min_before = moment(before).add(duration, 'minutes');
                        var before_calendar = before;
                        if(moment(min_before).format('YYYY-MM-DD') != moment(before).format('YYYY-MM-DD')){
                           before_calendar =  moment(before).add(1, 'days');
                        }
                        var qty = parseInt(form.find('.ify-apm-qty').val());
                        if(form.find('.ify-bring-more').length > 0 && form.find('.switch-bringing .ify-toggle').is(":checked")){
                            qty = qty + parseInt(form.find('.ify-bring-more').val());
                        }
                        let limit_capacity = capacity;
                        if(response.data.employee_limit){
                            limit_capacity = Math.min(response.data.employee_limit, capacity);
                            datetime_count = response.data.datetime_count_by_emp;
                        }
                        if(qty > limit_capacity){
                            form.removeClass('ify-loading');
                            form.find('.error-group').show();
                            form.find('.error-group span').html('Not enough slots available.');
                            setTimeout(function(){
                                form.find('.error-group').hide();
                                form.find('.error-group span').html('');
                            }, 3000);
                            return false;
                        }
                        form.find('.ify-step').removeClass('active');
                        form.find('.ify-step-2').addClass('active');
                        form.removeClass('ify-loading');
                        form.attr('data-step', '2');
                        var calendarH = new FullCalendar.Calendar(calendarEl, {
                            timeZone: timeZone,
                            initialView: 'dayGridMonth',
                            events:events,
                            headerToolbar: {
                                left: 'prev',
                                center: 'title',
                                right: 'next'
                            },
                            locale: dataApps.lang_code,
                            contentHeight: "auto",
                            handleWindowResize: true,
                            themeSystem: 'bootstrap3',
                            dayCellClassNames: function(arg) {
								var checkdayCellClassNames = 1;
                                var classEl = 'ify-date-'+moment(arg.date).format("YYYY-MM-DD");
								jQuery.each(backout_fulldate, function(i, t) {
									if(moment(arg.date) <= moment(t[1]+' 23:59:59',"YYYY-MM-DD HH:mm:ss") && moment(arg.date) >= moment(t[0]+' 00:00:00',"YYYY-MM-DD HH:mm:ss") ){
									  checkdayCellClassNames = 0;
									}
								})
								jQuery.each(backout_nofulldate, function(i, t) {
									if(moment(arg.date) <= moment(t[2]+' 00:00:00',"YYYY-MM-DD HH:mm") && moment(arg.date) >= moment(t[0]+' 23:59:59',"YYYY-MM-DD HH:mm") ){
									  checkdayCellClassNames = 0;
									} 
								})
								if (moment(arg.date).isBefore(before_calendar, 'day') || moment(arg.date).isAfter(future_days, 'day')) {
								    checkdayCellClassNames = 0;
								}
								if(checkdayCellClassNames == 0) classEl +=' ify-date-disable';
                                return classEl;
                            },
                            dateClick: function(arg) {
                                //console.log(arg);
                                //arg.dayEl.style.backgroundColor = 'red';
                                //arg.dayEl.className += ' selected';

                                //console.log(arg.dayEl.className);
                                var currentClass = arg.dayEl.className;
                                const today = new Date();
                                var a_today = moment(today).tz(timeZone).format('HH:mm');
                                if (currentClass.includes("ify-date-disable") || currentClass.includes("ify-event-disable")) {
                                    return false;
                                }
                                jQuery('#ify-calendar-' + idCurrent + ' .fc-daygrid-day').removeClass('ify-selected');
                                arg.dayEl.className += ' ify-selected';
                                form.find('.choose-date').val(arg.dateStr);
                                var timeRaws = loadOptionstime(arg.dateStr, events, limit_capacity, duration, basis);
                                if (timeRaws != false) {
                                    var htmlTime = '';
                                    var time_slot_step = dataApps.time_slot;
                                    $checkCalendar = checkCalendar(arg.dateStr, datetime_count, limit_capacity, qty);
                                    //                                                 console.log($checkCalendar);
                                    jQuery.each(timeRaws, function(i, t) {
                                        times = t.split(',');
                                        if (currentClass.includes("fc-day-today")) {
                                            htmlTime += rederOptionstime(time_slot_step,times[0], times[1], duration, dataApps.timeFormat, a_today, $checkCalendar,qty,limit_capacity,time_before,time_after,moment(arg.dateStr).format("YYYY-MM-DD"),before,backout_nofulldate,employee_booking,arrayLang);
                                        } else {
                                            htmlTime += rederOptionstime(time_slot_step,times[0], times[1], duration, dataApps.timeFormat, false, $checkCalendar,qty,limit_capacity,time_before,time_after,moment(arg.dateStr).format("YYYY-MM-DD"),before,backout_nofulldate,employee_booking,arrayLang);
                                        }

                                        //console.log(timeSlot);
                                    });
                                    startTime(timeZone, 'ify-current-time-' + idCurrent, dataApps.timeFormat);
                                    setInterval(function() {
                                        startTime(timeZone, 'ify-current-time-' + idCurrent, dataApps.timeFormat);
                                    }, 5000);
                                    jQuery('.ify-calendar-clock-' + idCurrent + ' .ify-timezone').html(timeZone);
                                    jQuery('.ify-calendar-clock-' + idCurrent).show();
                                    jQuery('.ify-calendar-time-' + idCurrent).html(htmlTime);
                                    if (!jQuery('.ify-bnt-continue-2').hasClass('ify-disable')) {
                                        jQuery('.ify-bnt-continue-2').addClass('ify-disable')
                                    }
                                    if(jQuery('.ify-calendar-time-' + idCurrent+' input[name=ify_radio_time]:checked').size() > 0){
                                        jQuery('.ify-bnt-continue-2').removeClass('ify-disable');
                                    }
                                }
                            },
                            eventContent: function (arg, createElement) {
                              
                              var dayCell = moment(arg.event.start).format("YYYY-MM-DD");
                              var paramsRaws = arg.event.extendedProps.availability;
                              var classEl = arg.event.classNames;
                              //console.log(dayCell+'--'+classEl[0]);
                              if(paramsRaws == null){
                                    if(classEl[0] == 'one_event')
                                       jQuery('.ify-date-'+dayCell).addClass('ify-event-disable');
                                    else
                                       if(!jQuery('.ify-date-'+dayCell).hasClass('one_event')){
                                        jQuery('.ify-date-'+dayCell).addClass('ify-event-disable');
                                       }
                              }else{
                                    if(classEl[0] == 'one_event'){
                                      jQuery('.ify-date-'+dayCell).addClass('one_event');
                                      jQuery('.ify-date-'+dayCell).removeClass('ify-event-disable');
                                    }
                              }
                              return { html: '' };
                            },
                        });
                        calendarH.render();

                    }
                });
            } //end step 1
            if (step == 2) {
                var html = '';
                html += '<div class="confirm-product" >';
                let srcImg = form.find('.ify-choose-img').val();
                if(srcImg != '' && srcImg != 'null')
                html += '<div class="prd-thumb" ><img src="' + form.find('.ify-choose-img').val() + '" title="' + form.find('.ify-choose-name').val() + '"></div>';
                html += '<div class="prd-title" >' + form.find('.ify-choose-name').val() + '</div>';
                html += '</div>';
                html += '<div class="confirm-booking" >';
                var prevDatetime = form.find('.choose-date').val() + ' ' + form.find("input[name='ify_radio_time']:checked").val();
                html += '<div class="confirm-date" ><label><i class="far fa-calendar-alt ify-icon" aria-hidden="true"></i> '+arrayLang.datetime+'</label> <span>' + moment(prevDatetime,'YYYY-MM-DD HH:mm').format(dataApps.dateFormat + ' ' + dataApps.timeFormat) + '</span></div>';
                let durationTime = form.find('.duration_input').val() + ' '+arrayLang.minutes;
                console.log(form.find('.duration_type_input').val());console.log(form.find('.duration_type_input').val() == '60');
                if(form.find('.duration_type_input').val() == '60')
                   durationTime = Number(form.find('.duration_input').val())/Number(form.find('.duration_type_input').val()) + ' '+arrayLang.hours;
                html += '<div class="confirm-duration" ><label><i class="far fa-clock ify-icon" aria-hidden="true"></i> '+arrayLang.duration+'</label> <span>'+ durationTime +'</span></div>';
                if (form.find('.option-employee select').length){
                    html += '<div class="confirm-employee" ><label><i class="far fa-user ify-icon" aria-hidden="true"></i> '+arrayLang.employee+'</label> <span>'+form.find('.option-employee select option:selected').text()+'</span></div>';
                }
                if (form.find('.option-location select').length){
                    html += '<div class="confirm-location" ><label><i class="fas fa-map-marker-alt ify-icon" aria-hidden="true"></i> '+arrayLang.location+'</label> <span>'+form.find('.option-location select option:selected').text()+'</span></div>';
                }
                html += '</div>';
                html += '<div class="confirm-total" >';
                var qty = parseInt(form.find('.ify-apm-qty').val());
                // if(dataApps.bringing_enable == 1 && form.find('.ify-bring-more').length > 0 && form.find('.switch-bringing .ify-toggle').is(":checked")){
                //     qty = 1 + parseInt(form.find('.ify-bring-more').val());
                // }
                if(form.find('.ify-bring-more').length > 0 && form.find('.switch-bringing .ify-toggle').is(":checked")){
                   var bring_more = parseInt(form.find('.ify-bring-more').val());
                   html += '<div class="total-quantity total-bring_more" ><label><i class="fas fa-user-plus"></i> Bring more</label> <span>' + bring_more + '</span></div>';
                }
                html += '<div class="total-quantity" ><label>'+arrayLang.quantity+'</label> <span>'+qty+'</span></div>';
                if(form.find('.price_hiden').length > 0 ){
                    var total_price = formatMoney(qty*(form.find('.price_hiden').val()), dataApps.money_format);
                    html += '<div class="total-price" ><label>'+arrayLang.total_price+'</label> <span>' + total_price + '</span></div>';
                }
                
                html += '</div>';
                form.find('.ify-confirm').html(html);
                form.find('.ify-step').removeClass('active');
                form.find('.ify-step-3').addClass('active');
                form.find('.ify-bnt-confirm').removeClass('ify-disable');
            }
        });
        jQuery(document).on("click", ".ify-apppintment-group .ify-bnt-confirm", function() {
            var form = jQuery(this).parent().parent().parent();
            var params = {};
            var arrJson = {};
            var properties = {};
            params.id = form.find('.ify-choose-variant').val();
            var qty = parseInt(form.find('.ify-apm-qty').val());
            var prdId = form.find('.ify_product_id_hiden').val();
            if(form.find('.ify-bring-more').length > 0 && form.find('.switch-bringing .ify-toggle').is(":checked")){
                //qty = 1 + parseInt(form.find('.ify-bring-more').val());
                arrJson.bring_more =  parseInt(form.find('.ify-bring-more').val());
            }
            params.quantity = qty;
            arrJson.variant_id = form.find('.ify-choose-variant').val();
            
            arrJson.date = form.find('.choose-date').val();
            arrJson.time = form.find("input[name='ify_radio_time']:checked").val();
            arrJson.time_zone = form.find(".timezone_input").val();
            arrJson.duration = form.find('.duration_input').val();
            arrJson.duration_type = form.find('.duration_type_input').val();

            //                   arrJson['duration'] =  form.find('.choose-date').val()+' '+form.find("input[name='ify_radio_time']:checked").val();
            //console.log(arrJson);
            //console.log(JSON.stringify(arrJson));
            
            properties = {};
            let datetimeString = form.find('.choose-date').val() + ' ' + form.find("input[name='ify_radio_time']:checked").val();
            properties[arrayLang.datetime] = moment(datetimeString,'YYYY-MM-DD HH:mm').format(dataApps.dateFormat + ' ' + dataApps.timeFormat);
            if(form.find('.duration_type_input').val() == '60'){
                properties[arrayLang.duration] = Number(form.find('.duration_input').val())/Number(form.find('.duration_type_input').val()) + ' '+arrayLang.hours;
            }
            else{
                properties[arrayLang.duration] = form.find('.duration_input').val() + ' ' + arrayLang.minutes;
            }
                // '_ify_params_json': JSON.stringify(arrJson),
            if (form.find('.option-employee select').length){
                arrJson.employee_id = form.find('.option-employee select').val();
                properties[arrayLang.employee] = form.find('.option-employee select option:selected').text();
            }
            if (form.find('.option-location select').length){
                arrJson.location_id = form.find('.option-location select').val();
                properties[arrayLang.location] = form.find('.option-location select option:selected').text();
            }

            if(jQuery(this).hasClass('ify-has-custom-request')){
                let validations = {};let rule = {}; let mes = {};
                let id = form.find("input[name='form_id']").val();
                if(typeof appointment_ifyValidate !== 'undefined'){
                 validations = appointment_ifyValidate;
                 if(typeof validations[id].rules !== 'undefined')
                    rule = validations[id].rules;
                 if(typeof validations[id].mes !== 'undefined'){
                    //mes = validations[id].mes;
                    jQuery.each( validations[id].mes, function( key, value ) {
                      var itemMes = {};
                      jQuery.each( value, function( k, l ) {
                        itemMes[k] = jQuery.validator.format(l);
                      });
                      mes[key] = itemMes;
                    });
                 }
                }
                form.validate({
                    ignore: '.storeify-hide .storeify-input-control,.storeify-hide input',
                    rules:rule,
                    messages:mes,
                });
                let checkValid = form.valid();
                if(checkValid){
                    form.addClass('ify-loading');
                    let serializeArray = jQuery('.ify-appointment-customrequest-form-'+id+' .ify-appointment-input').serializeArray();
                    if(!jQuery(this).hasClass('ify-free-service')){
                        arrJson.form_id = id;
                        arrJson.request_custom = serializeArray;
                        if(dataApps.show_question == 1){
			                form.find('.ify-custom-request-form .storeify-div-input').each(function(i) {
			                	let labelAs = jQuery(this).attr("data-label");
			                	if(!labelAs) labelAs = 'Custom question '+ (i+1);
			                	if(jQuery(this).hasClass('storeify-div-input-type-checkbox') || jQuery(this).hasClass('storeify-div-input-type-radio')){
			                		let add_ons = [];
							        jQuery(this).find(".ify-appointment-input:checked").each(function(){ 
							            add_ons.push(jQuery(this).val());
							        });
							        properties[labelAs] = add_ons.join(',');
			                	}else{
			                		properties[labelAs] = jQuery(this).find('.ify-appointment-input').val();
			                	}
					        	
					    	});
					    }
                    }else{
                        params.shopify_domain = form.find("input[name='domain']").val();
                        params.product_id = prdId;
                        params.form_id = id;
                        params.serialize = serializeArray;
                        properties['_ify_params_json'] = JSON.stringify(arrJson);
                        params.properties = properties;
                        addserviceFree(app_url,form,params,arrayLang);
                        return false;
                    }
                }else{
                    return false;
                }    
            }
            properties['_ify_params_json'] = JSON.stringify(arrJson);
            params.properties = properties;
            if(jQuery(this).hasClass('ify-free-service') && !jQuery(this).hasClass('ify-has-custom-request')){
                params.shopify_domain = form.find("input[name='domain']").val();
                params.product_id = prdId;
                params.customer = {};
                if(!jQuery(this).hasClass('ify-has-custom-request')){
                    var checkValid = form.valid();
                    if(checkValid){
                        form.addClass('ify-loading');
                        if(form.find('#ify_apppintment_first_name').length > 0){
                            params.customer.first_name  = form.find('#ify_apppintment_first_name').val();
                        }
                        if(form.find('#ify_apppintment_last_name').length > 0){
                            params.customer.last_name  = form.find('#ify_apppintment_last_name').val();
                        }
                        if(form.find('#ify_apppintment_email').length > 0){
                            params.customer.email  = form.find('#ify_apppintment_email').val();
                        }
                        if(form.find('#ify_apppintment_phone').length > 0){
                            params.customer.phone  = form.find('#ify_apppintment_phone').val();
                        }
                        if(form.find('#ify_apppintment_address').length > 0){
                            params.customer.address  = form.find('#ify_apppintment_address').val();
                        }
                        addserviceFree(app_url,form,params,arrayLang);
                    }
                }else{

                }
                return false;
            }
            //console.log(params.properties);
            //params.properties.push( {'_ify_data_json': [{"value":"24968","name":"shopId"},{"value":"60 minutes","name":"duration","label":"Duration"},{"value":"2021-08-19 02:00","name":"datetime","label":"Date Time"},{"value":"Medium","name":"option1","label":"option1"},{"value":"","name":"option2","label":"option2"},{"value":"","name":"option3","label":"option3"},{"value":"29786","name":"locationId","label":"Location"},{"value":"33286","name":"employeeId","label":"Employee"},{"value":"2021-08-19","name":"date"},{"value":"02:00","name":"time"},{"value":"5992821063843","name":"productId","label":"Service"},{"value":"Atmos Helmet","name":"productTitle"},{"value":"37475804872867","name":"variantId"}]} );

            //params.properties[_tipo_booking_json]: [{"value":"24968","name":"shopId"},{"value":"60 minutes","name":"duration","label":"Duration"},{"value":"2021-08-19 02:00","name":"datetime","label":"Date Time"},{"value":"Medium","name":"option1","label":"option1"},{"value":"","name":"option2","label":"option2"},{"value":"","name":"option3","label":"option3"},{"value":"29786","name":"locationId","label":"Location"},{"value":"33286","name":"employeeId","label":"Employee"},{"value":"2021-08-19","name":"date"},{"value":"02:00","name":"time"},{"value":"5992821063843","name":"productId","label":"Service"},{"value":"Atmos Helmet","name":"productTitle"},{"value":"37475804872867","name":"variantId"}];
            //console.log(params);return true;
            if ((typeof dataApps.callbackAddtocard) === 'function') {
                addtocard(params,dataApps.redirect,dataApps.callbackAddtocard);
            } else {
                addtocard(params,dataApps.redirect);
            }
        });
        jQuery(document).on('change', '.ify-calendar-time input[type="radio"]', function() {
            jQuery('.ify-bnt-continue-2').removeClass('ify-disable');
        })
        jQuery(document).on('click', '.button-print', function(e) {
        	e.preventDefault();
	        var contents = jQuery(".ify-apppintment-group .ify-confirm").html();
	        var frame1 = jQuery('<iframe />');
	        frame1[0].name = "frame1";
	        frame1.css({ "position": "absolute", "top": "-1000000px" });
	        jQuery("body").append(frame1);
	        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
	        frameDoc.document.open();
	        //Create a new HTML document.
	        frameDoc.document.write('<html><head><title>Booking Form</title>');
	        var style = '<style>';
	        style += 'body{text-align:center;}';
	        style += '.confirm-success{display:none}';
	        style += '.confirm-product{display:block;width:100%;text-align: center;padding-bottom: 15px;}';
	        style += '.prd-thumb{position: relative;display: inline-block;overflow: hidden;width: 120px;background: #fff;border: 0.1rem solid #e1e3e5;border-radius: 10px}';
	        style += '.prd-thumb img{position: absolute;top: 0;right: 0;bottom: 0;left: 0;margin: auto;max-width: 100%;max-height: 100%;}';
	        style += '.prd-thumb:after {content: "";display: block;padding-bottom: 100%;}';
	        style += '.prd-title{font-size: 15px;font-weight: 600;padding:15px 0 20px 0}';
	        style += '.confirm-booking,.confirm-total{flex-direction: column;align-items: flex-start;display: flex;justify-content: space-between;font-size: 14px;width:500px;margin:0 auto;}';
	        style += '.confirm-booking > div,.confirm-total > div{width: 100%;margin-bottom: 5px;padding-bottom: 5px;display: flex;justify-content: space-between;}';
	        style += '.confirm-booking label,.confirm-total label{display: inline-block;margin-right: 2px;font-weight: 600;}';
	        style += '</style>';
	        frameDoc.document.write(style);
	        frameDoc.document.write('</head><body>');
	        frameDoc.document.write(contents);
	        frameDoc.document.write('</body></html>');
	        frameDoc.document.close();
	        setTimeout(function () {
	            window.frames["frame1"].focus();
	            window.frames["frame1"].print();
	            frame1.remove();
	        }, 500);
	    });
	    //js 2
        jQuery(document).on('change', '.switch-bringing .ify-toggle', function() {
            if(this.checked) {
              jQuery('.input-bringing').show();
            }else{
              jQuery('.input-bringing').hide();
              jQuery('.ify-bring-more').val(0);
              jQuery('.input-bringing').removeClass('error');
              jQuery('.switch-bringing').parent().find('.ify-bnt-continue').attr("disabled", false);
            }
        });
        jQuery(document).on("change", ".ify-apppintment-group .option-employee select", function() {
             let limit = jQuery(this).find(':selected').attr('data-limit');
             
             let parent = jQuery(this).parent().parent();
             if(limit == 1){
                parent.find('.switch-bringing').hide();
                parent.find('.input-bringing').hide();
                parent.find('.input-bringing input.ify-bring-more').val(0);
                parent.find('.switch-bringing input').prop('checked', false);
             }else{
                parent.find('.switch-bringing').show();
             }
             
        });
        jQuery(document).on('keypress keyup blur', '.ify-apm-qty', function(event) {
            let val = Number(jQuery(this).val());
            let valMore = Number(jQuery('.ify-bring-more').val());
            if(Number.isInteger(val) && val > 0 && jQuery('input[name=bringing_enable]:checked')){
                let max = val*jQuery('.ify-bring-more').data('default');
                let bringLabel = arrayLang.bringing_label.replace("{number}", max);
                jQuery('.ify-bring-more').attr("data-max",max);
                jQuery('.input-bringing label').text(bringLabel);
                if(valMore > max){
                  jQuery(this).parent().addClass('error');
                  jQuery(this).parent().parent().find('.ify-bnt-continue').attr("disabled", true);
                }else{
                  jQuery(this).parent().removeClass('error');
                  jQuery(this).parent().parent().find('.ify-bnt-continue').attr("disabled", false);
                }
                    //jQuery('.ify-bring-more').val(max);
            }else{
                jQuery('.ify-bring-more').attr("data-max",0);
                jQuery('.ify-bring-more').val(0);
            }
            jQuery(this).val(jQuery(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });
        jQuery(document).on('keypress keyup blur', '.ify-bring-more', function(event) {
            if( (jQuery(this).data('max') < jQuery(this).val() || jQuery(this).val() < 0) && jQuery('input[name=bringing_enable]:checked') ){
                //jQuery(this).val(jQuery(this).data('max'));
                jQuery(this).parent().addClass('error');
                jQuery(this).parent().parent().find('.ify-bnt-continue').attr("disabled", true);
                event.preventDefault();
            }else{
                jQuery(this).parent().removeClass('error');
                jQuery(this).parent().parent().find('.ify-bnt-continue').attr("disabled", false);
            }
            jQuery(this).val(jQuery(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });
    }; //end storeifyappsJavaScript
    if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) {

        loadScript('//code.jquery.com/jquery-1.11.1.min.js', function() {

            storeifyAPPS = jQuery.noConflict(true);

            storeifyAPPS(document).ready(function() {

                storeifyappsJavaScript(storeifyAPPS);

            });

        });

    } else {

        storeifyappsJavaScript(jQuery);

    }

})(); //end storeify