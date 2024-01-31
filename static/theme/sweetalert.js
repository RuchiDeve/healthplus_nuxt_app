(function(){
    let loading;
    let activityMessageText = 'Working...';

    window.App = Object.assign(window.App || {}, {
        sweetAlert: {
            setActivityMessageText(text = 'Working...'){
                activityMessageText = text;
            }
        }
    });


    const Toast = window.Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    const Alert = window.Swal.mixin({
        allowOutsideClick: false,
        allowEscapeKey: false,
    });

    const ConfirmModal = window.Swal.mixin({
        showConfirmButton: true,
        showCancelButton: true,
    })

    window.App.sweetAlert = Object.assign(window.App.sweetAlert, {
        alert(title, content, icon, showConfirmButton = false){
            return Alert.fire({
                title: title,
                icon: icon,
                html: content,
                showConfirmButton: showConfirmButton,
            });
        },
        toast(message, type = 'info'){
            return Toast.fire({
                icon: type,
                html: message
            })
        },
        activityAlert(text){
            let loading_anim = '<div class="progress-circle-indeterminate" data-color="primary"></div>';
            return this.alert(loading_anim, '<p class="text-center text-info">' + text + '</p>');
        },

        confirmModal(message, title = 'Are you sure?', type = 'question'){
            return ConfirmModal.fire({
                icon: type,
                html: message,
                title: title,
            })
        },

    });


}());