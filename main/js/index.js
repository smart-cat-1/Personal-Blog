const getCodeBtn = document.querySelector('.get-code-btn');
let countdown = 60;
let timer = null;

getCodeBtn.addEventListener('click', () => {
    if (timer) return;

    // 这里可以加手机号校验逻辑
    getCodeBtn.disabled = true;
    getCodeBtn.textContent = `Resend in ${countdown}s`;

    timer = setInterval(() => {
        countdown--;
        getCodeBtn.textContent = `Resend in ${countdown}s`;
        if (countdown <= 0) {
            clearInterval(timer);
            timer = null;
            countdown = 60;
            getCodeBtn.textContent = 'get the code';
            getCodeBtn.disabled = false;
        }
    }, 1000);
});