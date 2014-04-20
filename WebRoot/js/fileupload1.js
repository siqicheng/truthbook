//document.querySelector('#fileSelect').addEventListener('click', function(e) {
//  	// Use the native click() of the file input.
//  	document.querySelector('#fileElem').click();
//}, false);
////document.querySelector('#fileSelect').onclick = function(e) {
////	setTimeout(function() {
////    document.querySelector('#fileElem').click(); // Will fail.
////  	}, 1500);
////};
function readURL(input) {
    if (input.files && input.files[0]) {
    	$('#img_prev').show();
        var reader = new FileReader();
        reader.onload = function (e) { $('#img_prev').attr('src', e.target.result).css({"max-width":"650px"}); };
        reader.readAsDataURL(input.files[0]);
        $('#loginBtn').removeClass("disabled");
    } else {
        //IE�£�ʹ���˾�
        var docObj = document.getElementByIdx_x('fileElem');
        docObj.select();
        //���IE9��document.selection�ܾ���ʵĴ���
        docObj.blur();
        var imgSrc = document.selection.createRange().text;
        var img_prevId = document.getElementByIdx_x("img_prev");
        $('#img_prev').width(150).height(200); //�������ó�ʼ��С
        //ͼƬ�쳣�Ĳ�׽����ֹ�û��޸ĺ�׺��α��ͼƬ
        try {
            img_prevId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            img_prevId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
        } catch (e) {
            alert("���ϴ���ͼƬ��ʽ����ȷ��������ѡ��!"); return false;
        }
        $('#img_prev').hide();
        document.selection.empty();
    }
};