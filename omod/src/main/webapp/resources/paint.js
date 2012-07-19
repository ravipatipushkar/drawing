function DrawingEditor(randomId) {
    var id = randomId;
    var clickX = 0;
    var clickY = 0;
    var selectedTool = "";
    var context;
    var canvas;
    var thickness = 5;
    var selectedColor = '#ff0000';
    var canvasWidth;
    var canvasHeight;
    var bold = '';
    var tools = ['pencil', 'eraser', 'text'];
    var italic = '';
    var fontSize = '24';
    var font = 'Courier New';
    var ancount = 0;
    var blueDot = "/openmrstru/moduleResources/drawing/blue-dot.png";
    var redDot = "/openmrstru/moduleResources/drawing/images/red-dot.png";
    var close = "/openmrstru/moduleResources/drawing/close.gif";
    var annotationsCollection = {};
    var formId='saveImageForm' + id;
    var submit=true;
    
    
    
    this.getSubmit=function(){
    	if(submit)
    	    return true;
    	else
    		return false;
    }
    
    this.setSubmit=function(v){
    	 submit =v;
    };
    
    this.getFormId=function(){
    	return formId;
    }
    
    this.setFormId=function(v){
    	formId =v;
    };
    
    this.getAllAnnotations = function() {
        return annotationsCollection;
    }

    this.prepareCanvas = function() {

        var canvasDiv = document.getElementById('canvasDiv' + id);
        canvas = document.createElement('canvas');
        canvasWidth = $j(canvasDiv).width() - 20;
        canvasHeight = 500;
            
        $j(canvas).attr('width', canvasWidth).attr('height', canvasHeight).attr('id', 'canvas' + id);
        canvasDiv.appendChild(canvas);
        context = canvas.getContext("2d");
        $j('#encodedImage' + id).val(canvas.toDataURL());
        $j(canvas).css('background-color', '#eee');
        $j(canvas).mousedown(function(event) {
            clickX = event.pageX - this.offsetLeft;
            clickY = event.pageY - this.offsetTop;
            if (selectedTool == 'pencil' || selectedTool == 'eraser') {
                $j(this).bind('mousemove', function(event) {
                    draw(event.pageX - this.offsetLeft, event.pageY - this.offsetTop);

                });
            } else if (selectedTool == 'text') {
                $j('#textAreaPopUp' + id).css('top', event.pageY + 'px').css('left', event.pageX + 'px').show();
                $j('#writableTextarea' + id).css('font-size', parseInt(fontSize));
                $j('#writableTextarea' + id).css('color', selectedColor);
            }
        });

        $j('#colorSelector' + id).ColorPicker({
            color: '#ff0000',
            onShow: function(colpkr) {
                $j(colpkr).fadeIn(500);
                return false;
            },
            onHide: function(colpkr) {
                $j(colpkr).fadeOut(500);
                return false;
            },
            onChange: function(hsb, hex, rgb) {
                $j('#colorSelector div' + id).css('backgroundColor', '#' + hex);
                selectedColor = '#' + hex;
                $j('#writableTextarea' + id).css('color', selectedColor);
            }
        });

        $j('#saveText' + id).click(function() {
            saveTextFromArea(clickX, clickY + parseInt(fontSize));
        });

        $j('#thickness' + id).change(function() {
            thickness = $j(this).val();
        });

        $j('#fontSize' + id).change(function() {
            fontSize = $j(this).val();
            $j('#writableTextarea' + id).css('font-size', parseInt(fontSize));

        });

        $j(canvas).bind('mouseup mouseleave', function(event) {
            $j(this).unbind('mousemove');
        });

        $j('#pencilDiv' + id).click(function() {
            selectedTool = 'pencil';
            removeTextAreaPopup();
            removehighlight();
            $j('#fontpropertiesDiv' + id).hide();
            $j('#thicknessDiv' + id).show();
            $j(this).addClass("highlight");

        });

        $j('#imageupload' + id).bind('change', function(e) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var img = new Image();
                    img.onload = function() {
                        drawImage(img);
                    }
                    img.src = event.target.result;
                }
                reader.readAsDataURL(e.target.files[0]);
            } else {
                alert('your browser doesnot support on the fly fileupload');
            }
        });

        $j('#eraserDiv' + id).click(function() {
            selectedTool = 'eraser';
            removeTextAreaPopup();
            removehighlight();
            $j('#fontpropertiesDiv' + id).hide();
            $j('#thicknessDiv' + id).show();
            $j(this).addClass("highlight");
        });

        $j('#textDiv' + id).click(function() {
            selectedTool = 'text';
            removehighlight();
            $j('#thicknessDiv' + id).hide();
            $j('#fontpropertiesDiv' + id).show();
            $j(this).addClass("highlight");
        });

        $j('#clearCanvas' + id).click(function() {
            removeTextAreaPopup();
            canvas.width = canvas.width;
            removeTextAreaPopup();
            $j('#encodedImage' + id).val('');

        });

         $j('#saveImage' + id).click(function() {
            var dataUrl = canvas.toDataURL();
            $j('#encodedImage' + id).val(dataUrl);
            var count = 0;
            $j.each(annotationsCollection, function(index, value) {
                $j('#'+formId).append('<input type="hidden" name="annotation' + id + '' + count + '" value="' + value.id + '|' + Math.round(value.position.left) + '|' + Math.round(value.position.top) + '|' + value.data + '|' + value.status + '" >');
                count++;
            });
			
            if( $j('#annotationCounter'+id).val() == null)
            $j('#'+formId).append('<input type="hidden"  id="annotationCounter'+ id +'" name="annotationCounter' + id + '" value="' + count + '"/>');
            else{
            	$j('#annotationCounter'+id).val(count);
            }
             
            if(submit)
            $j('#'+formId).submit();

        });


        $j('#boldDiv' + id).toggle(function() {
            $j(this).addClass("highlight");
            bold = 'bolder';
            $j('#writableTextarea' + id).css('font-weight', bold);
        }, function() {
            $j(this).removeClass("highlight");
            bold = '';
            $j('#writableTextarea' + id).css('font-weight', bold);
        });

        $j('#italicDiv' + id).toggle(function() {
            $j(this).addClass("highlight");
            italic = 'italic';
            $j('#writableTextarea' + id).css('font-style', italic);
        }, function() {
            $j(this).removeClass("highlight");
            italic = '';
            $j('#writableTextarea' + id).css('font-style', italic);
        });

        $j('#canvasDiv' + id).dblclick(function(event) {
            clickX = event.pageX - 9;
            clickY = event.pageY - 31;
            var annotationId = "marker" + ancount;
            ancount++;
            divx = clickX - 23;
            divy = clickY - 67;
            var v = '<div class="container"><div style="top:' + divy + 'px;left:' + divx + 'px;position:absolute;z-index:5;"><div id="' + annotationId + '_data" class="divContainerDown"><textarea style="width:98%;resize: none;"></textarea><span><a class="link save" > Save </a><a class="link" onClick="$j(\'#' + annotationId + '_data\').parent().parent().remove()"> Cancel </a></span></div><div class="calloutDown"><div class="calloutDown2"></div></div></div>';
            $j(this).append(v + '<img id="' + annotationId + '" src="' + redDot + '" style="top:' + clickY + 'px;left:' + clickX + 'px;position:absolute;z-index:4"/></div>');

            //  $j('#'+annotationId+'_data').parent().css('top', clickY-$j('#'+annotationId+'_data').parent().height());
            //  $j('#'+annotationId+'_data').parent().css('left', clickX+23-$j('#'+annotationId+'_data').parent().width()/8-5);
            $j('#' + annotationId).click(function(event) {
                $j('#' + annotationId + '_data').parent().css('top', event.pageY - $j('#' + annotationId + '_data').parent().height());
                $j('#' + annotationId + '_data').parent().css('left', event.pageX - $j('#' + annotationId + '_data').parent().width() / 8 - 5);

                $j('#' + annotationId + '_data').parent().fadeIn(500);
            });

            var p = "#" + annotationId + "_data span .save";
            $j(p + '').click({
                ele: $j(p + '').parent().parent()
            }, function(e) {
                saveAnnotation(e.data.ele);
            });
        });


    };

    this.createMarker = function(identification, x, y, text, stat) {
        var annotationId = "marker"+ id + ancount;
        ancount++;
        y = y + $j('#canvasDiv' + id).offset().top;
        x = x + $j('#canvasDiv' + id).offset().left;
        var annDivData = "<img src='" + close + "' style='float:right' onClick='$j(this).parent().parent().fadeOut(500)'/><span style='background-color:white'>" + text + "</span></br><span><a class='link move'> Move </a> <a  class='edit link'> Edit </a> <a class='link delete'> Delete </a></span>";
        var v = '<div class="container"><div style="position:absolute;z-index:5;display:none"><div id="' + annotationId + '_data" class="divContainerDown">' + annDivData + '</div><div class="calloutDown"><div class="calloutDown2"></div></div></div>';
        $j('#canvasDiv' + id).append(v + '<img id="' + annotationId + '" src="' + redDot + '" style="top:' + y + 'px;left:' + x + 'px;position:absolute;z-index:4"/></div>');
        $j('#' + annotationId).click(function(event) {
            $j('#' + annotationId + '_data').parent().css('top', event.pageY - $j('#' + annotationId + '_data').parent().height());
            $j('#' + annotationId + '_data').parent().css('left', event.pageX - $j('#' + annotationId + '_data').parent().width() / 8 - 5);
            $j('#' + annotationId + '_data').parent().fadeIn(500);
        });
        setHandlers($j('#' + annotationId + '_data'));
        annotationsCollection[annotationId + '_data'] = {
            data: text,
            position: {
                top: y,
                left: x
            },
            id: identification,
            status: stat
        };

    }

    this.loadExistingImage = function(dataUrl) {
        var imageObj = new Image();
        imageObj.onload = function() {
            drawImage(imageObj);
            var dataUrl = canvas.toDataURL();
            $j('#encodedImage' + id).val(dataUrl);
            
        };
        imageObj.src = dataUrl;
    };

    function saveAnnotation(v) {
    	$j(v).parent().fadeOut(500);
        var s = $j(v).children('textarea').val();
        var changedHtml = "<img src='" + close + "' style='float:right' onClick='$j(this).parent().parent().fadeOut(500)'/><span style='background-color:white'>" + s + "</span></br><span><a class='link move'> Move </a> <a  class='edit link'> Edit </a> <a class='link delete'> Delete </a></span>";
        $j(v).html(changedHtml);
        setHandlers(v);
        if (annotationsCollection[$j(v).attr('id')] == null) annotationsCollection[$j(v).attr('id')] = {
            data: s,
            position: getrelativePosition($j(v).parent().parent().children('img').position()),
            id: -1,
            status: 'CHANGED'
        };
        else {
            annotationsCollection[$j(v).attr('id')].data = s;
            annotationsCollection[$j(v).attr('id')].position = getrelativePosition($j(v).parent().parent().children('img').position());
            annotationsCollection[$j(v).attr('id')].status = 'CHANGED';
        }
        
    }

    function getrelativePosition(obj) {
        obj.top = obj.top - $j('#canvasDiv' + id).offset().top;
        obj.left = obj.left - $j('#canvasDiv' + id).offset().left;
        return obj;

    }

    function editOnClick(v) {

        var k = $j(v).children('span:first').text();
        $j(v).data('value', k);
        $j(v).html('<textarea style="width:98%;resize: none;">' + k + '</textarea><span><a class="link save" > Save </a><a class="link resetAfterCancel" > Cancel </a></span>');
        $j(v).children('span:last').children('.save').click({
            ele: v
        }, function(event) {
            saveAnnotation(event.data.ele);
        });
        $j(v).children('span:last').children('.resetAfterCancel').click({
            ele: v
        }, function(event) {
            resetAfterCancel(event.data.ele);
        });

    }

    function moveOnClick(v) {
        alert('not yet implemented');
    }


    function resetAfterCancel(k) {
        var s = $j(k).data('value');
        var changedHtml = "<img src='" + close + "' style='float:right' onClick='$j(this).parent().parent().fadeOut(500)'/><span style='background-color:white'>" + s + "</span></br><span><a class='link move'> Move </a> <a  class='edit link'> Edit </a> <a class='link delete'> Delete </a></span>";
        $j(k).html(changedHtml);
        setHandlers(k);
    }

    function setHandlers(v) {
        $j(v).children('span:last').children('.edit').click({
            ele: v
        }, function(event) {
            editOnClick(event.data.ele);
        });
        $j(v).children('span:last').children('.delete').click({
            ele: v
        }, function(event) {
            deleteAnnotation(event.data.ele);
        });
        $j(v).children('span:last').children('.move').click({
            ele: v
        }, function(event) {
            moveOnClick(event.data.ele);
        });
    }



    function deleteAnnotation(v) {
        if (annotationsCollection[$j(v).attr('id')].id == -1)
        	delete annotationsCollection[$j(v).attr('id')];
        else 
        	annotationsCollection[$j(v).attr('id')].status = 'DELETE';
        $j(v).parent().parent().remove();
    }

    function drawImage(imageObj) {
        if (canvas.height < imageObj.height) {
            if (confirm("the size of image is greater than the size of canvas.this clears the canvas do you wish to continue")) {
                canvas.height = imageObj.height;
                //context.drawImage(imageObj,(canvas.width/2)-(imageObj.width/2),(canvas.height/2)-(imageObj.height/2));
                context.drawImage(imageObj, 0, 0);
            }
        } else {
            context.drawImage(imageObj, 0, 0);
            //context.drawImage(imageObj,(canvas.width/2)-(imageObj.width/2),(canvas.height/2)-(imageObj.height/2));
        }
    }

    function removehighlight() {
        $j.each(tools, function() {
            $j('#' + this + 'Div' + id).removeClass("highlight");

        });
    };

    function draw(x, y) {
        if (selectedTool == 'pencil' || selectedTool == 'eraser') {
            context.strokeStyle = (selectedTool == "eraser") ? $j(canvas).css('background-color') : selectedColor;
            context.lineJoin = "round";
            context.lineCap = "round";
            context.lineWidth = thickness;
            context.beginPath();
            context.moveTo(clickX, clickY);
            context.lineTo(x, y);
            context.stroke();
            context.closePath();
            clickX = x;
            clickY = y;
        }
    };

    function removeTextAreaPopup() {
        $j('#textAreaPopUp' + id).hide();
    };

    function saveTextFromArea(x, y) {
        //get the value of the textarea 
        var text = $j('textarea#writableTextarea' + id).val();
        $j('textarea#writableTextarea' + id).val('');
        removeTextAreaPopup();
        context.strokeStyle = "rgba(237,229,0,1)";
        context.fillStyle = selectedColor;
        context.font = italic + ' ' + bold + ' ' + fontSize + 'px ' + font;
        context.fillText(text, x, y);
    };


}