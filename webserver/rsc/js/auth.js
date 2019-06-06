

//== Authentication Front-End ==================================================

//-- Project Constants ---------------------------
const URL_AUTH_REGISTER = '/auth/register';
const URL_AUTH_LOGIN    = '/auth/login';
const URL_AUTH_LOGOUT   = '/auth/logout';

//------------------------------------------------
export default auth;
const auth = {
    async register(username, password) {
        const response = await fetch(URL_AUTH_REGISTER, {
            method: 'POST',
            cache: 'no-cache',
            redirect: 'manual',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const replyData = response.json();
        console.log(replyData);
    }
}
