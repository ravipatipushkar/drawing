<%@ include file="/WEB-INF/template/include.jsp"%>

<openmrs:require privilege="Edit Observations" otherwise="/login.htm"  />
<openmrs:htmlInclude file="/moduleResources/drawing/colorpicker.css"/>
<openmrs:htmlInclude file="/moduleResources/drawing/paint.css"/>

<openmrs:htmlInclude file="/moduleResources/drawing/colorpicker.js"/>
<openmrs:htmlInclude file="/moduleResources/drawing/paint.js"/>
<openmrs:htmlInclude file="/moduleResources/drawing/resize.js"/>



<openmrs:htmlInclude file="/scripts/calendar/calendar.js" />
<openmrs:htmlInclude file="/scripts/timepicker/timepicker.js" />
 
         <script type="text/javascript">
         $j(document).ready(function(){
             var v=new DrawingEditor('');
              v.prepareCanvas();
              
              <c:if test="${not empty obsId}">
              <c:if test="${not empty encodedImage}">
                 v.loadExistingImage('${encodedImage}');
              </c:if>
              
              
               <c:forEach items="${annotations}" var="annotation">
             v.createMarker(${annotation.id},${annotation.location.x},${annotation.location.y},'${annotation.text}','${annotation.status}');
             </c:forEach>
             </c:if>
        
         });  
  
        </script>
     
          
        <c:choose>
            <c:when test="${obsId == null}" >
        <div id="drawingObsform" >
         <form method="post" id="saveImageForm" action="<openmrs:contextPath/>/module/drawing/saveDrawing.form">
        
             <table>
                 <c:choose>
                     <c:when test="${model.patientId == null}">
                         <tr>
                          <td><spring:message code="drawing.patient"/></td>
                         <td><openmrs_tag:personField formFieldName="patientId" formFieldId="drawingPatientId" searchLabelCode="Person.findBy"  linkUrl="" callback="" /></td>
                        </tr>
                    </c:when>
                    <c:otherwise>
                      <input type="hidden" name="patientId" value='${model.patientId}' />
                    </c:otherwise>
                  </c:choose>
               <tr>
                      <td><spring:message code="drawing.questionConcept"/></td>
                <td>
                     <openmrs:globalProperty var="questionConcepts" key="drawing.questionConcepts" listSeparator=","/>
                 
                     <c:choose>
                         <c:when test="${empty questionConcepts}">
                             <openmrs_tag:conceptField formFieldName="conceptId" formFieldId="drawingConceptId" includeDatatypes="Complex" includeClasses="Drawing"/>
                        </c:when>
                         <c:otherwise>
                             <select id="drawingConceptId" name="conceptId">
                                 <c:forEach var="conceptId" items="${questionConcepts}">
                                   <option value="${conceptId}"><openmrs:format conceptId="${conceptId}"/></option>
                                 </c:forEach>
                             </select>
                         </c:otherwise>
                     </c:choose>
                 </td>
             </tr>
                           <tr>
                           <td><spring:message code="drawing.encounter"/></td>
                           <td><openmrs_tag:encounterField formFieldName="encounterId" formFieldId="drawingEncounterId" /> </td>
                           </tr>
             <tr>
                  <td><spring:message code="drawing.date"/></td>
                   <td><input type="text" name="date" size="10" onfocus="showCalendar(this)" id="drawingDate" />(<spring:message code="general.format"/>: <openmrs:datePattern />)</td>
            </tr>
            
        </table>
            <input type="hidden" id="encodedImage" name="encodedImage"/>
            <input type="hidden" name="redirectUrl" value="${model.redirectUrl}">
        </form>
        </div>
        </c:when>
        <c:otherwise>
        <form method="post" id="saveImageForm" action="<openmrs:contextPath/>/module/drawing/updateDrawing.form">
           <input type="hidden" id="encodedImage" name="encodedImage"/>
           <input type="hidden" id="obsId" name="obsId" value="${obsId} "/>
           </form>
        </c:otherwise>
        </c:choose>
    
        
         <div class="editorContainer">
         <div id="drawingHeader">
             <div id='cursorDiv' class='iconDiv tool' title="Cursor"><img id='cursor' src="<openmrs:contextPath/>/moduleResources/drawing/images/cursor_icon.png" alt='cursor' class='imageprop' /></div>
             <div id='doneMoving' class='iconDiv' style="display:none;color:#000000;cursor: pointer">Done Moving</div>
			 <div id="pencilDiv" class="iconDiv tool" title="Pencil"><img id="pencil" src="<openmrs:contextPath/>/moduleResources/drawing/images/pencil_icon.png" alt="pencil" class="imageprop" /></div>
             <div id="eraserDiv" class="iconDiv tool" title="Eraser"><img id="eraser" src="<openmrs:contextPath/>/moduleResources/drawing/images/eraser_icon.png" alt="eraser" class="imageprop" /></div>
             <div id="textDiv" class="iconDiv tool" title="Text"><img id="text" src="<openmrs:contextPath/>/moduleResources/drawing/images/text_icon.png" alt="text" class="imageprop" /></div>
             <div id='fontpropertiesDiv' class="tool dependendTool" style="display: none;float: left;margin-left: 5px" >
                  <div id='boldDiv' class="iconDiv" title="Bold"><img src="<openmrs:contextPath/>/moduleResources/drawing/images/bold_icon.png" alt="bold" class="imageprop" /></div>
                  <div id='italicDiv' class="iconDiv" title="Italic"><img src="<openmrs:contextPath/>/moduleResources/drawing/images/italic_icon.png" alt="italic"  class="imageprop"/></div>
                  <div class="selection" >
                  	   <div style="float:left"><spring:message code="drawing.fontSize"/>:</div><div id="fontSlider" style="width:100px;float:right"></div>
               	  </div>
             </div>
             <div id='thicknessDiv' class="tool dependendTool" style="display: none;float: left;margin-left: 5px" >
               		<div class="selection">
               			<div style="float:left"><spring:message code="drawing.thickness"/>:</div><div id="thicknessSlider" style="width:100px;float:right"></div>
               		</div>
             </div>
			 <div id='annotationsVisibility' class='iconDiv' style="color:#000000;cursor: pointer">Hide Annotations</div>
			 
             <div id="undoDiv" class="iconDiv tool" title="Undo"><img id="undo" src="<openmrs:contextPath/>/moduleResources/drawing/images/undo_icon.png" alt="undo" class="imageprop" /></div>
             <div id="redoDiv" class="iconDiv tool" title="Redo"><img id="redo" src="<openmrs:contextPath/>/moduleResources/drawing/images/redo_icon.png" alt="redo" class="imageprop" /></div>
             <div id='undoRedoRateDiv' class="tool selection" style="float: left;margin-left: 5px;" title="This allows you to set the number of moves you want to undo/redo">
               		<spring:message code="drawing.undoRedoRate"/>:<select id="undoRedoRate"><option>1x</option><option>3x</option><option>5x</option><option>10x</option><option>20x</option></select> 		
             </div>
			 
			 <div id="colorSelector"  style="float: left" class="colorselector tool" title="Color Picker">
                    <div class="colorselector_innerdiv"></div>     
             </div>
             <div style="clear:both;"></div>
              
        </div>
        <div id="canvasDiv" class="canvasDiv">
            
        </div>
		<div id="templatesDialog" title="Templates" style="display:none;position:relative">
		<c:choose>
		<c:when test="${not empty model.encodedTemplateNames}">
		<div style="position:relative">
				<div style="width:30%;height:100%;float:left;border:1px;;margin-bottom:10px">
				    <b class="boxHeader"><spring:message code="drawing.availableTemplates"/></b>
					<div class="box" style="height:350px">
					 Search:<input type="search" id="searchTemplates" placeholder="search..."/>
						<div style="overflow-y: scroll;overflow-x:hidden;height:315px">
						
		       				<table>
		       				 <c:forEach var="encodedTemplateName" items="${model.encodedTemplateNames}">
							 <tr>
							     <td style="display:list-item;list-style:disc inside;"></td>
                    			 <td class="templateName" style="cursor:pointer">${encodedTemplateName}</td>
                 			  </tr>
							 </c:forEach>
               				</table>
						</div>
					</div>
				</div>
				<div style="float:left;width:68%;margin-left:10px;margin-bottom:10px" >
					<b class="boxHeader"><spring:message code="drawing.preview"/></b>
					<div class="box" style="height:350px">
		        		 <img  src="<openmrs:contextPath/>/moduleResources/drawing/images/preview.png" id="templateImage" class="templateImage"/>

					</div>
				</div>
				
			</div>
		<div style="clear:both"></div>
		</c:when>
		<c:otherwise>
		     <spring:message code="drawing.noTemplatesUploaded"/>
		</c:otherwise>
		</c:choose>
		
		</div>
        <div id='textAreaPopUp' style='position:absolute;display:none;z-index:1;'>
              <textarea id='writableTextarea' style='width:100px;height:50px;'></textarea>
              <input type='button' value='save' id='saveText'/>
          </div>
        <div id="drawingFooter">
             <div class="tool">
              <input type='button' id='clearCanvas' value="<spring:message code="drawing.clearCanvas"/>" />
			  <input type="button" id="showTemplates" value="<spring:message code="drawing.showTemplates"/>"/>
              <input type='button' id='saveImage' value="<spring:message code="drawing.save"/>" />
              <input type="file" id="imageUpload" value="<spring:message code="drawing.openImage"/>" /> 
              <span id='saveNotification' style='display:none;color:#ffffff;float:right'><spring:message code="drawing.saved"/></span>
            </div>        
        </div>
   </div>