function DrawingEditor(randomId) {
    var id = randomId;
    var clickX = 0;
    var clickY = 0;
    var selectedTool = "";
    var context;
    var canvas;
    var thickness = 6;
    var selectedColor = '#ff0000';
    var canvasWidth;
    var canvasHeight;
    var bold = '';
    var tools = ['pencil', 'eraser', 'text', 'cursor'];
    var italic = '';
    var fontSize = '25';
    var font = 'Courier New';
    var ancount = 0;
    var blueDot = openmrsContextPath + "/moduleResources/drawing/blue-dot.png";
    var redDot = openmrsContextPath + "/moduleResources/drawing/images/red-dot.png";
    var close = openmrsContextPath + "/moduleResources/drawing/close.gif";
    var annotationsCollection = {};
    var formId = 'saveImageForm' + id;
    var submit = true;
    var currentLoadedImage = null;
    var currentLoadedImageCoordinates = {
        x: 0,
        y: 0
    };
    var imageMoveCoordinates = {
        x: null,
        y: null
    };
    var clicked = {};
    var imageCanBeMoved = false;




    this.getSubmit = function() {
        if (submit) return true;
        else return false;
    }

    this.setSubmit = function(v) {
        submit = v;
    };

    this.getFormId = function() {
        return formId;
    }

    this.setFormId = function(v) {
        formId = v;
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
        $j(canvas).mousedown(function(event) {
            clickX = getRelativeLeft(event.pageX) - this.offsetLeft;
            clickY = getRelativeTop(event.pageY) - this.offsetTop;
			//alert(event.pageX+'   '+event.pageY);
			//alert(clickX+'      '+clickY);
            if (selectedTool == "cursor") {
                clicked = {
                    x: clickX,
                    y: clickY
                };
                console.log(clickX.between(currentLoadedImageCoordinates.x, currentLoadedImage.width + currentLoadedImageCoordinates.x) && clickY.between(currentLoadedImageCoordinates.y, currentLoadedImage.height + currentLoadedImageCoordinates.y));

                if (currentLoadedImage != null && clickX.between(currentLoadedImageCoordinates.x, currentLoadedImage.width + currentLoadedImageCoordinates.x) && clickY.between(currentLoadedImageCoordinates.y, currentLoadedImage.height + currentLoadedImageCoordinates.y)) {
                    $j(this).css('cursor', 'move');
                    $j(this).bind('mousemove', function(event) {
                        imageCanBeMoved = true;
                        clearCanvas();
                        imageMoveCoordinates.x =getRelativeLeft(event.pageX) - this.offsetLeft - clicked.x;
                        imageMoveCoordinates.y = getRelativeTop(event.pageY) - this.offsetTop - clicked.y;
                        console.log(imageMoveCoordinates.x + "      " + imageMoveCoordinates.y);
                        drawImage(currentLoadedImage, currentLoadedImageCoordinates.x + imageMoveCoordinates.x, currentLoadedImageCoordinates.y + imageMoveCoordinates.y);
                    });
                }
            } else if (selectedTool == 'pencil' || selectedTool == 'eraser') {
                $j(this).bind('mousemove', function(event) {
                    draw(getRelativeLeft(event.pageX) - this.offsetLeft, getRelativeTop(event.pageY) - this.offsetTop);

                });
            } else if (selectedTool == 'text') {
                $j('#textAreaPopUp' + id).css('top', event.pageY + 'px').css('left', event.pageX + 'px').show();
                $j('#writableTextarea' + id).css('font-size', parseInt(fontSize));
                $j('#writableTextarea' + id).css('color', selectedColor);
            }
        });
        $j( "#fontSlider"+id ).slider({
		     value:25,
		     change: function(event, ui) { 
                fontSize=ui.value;
			 }
		});
		$j( "#thicknessSlider"+id ).slider({
		     value:6,
			 max:50,
		     change: function(event, ui) { 
                thickness=ui.value;
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
            if (selectedTool == "cursor") {
                if (currentLoadedImage != null && imageCanBeMoved) {
                    currentLoadedImageCoordinates.x = currentLoadedImageCoordinates.x + imageMoveCoordinates.x;
                    currentLoadedImageCoordinates.y = currentLoadedImageCoordinates.y + imageMoveCoordinates.y;
                    imageCanBeMoved = false;
                    $j(this).css('cursor', 'default');
                }
            }
        });

        $j('#pencilDiv' + id).click(function() {
            selectedTool = 'pencil';
            removeTextAreaPopup();
            removehighlight();
            $j('#fontpropertiesDiv' + id).hide();
            $j('#thicknessDiv' + id).show();
            $j(this).addClass("highlight");

        });

        $j('#imageUpload' + id).bind('change', function(e) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var img = new Image();
                    img.onload = function() {
                        currentLoadedImage = this;
                        drawImage(img, 0, 0);
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

        $j('#cursorDiv' + id).click(function() {
            selectedTool = 'cursor';
            removeTextAreaPopup();
            removehighlight();
            $j('#fontpropertiesDiv' + id).hide();
            $j('#thicknessDiv' + id).show();
            $j(this).addClass("highlight");
        });

        $j('#clearCanvas' + id).click(function() {
            currentLoadedImage = null;
            currentLoadedImageCoordinates = {
                x: 0,
                y: 0
            };
            clearCanvas();
        });

        $j('#saveImage' + id).click(function() {
            var dataUrl = canvas.toDataURL();
            $j('#encodedImage' + id).val(dataUrl);
            var count = 0;
            $j(':hidden').remove('.annotationhiddenFields'+id);
            $j.each(annotationsCollection, function(index, value) {
                $j('#' + formId).append('<input type="hidden" class="annotationhiddenFields'+id+'" name="annotation' + id + '' + count + '" value="' + value.id + '|' + Math.round(value.position.left) + '|' + Math.round(value.position.top) + '|' + value.data + '|' + value.status + '" >');
                count++;
            });

            if ($j('#annotationCounter' + id).val() == null) 
            	$j('#' + formId).append('<input type="hidden"  id="annotationCounter' + id + '" name="annotationCounter' + id + '" value="' + count + '"/>');
            else 
                $j('#annotationCounter' + id).val(count);
            
            $j('#saveNotification'+id).fadeIn(500).delay(2000).fadeOut(500);
            if (submit) 
            	$j('#' + formId).submit();

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
            clickX = getRelativeLeft(event.pageX) - 9;
            clickY = getRelativeTop(event.pageY) - 31;
            var annotationId = "marker" + ancount;
            ancount++;
            divx = clickX - 23;
            divy = clickY - 67;
            var v = '<div class="container"><div style="top:' + divy + 'px;left:' + divx + 'px;position:absolute;z-index:5;"><div id="' + annotationId + '_data" class="divContainerDown"><textarea style="width:98%;resize: none;"></textarea><span><a class="link save" > Save </a><a class="link" onClick="$j(\'#' + annotationId + '_data\').parent().parent().remove()"> Cancel </a></span></div><div class="calloutDown"><div class="calloutDown2"></div></div></div>';
            $j(this).append(v + '<img id="' + annotationId + '" src="' + redDot + '" style="top:' + clickY + 'px;left:' + clickX + 'px;position:absolute;z-index:4"/></div>');

            $j('#' + annotationId).click(function(event) {
                $j('#' + annotationId + '_data').parent().css('top', getRelativeTop(event.pageY) - $j('#' + annotationId + '_data').parent().height());
                $j('#' + annotationId + '_data').parent().css('left', getRelativeLeft(event.pageX) - $j('#' + annotationId + '_data').parent().width() / 8 - 5);

                $j('#' + annotationId + '_data').parent().fadeIn(500);
            });

            var p = "#" + annotationId + "_data span .save";
            $j(p + '').click(function() {
                saveAnnotation($j(this).parent().parent());
            });
        });

        Number.prototype.between = function(first, last) {
            return (first < last ? this >= first && this <= last : this >= last && this <= first);

        }



    };
	
	function getRelativeTop(top){
	          return top-$j('#canvasDiv' + id).offset().top;
	}
	
	function getRelativeLeft(left){
	         return left-$j('#canvasDiv' + id).offset().left;
	}

    this.createMarker = function(identification, x, y, text, stat) {
        var annotationId = "marker" + id + ancount;
        ancount++;
        var annDivData = "<img src='" + close + "' style='float:right' onClick='$j(this).parent().parent().fadeOut(500)'/><span style='background-color:white'>" + text + "</span></br><span><a class='link move'> Move </a> <a  class='edit link'> Edit </a> <a class='link delete'> Delete </a></span>";
        var v = '<div class="container"><div style="position:absolute;z-index:5;display:none"><div id="' + annotationId + '_data" class="divContainerDown">' + annDivData + '</div><div class="calloutDown"><div class="calloutDown2"></div></div></div>';
        $j('#canvasDiv' + id).append(v + '<img id="' + annotationId + '" src="' + redDot + '" style="top:' + y + 'px;left:' + x + 'px;position:absolute;z-index:4"/></div>');
        
        setHandlers($j('#' + annotationId + '_data'));
		$j('#' + annotationId).click(function(event) {
            $j('#' + annotationId + '_data').parent().css('top', getRelativeTop(event.pageY) - $j('#' + annotationId + '_data').parent().height());
            $j('#' + annotationId + '_data').parent().css('left', getRelativeLeft(event.pageX) - $j('#' + annotationId + '_data').parent().width() / 8 - 5);
            $j('#' + annotationId + '_data').parent().fadeIn(500);
        });
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
            drawImage(imageObj, 0, 0);
            var dataUrl = canvas.toDataURL();
            $j('#encodedImage' + id).val(dataUrl);

        };
        imageObj.src = dataUrl;
    };

    function saveAnnotation(v) {
        $j(v).parent().fadeOut(500);
        var s = $j(v).children('textarea').val();
        if (annotationsCollection[$j(v).attr('id')] == null) annotationsCollection[$j(v).attr('id')] = {
            data: s,
            position: $j(v).parent().parent().children('img').position(),
            id: -1,
            status: 'CHANGED'
        };
        else {
		     if(!(typeof s === 'undefined'))
            annotationsCollection[$j(v).attr('id')].data = s;
            annotationsCollection[$j(v).attr('id')].position = $j(v).parent().parent().children('img').position();
            annotationsCollection[$j(v).attr('id')].status = 'CHANGED';
        }
		var changedHtml = "<img src='" + close + "' style='float:right' onClick='$j(this).parent().parent().fadeOut(500)'/><span style='background-color:white'>" + annotationsCollection[$j(v).attr('id')].data + "</span></br><span><a class='link move'> Move </a> <a  class='edit link'> Edit </a> <a class='link delete'> Delete </a></span>";
        $j(v).html(changedHtml);
        setHandlers(v);
        placeMarker(v);

    }

    function editOnClick(v) {

        var k = $j(v).children('span:first').text();
        $j(v).html('<textarea style="width:98%;resize: none;">' + k + '</textarea><span><a class="link save" > Save </a><a class="link resetAfterCancel" > Cancel </a></span>');
        $j(v).children('span:last').children('.save').click(function() {
            saveAnnotation($j(this).parent().parent());
        });
        $j(v).children('span:last').children('.resetAfterCancel').click(function() {
            resetAfterCancel($j(this).parent().parent());
        });

    }

    function moveOnClick(v) {
        var changedHtml = "<img src='" + close + "' style='float:right' onClick='$j(this).parent().parent().fadeOut(500)'/><span style='background-color:white'>place it here ?</span></br><span><a class='link save'> Save </a> <a  class='resetAfterCancel link'> Cancel </a></span>";
        $j(v).parent().parent().children('img').attr('src',blueDot);
		$j(v).parent().hide();
		$j(v).html(changedHtml);
		$j(v).children('span:last').children('.save').click(function() {
            saveAnnotation($j(this).parent().parent());
        });
        $j(v).children('span:last').children('.resetAfterCancel').click(function() {
            resetAfterCancel($j(this).parent().parent());
        });
        
        $j(v).parent().parent().children('img').draggable(
			{
				zIndex: 	4,
				containment : '#canvasDiv'+id,
				start: function(event, ui) { 
				    var calloutId=$j(this).attr('id')+'_data';
					$j('#'+calloutId).parent().hide();
				},
				stop: function(event, ui) { 
				    var calloutId=$j(this).attr('id')+'_data';
					setCallOut(this);
					$j('#'+calloutId).parent().show();
				}
			});
    }
	
	function setCallOut(image)
	{
	    var imageId=$j(image).attr('id');
	    $j('#' + imageId + '_data').parent().css('top', $j(image).position().top - $j('#' + imageId + '_data').parent().height());
            $j('#' + imageId + '_data').parent().css('left', $j(image).position().left+$j(image).width()/2 - $j('#' + imageId + '_data').parent().width() / 8 - 5);
	}
	
	function placeMarker(v){
		var marker=$j(v).parent().parent().children('img');
		marker.attr('style','top:'+Math.round(annotationsCollection[$j(v).attr('id')].position.top)+'px;left:'+Math.round(annotationsCollection[$j(v).attr('id')].position.left)+'px;position:absolute;z-index:4');
		marker.attr('src',redDot);
	    marker.draggable( 'destroy' );
	}


    function resetAfterCancel(k) {
        var changedHtml = "<img src='" + close + "' style='float:right' onClick='$j(this).parent().parent().fadeOut(500)'/><span style='background-color:white'>" +annotationsCollection[$j(k).attr('id')].data + "</span></br><span><a class='link move'> Move </a> <a  class='edit link'> Edit </a> <a class='link delete'> Delete </a></span>";
        $j(k).html(changedHtml);
        setHandlers(k);
		placeMarker(k);
		$j(k).parent().hide();
    }
	
	

    function setHandlers(v) {
        $j(v).children('span:last').children('.edit').click(function() {
            editOnClick($j(this).parent().parent());
        });
        $j(v).children('span:last').children('.delete').click(function() {
            deleteAnnotation($j(this).parent().parent());
        });
        $j(v).children('span:last').children('.move').click(function() {
            moveOnClick($j(this).parent().parent());
        });
    }



    function deleteAnnotation(v) {
        if (annotationsCollection[$j(v).attr('id')].id == -1) delete annotationsCollection[$j(v).attr('id')];
        else annotationsCollection[$j(v).attr('id')].status = 'DELETE';
        $j(v).parent().parent().remove();
    }

    function drawImage(imageObj, x, y) {
        if (canvas.height < imageObj.height) {
            if (confirm("the size of image is greater than the size of canvas.this clears the canvas do you wish to continue")) {
                canvas.height = imageObj.height;
                //context.drawImage(imageObj,(canvas.width/2)-(imageObj.width/2),(canvas.height/2)-(imageObj.height/2));
                context.drawImage(imageObj, x, y);
            }
        } else {
            context.drawImage(imageObj, x, y);
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
            context.strokeStyle = (selectedTool == "eraser") ? '#ffffff' : selectedColor;
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

    function clearCanvas() {

        removeTextAreaPopup();
        canvas.width = canvas.width;
        removeTextAreaPopup();
        $j('#encodedImage' + id).val(canvas.toDataURL());
    }

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