package org.openmrs.module.drawing.web.controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.openmrs.Concept;
import org.openmrs.Location;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.openmrs.Person;
import org.openmrs.api.context.Context;
import org.openmrs.obs.ComplexData;
import org.openmrs.util.OpenmrsConstants;
import org.openmrs.util.OpenmrsUtil;
import org.openmrs.validator.ObsValidator;
import org.openmrs.web.WebConstants;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;
import org.springframework.validation.ValidationUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.tags.BindErrorsTag;

@Controller
public class DrawingWindowController  {
	
	@RequestMapping(value="/module/drawing/saveDrawing",method = RequestMethod.POST)
	public String saveDrawing(@RequestParam(value="encodedImage",required = true)String encodedImage,@RequestParam(value="patientId",required = true)Patient patient,@RequestParam(value="conceptId",required = true)Concept concept,@RequestParam(value="date",required = true)String dateString,HttpServletRequest request){
		String [] s=encodedImage.split(",");
		byte [] raw=Base64.decodeBase64(s[1]);
		Date date;
		ByteArrayInputStream bs=new ByteArrayInputStream(raw);
		
		try{
			if(StringUtils.isEmpty(dateString))
				date=new Date();
			else
			{
			    date=Context.getDateFormat().parse(dateString);
			}
			
		    Obs o=new Obs(patient, concept, date, null);
		    ComplexData cd=new ComplexData("drawing.png", bs);
		    o.setComplexData(cd);
		    Errors obsErrors = new BindException(o, "obs");
			ValidationUtils.invokeValidator(new ObsValidator(), o, obsErrors);
			if (!obsErrors.hasErrors()) {
				//bind the errors to the model object
				 Context.getObsService().saveObs(o, "saving obs");
				 request.getSession().setAttribute(WebConstants.OPENMRS_MSG_ATTR, "drawing.saved");
			}
			else
				request.getSession().setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "drawing.save.error");

		   
		    
		   
		}
		catch(Exception e)
		{
			request.getSession().setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "drawing.save.error");
		}
		
		return "redirect:/patientDashboard.form?patientId="+patient.getPatientId();
	}
	
}


