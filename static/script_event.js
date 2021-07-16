function show(id){

    const div_information = document.getElementById("div_information");


    if(id!=0){
    $.ajax("http://127.0.0.1:5000/get_event/"+id, {
        type: 'GET', 
        dataType: 'json',
        crossDomain: true,
        cache: false,
        success: function(responseJSON, status, xhr) {
    
            for(let i = 0; i<responseJSON.length; i++){
    
                let event_view = document.createElement('div');
                event_view.classList.add('event_view');
                let image_event = document.createElement('img');
                image_event.classList.add('event_image');
                image_event.src = "/static/photos/"+responseJSON[i][1]+".jpg";
                event_view.appendChild(image_event);
    
                let div_event_name = document.createElement('div');
                div_event_name.classList.add('div_event_name');
                let event_name = document.createElement('b');
                event_name.classList.add('event_name');
                event_name.innerText = responseJSON[i][0];
                div_event_name.appendChild(event_name);
                event_view.appendChild(div_event_name);
    
                let div_event_start_date = document.createElement('div');
                div_event_start_date.classList.add('div_event_information');
                let event_start_date = document.createElement('b');
                event_start_date.classList.add('event_information');
                event_start_date.innerText = "Start date:  "+responseJSON[i][4];
                div_event_start_date.appendChild(event_start_date);
                event_view.appendChild(div_event_start_date);
    
                let div_event_end_date = document.createElement('div');
                div_event_end_date.classList.add('div_event_information');
                let event_end_date = document.createElement('b');
                event_end_date.classList.add('event_information');
                event_end_date.innerText = "End date:  "+responseJSON[i][5];
                div_event_end_date.appendChild(event_end_date);
                event_view.appendChild(div_event_end_date);
    
    
                let div_event_city_name = document.createElement('div');
                div_event_city_name.classList.add('div_event_information');
                let event_city_name = document.createElement('b');
                event_city_name.classList.add('event_information');
                event_city_name.innerText = "City:  "+responseJSON[i][2];
                div_event_city_name.appendChild(event_city_name);
                event_view.appendChild(div_event_city_name);
    
                let div_event_place_name = document.createElement('div');
                div_event_place_name.classList.add('div_event_information');
                let event_place_name = document.createElement('b');
                event_place_name.classList.add('event_information');
                event_place_name.innerText = "Place:  "+responseJSON[i][3];
                div_event_place_name.appendChild(event_place_name);
                event_view.appendChild(div_event_place_name);
    
                let div_event_type_name = document.createElement('div');
                div_event_type_name.classList.add('div_event_information');
                let event_type_name = document.createElement('b');
                event_type_name.classList.add('event_information');
                event_type_name.innerText = "Type:  "+responseJSON[i][6];
                div_event_type_name.appendChild(event_type_name);
                event_view.appendChild(div_event_type_name);
    
                div_information.appendChild(event_view); 
    
                const login_window = document.getElementById("id_login_window");
                login_window.style.display = "block";
    
    
            }
    
        },
        error: function (ajaxContext) {
            console.log("Error while getting data from server");
        },
        
    });
    }
    
    else{
    alert("Can't find event");
    }
    
    
    }
    
    
    
    function submit(event_id){
    const login = document.getElementById("input_login");
    const password = document.getElementById("input_password");
    const code = document.getElementById("code");
    
    code.innerText="";
    
    if(login.value==""){
        alert("Login can't be empty");
    }
    else if(password.value==""){
        alert("Password can't be empty");
    }
    else{
    
    var data={
    login: login.value,
    password: password.value, 
    id_event: event_id
    }
    
    
        $.ajax("http://127.0.0.1:5000/submit", {
            type: 'POST', 
            dataType: 'text',
            crossDomain: true,
            cache: false,
            data: data,
            success: function(response, status, xhr) {
                console.log(response);
    
                if(response=="0"){
                    alert("Invalid password");
                }
                else if(response == "1"){
                    alert("Ticket already exists");
                }
                else{
                    code.innerText="Your code: "+response;
                    //alert("Your code: "+ response); 
                }
    
        
            },
            error: function (ajaxContext) {
                console.log("Error while getting data from server");
            },
            
        });
    
    
    }
    
    
    }