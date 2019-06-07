

//== Authentication Front-End ==================================================

//-- Project Constants ---------------------------
const URL_AUTH_REGISTER = '/auth/register';
const URL_AUTH_LOGIN    = '/auth/login';
const URL_AUTH_LOGOUT   = '/auth/logout';

//------------------------------------------------
let auth;
export default auth = {
    async register(username, password) {
        // Send registration request to server, retrieve response
        const registerData = {username, password};
        let response = await fetch(URL_AUTH_REGISTER, {
            method: 'POST',
            cache: 'no-cache',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        });
        const replyData = await response.json();
        // Check for failed registration
        if (response.status != 201) {
            alert("Herped a Derp. Continue?");
            return;
        }
        // Store token in local storage
        console.log(response.status);
        console.log(replyData);
    }
}

//------------------------------------------------
let authForm = document.getElementById("auth_register");
if (authForm) {
    authForm.onsubmit = function (eventSubmit) {
        eventSubmit.preventDefault();
        const registerData = new FormData(authForm);
        auth.register(
            registerData.get('username'),
            registerData.get('password'),
        );
    };
}
