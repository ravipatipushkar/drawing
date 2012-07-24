package org.openmrs.module.drawing.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Concept;
import org.openmrs.Encounter;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.drawing.AnnotatedImage;
import org.openmrs.module.drawing.DrawingUtil;
import org.openmrs.module.drawing.ImageAnnotation;
import org.openmrs.module.drawing.Position;
import org.openmrs.obs.ComplexData;
import org.openmrs.validator.ObsValidator;
import org.openmrs.web.WebConstants;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DrawingWindowController {
	
	private Log log = LogFactory.getLog(DrawingWindowController.class);
	
	@RequestMapping(value = "/module/drawing/saveDrawing", method = RequestMethod.POST)
	public String saveDrawing(@RequestParam(value = "encodedImage", required = true) String encodedImage,
	                          @RequestParam(value = "patientId", required = false) Patient patient,
	                          @RequestParam(value = "conceptId", required = false) Concept concept,
	                          @RequestParam(value = "encounterId", required = false) Encounter encounter,
	                          @RequestParam(value = "date", required = true) String dateString, HttpServletRequest request) {
		
		String redirect = "/module/drawing/manage.form";
		
		try {
			Date date = StringUtils.isBlank(dateString) ? new Date() : Context.getDateFormat().parse(dateString);
			Obs o = new Obs(patient, concept, date, null);
			o.setEncounter(encounter);
			AnnotatedImage ai = new AnnotatedImage(DrawingUtil.base64ToImage(encodedImage));
			ai.setAnnotations(DrawingUtil.getAnnotations(request, ""));
			o.setComplexData(new ComplexData("drawingObs.png", ai));
			Errors obsErrors = new BindException(o, "obs");
			ValidationUtils.invokeValidator(new ObsValidator(), o, obsErrors);
			if (!obsErrors.hasErrors()) {
				Context.getObsService().saveObs(o, "saving obs");
				request.getSession().setAttribute(WebConstants.OPENMRS_MSG_ATTR, "drawing.saved");
				redirect = "redirect:/patientDashboard.form?patientId=" + patient.getPatientId();
			} else
				request.getSession().setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "drawing.save.error");
			
		}
		catch (Exception e) {
			request.getSession().setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "drawing.save.error");
		}
		return redirect;
		
	}
	
	@RequestMapping(value = "/module/drawing/updateDrawing", method = RequestMethod.POST)
	public String updateDrawing(@RequestParam(value = "encodedImage", required = true) String encodedImage,
	                            @RequestParam(value = "obsId", required = true) String obsId, HttpServletRequest request)
	    throws IOException {
		
		Obs obs = Context.getObsService().getComplexObs(Integer.parseInt(obsId.trim()), "");
		if (obs == null) {
			log.error("obs cannot be null");
			request.getSession().setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "drawing.save.error");
		}
		AnnotatedImage ai = (AnnotatedImage) obs.getComplexData().getData();
		ai.setImage(DrawingUtil.base64ToImage(encodedImage));
		ai.setAnnotations(DrawingUtil.getAnnotations(request, ""));
		obs.setComplexData(new ComplexData(obs.getComplexData().getTitle(), ai));
		Context.getObsService().saveObs(obs, "saving obs");
		
		return "redirect:/module/drawing/manage.form?obsId=" + obs.getId();
	}
	
}
