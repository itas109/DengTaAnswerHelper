//模拟答题
//localStorage.setItem('oUrl','http://10.1.1.152:8082/quiz-api/');
localStorage.setItem('anniujia',0)
var oUrls=localStorage.getItem('oUrls')
var dats=null;	
var W_num=0;  // 判断 当前 第几题
var ww_num=0;//  自增  只增 
var ARR=[];
var xuanze=[];
//var anniujia=0;
// 下一题 
$(".w_btn_tab_down").click(function(){
	ww_num=$('.activess').length;
//	ww_num++;
	if(ww_num>w_total){
		ww_num=w_total;
	}
	W_num++;
	if(W_num>w_total){
		W_num=w_total;
		console.log(W_num);
		$(this).addClass('W_bgcol');
	}
	if(W_num>=ww_num){
		$(this).addClass('W_bgcol');
	}
	if(W_num>=1){
		$('.w_btn_tab_up').removeClass('W_bgcol');
	}


	$('.W_ti_ul li').eq(W_num).show().siblings().hide();
	$('.W_kuan li').eq(W_num).addClass('W_active').siblings().removeClass('W_active');
	
	var w_tt=W_num+1;
	if(w_tt>w_total){
		w_tt=w_total
	}
	
	
	$('.W_num_i').html(w_tt);
})

// 上一题 
$(".w_btn_tab_up").click(function(){
	
	ww_num--;
	if(ww_num<0){
		W_num=0
	};
	W_num--;

	if(W_num<0){
		W_num=0
	}
	if(W_num<=0){
		$('.w_btn_tab_up').addClass('W_bgcol');
	}
	$('.W_ti_ul li').eq(W_num).show().siblings().hide();
	$('.W_kuan li').eq(W_num).addClass('W_active').siblings().removeClass('W_active');
	$('.W_num_i').html(W_num+1);
	if(W_num>=0){
		$('.w_btn_tab_down').removeClass('W_bgcol');
	}
})

// 列表点击 
$('.W_kuan ').on('click','li',function(){
	var i=$('.W_kuan li').index(this);
	localStorage.setItem('w_changeid',i)
	
	var anniujia=localStorage.getItem('anniujia')
//	alert(i);
//	alert(anniujia)
	if(i>anniujia){
		alert('答完本题才可以答下一题哦~');
		return false;
	}else if(i<anniujia){
		$('.w_btn_tab_down').removeClass('W_bgcol')
	}
	
	$('.W_ti_ul li').eq(i).show().siblings().hide();
	$(this).addClass('W_active').siblings().removeClass('W_active')
	$('.W_num_i').html(i+1);
	W_num=i;
//	ww_num=i;
//	anniujia=i;
})

//$('.W_kuan li').click(function(){
//	alert(1);
//	
//})

$('.W_ml45 label .W_col').click(function(){
	$('.W_col').removeClass('active_color');
	$(this).addClass('active_color');
})


//试题 加载。。


// 隐藏分享
$('.jiathis_style_32x32').hide()
// 点击分享  显示
var fenxiangurl=localStorage.getItem('fenxiangurl')
$('#bks').click(function(){
	
	jc = {
		title:'灯塔-党建在线  知识竞赛',
		url:fenxiangurl,
		
		summary:'我在“灯塔-党建在线”十九大精神学习知识竞赛中用时'+localStorage.getItem('w_shijain')+'获得'+localStorage.getItem('fenfen')+'分，来挑战我吧!',
	    evt:{
	        "share":"geturl"
	    }
	};
	window.jiathis_config = jc;
	
	$('.jiathis_style_32x32').show();
})



var  w_DanXuanfenshu=[];
var  w_DuoXuanfenshu=[];
var  w_answer; //多选答案
var  w_nowJson;//单选 填入
var  w_nowDuoJson=[];
var w_nowNum,w_DSzong
var w_name
// 监听  加入 选择
$('.W_ti_ul ').on('click','input',function(e){
	e.stopPropagation();
	$(this).parent().parent().addClass('active_color').siblings().removeClass('active_color');
	var w_subjectType=$(this).parent().parent().attr('subjectType');// 判断 多选1    单选0
	localStorage.setItem('w_subjectType',w_subjectType)
//  只是单选题
	
	w_nowNum= $(this).parent().parent().parent().index();//第几题
	
	// 判断是否可以答题
	if( w_nowNum == w_total-1){		
		$('.jiaojuan').removeClass('W_jiaoquancol')	;	
	}
	
	var w_nowVal=$(this).val();// 答案
	var w_dantifen= w_dataScore; // 单  分值 获取要
	if(w_subjectType==0){
		w_nowJson={};
		w_nowJson.w_nowName=w_nowNum;
		w_nowJson.w_nowNameVal=w_nowVal;
		w_nowJson.w_nowFenVal=w_dantifen;
		if(w_DanXuanfenshu.length<=w_nowNum){
			w_DanXuanfenshu.push(w_nowJson);
//			console.log(w_DanXuanfenshu);
		}else{
			w_DanXuanfenshu[w_nowNum]=w_nowJson
		}
	}else{
		w_nowNum= $(this).parent().parent().parent().index();//第几题
		w_answer=$(this).parent().parent().attr('answer');	
		localStorage.setItem('w_nowNum',w_nowNum);
		localStorage.setItem('w_answer',w_answer);
	}
	if(w_nowNum!=w_total){
		$('.w_btn_tab_down').removeClass('W_bgcol');
	}
	
	$('.W_kuan li').eq(w_nowNum).addClass('activess');
	localStorage.setItem('anniujia',$('.activess').length)
	//console.log()
	if(w_nowNum==w_total-1){
		$('.w_btn_tab_down').addClass('W_bgcol');
	}

	
})

//$('#mydefen').modal('show')
// 跳转到  index
$('.w_toIndex').click(function(){
	location.href='index.html';
	sessionStorage.removeItem('allData');

})

// 交卷算分
var subjectInfoList=[];
var w_arrll=[];
$('.jiaojuan').click(function(){
	
		w_name=''
	for(var i=0; i<w_total;i++){
		if($('[name="ra_'+i+'"]').attr("type")==="radio"){
			w_jjson={}
			w_jjson.id=$('[name="ra_'+i+'"]:checked').attr('ids');
			w_jjson.answer=$('[name="ra_'+i+'"]:checked').val();
			w_jjson.right=$('[name="ra_'+i+'"]:checked').attr('goright');
			w_jjson.subjectType=0;
			subjectInfoList.push(w_jjson);
		}else if($('[name="ra_'+i+'"]').attr("type")==="checkbox"){
			w_name='ra_'+i;
			$('[name="'+w_name+'"]:checked').each(function(){  
//				console.log($(this).val());
   				w_nowDuoJson.push( $(this).val() ); 
			});  
			w_jjson={}
			w_jjson.id=$('[name="ra_'+i+'"]:checked').attr('ids')	
			w_jjson.answer=w_nowDuoJson.join(',')
			w_jjson.right=$('[name="ra_'+i+'"]:checked').attr('goright')
			w_jjson.subjectType=1;
			subjectInfoList.push(w_jjson);
			w_nowDuoJson=[];
		}
		
	};
	
	w_arrll=[]
	for(var i=0;i<subjectInfoList.length;i++){
		if(subjectInfoList[i].answer.length==0){
			w_arrll.push(i+1);			
		}
	}
	
	if(w_arrll.length>0){
		alert('您第'+w_arrll.join(',')+'题没有答');
		w_arrll=[];
		subjectInfoList=[];
		return false;
	}
	
	
//	console.log(subjectInfoList);
	var w_fff=0;
	var w_cuoti=[];
	for(var i=0;i<subjectInfoList.length;i++){
		if(subjectInfoList[i].answer==subjectInfoList[i].right){
			w_fff+= Math.floor(w_dataScore)
		}else{
			w_cuoti.push(i);
		}

	}
	localStorage.setItem('w_cuoti', JSON.stringify(w_cuoti))
	localStorage.setItem('w_allHuiKan',JSON.stringify(subjectInfoList) )
//	console.log(JSON.parse(localStorage.getItem('w_allHuiKan')))
	subjectInfoList=[];
	//	console.log(w_cuoti);
//	w_cuotis(w_cuoti);
//	$('.w_right').show();
//	console.log(w_fff);
//	console.log( JSON.parse(localStorage.getItem('w_allHuiKan')))
	var w_cuowu= (w_dataScore*w_total-w_fff)/w_dataScore
	
	clearInterval(jisiqi);
	$('.fenfen').html(w_fff); //分数
	localStorage.setItem('fenfen',w_fff)
//	console.log(localStorage.getItem('fenfen'))
	$('.w_shijain').html( $('.W_time').html() );
	localStorage.setItem('w_shijain', $('.W_time').html() )
	
	$('.w_num_geshu').html( w_total );
	$('.w_dui').html(w_total-w_cuowu);
	$('.w_cuode').html(w_cuowu);
	
	$('.jiaojuan').addClass('W_jiaoquancol');	

})

// 添加 错误题的 class
function w_cuotis(w_cuoti){
	for(var i=0; i<w_cuoti.length;i++){
		$('.w_addhtml li').eq(w_cuoti[i]).addClass('w_cuocclass')
	}
}

//点击分享
$('#bks').click(function (){
		$('#myshouji').modal('show')
})

//再次答题 
$('.oneMore').click(function(){
//	localStorage.removeItem('w_allHuiKan');
	$('#mydefen').modal('hide');
	W_num=0;  // 判断 当前 第几题
	ww_num=0;//  自增  只增 
	ajax1('subject_info/randomList');
	w_yongtime=0;
	clearInterval(jisiqi);
	jisiqi=setInterval(jishi,1000)
	$('.w_btn_tab_up ').addClass('W_bgcol');
	w_dd= datd;
	sessionStorage.setItem('allData',JSON.stringify(datd));
	charu(w_dd);
})

// post  
function ajax2(urls,obj){
        $.ajax({
          async:false ,
          type: "post",
          url:oUrls+urls,
          data:obj,
          dataType: "json",
          success: function(data) {
           dats=data;
          }
        });
        
    }
//  get
var datd=null;
var sty;
function ajax1(urls,obj){
        $.ajax({
          async:false ,
          type: "get",
          url:oUrls+urls,
          data:obj,
          dataType: "json",
          success: function(data) {
           datd=data;
          },
          error:function(err){
          	console.log(err)
          }
        });
}
// 获取 题目列表  
// 判读 用不用 请求 。。。
if( sessionStorage.getItem('allData') ){	
	var w_dd=sessionStorage.getItem('allData');
//	console.log(JSON.parse(w_dd));
//	console.log('不走 ajax')
	charu( JSON.parse(w_dd) );
}else{
	ajax1('subject_info/randomList');
//	console.log(datd);
	if(datd.code!=200){
		alert(datd.msg);
		location.href='index.html'
	}
	var w_dd= datd;
//	console.log(w_dd);
	if(w_dd.data.subjectInfoList.length>0){
		sessionStorage.setItem('allData',JSON.stringify(datd));
	}
	charu(w_dd);
	
}
var w_dataScore,w_total
	//  console.log(datd)
	//ajax1('subject_info/randomList');	
	function charu(w_dd){
//		console.log(w_dd)
		if(w_dd.code=='200'){
	    	w_total=w_dd.data.totalSubject;
	    	var w_data=w_dd.data.subjectInfoList;
	    	 w_dataScore=w_dd.data.subjectScore;
//	    	console.log(w_dataScore);
//	    	console.log(w_total);
	    	var w_Html='';
	    	var w_ConHtml='';
	    	var w_xuanxiang=''
//	    	console.log(w_data);
	    	for(var i=0;i<w_total;i++){
	    		if(i==0){
	    			w_Html+='<li>'+Math.floor(i+1)+'</li>'
	    		}else{
	    			w_Html+='<li >'+Math.floor(i+1)+'</li>'
	    		}
	    		
	    	}
	    	
	    	for(var j=0;j<w_total;j++){
//	    		console.log(w_data[j].subjectType);
	    		if( w_data[j].subjectType==0 ){

	    			// 添加选项 的 abcd
	    			for(var y=0; y< w_data[j].optionInfoList.length;y++){
	    				
	    				changeToZiMu(y);// 改字母
//	    				console.log(w_data[j].answer)
	    				w_xuanxiang+='<div class="W_ml45" subjectType='+w_data[j].subjectType+' answer='+w_data[j].answer+' >'
	    								+'<label><input type="radio" name="ra_'+j+'" ids="'+w_data[j].id+'" value="'+w_data[j].optionInfoList[y].optionType+'" goright="'+w_data[j].answer+'" />'
	    								+'<sapn class="W_ml10 W_col W_pointer w_fz18">'+sty+'.'+w_data[j].optionInfoList[y].optionTitle+'</sapn>'
	    								+'</label></div>'
	    								
	    			}
	    			
	    			// 添加整体 试题  的
	    			w_ConHtml+='<li>'
	    						+'<h1 ><span><i class="W_num_i w_fz18">'+Math.floor(j+1)+'</i></span>.<span class="w_colred w_fz18 w_boderti">单选题</span><span class="w_fz18">'+w_data[j].subjectTitle+'</span></h1>'
								+w_xuanxiang
								+'<div class="w_right W_ml45 w_fz18"></div>'
								+'</li>'
					w_xuanxiang='';

	    		}else{
	    			for(var y=0; y< w_data[j].optionInfoList.length;y++){
	    				
	    				changeToZiMu(y);// 改字母
	    				
	    				w_xuanxiang+='<div class="W_ml45" subjectType='+w_data[j].subjectType+' answer='+w_data[j].answer+' ><label><input type="checkbox" name="ra_'+j+'" ids="'+w_data[j].id+'" value="'+w_data[j].optionInfoList[y].optionType+'" goright="'+w_data[j].answer+'" /><sapn right='+w_data[j].optionInfoList[y].isRight+' class="W_ml10 W_col W_pointer w_fz18">'+sty+'.'+w_data[j].optionInfoList[y].optionTitle+'</sapn></label></div>'
	    			}

	    			w_ConHtml+='<li>'
	    						+'<h1 ><span><i class="W_num_i w_fz18">'+Math.floor(j+1)+'</i></span>.<span class="w_colred w_fz18 w_boderti">多选题</span><span class="w_fz18">'+w_data[j].subjectTitle+'</span></h1>'
								+w_xuanxiang
								+'<div class="w_right W_ml45 w_fz18"></div>'
								+'</li>'
					w_xuanxiang='';


	    		}
	    		
	    	}
	    	// 123 导航。。
	    	$('.w_addhtml').html(w_Html);
	    	$('.w_charu').html(w_ConHtml);
	    }else{
	    	console.log(w_dd.mag)
	    }
	}
var w_yongtime=0;
var jisiqi=setInterval(jishi,1000)

$('.w_right').hide();
function jishi(){
	w_yongtime++;
	if(w_yongtime<60){
		$('.W_time').html(w_yongtime+'秒');
	}else{
		var w_fen= Math.floor(w_yongtime/60) ;
		var w_miao= Math.floor(w_yongtime%60);
		$('.W_time').html(w_fen+'分'+w_miao+'秒');
	}
	
}

    // 封装  字符 转 字母
function changeToZiMu(y){
		switch(y+"y")
		{
			case '0y':sty='A'
			  break;
			case '1y':sty='B'
			  break;
			case '2y':sty='C'
			  break;
			case '3y':sty='D'
			  break;
			case '4y':sty='E'
			  break;
			case '5y':sty='F'
			  break;
			case '6y':sty='J'
			  break;
			case '7y':sty='H'
			  break;
		  	case '8y':sty='I'
		  	  break;
		  	case '9y':sty='G'
		      break;
		  	case '10y':sty='K'
		  	  break;
		  	case '11y':sty='L'
		  	  break;
		  	case '12y':sty='M'
		  	  break;
		  	case '13y':sty='N'
		  	  break;
		  	case '14y':sty='O'
		  	  break;
		  	case '15y':sty='P'
		  	  break;
		}
}
