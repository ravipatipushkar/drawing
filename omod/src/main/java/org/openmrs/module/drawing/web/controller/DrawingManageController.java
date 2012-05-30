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
import java.io.File;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;

import org.apache.commons.logging.LogFactory;
import org.openmrs.api.context.Context;
import org.openmrs.util.OpenmrsConstants;
import org.openmrs.util.OpenmrsUtil;
import org.openmrs.web.WebConstants;
import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * The main controller.
 */
@Controller
public class  DrawingManageController {
    
	protected final Log log = LogFactory.getLog(getClass());
	
	@RequestMapping(value = "/module/drawing/manage", method = RequestMethod.GET)
	public void manage(ModelMap model) {
		
		
		model.addAttribute("user", Context.getAuthenticatedUser());
	}
	
	@RequestMapping(value = "/module/drawing/manage", method = RequestMethod.POST)
	public void getImage(ModelMap model,@RequestParam(value = "encodedImage", required = false) String encodedImage, HttpSession session) {
		String [] s=encodedImage.split(",");
		byte [] raw=Base64.decodeBase64(s[1]);
		ByteArrayInputStream bs=new ByteArrayInputStream(raw);
		try{
		BufferedImage img=ImageIO.read(bs);
		File dir = OpenmrsUtil.getDirectoryInApplicationDataDirectory(Context.getAdministrationService().getGlobalProperty(
			 OpenmrsConstants.GLOBAL_PROPERTY_COMPLEX_OBS_DIR));
			File outfile = new File(dir, new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date())+".png");
		    ImageIO.write(img, "png", outfile);
		    session.setAttribute(WebConstants.OPENMRS_MSG_ATTR, "Drawing.saved");
		}
		catch(Exception e)
		{
			session.setAttribute(WebConstants.OPENMRS_ERROR_ATTR, "Drawing.save.error");
		}
		
	}
}
