package org.openmrs.module.drawing.elements;

import java.io.ByteArrayInputStream;
import java.util.Collection;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.openmrs.Concept;
import org.openmrs.Obs;
import org.openmrs.module.htmlformentry.FormEntryContext;
import org.openmrs.module.htmlformentry.FormEntrySession;
import org.openmrs.module.htmlformentry.FormSubmissionError;
import org.openmrs.module.htmlformentry.HtmlFormEntryUtil;
import org.openmrs.module.htmlformentry.action.FormSubmissionControllerAction;
import org.openmrs.module.htmlformentry.element.HtmlGeneratorElement;
import org.openmrs.obs.ComplexData;

public class DrawingSubmissionElement implements HtmlGeneratorElement,
		FormSubmissionControllerAction {
	
	
	private String id;
	private Concept questionConcept;
	
    
	public DrawingSubmissionElement(FormEntryContext context, Map<String, String> parameters){
		String questionConceptId = parameters.get("questionConceptId");
		id=parameters.get("id");
		if (StringUtils.isBlank(questionConceptId) )
			throw new RuntimeException("questionConceptId cannot be empty");
		else if (StringUtils.isBlank(id))
			throw new RuntimeException("id cannot be empty");
		
			questionConcept = HtmlFormEntryUtil.getConcept(questionConceptId);
			if (questionConcept == null)
				throw new IllegalArgumentException("Cannot find concept for value " + questionConceptId
				        + " in conceptId attribute value. Parameters: " + parameters);
		
		
	}
	
	
	@Override
	public Collection<FormSubmissionError> validateSubmission(
			FormEntryContext context, HttpServletRequest submission) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void handleSubmission(FormEntrySession session,HttpServletRequest submission) {
          String encodedDataUrl=submission.getParameter("encodedDataUrl"+id);
          if(StringUtils.isBlank(encodedDataUrl)){
        	  System.out.println("encodedDataUrl is empty"+encodedDataUrl);
        	  return;
          }
  		  byte [] rawImageBytes=Base64.decodeBase64(encodedDataUrl.split(",")[1]);
  		  ByteArrayInputStream bs=new ByteArrayInputStream(rawImageBytes); 
  		 Obs o= session.getSubmissionActions().createObs(questionConcept, new ComplexData("drawing.png", bs), null, null);
  		 System.out.println("obs data printing   -----------"+o.getPerson().toString()+"-------"+o.getConcept().toString()+"-----------"+o.getComplexData().getTitle());
	   
	}

	@Override
	public String generateHtml(FormEntryContext context) {
		System.out.println("the id is "+id);
		String generatedHtml=
		"<link rel='stylesheet' type='text/css' href='http://localhost:8080/openmrstru/moduleResources/drawing/paint.css' />"+
		"<link rel='stylesheet' media='screen' type='text/css' href='http://localhost:8080/openmrstru/moduleResources/drawing/colorpicker.css' />"+
		"<script type='text/javascript' src='http://localhost:8080/openmrstru/moduleResources/drawing/paint.js'></script>"+
		"<script type='text/javascript' src='http://localhost:8080/openmrstru/moduleResources/drawing/colorpicker.js'></script>"+
		"<script type='text/javascript'>$j(document).ready(function(){prepareCanvas('canvasDiv');}); function submitHtmlForm() {$j('#encodedDataUrl"+id+"').val(canvas.toDataURL());if (!tryingToSubmit) {tryingToSubmit = true;DWRHtmlFormEntryService.checkIfLoggedIn(checkIfLoggedInAndErrorsCallback);}}</script>"+
		"<div>"+
		"<div id='drawingheader'>"+
		"<div id='pencilDiv' class='iconDiv'><img id='pencil' src='http://localhost:8080/openmrstru/moduleResources/drawing/images/pencil_icon.png' alt='pencil' class='imageprop' /></div>"+
		"<div id='eraserDiv' class='iconDiv'><img id='eraser' src='http://localhost:8080/openmrstru/moduleResources/drawing/images/eraser_icon.png' alt='eraser' class='imageprop' /></div>"+
		"<div id='textDiv' class='iconDiv'><img id='text' src='http://localhost:8080/openmrstru/moduleResources/drawing/images/text_icon.png' alt='text' class='imageprop' /></div>"+
		"<div id='fontpropertiesDiv' style='display: none;float: left;margin-left: 5px' ><div id='boldDiv' class='iconDiv'><img src='http://localhost:8080/openmrstru/moduleResources/drawing/images/bold_icon.png' alt='bold' class='imageprop' /></div><div id='italicDiv' class='iconDiv'><img src='http://localhost:8080/openmrstru/moduleResources/drawing/images/italic_icon.png' alt='italic'  class='imageprop'/></div>Font Size:<select id='fontSize'><option>24</option><option>28</option><option>32</option><option>38</option></select></div>"+
		"<div id='thicknessDiv' style='display: none;float: left;margin-left: 5px' >Thickness:<select id='thickness'><option>2</option><option>4</option><option>6</option><option>8</option></select></div>"+
		"<div id='colorSelector' style='float: left'><div></div></div>"+
		"<div style='clear:both;'></div>"+
		"</div>"+
		"<div id='canvasDiv'></div>"+
		"<div id='textAreaPopUp' style='position:absolute;display:none;z-index:1;'><textarea id='writableTextarea' style='width:100px;height:50px;'></textarea><input type='button' value='save' id='saveText'></div>"+
		"<div id='drawingfooter'><input type='button' id='clearCanvas' value='Clear canvas' /><input type='hidden' id='encodedDataUrl"+id+"' name='encodedDataUrl"+id+"' /></div>"+
		"</div>";
		
		return generatedHtml;
	}

}
