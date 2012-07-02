 function DrawingEditor(randomId){
         var id=randomId;
	     var clickX=0;
         var clickY=0;
         var selectedTool="";
         var context;
         var canvas;
         var thickness=5;
         var selectedColor='#ff0000';
         var canvasWidth;
         var canvasHeight;
         var bold='';
         var tools=['pencil','eraser','text'];
         var italic='';
         var fontSize='24';
         var font='Courier New';
         
         this.prepareCanvas = function(){
          	
          	   var canvasDiv = document.getElementById('canvasDiv'+id);
          	   canvas = document.createElement('canvas');
          	   
          	     canvasWidth=$j(canvasDiv).width()-20;
               canvasHeight=500;
              
	           $j(canvas).attr('width', canvasWidth).attr('height', canvasHeight).attr('id', 'canvas'+id);
	           canvasDiv.appendChild(canvas);
               context = canvas.getContext("2d");
               $j(canvas).css('background-color','#eee');
             /*  var imageObj = new Image();

        imageObj.onload = function() {
          context.drawImage(imageObj, 69, 50);
        };
        imageObj.src = "imgs/hands.jpg";*/
               $j(canvas).mousedown(function(event) {
              	 clickX=event.pageX-this.offsetLeft;
                 clickY=event.pageY-this.offsetTop;
                if(selectedTool =='pencil' || selectedTool =='eraser'){
                 $j(this).bind('mousemove', function(event) {
                  	draw(event.pageX-this.offsetLeft,event.pageY-this.offsetTop);
                  	
                 });
                }else if(selectedTool == 'text'){
                    $j('#textAreaPopUp'+id).css('top',event.pageY+'px').css('left',event.pageX+'px').show();
                    $j('#writableTextarea'+id).css('font-size',parseInt(fontSize));
                    $j('#writableTextarea'+id).css('color',selectedColor);
                }
                 
              });
               
               
              $j('#colorSelector'+id).ColorPicker({
					color: '#ff0000',
					onShow: function (colpkr) {
							$j(colpkr).fadeIn(500);
							return false;
					},
					onHide: function (colpkr) {
							$j(colpkr).fadeOut(500);
							return false;
					},
					onChange: function (hsb, hex, rgb) {
							$j('#colorSelector div'+id).css('backgroundColor', '#' + hex);
							selectedColor='#'+hex;
							$j('#writableTextarea'+id).css('color',selectedColor);
					}
				});
              
                $j('#saveText'+id).click(function() {
                    saveTextFromArea(clickX,clickY+parseInt(fontSize));    
                });
                
                $j('#thickness'+id).change(function() {
                     thickness=$j(this).val();     
               });
               
                $j('#fontSize'+id).change(function() {
                     fontSize=$j(this).val();
                      $j('#writableTextarea'+id).css('font-size',parseInt(fontSize));
                         
               });
               
               $j(canvas).bind('mouseup mouseleave', function(event) {
                 $j(this).unbind('mousemove');
                });
               
               $j('#pencilDiv'+id).click(function(){
                 selectedTool='pencil';
                 removeTextAreaPopup();
                 removehighlight();
                 $j('#fontpropertiesDiv'+id).hide();
                 $j('#thicknessDiv'+id).show();
                 $j(this).addClass("highlight");
                 
               });
               
               $j('#imageupload'+id).bind('change', function(e) {
            	   if (window.File && window.FileReader && window.FileList && window.Blob) {
            		   var reader = new FileReader();
     					reader.onload = function(event){
     							var img = new Image();
     							img.onload = function(){
     								drawImage(img);
     							}
     							img.src = event.target.result;
     					}
     					reader.readAsDataURL(e.target.files[0]); 
            	   } else {
            		   alert('your browser doesnot support on the fly fileupload');
            		 } 
            	   
            	 
					//$(this).html($(this).html());   
					//alert('working'); 
               	});
               
               $j('#eraserDiv'+id).click(function(){
               	selectedTool='eraser';
               	removeTextAreaPopup();
               	removehighlight();
               	$j('#fontpropertiesDiv'+id).hide();
               	$j('#thicknessDiv'+id).show();
               	$j(this).addClass("highlight");
               });
               
               $j('#textDiv'+id).click(function(){
               	selectedTool='text';
               	removehighlight();
               	$j('#thicknessDiv'+id).hide();
               	$j('#fontpropertiesDiv'+id).show();
               	$j(this).addClass("highlight");
               });
               
                $j('#clearCanvas'+id).click(function(){
                	removeTextAreaPopup();
               	    canvas.width = canvas.width;
               	    removeTextAreaPopup();
                	$j('#encodedImage'+id).val('');

               });
                
                $j('#saveImage'+id).click(function() {
                	var dataUrl=canvas.toDataURL();
                	$j('#encodedImage'+id).val(dataUrl);
                	$j('#saveImageForm'+id).submit();
                	
                });
         
               
               $j('#boldDiv'+id).toggle(function() {
                   $j(this).addClass("highlight");
                   bold='bolder';
                   $j('#writableTextarea'+id).css('font-weight',bold);
               },
               function() {
               	 $j(this).removeClass("highlight");
                   bold='';
                   $j('#writableTextarea'+id).css('font-weight',bold);
               });
               
               $j('#italicDiv'+id).toggle(function() {
                   $j(this).addClass("highlight");
                   italic='italic';
                  $j('#writableTextarea'+id).css('font-style',italic);
               },
               function() {
               	 $j(this).removeClass("highlight");
                   italic='';
                 $j('#writableTextarea'+id).css('font-style',italic);
               });
          };
          
          this.loadExistingImage= function(dataUrl){
        	  var imageObj = new Image();
                  imageObj.onload = function() {
            	  drawImage(imageObj)
              };
                imageObj.src = dataUrl;
          };
              
              function drawImage(imageObj){
            	  if(canvas.height<imageObj.height){
            		  if(confirm("the size of image is greater than the size of canvas.this clears the canvas do you wish to continue")){
   					    canvas.height = imageObj.height;
   	                  context.drawImage(imageObj,(canvas.width/2)-(imageObj.width/2),(canvas.height/2)-(imageObj.height/2));
                      }
            	  }else{
            		  context.drawImage(imageObj,(canvas.width/2)-(imageObj.width/2),(canvas.height/2)-(imageObj.height/2));
            	  }
            }
               
             function removehighlight()
             {
             	$j.each(tools, function() {
				   $j('#'+this+'Div'+id).removeClass("highlight");

				 });
             };  
               
            function draw(x,y){
        	if(selectedTool =='pencil' || selectedTool =='eraser'){
        	        context.strokeStyle = (selectedTool == "eraser")? $j(canvas).css('background-color'):selectedColor;
		            context.lineJoin = "round";
		            context.lineCap = "round";
		            context.lineWidth = thickness;
                  	context.beginPath();
                    context.moveTo(clickX,clickY);                
		            context.lineTo(x,y);
		            context.stroke();
		            context.closePath();
		            clickX=x;
                    clickY=y;
               }
           }; 
        function removeTextAreaPopup()
        {
        	$j('#textAreaPopUp'+id).hide();
        };
        function saveTextFromArea(x,y){
                //get the value of the textarea 
                var text = $j('textarea#writableTextarea'+id).val();
                $j('textarea#writableTextarea'+id).val('');
                removeTextAreaPopup();     
                context.strokeStyle = "rgba(237,229,0,1)";
               context.fillStyle = selectedColor;
               context.font=italic+' '+bold+' '+fontSize+'px '+font;
             	context.fillText(text,x,y);
            }; 
        
        
 }             