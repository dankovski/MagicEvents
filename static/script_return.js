function return_ticket(){
    const login = document.getElementById("input_login");
    const password = document.getElementById("input_password");
    const code = document.getElementById("input_code");
 
    
    if(login.value==""){
        alert("Login can't be empty");
    }
    else if(password.value==""){
        alert("Password can't be empty");
    }
    else if(code.value==""){
        alert("Code can't be empty");
    }
    else{
    
    var data={
    login: login.value,
    password: password.value, 
    code: code.value
    }
    
        $.ajax("http://127.0.0.1:5000/return_ticket", {
            type: 'POST', 
            dataType: 'text',
            crossDomain: true,
            cache: false,
            data: data,
            success: function(response, status, xhr) {
                alert(response);
    
            },
            error: function (ajaxContext) {
                console.log("Error while getting data from server");
            },
            
        });
    

    }
    
    
    }