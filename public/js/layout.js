window.addEventListener('load', () => {
    const logoutA = $("a#user-logout");
    const createDocA = $("a#create-doc");

    if (Cookies.get('token')) {
        // If the token cookie exists, show authenticated links
        $('#user-logout-li,#user-account-li,#user-docs-li,#create-doc-li').show();
        $('#user-login-li,#user-register-li').hide();
    } else {
        // If the token cookie doesn't exist, show login and signup links
        $('#user-logout-li,#user-account-li,#user-docs-li,#create-doc-li').hide();
        $('#user-login-li,#user-register-li').show();
    }
    
    // Log user out
    logoutA.on('click', (event) => {
        event.preventDefault();
        $.ajax({
            type: "GET",
            url: '/user/logout',
            encode: true,
            success: (res) => {
                if (res.success) {
                    window.location.assign('/user/login');
                } else {
                    console.log(res);
                }
            },
            error: (err) => console.log(err)
        });
    });

    // Create new doc, assign session user as owner
    createDocA.on('click', (event) => {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: '/api/documents/create',
            encode: true,
            success: (res) => {
                if (res.success) {
                    window.location.assign('/documents/' + res.data._id);
                } else {
                    console.log(res);
                }
            },
            error: (err) => console.log(err)
        });
    });
});