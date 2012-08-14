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
    var redDot = openmrsContextPath + "/moduleResources/drawing/red-dot.png";
    var close = openmrsContextPath + "/moduleResources/drawing/close.gif";
    var annotationsCollection = {};
    var formId = 'saveImageForm' + id;
    var submit = true;
    var currentLoadedImage = null;
    var undoCollection = [];
    var redoCollection = [];
    var imageCollection = [];
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
                        imageMoveCoordinates.x = getRelativeLeft(event.pageX) - this.offsetLeft - clicked.x;
                        imageMoveCoordinates.y = getRelativeTop(event.pageY) - this.offsetTop - clicked.y;
                        console.log(imageMoveCoordinates.x + "      " + imageMoveCoordinates.y);
                        reDraw();
                        drawImage(currentLoadedImage, currentLoadedImageCoordinates.x + imageMoveCoordinates.x, currentLoadedImageCoordinates.y + imageMoveCoordinates.y);
                    });
                }
            } else if (selectedTool == 'pencil' || selectedTool == 'eraser') {
                addClick(clickX, clickY, false, selectedTool);
                $j(this).bind('mousemove', function(event) {
                    addClick(getRelativeLeft(event.pageX) - this.offsetLeft, getRelativeTop(event.pageY) - this.offsetTop, true, selectedTool);
                    draw(getRelativeLeft(event.pageX) - this.offsetLeft, getRelativeTop(event.pageY) - this.offsetTop);

                });
            } else if (selectedTool == 'text') {
                $j('#textAreaPopUp' + id).css('top', event.pageY + 'px').css('left', event.pageX + 'px').show();
                $j('#writableTextarea' + id).css('font-size', parseInt(fontSize));
                $j('#writableTextarea' + id).css('color', selectedColor);
            }
        });
		
		
		$j('#drawingTab').click(function(){
		  if($j(canvas).width() < $j('#canvasDiv'+id).width()-20){
			  canvas.width=$j('#canvasDiv'+id).width()-20;
		}
		});
		
        $j("#fontSlider" + id).slider({
            value: 25,
            change: function(event, ui) {
                fontSize = ui.value;
            }
        });
        $j("#thicknessSlider" + id).slider({
            value: 6,
            max: 50,
            change: function(event, ui) {
                thickness = ui.value;
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
        
        
        $j.expr[':'].Contains = function(a, i, m) { 
            return $j(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
         };
		
		$j('#searchTemplates').keyup(function(){
		     var search=$j(this).val();
			  $j('.templateName').parent().show();
			  if($j.trim(search) != ' ')
			  $j('.templateName:not(:Contains('+search+'))').parent().hide();
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
                        drawMovableImage(this);
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
            addClick(0, 0, false, "clear");
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
            $j(':hidden').remove('.annotationhiddenFields' + id);
            $j.each(annotationsCollection, function(index, value) {
                $j('#' + formId).append('<input type="hidden" class="annotationhiddenFields' + id + '" name="annotation' + id + '' + count + '" value="' + value.id + '|' + Math.round(value.position.left) + '|' + Math.round(value.position.top) + '|' + value.data + '|' + value.status + '" >');
                count++;
            });

            if ($j('#annotationCounter' + id).val() == null) $j('#' + formId).append('<input type="hidden"  id="annotationCounter' + id + '" name="annotationCounter' + id + '" value="' + count + '"/>');
            else $j('#annotationCounter' + id).val(count);

            $j('#saveNotification' + id).fadeIn(500).delay(2000).fadeOut(500);
            if (submit) $j('#' + formId).submit();

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

        $j('#doneMoving' + id).click(function() {
            $j('.tool').show();
            $j('.dependendTool').hide();
            
            $j(this).hide();
            $j('#pencilDiv' + id).trigger('click');
            if (currentLoadedImage != null) {
                imageCollection.push(currentLoadedImage);
                addClick(currentLoadedImageCoordinates.x, currentLoadedImageCoordinates.y, false, "cursor");

            }
            currentLoadedImage = null;
            currentLoadedImageCoordinates = {
                x: 0,
                y: 0
            };
            imageMoveCoordinates = {
                x: null,
                y: null
            };

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

        $j('#undoDiv' + id).mousedown(function() {
            $j(this).addClass("highlight");
			var v=parseInt($j('#undoRedoRate'+id).val().split('x',1));
            for	(var i=0;i<v;i++)	{
            if (undoCollection.length <= 0) 
			    break;
                redoCollection.push(undoCollection.pop());
			}
			clearCanvas();
			reDraw();
        });
		
        $j('#undoDiv' + id).mouseup(function() {
            $j(this).removeClass("highlight");
        });
        
        
        $j('#redoDiv' + id).mousedown(function() {
            $j(this).addClass("highlight");
			var v=parseInt($j('#undoRedoRate'+id).val().split('x',1));
            for	(var i=0;i<v;i++)	{
            if (redoCollection.length <= 0) 
			      break;
                undoCollection.push(redoCollection.pop());
			}
			clearCanvas();
			reDraw();
        });
		
		$j('#redoDiv' + id).mouseup(function() {
            $j(this).removeClass("highlight");
        });
		
        $j('#templateImage'+id).click(function() {
        	
            drawMovableImage(this);
            $j('#templatesDialog' + id).dialog('close');

        });

        $j('.templateName').click(function() {
            $j.post(openmrsContextPath + "/module/drawing/getTemplate.form",{templateName: $j(this).html()}, function(data) {
                $j('#templateImage'+id).attr('src', data);
            }).error(function() {
                alert('Unable load Template');
            });

        });
        
        
		
        $j('.templateName').hover(function() {
            $j(this).css({
                color: '#1AAD9B'
            });
        }, function() {
            $j(this).css({
                color: 'black'
            });
        });

        $j('#showTemplates' + id).click(function() {
            $j('#templatesDialog' + id).dialog('open');
        });

        $j('#templatesDialog' + id).dialog({
            autoOpen: false,
            modal: true,
            resizable: false,
            draggable: false,
            width: 1000,
            height: 500,
            buttons: {
                "Cancel": function() {
                    $j(this).dialog("close");
                }
            }
        });
        
        $j('#annotationsVisibility'+id).toggle(hideAnnotations,showAnnotations);

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
    
    function showAnnotations(){
    	$j('#annotationsVisibility'+id).html('Hide Annotations');
    	$j('.container'+id).show();
    }
    
    function hideAnnotations(){
    	$j('#annotationsVisibility'+id).html('Show Annotations');
    	$j('.container'+id).hide();
    }

    function addClick(x, y, dragging, tool) {
        redoCollection = [];
        if (tool === "text") {
            undoCollection.push({
                clickX: x,
                clickY: y,
                clickTool: tool,
                clickColor: selectedColor,
                fontThickness: fontSize,
                clickDrag: dragging,
                italicStyle: italic,
                boldStyle: bold,
                text: $j('textarea#writableTextarea' + id).val()
            });
        } else if (tool === "cursor") {
            undoCollection.push({
                clickX: x,
                clickY: y,
                clickTool: tool,
                image: imageCollection.pop()
            });
        } else if (tool === "clear") {
            undoCollection.push({
                clickTool: tool
            });
        } else {
            undoCollection.push({
                clickX: x,
                clickY: y,
                clickTool: tool,
                clickColor: selectedColor,
                clickThickness: thickness,
                clickDrag: dragging
            });
        }
    }

    function drawMovableImage(k) {
        var img = new Image();
        img.src = k.src;
        currentLoadedImage = img;
        currentLoadedImageCoordinates = {
            x: 0,
            y: 0
        };
        prepareForImageMoving();
        reDraw();
        drawImage(img, 0, 0);

    }

    function prepareForImageMoving() {
        $j('#cursorDiv' + id).trigger('click');
        $j('.tool').hide();
        $j('#doneMoving'+id).show();
    }

    function getLastClearIndex() {
        for (var j = undoCollection.length - 1; j >= 0; j--) {
            if (undoCollection[j].clickTool === "clear") {
                return j;
            }
        }
        return 0;

    }


    function reDraw() {
        for (i = getLastClearIndex(); i < undoCollection.length; i += 1) {
            if (undoCollection[i].clickTool === "text") {
                writeText(undoCollection[i].clickX, undoCollection[i].clickY, undoCollection[i].clickColor, undoCollection[i].italicStyle, undoCollection[i].boldStyle, undoCollection[i].fontThickness, undoCollection[i].text);
            } else if (undoCollection[i].clickTool === "cursor") {
                drawImage(undoCollection[i].image, undoCollection[i].clickX, undoCollection[i].clickY);
            } else if (undoCollection[i].clickTool === "clear") {
                //never comes to this case
                continue;
            } else {
                context.beginPath();
                if (undoCollection[i].clickDrag && i) {
                    context.moveTo(undoCollection[i - 1].clickX, undoCollection[i - 1].clickY);
                } else {
                    context.moveTo(undoCollection[i].clickX - 1, undoCollection[i].clickY);
                }
                context.lineTo(undoCollection[i].clickX, undoCollection[i].clickY);

                // Set the drawing color
                if (undoCollection[i].clickTool === "eraser") {
                    context.strokeStyle = 'white';
                } else {
                    context.strokeStyle = undoCollection[i].clickColor;
                }
                context.lineCap = "round";
                context.lineJoin = "round";
                context.lineWidth = undoCollection[i].clickThickness;
                context.stroke();
                context.closePath();
            }

        }



    }


    function getRelativeTop(top) {
        return top - $j('#canvasDiv' + id).offset().top;
    }

    function getRelativeLeft(left) {
        return left - $j('#canvasDiv' + id).offset().left;
    }

    this.createMarker = function(identification, x, y, text, stat) {
        var annotationId = "marker" + id + ancount;
        ancount++;
        var annDivData = "<img src='" + close + "' style='float:right' onClick='$j(this).parent().parent().fadeOut(500)'/><span style='background-color:white'>" + text + "</span></br><span><a class='link move'> Move </a> <a  class='edit link'> Edit </a> <a class='link delete'> Delete </a></span>";
        var v = '<div class="container'+id+'"><div style="position:absolute;z-index:5;display:none"><div id="' + annotationId + '_data" class="divContainerDown">' + annDivData + '</div><div class="calloutDown"><div class="calloutDown2"></div></div></div>';
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
            imageCollection.push(imageObj);
			addClick(0,0,false,'cursor');
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
            if (!(typeof s === 'undefined')) annotationsCollection[$j(v).attr('id')].data = s;
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
        $j(v).parent().parent().children('img').attr('src', blueDot);
        $j(v).parent().hide();
        $j(v).html(changedHtml);
        $j(v).children('span:last').children('.save').click(function() {
            saveAnnotation($j(this).parent().parent());
        });
        $j(v).children('span:last').children('.resetAfterCancel').click(function() {
            resetAfterCancel($j(this).parent().parent());
        });

        $j(v).parent().parent().children('img').draggable({
            zIndex: 4,
            containment: '#canvasDiv' + id,
            start: function(event, ui) {
                var calloutId = $j(this).attr('id') + '_data';
                $j('#' + calloutId).parent().hide();
            },
            stop: function(event, ui) {
                var calloutId = $j(this).attr('id') + '_data';
                setCallOut(this);
                $j('#' + calloutId).parent().show();
            }
        });
    }

    function setCallOut(image) {
        var imageId = $j(image).attr('id');
        $j('#' + imageId + '_data').parent().css('top', $j(image).position().top - $j('#' + imageId + '_data').parent().height());
        $j('#' + imageId + '_data').parent().css('left', $j(image).position().left + $j(image).width() / 2 - $j('#' + imageId + '_data').parent().width() / 8 - 5);
    }

    function placeMarker(v) {
        var marker = $j(v).parent().parent().children('img');
        marker.attr('style', 'top:' + Math.round(annotationsCollection[$j(v).attr('id')].position.top) + 'px;left:' + Math.round(annotationsCollection[$j(v).attr('id')].position.left) + 'px;position:absolute;z-index:4');
        marker.attr('src', redDot);
        marker.draggable('destroy');
    }


    function resetAfterCancel(k) {
        var changedHtml = "<img src='" + close + "' style='float:right' onClick='$j(this).parent().parent().fadeOut(500)'/><span style='background-color:white'>" + annotationsCollection[$j(k).attr('id')].data + "</span></br><span><a class='link move'> Move </a> <a  class='edit link'> Edit </a> <a class='link delete'> Delete </a></span>";
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
                canvas.height = imageObj.height;
                context.drawImage(imageObj, x, y);
        } else {
            context.drawImage(imageObj, x, y);
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

    function writeText(x, y, color, italicStyle, boldStyle, fontThickness, text) {
        context.strokeStyle = "rgba(237,229,0,1)";
        context.fillStyle = color;
        context.font = italicStyle + ' ' + boldStyle + ' ' + fontThickness + 'px ' + font;
        context.fillText(text, x, y);

    }

    function saveTextFromArea(x, y) {
        //get the value of the textarea 
        addClick(x, y, false, selectedTool);
        var text = $j('textarea#writableTextarea' + id).val();
        $j('textarea#writableTextarea' + id).val('');
        removeTextAreaPopup();
        writeText(x, y, selectedColor, italic, bold, fontSize, text);
    };


}