package org.openmrs.module.drawing.web.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Concept;
import org.openmrs.Encounter;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.drawing.AnnotatedImage;
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
	                          @RequestParam(value = "patientId", required = true) Patient patient,
	                          @RequestParam(value = "conceptId", required = true) Concept concept,
	                          @RequestParam(value = "encounterId", required = false) Encounter encounter,
	                          @RequestParam(value = "date", required = true) String dateString, HttpServletRequest request) {
		byte[] raw = Base64.decodeBase64(encodedImage.split(",")[1]);
		ByteArrayInputStream bs = new ByteArrayInputStream(raw);
		Date date;
		
		try {
			if (StringUtils.isBlank(dateString))
				date = new Date();
			else
				date = Context.getDateFormat().parse(dateString);
			Obs o = new Obs(patient, concept, date, null);
			o.setEncounter(encounter);
			AnnotatedImage ai = new AnnotatedImage(ImageIO.read(bs));
			ai.setAnnotations(getAnnotations(request));
			ComplexData cd = new ComplexData("drawing.png", ai);
			o.setComplexData(cd);
			Errors obsErrors = new BindException(o, "obs");
			ValidationUtils.invokeValidator(new ObsValidator(), o, obsErrors);
			if (!obsErrors.hasErrors()) {
				Context.getObsService().saveObs(o, "saving obs");
				request.getSession().setAttribute(WebConstants.OPENMRS_MSG_ATTR, "drawing.saved");
			} else
				request.getSession().setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "drawing.save.error");
			bs.close();
			
		}
		catch (Exception e) {
			e.printStackTrace();
			request.getSession().setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "drawing.save.error");
		}
		 
		return "redirect:/patientDashboard.form?patientId=" + patient.getPatientId();
	}
	
	@RequestMapping(value = "/module/drawing/updateDrawing", method = RequestMethod.POST)
	public String updateDrawing(@RequestParam(value = "encodedImage", required = true) String encodedImage,
	                            @RequestParam(value = "obsId", required = true) String obsId, HttpServletRequest request)
	    throws IOException {
		
		byte[] raw = Base64.decodeBase64(encodedImage.split(",")[1]);
		ByteArrayInputStream bs = new ByteArrayInputStream(raw);
		
		Obs obs = Context.getObsService().getComplexObs(Integer.parseInt(obsId.trim()), "");
		if(obs == null)
		{
			log.error("obs cannot be null");
			request.getSession().setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "drawing.save.error");

		}
		AnnotatedImage ai = (AnnotatedImage) obs.getComplexData().getData();
		ai.setImage(ImageIO.read(bs));
		ai.setAnnotations(getAnnotations(request));
		obs.setComplexData(new ComplexData(obs.getComplexData().getTitle(), ai));
		Context.getObsService().saveObs(obs, "saving obs");
		bs.close();
		return "redirect:/module/drawing/manage.form?obsId=" + obs.getId();
	}
	
	public ImageAnnotation[] getAnnotations(HttpServletRequest request) {
		ArrayList<ImageAnnotation> annotations = new ArrayList<ImageAnnotation>();
		int annotationsCount = Integer.parseInt(request.getParameter("annotationCounter"));
		for (int i = 0; i < annotationsCount; i++) {
			String s = request.getParameter("annotation" + i);
			String[] data = s.split("\\|");
			if (data == null || data.length < 5) {
				log.error("incorrect annotation format");
				continue;
			}
			annotations.add(new ImageAnnotation(Integer.parseInt(data[0]), new Position(Integer.parseInt(data[1]), Integer
			        .parseInt(data[2])), data[3], new Date(), Context.getAuthenticatedUser(), data[4]));
		}
		
		return annotations.toArray(new ImageAnnotation[0]);
	}
	
}
