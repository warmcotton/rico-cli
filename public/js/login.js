const rest = "http://192.168.219.108:5050";
const loginRouter = "/login";

$(document).ready(function() {
    $("#loginButton").on("click", function() {
        const email = $('#email').val();
        const password = $('#password').val();

        if (email === "" || password === "") alert("email, password 확인");
        else submitLogin(rest+loginRouter, {email:email, password:password}); 
    })

    console.log($('#path').val()); // /item?itemid=22

});

function submitLogin(path, params) {
    $.ajax({
        type: 'POST',
        url: path,
        contentType: 'application/json',
        data: JSON.stringify(params), 
        success: function(data, status, xhr) {
            const accessToken = xhr.getResponseHeader('accessToken');
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                location.href=location.origin+$('#path').val();
            } else {
                alert("accessToken null")
            }
            
        },
        error: function(xhr, status, error) {
            alert("error : "+xhr.status+"  "+xhr.responseText );
        }
    });
}
