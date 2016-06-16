/**
 * Created by GDH on 2016/6/16.
 */
var userInfo={};
$.ajax({
    type: "post",
    url: "./test.php",
    data: "type=verify",
    dataType: "json",
    success: function (data) {
        userInfo=data;
    },
    error: function (msg) {
        alert(msg);
    }
    
});