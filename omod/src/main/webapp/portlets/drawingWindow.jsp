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
             <div id='cursorDiv' class='iconDiv tool'><img id='cursor' src="<openmrs:contextPath/>/moduleResources/drawing/images/cursor_icon.png" alt='cursor' class='imageprop' /></div>
             <div id='doneMoving' class='iconDiv' style="display:none;color:#000000">Done Moving</div>
			 <div id="pencilDiv" class="iconDiv tool"><img id="pencil" src="<openmrs:contextPath/>/moduleResources/drawing/images/pencil_icon.png" alt="pencil" class="imageprop" /></div>
             <div id="eraserDiv" class="iconDiv tool"><img id="eraser" src="<openmrs:contextPath/>/moduleResources/drawing/images/eraser_icon.png" alt="eraser" class="imageprop" /></div>
             <div id="textDiv" class="iconDiv tool"><img id="text" src="<openmrs:contextPath/>/moduleResources/drawing/images/text_icon.png" alt="text" class="imageprop" /></div>
             <div id='fontpropertiesDiv' class="tool dependendTool" style="display: none;float: left;margin-left: 5px" >
                  <div id='boldDiv' class="iconDiv"><img src="<openmrs:contextPath/>/moduleResources/drawing/images/bold_icon.png" alt="bold" class="imageprop" /></div>
                  <div id='italicDiv' class="iconDiv"><img src="<openmrs:contextPath/>/moduleResources/drawing/images/italic_icon.png" alt="italic"  class="imageprop"/></div>
                  <div class="selection" >
                  	   <div style="float:left">Font Size:</div><div id="fontSlider" style="width:100px;float:right"></div>
               	  </div>
             </div>
             <div id='thicknessDiv' class="tool dependendTool" style="display: none;float: left;margin-left: 5px" >
               		<div class="selection">
               			<div style="float:left">Thickness:</div><div id="thicknessSlider" style="width:100px;float:right"></div>
               		</div>
             </div>
			 
             <div id="undoDiv" class="iconDiv tool"><img id="undo" src="<openmrs:contextPath/>/moduleResources/drawing/images/undo_icon.png" alt="undo" class="imageprop" /></div>
             <div id="redoDiv" class="iconDiv tool"><img id="redo" src="<openmrs:contextPath/>/moduleResources/drawing/images/redo_icon.png" alt="redo" class="imageprop" /></div>
             <div id="colorSelector"  style="float: left" class="colorselector tool">
                    <div class="colorselector_innerdiv"></div>     
             </div>
             <div style="clear:both;"></div>
              
        </div>
        <div id="canvasDiv" class="canvasDiv">
            
        </div>
		<div id="templatesDialog" title="Templates" style="display:none;position:relative">
		<c:choose>
		<c:when test="${not empty encodedTemplateNames}">
		<div style="width:300px;height:294px;overflow-y: scroll;overflow-x:hidden;float:left;border:1px;">
		       <ol>
		        <c:forEach var="encodedTemplateName" items="${encodedTemplateNames}">
                     <li class="templateName"><span>${encodedTemplateName}</span></li></br>
                 </c:forEach>
               <ol>
		</div>
		<div style="float:right;border:1px">
		  <img  src="" class="templateImage">
		</div>
		<div style="clear:both"></div>
		</c:when>
		<c:otherwise>
		      No Templates Uploaded
		</c:otherwise>
		</c:choose>
		
		</div>
        <div id='textAreaPopUp' style='position:absolute;display:none;z-index:1;'>
              <textarea id='writableTextarea' style='width:100px;height:50px;'></textarea>
              <input type='button' value='save' id='saveText'/>
          </div>
    <!--    <div id="sidepane">
            
    </div>-->
        <div id="drawingFooter">
             <div class="tool">
              <input type='button' id='clearCanvas' value="Clear Canvas" />
			  <input type="button" id="showTemplates" value="Show Templates"/>
              <input type='button' id='saveImage' value="Save" />
              <input type="file" id="imageUpload" value="Open Image" /> 
              <span id='saveNotification' style='display:none;color:#ffffff;float:right'>DRAWING SAVED</span>
            </div>        
        </div>
   </div>