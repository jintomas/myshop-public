ubsApp.getAddPlayerTemplate=function(templateConfig,tempVar){
	var object={};
	templateConfig=$.extend(templateConfig,object);
	templateConfig.studentList = $.extend(ubsApp.studentArray,[]);
	templateConfig.isStudentAdded = ubsApp.studentArray.length > 0 ? true : false;
	tempVar.html+=ubsAddPlayerTemplate(templateConfig);

}
ubsApp.student = {}
ubsApp.studentIdSuffix = "ubs"
ubsApp.openAddPlayerTemplate = function(){

	ubsApp.startCurrentScenario();
	ubsApp.renderPageByName("addPlayerPage");
}


ubsApp.addNewPlayer = function() {
    $("#addPlayerValidationMessage").empty();
    let playerName = $("#playerNameInput").val();
    let playerAge = $("#playerAge").val();
    let gender = $("#playerGender").val();
    let org = $("#playerOrg").val()
    let message = "";

    if(!playerName) {
        message = ubsApp.getTranslation("ENTER_PLAYER_NAME");
    } else if(!playerAge) {
        message = ubsApp.getTranslation("ENTER_PLAYER_AGE");
    } else if(!gender) {
        message = ubsApp.getTranslation("ENTER_PLAYER_GENDER");
    }else if(!org){
        message = ubsApp.getTranslation("ENTER_PLAYER_ORG");
    }
    if(message) {
        $("#addPlayerValidationMessage").append(message);
        return;
    }
    let player = {};
    player.name = playerName;
    player.age = parseInt(playerAge);
    player.gender = gender;
    player.org = org;
    player.userdata = {lastScore:0, highScore: 0}
    let players = [];
    players[0] = player;

    if(ubsApp.isAndroidEnabled) {
       Android.addStudents(JSON.stringify(players));
    }
    message = ubsApp.getTranslation("PLAYER_ADDED_SUCCESSFULLY");

     if(ubsApp.isAndroidEnabled) {
     try {
              ubsApp.studentArray = JSON.parse(Android.getStudentList());

     } catch(err) {
         console.log("Erro parsing student array from andriod");
       ubsApp.studentArray=[];
     }
     }
     if(ubsApp.isChinaVer) {

         ubsApp.student = {
             StudentId: player.name + ubsApp.studentIdSuffix,
             StudentAge: player.age,
             StudentName: player.name,
             StudentGender: player.gender,
             StudentOrg: player.org
         }
         let isStudentExist = false
         for (i = 0; i < ubsApp.studentArray.length; i++) {
             if (ubsApp.studentArray[i].StudentId == ubsApp.student.StudentId) {
                 isStudentExist = true
                 break
             }
         }
         if (!isStudentExist) {
             if(ubsApp.student.StudentData == undefined){
                 ubsApp.student.StudentData = JSON.stringify({lastScore:0, highScore: 0})
             }
            ubsApp.studentArray.push(ubsApp.student)
         }
         else{
             message = ubsApp.getTranslation("PLAYER_ADDED_FAILED");
         }
     }
     else {
        ubsApp.studentArray = JSON.parse("[{\r\n\t\"StudentId\": \"STU111451\",\r\n\t\"StudentAge\": 12,\"StudentGender\": \"male\",\"StudentName\": \"JITENDRA RAMSAJIVAN\"\r\n}, {\r\n\t\"StudentId\": \"STU111453\",\r\n\t\"StudentAge\": 24,\"StudentGender\": \"female\",\"StudentName\": \"ANUSHKA AMIT TIVARI\"\r\n}, {\r\n\t\"StudentId\": \"STU111448\",\r\n\t\"StudentAge\": 32,\"StudentGender\": \"male\",\"StudentName\": \"ANUBHAV SANTOSH\"\r\n}]");

     }
    ubsApp.openResultPopup({
        "message" : message,
        "header" : "",
        "headerStyle" : "text-align: center;  color: black; font-weight: 700; "
    });
     localStorage.setItem('users', ubsApp.studentArray)
     ubsApp.populateStudentArray(ubsApp.studentArray);
    let numberOfPlayers = 4;

    if(ubsApp.studentArray.length < 4) {
        numberOfPlayers = ubsApp.studentArray.length;
    }

$('#num_online_players')
    .find('option')
    .remove()
    .end();
    for(let i=1; i<=numberOfPlayers; i++) {
        $('#num_online_players').append('<option value="' + i + '" id="player'+ i + '">' + i + '</option>')
    }

    $('#num_online_players').val(numberOfPlayers)

    monopoly.initOnlinePlayers();
}

ubsApp.updatePlayer = function(studentId) {

    $("#addPlayerValidationMessage").empty();
        let playerName = $("#" + studentId + "Name").val();
        let playerAge = $("#" + studentId + "Age").val();
        let gender = $("#" + studentId + "Gender").val();

        let message = "";

        if(!playerName) {
            message = ubsApp.getTranslation("ENTER_PLAYER_NAME");
        } else if(!playerAge) {
            message = ubsApp.getTranslation("ENTER_PLAYER_AGE");
        } else if(!gender) {
            message = ubsApp.getTranslation("ENTER_PLAYER_GENDER");
        }
        if(message) {
            $("#addPlayerValidationMessage").append(message);
            return;
        }
        let player = {};
        player.StudentName = playerName;
        player.StudentAge = parseInt(playerAge);
        player.StudentGender = gender;
        player.StudentID = studentId;

        if(ubsApp.isAndroidEnabled) {
           Android.updateStudent(JSON.stringify(player));
        }
        message = ubsApp.getTranslation("PLAYER_UPDATED_SUCCESSFULLY");
        ubsApp.openResultPopup({
                           "message" : message,
                           "header" : "",
                           "headerStyle" : "text-align: center;  color: black; font-weight: 700; "
                           });
         if(ubsApp.isAndroidEnabled) {
             try {
                 ubsApp.studentArray = JSON.parse(Android.getStudentList());

             } catch (err) {
                 console.log("Erro parsing student array from andriod");
                 ubsApp.studentArray = [];
             }
         }
         else if(ubsApp.isChinaVer){
            for(i =0; i<ubsApp.studentArray.length; i++){
                console.log(ubsApp.studentArray[i].StudentData)
                if(ubsApp.studentArray[i].StudentId == studentId){
                    console.log(ubsApp.studentArray[i])
                    ubsApp.student = {StudentId: player.StudentID, StudentName: player.StudentName,
                        StudentAge: player.StudentAge, StudentGender:player.StudentGender,
                        StudentOrg: ubsApp.studentArray[i].StudentOrg, StudentData: ubsApp.studentArray[i].StudentData}
                    ubsApp.studentArray[i] = ubsApp.student
                }
            }
         }else {
            ubsApp.studentArray = JSON.parse("[{\r\n\t\"StudentId\": \"STU111451\",\r\n\t\"StudentAge\": 12,\"StudentGender\": \"male\",\"StudentName\": \"JITENDRA new RAMSAJIVAN\"\r\n}, {\r\n\t\"StudentId\": \"STU111453\",\r\n\t\"StudentAge\": 24,\"StudentGender\": \"female\",\"StudentName\": \"ANUSHKA AMIT TIVARI\"\r\n}, {\r\n\t\"StudentId\": \"STU111448\",\r\n\t\"StudentAge\": 32,\"StudentGender\": \"male\",\"StudentName\": \"ANUBHAV SANTOSH\"\r\n}]");

         }
         ubsApp.populateStudentArray(ubsApp.studentArray);
        let numberOfPlayers = 4;
        if(ubsApp.studentArray.length < 4) {
            numberOfPlayers = ubsApp.studentArray.length;
        }

    $('#num_online_players')
        .find('option')
        .remove()
        .end();
        for(let i=1; i<=numberOfPlayers; i++) {
            $('#num_online_players').append('<option value="' + i + '" id="player'+ i + '">' + i + '</option>')
        }

        $('#num_online_players').val(numberOfPlayers)

        monopoly.initOnlinePlayers();
}

ubsApp.deletePlayer = function(studentId) {


        if(ubsApp.isAndroidEnabled) {
           Android.deleteStudent(studentId);
        }
        let message = ubsApp.getTranslation("PLAYER_DELETED_SUCCESSFULLY");
        ubsApp.openResultPopup({
                           "message" : message,
                           "header" : "",
                           "headerStyle" : "text-align: center;  color: black; font-weight: 700; "
                           });
         if(ubsApp.isAndroidEnabled) {
         try {
                  ubsApp.studentArray = JSON.parse(Android.getStudentList());

         } catch(err) {
             console.log("Erro parsing student array from andriod");
           ubsApp.studentArray=[];
         }
         }
         else if(ubsApp.isChinaVer){
             ubsApp.studentArray = ubsApp.studentArray.filter(function (tempstd) {
                 return tempstd.StudentId != studentId;
             });
             if(ubsApp.studentArray.length ==0){
                 localStorage.removeItem('users')
             }

         }
         else {
            ubsApp.studentArray = JSON.parse("[{\r\n\t\"StudentId\": \"STU111451\",\r\n\t\"StudentAge\": 12,\"StudentGender\": \"male\",\"StudentName\": \"JITENDRA RAMSAJIVAN\"\r\n}, {\r\n\t\"StudentId\": \"STU111453\",\r\n\t\"StudentAge\": 24,\"StudentGender\": \"female\",\"StudentName\": \"ANUSHKA AMIT TIVARI\"\r\n}, {\r\n\t\"StudentId\": \"STU111448\",\r\n\t\"StudentAge\": 32,\"StudentGender\": \"male\",\"StudentName\": \"ANUBHAV SANTOSH\"\r\n}]");

         }
         ubsApp.populateStudentArray(ubsApp.studentArray);
        let numberOfPlayers = 4;
        if(ubsApp.studentArray.length < 4) {
            numberOfPlayers = ubsApp.studentArray.length;
        }

    $('#num_online_players')
        .find('option')
        .remove()
        .end();
        for(let i=1; i<=numberOfPlayers; i++) {
            $('#num_online_players').append('<option value="' + i + '" id="player'+ i + '">' + i + '</option>')
        }

        $('#num_online_players').val(numberOfPlayers)

        monopoly.initOnlinePlayers();
}