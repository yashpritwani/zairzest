$(document).ready(function() {

  function validate(id,res) {
    setTimeout(function () {
      $(`#${id}`).removeClass("onclic");
      console.log(res);
      if (res.status == 'success') {
        $(`#${id}`).addClass("validate-success", 450, callback(id,res));
      } else {
        $(`#${id}`).addClass("validate-fail", 450, callback(id,res));
      }
    }, 2250);
  }
  
  function callback(id, res) {
    if (res.status == 'success') {
      if(id=="unreg-btn"){
        $("#unreg-btn").hide();
      }else{
        $("#join-team-form").hide();
        $("#create-team-form").hide();
        $("#teamreg-btn").hide();
        $("#joinreg-btn").hide();
        $("#unreg-btn").show();
      }
      let msg = id == "create-team-btn" ? "Team Created Successfully" : id == "join-team-btn" ? "Team Joined Successfully" : "Unregistred Successfully";
      showToast(200, msg);
      $(`#${id}`).removeClass("validate-success");
      toggleModal();
    } else {
      showToast(res.responseJSON.errorCode, res.responseJSON.message || "Sorry, There seems to be a problem at our end");
      $(`#${id}`).removeClass("validate-fail");
    }
        
  }
  
    const overlay = document.querySelector('.modal-overlay')
    overlay.addEventListener('click', toggleModal)
    
    var closemodal = document.querySelectorAll('.modal-close')
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener('click', toggleModal)
    }
    
    document.onkeydown = function(evt) {
      evt = evt || window.event
      var isEscape = false
      if ("key" in evt) {
    	isEscape = (evt.key === "Escape" || evt.key === "Esc")
      } else {
    	isEscape = (evt.keyCode === 27)
      }
      if (isEscape && document.body.classList.contains('modal-active')) {
    	toggleModal()
      }
    };
    
    
    function toggleModal () {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.toggle('opacity-0')
      modal.classList.toggle('pointer-events-none')
      body.classList.toggle('modal-active');
      modal.classList.toggle("mod--show");
      if(!($("body").hasClass("modal-active"))){
        $("#teamreg-btn").hide();
        $("#joinreg-btn").hide();
        $("#unreg-btn").hide();
        $("#singlereg-btn").hide();
        $("#mod__title").text("Loading...");
        $("#mod__desc").text("");
        $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading... " );
        $(`#mod_team-details`).text("");
        $("#join-team-form").hide();
        $("#create-team-form").hide();
      }
    }
    $(".modal-open").click(function(event) {
      window.currentItem = $(event.target).parent();
      // console.log("clicked", currentItem);
      toggleModal();
      var mod = document.querySelector(".modal");
      if ($("body").hasClass("modal-active")) {
        $("#spinner-id").show();
        let eventID = $(currentItem).attr("data-id")
        mod.eventID = eventID;
        let coverURL = $(currentItem).attr("data-image");
        let title = $(currentItem).attr("data-title");
        let desc = $(currentItem).attr('data-desc');
        let date_time = $(currentItem).attr('data-date_time');
        let max_participants = $(currentItem).attr('data-max_participants');
        let isListed = $(currentItem).attr('data-isListed');

        $("#mod__form_desc").hide();
      
        $("#mod__cover").attr("src", "/image/eventcomingsoon.jpeg");
  
        // Check if the user is already registered for the event
        // and set the function of the button as required

        if(isListed == "true"){
          $("#loader").show();
          fetch(`/getRegistrationData/${eventID}`).then(function(res) {
            if (res.ok) {
            return res.json();
            } else {
              return { registered: false };
            }
          }).then(function(message) {
            console.log(message);
            $("#loader").hide();
            if (message.data.registered == true) {
              // Make the button into a Unregister button
              if(max_participants != "1"){
                var insertHTML = "<h1 class='text-black-800 lg:text-xl text-lg'>Team Leader must share <b> Team Code/Id</b> with their respective Team members.Futher Information will be notified through Mail </h1>";
                insertHTML += `<h1 class='text-black-800 lg:text-xl text-lg' ><strong>Team Id : ${message.data.team_id}</strong><br>`;
                insertHTML += `<strong>Team Name : ${message.data.team_name}</strong><br><h1>` ;
                insertHTML += `<ol><strong>Team Members :</strong>` ;
                message.data.members.forEach(element => {
                  insertHTML += `<li>${element} <li>`;  
                });
                insertHTML += `</ol>`;
                // console.log(message.data.team_extra_data && message.data.extra_data.length != 0);
                if(message.data.team_extra_data && message.data.team_extra_data.length != 0){
                  insertHTML += `<ol><strong>Extra Details : </strong>`;
                  Object.keys(message.data.team_extra_data).forEach(function(key,index) {
                    insertHTML += `<li>${key} : ${message.data.team_extra_data[key]} <li>`; 
                  });
                  insertHTML += `</ol>`;
                }
                $(`#mod_team-details`).html(insertHTML);
              }              
              $("#unreg-btn").show();
            } else {
              console.log(max_participants);
              if(moment(Date.now()).isAfter(moment(date_time))){
                if(max_participants == "1"){
                  $("#singlereg-btn").show();
                }else{
                  $("#teamreg-btn").show();
                  $("#joinreg-btn").show();
                }
              }else{
                var insertHTML = "<h1 class='text-black-800 lg:text-xl text-lg mx-auto'>Registration Time is now <b> Over.</b></h1>";
                $(`#mod_team-details`).html(insertHTML);
              }
            }
          });
        }
  
        // Add a cover image, title and description to the modal
        $("#mod__cover").attr("src", coverURL);
        $("#mod__title").text(title);
        $("#mod__desc").text(desc);
        $("#mod__date_time_venue").html(`<strong>Date & Time :</strong> ${date_time} IST`);
        $("#spinner").hide();
        
        $("#teamreg-btn").click(function(){
          $("#teamreg-btn").hide();
          $("#joinreg-btn").hide();
          $("#create-team-form").show();
        });

        $("#joinreg-btn").click(function(){
          $("#teamreg-btn").hide();
          $("#joinreg-btn").hide();
          $("#join-team-form").show();
        });

        function validateMeetURL(meetURL) {
          const re = /^(https?:\/\/)?meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
          return re.test(String(meetURL).toLowerCase());
        }

        $("#create-team-btn").click(function(){

          if(!moment(Date.now()).isAfter(moment(date_time))){
            var meetURL = $("#create-meeting-url").val(); 
            var teamName = $("#create-team-name").val();          
            if(teamName === ""){
              showToast(400,"Team Name Should not be empty");
            }else if(!validateMeetURL(meetURL)){
              showToast(400,"Team Meet URL is not in correct format");
            }else{
              $(`#create-team-btn`).addClass("onclic", 50);
              const data = {
                eventID:eventID,
                team_name: teamName,
                team_extra_data:{
                  "meetURL": meetURL,
                }
              };
              
              $.ajax({
                type: "POST",
                url: `/registerForEvent/${eventID}`,
                data: data,
                dataType: "json",
              })
                .done(function (data) {
                  validate("create-team-btn",data);
                  
                })
                .fail(function (err) {
                  validate("create-team-btn",err);
                });
            }
          }else{
            showToast(400,"Registration Time is Over.");

          }
        });
        $("#join-team-btn").click(function(){

          var team_id = $("#join-team-code").val();          
          if(moment(Date.now()).isAfter(moment(date_time))){
              showToast(400,"Registration Time is Over.");
          }
          else if(team_id === ""){
            showToast(400,"Team Name Should not be empty");
          }else{
            $(`#create-team-btn`).addClass("onclic", 50);
            const data = {
              eventID:eventID,
              team_id: team_id,
            };
            $.ajax({
              type: "POST",
              url: `/registerForEvent/${eventID}`,
              data: data,
              dataType: "json",
            })
              .done(function (data) {
                validate("join-team-btn",data);
              })
              .fail(function (err) {
                validate("join-team-btn",err);
              });
          }
        });
        $("#unreg-btn").click(function(){

     
            $(`#unreg-btn`).addClass("onclic", 50);
            $.ajax({
              type: "POST",
              url: `/deregisterForEvent/${eventID}`,
              dataType: "json",
            })
              .done(function (data) {
                console.log(data);
                validate("unreg-btn",data);
              })
              .fail(function (err) {
                validate("unreg-btn",err);
              });
          
        });



        } else {
        // When the modal closes, remove both classes and hide the button
  
        // Empty the title and description
        $("#mod__title").text("Loading...");
        $("#mod__desc").text("");
        $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading... " );
      }
    });
    

  });