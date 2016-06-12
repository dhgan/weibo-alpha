(function(){
    var emoji=[
        {"title": "呵呵"},
        {"title": "哈哈"},
        {"title": "吐舌"},
        {"title": "啊"},
        {"title": "酷"},
        {"title": "怒"},
        {"title": "开心"},
        {"title": "汗"},
        {"title": "泪"},
        {"title": "黑线"},
        {"title": "鄙视"},
        {"title": "不高兴"},
        {"title": "真棒"},
        {"title": "钱"},
        {"title": "疑问"},
        {"title": "阴险"},
        {"title": "吐"},
        {"title": "咦"},
        {"title": "委屈"},
        {"title": "花心"},
        {"title": "呼~"},
        {"title": "笑眼"},
        {"title": "冷"},
        {"title": "太开心"},
        {"title": "滑稽"},
        {"title": "勉强"},
        {"title": "狂汗"},
        {"title": "乖"},
        {"title": "睡觉"},
        {"title": "惊哭"},
        {"title": "升起"},
        {"title": "惊讶"},
        {"title": "喷"},
        {"title": "爱心"},
        {"title": "心碎"},
        {"title": "玫瑰"},
        {"title": "礼物"},
        {"title": "彩虹"},
        {"title": "星星月亮"},
        {"title": "太阳"},
        {"title": "钱币"},
        {"title": "灯泡"},
        {"title": "茶杯"},
        {"title": "蛋糕"},
        {"title": "音乐"},
        {"title": "haha"},
        {"title": "胜利"},
        {"title": "大拇指"},
        {"title": "弱"},
        {"title": "OK"}
    ];
    for(var i=1;i<=50;i++){
        if(i<10) i="0"+i;
        emoji[i-1].url="./imgs/emoji/i_f"+i+".png";
    }
    function createObjectURL(blob) {
        if(window.URL){
            return window.URL.createObjectURL(blob);
        } else if(window.webkitURL){
            return window.webkitURL.createObjectURL(blob);
        } else {
            return null;
        }
    }
    $.fn.clipImg=function() {
        var imgW=this[0].naturalWidth;
        var imgH=this[0].naturalHeight;
        var constW=this.parent().width();
        var oImg=imgH<=imgW?{"l":imgW, "t": "width", "o": imgH}
            :{"l":imgH, "t": "height", "o": imgW};
        if(oImg["l"]>constW){
            var clip=Math.abs(imgH-imgW)/2*constW/oImg['o'];
            if(oImg['t']=="width"){
                this.css({
                    "width": "auto",
                    "height": constW,
                    "margin-left":  -clip

                });
            } else{
                this.css({
                    "width": constW,
                    "height": "auto",
                    "margin-top":  -clip

                });
            }
        }
    }
    //检测微博字数
    $.fn.msgTxtDetect=function(option){
        var defaults={
            maxLength: 140
        }
        var opts=$.extend({}, defaults, option);
        var $this=$(this);
        function detectLength(){
            var $msgTxt=$this.find(".msgTxt");
            autoHeight.call($msgTxt[0]);
            var val=$msgTxt.val().trim();
            var length=val.length;
            var i, total=0;
            for(i=0;i<length;i++){
                total+=val.charCodeAt(i)>255?1:0.5;
            }
            var left=Math.floor(opts.maxLength-total);
            var btn=$this.find(".msgSend input:submit");
            var msgTips=$this.find(".msgSend strong");
            if(left<0){
                msgTips.addClass("red");
                btn.attr("disabled","disabled")
                    .addClass("disabled");
            }else{
                msgTips.removeClass("red");
                btn.removeAttr("disabled")
                    .removeClass("disabled");
                if(left===defaults.maxLength){
                    btn.addClass("disabled");
                }
            }
            msgTips.text(left).attr("data-msg-length", total);
        };
        $this.delegate(".msgTxt","input", detectLength);
        if(window.VBArray && window.addEventListener){
            $this.delegate(".msgTxt","keyup", function(e){
                var key=e.keyCode;
                (key==8||key==46)&&detectLength();
            })
            $this.delegate(".msgTxt","cut", detectLength);
        }
    }

    $.fn.msgBoxEvent=function(){
        var updatePhoto=[];
        /*var _this=$(this);*/
        var _this=this;
        _this.msgTxtDetect();
        _this.delegate(".emojiSet","click", function (e) {
            var target=e.target;
            if(target.tagName.toLowerCase()==="a"){
                var $msgTxt=_this.find(".msgTxt");
                var msg=$msgTxt.val();
                $msgTxt.val(msg+"["+target.parentNode.title+"]")
                    .trigger("input");
            }
        });
        _this.delegate(".msgPhotoAdd","change",function(){
            var file=this.files[0];
            var url=createObjectURL(file);
            if(file.size/1024>=10240){
                alert("文件大小不能大于10m");
            }
            var imgY=new Image();
            imgY.onload=function(){
                var $img=$("<img />",{"src": url});
                var $div=$("<div></div>");
                $div.append($img);
                var $icon=$("<span></span>",{class: "msgPhotoDel"});
                $div.append($icon);
                _this.find(".msgPhotoShow").append($div);
                $img.clipImg();
                updatePhoto.push(file);
                _this.find(".msgPhotoShow").height(Math.ceil(updatePhoto.length/5)*116);
            };
            imgY.src=url;
        });
        _this.delegate(".msgPhotoShow","click",function(e){
            var target=e.target;
            if(target.className==="msgPhotoDel"){
                var $msgPhotoList=$(target.parentNode)[0];
                var i=$(this).find("div").index($msgPhotoList);
                $msgPhotoList.remove();
                updatePhoto.splice(i,1);
                $(this).height(Math.ceil(updatePhoto.length/5)*116);
            }
        });
        _this.delegate(".msgSend input:submit","click",function () {
            var msgLength=_this.find(".msgSend strong").data("msg-length");
            if(msgLength>0&&msgLength<=140){
                var msg=_this.find(".msgTxt").val().trim();
                msg=msg.replace(/\n/g," ");
                var formData=new FormData();
                formData.append("message", msg);
                updatePhoto.forEach(function(value, index){
                    formData.append("photo"+index, value);
                });
                /* ajax上传如果成功则将msgTxt清 */
                $.ajax({
                    type: "post",
                    url: "",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function () {
                        
                    },
                    error: function () {

                    }
                })
            }
        });
    }
    function autoHeight() {
        var $other=$(this).parent().find(".autoHeightClone");
        if($other.length<=0){
            $other=$(this).clone();
            $other.addClass("autoHeightClone")
                .appendTo($(this).parent());
            $other.css({
                "min-height": 0,
                "height": 0,
                "visibility": "hidden",
                "position":"absolute",
                "width": $(this).outerWidth(),
                "top": 0
            });
        }
        $other.val(this.value);
        $(this).innerHeight($other[0].scrollHeight);
    }
    $(".msgBox").each(function () {
        $(this).msgBoxEvent();
    });
    $.fn.centerImg=function () {
        var imgW=this[0].naturalWidth;
        var constW=this.parent().width();
        this.css("width", imgW>constW?constW:imgW);
    }
    function createCommentBox(userHead) {
        var $commentBox=$("<div class='commentBox'></div>");
        if(userHead){
            $("<img src='"+userHead+"'>").appendTo($commentBox);
        }
        $("<textarea class='msgTxt' name='msgTxt'></textarea>").appendTo($commentBox);
        var $msgTool=$("<div class='msgTool clearfix'></div>");
        var $msgAdd=$("<ul class='msgAdd'></ul>");
        var $msgEmoji=$("<li class='msgEmoji'></li>");
        var $emojiSet=$("<ul class='emojiSet'></ul>");
        $("<i>&nbsp;</i><span>表情</span>").appendTo($msgEmoji);
        emoji.forEach(function (value) {
            $("<li title='"+value['title']+"'><a href='javascript:;'></a></li>")
                .appendTo($emojiSet);
        });
        $emojiSet.appendTo($msgEmoji);
        $msgEmoji.appendTo($msgAdd);
        $msgAdd.appendTo($msgTool);
        var $msgSend=$("<div class='msgSend'></div>");
        $("<strong>140</strong>" +
            "<input type='submit' value='评论' class='disabled' disabled='disabled'>")
            .appendTo($msgSend);
        $msgSend.appendTo($msgTool);
        $msgTool.appendTo($commentBox);
        $commentBox.msgTxtDetect();
        return $commentBox;

    }
    function createCommentTotal() {
        var $commentTotal=$("<div class='commentTotal'></div>");
        var userHead="./imgs/head.png";
        createCommentBox(userHead).appendTo($commentTotal);
        $("<ul class='commentList'></ul>").appendTo($commentTotal);
        return $commentTotal;
    }
    function createCommentList() {
        var info={
            "userName": "空想的萌萌猫",
            "userLink": "#",
            "userHead": "./imgs/head.png",
            "context": "把情懷和做事分開對別人也多了幾分尊重和坦誠對事情就多了幾分認真和認命",
            "commentTime": "16:45",
        };
        var $commentList=$("<li></li>");
        $("<div class='commentMsg clearfix'>" +
            "<a href='"+info.userLink+"'>"+info.userName+
            "<img src='"+info.userHead+"' title='"+info.userName+"'></a>：" +
                info.context+
            "</div>")
            .appendTo($commentList);
        $("<div class='commentFooter'>" +
            "<span>" + info.commentTime+ "</span>" +
            "<a href='javascript:;'>回复</a></div>")
            .appendTo($commentList);
        return $commentList;
    }
    $.fn.commentBoxEvent=function () {
        var _this=this;
        _this.delegate(".msgListPhoto", "click", function (e) {
            var $this=$(this);
            function createMsgListPhotoShow() {
                var $msgListPhotoShow=$("<ul class='msgListPhotoShow clearfix'></ul>");
                $this.find("li img").each(function () {
                    $("<li class='li_small'><img src='"+this.src+"'></li>")
                        .appendTo($msgListPhotoShow);
                })
                return $msgListPhotoShow;
            }
            var $target=$(e.target);
            if($target.is("li")) $target=$target.find("img");
            if($target.is("img")){
                var index=$target.parent().index();
                var bps=_this.find(".big_photo_show");
                var mlps=_this.find(".msgListPhotoShow");
                $this.hide();
                var flag=1;
                if(bps.length<=0){
                    bps=$("<div class='big_photo_show'><img src=''></div>");
                    mlps=createMsgListPhotoShow();
                    bps.insertAfter(_this.find(".msgListPhoto"));
                    mlps.insertAfter(bps);
                    flag=0;
                }
                bps.show()
                    .find("img")
                    .attr("src", $target.attr("src"))
                    .centerImg();
                mlps.show()
                    .find("li").eq(index).addClass("selected")
                    .siblings().removeClass("selected");
                flag||mlps.find("img").each(function () {
                    $(this).clipImg();
                });
            }
        });
        _this.delegate(".big_photo_show","click",function () {
            $(this).hide();
            _this.find(".msgListPhotoShow").hide();
            _this.find(".msgListPhoto").show();
        });
        _this.delegate(".msgListPhotoShow","click", function (e) {
            var $target=$(e.target);
            if($target.is("img")){
                var $li=$target.parent();
                $li.addClass("selected")
                    .siblings().removeClass("selected");
                _this.find(".big_photo_show img").attr({
                    "src": e.target.src})
                    .centerImg();
            }
        });
        if(_this.data("msg-type")==="msgList"){
            _this.delegate(".msgComment", "click", function () {
                var $commentTotal=_this.find(".commentTotal");
                if($commentTotal.length==0){
                    $commentTotal=createCommentTotal();
                    for(var i=0;i<5;i++){
                        var $li=createCommentList();
                        $li.appendTo($commentTotal.find(".commentList"));
                    }
                    $commentTotal.appendTo(_this);
                }else {
                    $commentTotal.fadeToggle();
                }
                $(this).find("b").fadeToggle();
                /*ask for comment*/
                $.ajax({
                    success: function () {
                        /*var $li=createCommentList();
                        $li.appendTo($commentTotal.find(".commentList"));*/
                    }
                });
            });
        } else{
            var $commentTotal=createCommentTotal();
            $commentTotal.appendTo(_this);
            _this.find(".msgComment").find("b").show();
            for(var i=0;i<5;i++){
                var $li=createCommentList();
                $li.appendTo($commentTotal.find(".commentList"));
            }
            /*ask for comment*/
            $.ajax({
                success: function () {
                    /*var $li=createCommentList();
                    $li.appendTo($commentTotal.find(".commentList"));*/
                }
            });
        }
        _this.delegate(".emojiSet", "click", function (e) {
            var target=e.target;
            if(target.tagName.toLowerCase()==="a"){
                var $msgTxt=$(target).parents(".commentBox").find(".msgTxt");
                var msg=$msgTxt.val();
                $msgTxt.val(msg+"["+target.parentNode.title+"]")
                    .trigger("input");
            }
        });
        _this.delegate(".msgSend input:submit", "click", function (e) {
            var $this=$(e.target).parents(".commentBox");
            var msgLength=$this.find(".msgSend strong").data("msg-length");
            if(msgLength>0&&msgLength<=140){
                var msg=$this.find(".msgTxt").val().trim();
                msg=msg.replace(/\n/g," ");
                var formData=new FormData();
                formData.append("message", msg);
                console.log(msg);
                /* ajax上传如果成功则将msgTxt清 */
                /*$.ajax({
                    type: "post",
                    url: "",
                    data: formData,
                    success: function () {

                    },
                    error: function () {

                    }
                })*/
            }
        });
        _this.delegate(".commentFooter a", "click",function (e) {
            var $li=$(e.target).parents(".commentFooter").parent();
            var $commentBox=$li.find(".commentBox");
            if($commentBox.length==0){
                $commentBox=createCommentBox();
                $commentBox.appendTo($li);
            } else{
                $commentBox.toggle();
            }
        })
        _this.find(".msgListPhoto img").bind("load",function () {
            $(this).clipImg();
        });
    }
    function createMsgList(type){
        var info={
            userLink: "#",
            msgListTime: "17:35",
            userHead: "./imgs/head/girl-3.png",
            userName: "卡带机",
            msgInfo: "WWDC 大会将在下周举行了，在今年的这场大会上苹果公司将以更新软件为主，或许是因为这场大会上要发布的东西太多，苹果提前公开了将会在今年晚些时候更新的 App Store 2.0，这样到时候在 WWDC 大会上苹果就可以有针对性地对这次更新加以说明。被吐槽了这么多年的App Store要重新出发了~",
            msgReply: "柳岩不哭，强烈要求大国文化道歉#大国文化给柳岩道歉#",
            msgLink: "javascript:",
            msgPhotoNum: 6,
            msgPhoto: [
                "./imgs/1.jpg",
                "./imgs/2.jpg",
                "./imgs/3.jpg",
                "./imgs/1.jpg",
                "./imgs/3.jpg",
                "./imgs/2.jpg"
            ],
            msgLike: 66,
            msgComment: 6
        };
        var $msgListContentBox=$("<div class='msgListContentBox clearfix' data-msg-type='"+type+"'></div>")
        $("<div class='msgDel'></div>").appendTo($msgListContentBox);
        var $msgListContent=$("<div class='msgListContent'></div>");
        $("<div class='msgListUserInfo'>" +
            "<a href='"+info.userLink+"'>" +
            "<img src='"+info.userHead+"' class='msgListUserHead'/>" +
            "<strong class='msgListUserName'>"+info.userName+"</strong>"+
            "</a>" +
            "<a href='javascript:;' class='msgListTime'>"+info.msgListTime+"</a>" +
            "</div>").appendTo($msgListContent);
        $("<div class='msgListBody'>"+info.msgInfo+"</div>").appendTo($msgListContent);
        if(type=="msgList"||type=="msgItem"){
            var $msgListPhoto=$("<ul class='msgListPhoto clearfix'></ul>");
            for(var i=0;i<info.msgPhotoNum;i++){
                var $msgPhoto=$("<img src='"+info.msgPhoto[i]+"'>");
                $("<li class='li_"+info.msgPhotoNum+"_"+(i+1)+"'></li>")
                    .append($msgPhoto)
                    .appendTo($msgListPhoto);
            };
            $msgListPhoto.appendTo($msgListContent);
            $("<ul class='msgListFooter clearfix'>" +
                "<li class='msgLike'><i>&nbsp;</i><span>"+info.msgLike+"</span></li>" +
                "<li class='msgComment'><i>&nbsp;</i><span>"+info.msgComment+"</span><b></b></li></ul>")
                .appendTo($msgListContent);
        }
        if(type=="reply"){
            $("<div class='msgReply'>评论我的微博：" +
                "<a href='"+info.msgLink+"'>" +
                    info.msgReply+
                "</a></div>").appendTo($msgListContent);
            $("<ul class='msgListFooter clearfix'> " +
                "<li class='msgComment'>回复<b></b></li>" +
                "</ul>").appendTo($msgListContent);
        }
        $msgListContent.appendTo($msgListContentBox);
        return $msgListContentBox;
    }
    var time=0;
    var timer=setInterval(function () {
        if(time<5){
            time++;
            var m;
            if(time%2) m=createMsgList("msgItem");
            else m=createMsgList("msgList");
            m.commentBoxEvent();
            m.appendTo($('.content'));
        }else{
            clearInterval(timer);
        }
    },1000);
    /*create msgBox*/
    function createMsgBox() {
        var $msgBox=$("<div class='msgBox'></div>");
        $("<textarea class='msgTxt' name='msgTxt'></textarea>").appendTo($msgBox);
        var $msgTool=$("<div class='msgTool clearfix'></div>");
        $("<div class='msgPhotoShow clearfix'></div>").appendTo($msgTool);
        var $msgAdd=$("<ul class='msgAdd'></ul>");
        var $msgEmoji=$("<li class='msgEmoji'></li>");
        var $emojiSet=$("<ul class='emojiSet'></ul>");
        $("<i>&nbsp;</i><span>表情</span>").appendTo($msgEmoji);
        emoji.forEach(function (value) {
            $("<li title='"+value['title']+"'><a href='javascript:;'></a></li>")
                .appendTo($emojiSet);
        });
        $emojiSet.appendTo($msgEmoji);
        $msgEmoji.appendTo($msgAdd);
        $("<li class='msgPhoto'>" +
            "<i>&nbsp;</i><span>照片</span>" +
            "<input type='file' name='msgPhoto' class='msgPhotoAdd' accept='image/*'> " +
            "</li>").appendTo($msgAdd);
        $msgAdd.appendTo($msgTool);
        var $msgSend=$("<div class='msgSend'></div>");
        $("<strong>140</strong>" +
            "<input type='submit' value='发表' class='disabled' disabled='disabled'>")
            .appendTo($msgSend);
        $msgSend.appendTo($msgTool);
        $msgTool.appendTo($msgBox);
        $msgBox.msgTxtDetect();
        return $msgBox;

    }
    $("#WB").bind("click",function () {
        var $pop=$("#gdh-pop");
        if($pop.length){
            $pop.show();
        } else{
            $pop=$("<div id='gdh-pop'></div>");
            var $popMsgBox=$("<div class='popMsgBox'></div>");
            var $msgHead=$("<div class='msgHead'>" +
                "<h3>有什么想说的吗</h3>" +
                "<i></i> </div>");
            $msgHead.appendTo($popMsgBox);
            var $newS=createMsgBox();
            $newS.msgBoxEvent();
            $newS.appendTo($popMsgBox);
            var $shadowBox=$("<div class='shadowBox'></div>");
            $shadowBox.on("click", function () {
                $("#gdh-pop").hide();
            });
            $popMsgBox.delegate(".msgHead i", "click", function () {
                $("#gdh-pop").hide();
            });
            $shadowBox.appendTo($pop);
            dragDrop($popMsgBox, $msgHead);
            $popMsgBox.appendTo($pop);
            $pop.appendTo($("body"));
        }
    });
    function dragDrop($target,$dragUtil) {
        var disX, disY, flag=false;
        $dragUtil.on("mousedown", function (e) {
            e.returnValue=false;
            e.stopPropagation();
            disX=$target.offset().left-e.pageX;
            disY=$target.offset().top-e.pageY;
            flag=true;
        });
        $(document).on("mousemove", function (e) {
            e.returnValue=false;
            e.stopPropagation();
            if(flag){
                $target.offset({
                    "left": (disX+e.pageX),
                    "top": (disY+e.pageY)
                });
            };
        });
        $(document).on("mouseup", function (e) {
            flag=false;
        })
    }
})();
