window.addEventListener('load', () => {
    $("form.signup-form").submit((event) => {
        event.preventDefault();
        const formData = {
            "email": $("input#email").val(),
            "enteredOtp": $("input#otp").val(),
        };
        $.ajax({
            type: "POST",
            url: "/user/verifyotp",
            data: formData,
            encode: true,
            success: (response) => {
                if (response.success === true) {
                    window.location.assign('/user/login');
                } else {
                    $("div.messages").show();
                    showSignupError(response);
                }
            },
            error: (err) => {
                console.log(err);
                showSignupError(err);
            }
        });
    });

    $("#resendotp").on('click', function (){
        event.preventDefault();
        const formData = {
            "email": $("input#email").val(),
        };
        $.ajax({
            type: "POST",
            url: "/user/sendotp",
            data: formData,
            encode: true,
            success: (response) => {
                console.log("Otp Send Successfully");
            },
            error: (err) => {
                console.log("Try Again Later");
                console.log(err);
                showSignupError(err);
            }
        });
    })

    const showSignupError = (response) => {
        const messageListItem = $("li#message");
        const msg = (response.message ? response.message 
                : "Sorry, couldn't create your account");
        $("div.messages").show();
        messageListItem.empty();
        messageListItem.text(msg);
    };
});
