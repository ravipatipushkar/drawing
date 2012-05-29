         var clickX=0;
         var clickY=0;
         var selectedool="";
         var context;
         var canvas;
         var thickness=5;
         var selectedColor='red';
         var canvasWidth;
         var canvasHeight;
         var bold='';
         var tools=['pencil','eraser','text'];
         var italic='';
         var fontSize='40';
         var font='Courier New';
         
          function prepareCanvas(parentDivId){
          	
          	   var canvasDiv = document.getElementById(parentDivId);
          	   canvas = document.createElement('canvas');
          	   canvasWidth=$j(canvasDiv).width()-20;
               canvasHeight=500;
              
	           $j(canvas).attr('width', canvasWidth).attr('height', canvasHeight).attr('id', 'canvas');
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
                    $j('#textAreaPopUp').css('top',event.pageY+'px').css('left',event.pageX+'px').show();
                }
                 
              });
               
               
               $j('#colorSelector').ColorPicker({
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
							$j('#colorSelector div').css('backgroundColor', '#' + hex);
							selectedColor='#'+hex;
							
					}
				});
              
                $j('#saveText').click(function() {
                    saveTextFromArea(clickX,clickY+parseInt(fontSize));   
                    
                });
                
                $j('#thickness').change(function() {
                     thickness=$j(this).val();     
               });
               
                $j('#fontSize').change(function() {
                     fontSize=$j(this).val();  
                     $j('#writableTextarea').css('font-size',parseInt(fontSize));
               });
               
               $j(canvas).bind('mouseup mouseleave', function(event) {
                 $j(this).unbind('mousemove');
                });
               
               $j('#pencilDiv').click(function(){
                 selectedTool='pencil';
                 removeTextAreaPopup();
                 removehighlight();
                 $j('#fontpropertiesDiv').hide();
                 $j('#thicknessDiv').show();
                 $j(this).addClass("highlight");
                 
               });
               
               $j('#eraserDiv').click(function(){
               	selectedTool='eraser';
               	removeTextAreaPopup();
               	removehighlight();
               	$j('#fontpropertiesDiv').hide();
               	$j('#thicknessDiv').show();
               	$j(this).addClass("highlight");
               });
               
               $j('#textDiv').click(function(){
               	selectedTool='text';
               	removehighlight();
               	$j('#thicknessDiv').hide();
               	$j('#fontpropertiesDiv').show();
               	$j(this).addClass("highlight");
               });
               
                $j('#clearcanvas').click(function(){
                	removeTextAreaPopup();
               	    canvas.width = canvas.width;
               	    removeTextAreaPopup();
               });
               
               $j('#boldDiv').toggle(function() {
                   $j(this).addClass("highlight");
                   bold='bolder';
                   $j('#writableTextarea').css('font-weight',bold);
               },
               function() {
               	 $j(this).removeClass("highlight");
                   bold='';
                   $j('#writableTextarea').css('font-weight',bold);
               });
               
               $j('#italicDiv').toggle(function() {
                   $j(this).addClass("highlight");
                   italic='italic';
                  $j('#writableTextarea').css('font-style',italic);
               },
               function() {
               	 $j(this).removeClass("highlight");
                   italic='';
                 $j('#writableTextarea').css('font-style',italic);
               });
          }
               
             function removehighlight()
             {
             	$j.each(tools, function() {
				   $j('#'+this+'Div').removeClass("highlight");
				   
				 });
             }  
               
            function draw(x,y){
        	if(selectedTool =='pencil' || selectedTool =='eraser'){
        	        context.strokeStyle = (selectedTool == "eraser")? $j(canvas).css('background-color'):selectedColor;
		            context.lineJoin = "round";
		            context.lineWidth = thickness;
                  	context.beginPath();
                    context.moveTo(clickX,clickY);                
		            context.lineTo(x,y);
		            context.closePath();
		            context.stroke();
		            clickX=x;
                    clickY=y;
               }
           } 
        function removeTextAreaPopup()
        {
        	$j('#textAreaPopUp').hide();
        }
        function saveTextFromArea(x,y){
                //get the value of the textarea 
                var text = $j('textarea#writableTextarea').val();
                $j('textarea#writableTextarea').val('');
                removeTextAreaPopup();
                context.strokeStyle = "rgba(237,229,0,1)";
               context.font=italic+' '+bold+' '+fontSize+'px '+font;
             	context.fillText(text,x,y);
            }        
                
              
