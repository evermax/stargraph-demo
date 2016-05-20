function callback(response) {
    var date = new Date();
    $("#loader").hide();
    var chart = new CanvasJS.Chart("chartContainer",
    {
        zoomEnabled: true,

        title:{
        text: "Repo with " + response.data.length + " stars created at " + response.created_at
    },
    data: [
        {
            type: "area",
            xValueType: "dateTime",
            dataPoints: response.data
        }
    ]
    });

    chart.render();
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
$(document).ready(function() {
    $("#loader").hide();
    var token = getCookie("token");
    if (token !== "") {
        $(".token").hide();
    }
    callback({data:[], created_at: new Date().toISOString()});
    $("#form").submit(function(e) {
        e.preventDefault();
        var repo = $("#repo").val();
        if (token === "") {
            token = $("#token").val();
        }
        //console.log(repo, token);
        $("#loader").show();
        $.get("/api?repo=" + repo + "&token=" + token, function(data){
            //console.log(data);
            var obj = JSON.parse(data);
            //console.log(obj);
            callback(obj);
            if (obj.length !== 0) {
                var lastTimestamp = obj.pop().x;
                $("#legend").html("Last star on the repository put at: " + new Date(lastTimestamp).toDateString());
            }
            });
    });
});
