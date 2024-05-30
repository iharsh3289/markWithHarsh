window.addEventListener('load', () => {
    $("form.signup-form").submit((event) => {
        event.preventDefault();
        const formData = {
            "fName": $("input#first-name").val(),
            "lName": $("input#last-name").val(),
            "email": $("input#email").val(),
            "phoneNumber": $("input#phoneNumber").val(),
            "password": $("input#password").val()
        };
        $.ajax({
            type: "POST",
            url: "/user/register",
            data: formData,
            encode: true,
            success: (response) => {
                if (response.success === true) {
                    const formData = {
                        "email": $("input#email").val()
                    }

                    $.ajax({
                        type: "POST",
                        url: "/user/sendotp",
                        data: formData,
                        encode: true,
                        success: (response) => {
                            if (response.success == true) {
                                var url1 = '/user/verifyotp?' + $.param({
                                    email: $("input#email").val(),
                                });
                                console.log(url1);
                                window.location.assign(url1);
                            } else {
                                window.location.assign('/user/login');
                            }
                        },
                        error: (err) => {
                            console.log(err);
                            window.location.assign('/user/login');
                        }
                    });
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
    const showSignupError = (response) => {
        const messageListItem = $("li#message");
        const msg = (response.message ? response.message 
                : "Sorry, couldn't create your account");
        $("div.messages").show();
        messageListItem.empty();
        messageListItem.text(msg);
    };
});
