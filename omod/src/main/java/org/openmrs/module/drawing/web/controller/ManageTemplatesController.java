/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.drawing.web.controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.module.drawing.DrawingUtil;
import org.openmrs.web.WebConstants;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 */
@Controller
public class ManageTemplatesController {
	
	protected final Log log = LogFactory.getLog(getClass());
	 
	
	@RequestMapping(value = "/module/drawing/manageTemplates", method = RequestMethod.GET)
	public void manage(ModelMap model) {
		model.addAttribute("encodedTemplateNames", DrawingUtil.getAllTemplateNames());
	}
	
	@RequestMapping(value = "/module/drawing/manageTemplates", method = RequestMethod.POST)
	public void manage(@RequestParam(value = "templateName", required = false) String templateName,
	                   @RequestParam(value = "template", required = true) MultipartFile file, ModelMap model,
	                   HttpSession session) {
		
		model.addAttribute("encodedTemplateNames", DrawingUtil.getAllTemplateNames());
		if (file == null || file.getSize()==0) {
			session.setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "Please Fill All The Fields");
			return;
		} else if (!DrawingUtil.isImage(file.getOriginalFilename())) {
			session.setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "File Format Not Supported");
			return;
		}
		if (StringUtils.isBlank(templateName))
			templateName = file.getOriginalFilename();
		else
			templateName = templateName +"."+ DrawingUtil.getExtension(file.getOriginalFilename());
		
		try {
			BufferedImage bi = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
			Boolean saved = DrawingUtil.saveFile(templateName, bi);
			if (saved){
				session.setAttribute(WebConstants.OPENMRS_MSG_ATTR, "Template Saved");
				model.addAttribute("encodedTemplateNames", DrawingUtil.getAllTemplateNames());

			}else
				session.setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "Error Saving Template");
			
		}
		catch (IOException e) {
			session.setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "Unable To Save Uploaded File");
			log.error("Unable to read uploadedFile", e);
		}
		
	}
	
	@RequestMapping(value = "/module/drawing/getTemplate", method = RequestMethod.POST)
	public @ResponseBody
	String getTemplate(@RequestParam(value="templateName",required=true)String templateName) {
		String encodedImage=null;
		try {
	         encodedImage= DrawingUtil.getTemplateAsBase64ByName(StringEscapeUtils.unescapeHtml(templateName));
        }
        catch (IOException e) {
	        log.error("unable to get the file", e);
        }
		
		return encodedImage;
		
	}
	@RequestMapping(value = "/module/drawing/deleteTemplate", method = RequestMethod.POST)
	public @ResponseBody
	void deleteTemplate(@RequestParam(value="templateName",required=true)String templateName) {
	       DrawingUtil.deleteTemplate(StringEscapeUtils.unescapeHtml(templateName));
	}
	
}
