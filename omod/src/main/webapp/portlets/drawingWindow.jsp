<%@ include file="/WEB-INF/template/include.jsp"%>
<openmrs:require privilege="Edit Observations" otherwise="/login.htm"  />

<openmrs:htmlInclude file="/moduleResources/drawing/paint.js"/>
<openmrs:htmlInclude file="/moduleResources/drawing/paint.css"/>
<openmrs:htmlInclude file="/moduleResources/drawing/colorpicker.js"/>
<openmrs:htmlInclude file="/moduleResources/drawing/colorpicker.css"/>
<openmrs:htmlInclude file="/scripts/calendar/calendar.js" />
<openmrs:htmlInclude file="/scripts/timepicker/timepicker.js" />
 
         <script type="text/javascript">
         $j(document).ready(function(){
         	prepareCanvas("canvasDiv");
         });  
         
        </script>
      
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
		     		 <td><openmrs_tag:conceptField formFieldName="conceptId" formFieldId="drawingConceptId" includeDatatypes="Complex" includeClasses="Drawing"/></td>
		      </tr>
		     <tr>
		     	 <td><spring:message code="drawing.date"/></td>
		      	 <td><input type="text" name="date" size="10" onfocus="showCalendar(this)" id="drawingDate" />(<spring:message code="general.format"/>: <openmrs:datePattern />)</td>
			</tr>
		</table>
		    <input type="hidden" id="encodedImage" name="encodedImage"/>
		</form>
	</div>
         <div id="drawingheader">
			<div id="pencilDiv" class="iconDiv"><img id="pencil" src="<openmrs:contextPath/>/moduleResources/drawing/images/pencil_icon.png" alt="pencil" class="imageprop" /></div>
			  <div id="eraserDiv" class="iconDiv"><img id="eraser" src="<openmrs:contextPath/>/moduleResources/drawing/images/eraser_icon.png" alt="eraser" class="imageprop" /></div>
              <div id="textDiv" class="iconDiv"><img id="text" src="<openmrs:contextPath/>/moduleResources/drawing/images/text_icon.png" alt="text" class="imageprop" /></div>
              <div id='fontpropertiesDiv' style="display: none;float: left;margin-left: 5px" >
      		  	<div id='boldDiv' class="iconDiv"><img src="<openmrs:contextPath/>/moduleResources/drawing/images/bold_icon.png" alt="bold" class="imageprop" /></div>
      		  	<div id='italicDiv' class="iconDiv"><img src="<openmrs:contextPath/>/moduleResources/drawing/images/italic_icon.png" alt="italic"  class="imageprop"/></div>
      		    Font Size:
      		 <select id="fontSize">
      		 	<option>24</option>
      		 	<option>28</option>
      		 	<option>32</option>
      		 	<option>38</option>
      		 </select>
      		  </div>
      		 <div id='thicknessDiv' style="display: none;float: left;margin-left: 5px" >
      		 Thickness:
      		 <select id="thickness">
      		 	<option>2</option>
      		 	<option>4</option>
      		 	<option>6</option>
      		 	<option>8</option>
      		 </select>
      		 </div>
      		  <div id="colorSelector" style="float: left">
      		    <div></div> 	
      		 </div>
              <div style="clear:both;"></div>
      		
		</div>
		<div id="canvasDiv">
			
		</div>
		<div id='textAreaPopUp' style='position:absolute;display:none;z-index:1;'>
      		<textarea id='writableTextarea' style='width:100px;height:50px;'></textarea>
      		<input type='button' value='save' id='saveText'/>
      	</div>
	<!--	<div id="sidepane">
			
	</div>-->
		<div id="drawingfooter">
		  
			 <input type='button' id='clearCanvas' value="Clear Canvas" />
					     <input type='button' id='saveImage' value="Save" />
			
		</div>
		