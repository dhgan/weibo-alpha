(function(){
    var $emojiSet=$("#emojiSet");
    var $msgTxt=$("#msgTxt");
    $emojiSet.bind("click",function (e) {
        var target=e.target;
        if(target.tagName.toLowerCase()==="a"){
            var msg=$msgTxt.val();
            $msgTxt.val(msg+"["+target.parentNode.title+"]")
                .trigger("input");
        }
    });
    var updatePhoto=[];
    function createObjectURL(blob) {
        if(window.URL){
            return window.URL.createObjectURL(blob);
        } else if(window.webkitURL){
            return window.webkitURL.createObjectURL(blob);
        } else {
            return null;
        }
    }
    $("#msgPhotoAdd").bind("change",function(e){
        var file=this.files[0];
        var url=createObjectURL(file);
        var imgY=new Image();
        imgY.onload=function(){
            var imgW=this.width;
            var imgH=this.height;
            var length=imgW>imgH?{"l":imgW, "type": "width"}:{"l":imgH, "type": "height"};
            var $img=$("<img />",{"src": url});
            $img.css(length["type"], length.l>100?100:length.l);
            var $div=$("<div></div>");
            $div.append($img);
            var $icon=$("<span></span>",{class: "msgPhotoDel"});
            $div.append($icon);
            $("#msgPhotoShow").append($div);
            updatePhoto.push(file);
            $("#msgPhotoShow").height(Math.ceil(updatePhoto.length/5)*120);
        };
        imgY.src=url;
    });
    $("#msgPhotoShow").bind("click",function(e){
        var target=e.target;
        if(target.className==="msgPhotoDel"){
            var $msgPhotoList=$(target.parentNode)[0];
            var i=$(this).find("div").index($msgPhotoList);
            $msgPhotoList.remove();
            updatePhoto.splice(i,1);
            $("#msgPhotoShow").height(Math.ceil(updatePhoto.length/5)*120);
        }
    });
    $.fn.msgTxtDetect=function(option){
        var defaults={
            maxLength: 140
        }
        var opts=$.extend({}, defaults, option);
        var $this=$(this);
        function detectLength(){
            var val=$this.val().trim();
            var length=val.length;
            var i, total=0;
            for(i=0;i<length;i++){
                total+=val.charCodeAt(i)>255?1:0.5;
            }
            var left=Math.floor(opts.maxLength-total);
            var btn=$("#msgSendBtn");
            if(left<0){
                $("#msgTips").addClass("red");
                btn.attr("disabled","disabled")
                    .addClass("disabled");
            }else{
                $("#msgTips").removeClass("red");
                btn.removeAttr("disabled")
                    .removeClass("disabled");
                if(left===defaults.maxLength){
                    btn.addClass("disabled");
                }
            }
            $("#msgTips").text(left).attr("data-msgLength", total);
            console.log(val.trim());
        };
        $this.bind("input", detectLength);
        if(window.VBArray && window.addEventListener){
            $this.bind("keyup", function(e){
                var key=e.keyCode;
                (key==8||key==46)&&detectLength();
            })
            $this.bind("cut", detectLength);
        }
    }
    $("#msgTxt").msgTxtDetect();
    $("#msgSendBtn").bind("click",function(){
        var msgLength=$("#msgTips").attr("data-msgLength");
        if(msgLength>0&&msgLength<=140){
            var msg=$("#msgTxt").val().trim();
            msg=msg.replace(/\n/g," ");
            var form=new FormData();
            form.append("message", msg);
            updatePhoto.forEach(function(value, index){
                form.append("photo"+index, value);
            });
            /* ajax上传如果成功则将msgTxt清 */
        }
    });
})();
