analytics = {
    url: '/china/analytics'
};

$(document).ready(function () {
    function before(object, method, callback) {
        let originalMethod = object[method];
        object["old_" + method] = originalMethod;
        object[method] = function () {
            shoudContinue = callback.apply(object, arguments);
            if (shoudContinue) {
                originalMethod.apply(object, arguments);
            }
        };
    }

    function after(object, method, callback) {
        let originalMethod = object[method];
        object[method] = function () {
            originalMethod.apply(object, arguments);
            callback.apply(object);
        };
    }

    analytics.initializePages();

    before(ubsApp, 'restartGame', () => {
        monopoly.renderPageforBoard(analytics.pages.Login);
        return true;
    });

    after(monopoly, 'openAddPlayer', ()=>{

        $.get({url:'/getOrg', success: function (data) {
            if(localStorage.getItem('orgs') == undefined || JSON.parse(localStorage.getItem('orgs')).length != data.length){
                localStorage.setItem('orgs', JSON.stringify(data))
            }
            $('#playerOrg')
                .find('option')
                .remove()
                .end();
            console.log(localStorage.getItem('orgs'))
            localOrg = JSON.parse(localStorage.getItem('orgs'))
            for(let i=0; i<localOrg.length; i++) {
                console.log(localOrg[i])
                $('#playerOrg').append('<option value="' + localOrg[i].name + '" id="'+ localOrg[i].name + localOrg[i].id+'">' + localOrg[i].name + '</option>')
            }
        }})
    })

    /*after(monopoly, 'storePlayerDetails', ()=>{
        for(i=0; i<ubsApp.studentArray.length; i++){
            var url_param = "?userid="+ubsApp.studentArray[i].StudentName+"&age="+ubsApp.studentArray[i].StudentAge+"&gender="+ubsApp.studentArray[i].StudentGender+"&orgname="+ubsApp.studentArray[i].StudentOrg
            $.get({
                url: '/addUser'+url_param,
                success:(data) =>{
                    console.log(data)
                },
                error: (err)=>{
                    console.log(err)
                }
            })
        }
    })*/

    after(ubsApp, 'closeGame', ()=>{
        for(var k=0; k<ubsApp.studentArray.length; k++){
            var std = ubsApp.studentArray[k]
            var url_param = "?userid="+std.StudentName+"&age="+std.StudentAge+
                "&gender="+std.StudentGender+"&orgname="+std.StudentOrg+"&userdata='"
            for(var i = 0; i<userArray.length; i++){
                if(userArray[i].name == ubsApp.studentArray[k].StudentName){
                    stdData = JSON.parse(ubsApp.studentArray[k].StudentData)
                    stdData.lastScore = userArray[i].score - initialPlayerCash +
                        userArray[i].bankBalance - initialPlayerBankBalance - userArray[i].credit
                    if(stdData.lastScore > stdData.highScore){
                        stdData.highScore = stdData.lastScore
                    }
                    ubsApp.studentArray[k].StudentData = JSON.stringify(stdData)
                    url_param = url_param + ubsApp.studentArray[k].StudentData + "'"
                    console.log(url_param)
                    $.get({
                        url: '/addUser'+url_param,
                        success:(data) =>{
                            console.log(data)
                        },
                        error: (err)=>{
                            console.log(err)
                        }
                    })
                    break
                }
            }
        }
        localStorage.setItem('users', JSON.stringify(ubsApp.studentArray))
    })


    $('#monopolyBase, #templateContent, #helpContent').on('click', function (eventObject) {
        let eventTarget = eventObject.target;
        console.log(eventTarget.id || eventTarget.className);
        $.post({
            url: analytics.url,
            success: function (response) {
                console.log(response)
            },
            error: function (error) {
                console.log(error)
            }
        });
    });
});

analytics.initializePages = function () {
    analytics.pages = $.extend({}, analytics.origpages);
};

analytics.logIn = function () {
    let credentials = {
        username: $('#username').val(),
        password: $('#password').val()
    }
    $.post({
        url: analytics.url + "/login",
        data: JSON.stringify(credentials),
        contentType: 'application/json; charset=utf-8',     
        success: (response) => {
            eval(response);
        }
    });
};

analytics.submitData = function (data) {};