
window.App = {
    baseComponent: {
        selectedAll: false,
        selected: [],
        toggleSelectAll(selected_all){
            var checkBoxes = document.querySelectorAll('input[type=checkbox].records');

            for (var i = 0; i < checkBoxes.length; i++) {
                var chkBox = checkBoxes[i];
                if(chkBox.checked === selected_all){

                } else {
                    $(chkBox).trigger('click');
                }
            }
        },
        readFile(event, saveTo) {
            var input = event.target;

            if (input.files && input.files[0]) {
                var reader = new FileReader();
                var data = this;

                reader.onload = function (e) {
                    console.log('reader.onload', e);
                    data[saveTo] = e.target.result;
                };

                reader.readAsDataURL(input.files[0]);
            }
        },
    },
    buildValidationErrorNotifications(notification){
        var errors = notification.errors;

        if(!_.keys(errors).length) return;

        var error_message = '<h6>' + notification.title + '</h6>';

        error_message += '<ul class="">';

        errors.forEach((error)=>{
            error_message += '<li class="">';
            error_message += '(' + error.field + ') ' + error.defaultMessage;
            error_message += '</li>';
        });

        error_message += '</ul>';

        window.App.sweetAlert.alert("Error", error_message, "error", true);

    },
    buildNotification(notification){
        var message = '<h6>' + notification.title + '</h6>';

        this.toastNotification("Attention!", message, "info");
    },
    buildErrorNotification(notification){
        var message = '<h6>' + notification.title + '</h6>';

        this.toastNotification("Error!", message, "error");
    },
    toastNotification(title, body, type) {
        'use strict';
        window.$.toast({
            heading: title,
            text: body,
            position: 'top-center',
            icon: type,
            stack: true,
            loaderBg: '#f96868'
        })
    },
    initClipboard(){
        if (window.ClipboardJS !== undefined){
            new window.ClipboardJS('.btn-clipboard');
        }
    },
    initAjaxForm(){
        const $this = this;

        let token = document.head.querySelector('meta[name="csrf-token"]');

        if (token) {
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
        } else {
            console.error('CSRF token not found');
        }

        $("form[data-submit-ajax]").on("submit", function(event){
            event.preventDefault();

            var form = this;
            var payload= $(form).serialize();
            var url = $(this).attr('action');

            window.axios.post(url, payload).then(function(response){
                $this.dispatcher('post-response', response);
                form.reset();
            });

        });
    },
    initWebsocket(){
        const $this = this;

        window.App.socket.subscribe('/user/me', function (response) {
            const result = JSON.parse(response.body);
            console.log('websocket', result);

            $this.dispatcher(result.event, result.payload);

        });
    },
    initToolTip(){
        /* Code for attribute data-custom-class for adding custom class to tooltip */
        if (typeof $.fn.tooltip.Constructor === 'undefined') {
            throw new Error('Bootstrap Tooltip must be included first!');
        }

        var Tooltip = $.fn.tooltip.Constructor;

        // add customClass option to Bootstrap Tooltip
        $.extend(Tooltip.Default, {
            customClass: ''
        });

        var _show = Tooltip.prototype.show;

        Tooltip.prototype.show = function() {

            // invoke parent method
            _show.apply(this, Array.prototype.slice.apply(arguments));

            if (this.config.customClass) {
                var tip = this.getTipElement();
                $(tip).addClass(this.config.customClass);
            }

        };
        $('[data-toggle="tooltip"]').tooltip();
    },
    dispatcher: null,
    init($dispatch){
        this.dispatcher = $dispatch;

        this.dispatcher('ready', this);

        this.initWebsocket();

        this.initAjaxForm();

        this.initClipboard();

    },
};