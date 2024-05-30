window.addEventListener('load', () => {
    $("form.login").submit((event) => {
        event.preventDefault();
        const formData = {
            "email": $("input#email-login").val(),
            "password": $("input#password-login").val()
        };
        $.ajax({
            type: "POST",
            url: "/user/login",
            "data": formData,
            "encode": true,
            success: (response) => {
                console.log(response);
                if (response.success === true) {
                    window.location.assign("/");
                } else {
                    showLoginError();
                }
            },
            error: (err) => {
                if(err.responseJSON.status=="registeragain"){
                    window.location.assign("/user/verifyotp?email="+$("input#email-login").val())
                }
                console.log(err);
                showLoginError();
            }
        });
    });
    const showLoginError = () => {
        const messageListItem = $("li#message");
        $("div.messages").show();
        messageListItem.empty();
        messageListItem.text("Login failed, please try again");
    };
});
