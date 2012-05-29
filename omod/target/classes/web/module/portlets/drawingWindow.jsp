<%@ include file="/WEB-INF/template/include.jsp"%>

<openmrs:htmlInclude file="/moduleResources/drawing/paint.js"/>
<openmrs:htmlInclude file="/moduleResources/drawing/paint.css"/>
 
         <script type="text/javascript">
         $j(document).ready(function(){
         	prepareCanvas("canvasDiv");
         });  
        </script>
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
              <div style="clear:both;"></div>
      		
		</div>
		<div id="canvasDiv">
			
		</div>
		<div id='textAreaPopUp' style='position:absolute;display:none;z-index:1;'>
      		<textarea id='writableTextarea' style='width:100px;height:50px;'></textarea>
      		<input type='button' value='save' id='saveText'>
      	</div>
	<!--	<div id="sidepane">
			
	</div>-->
		<div id="drawingfooter">
			 <input type='button' id='clearcanvas' value="Clear Canvas" />
		</div>