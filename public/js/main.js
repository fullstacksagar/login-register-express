$('form').validate({
    rules: {
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        phone: {
            required: true,
            number: true,
            minlength:10
        },
        password: {
            required: true,
            minlength: 6
        },
        cpassword: {
            required: true,
            equalTo: '#password'
        }
    },
    highlight: function(element) {
        $(element).closest('.input-group').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.input-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});
