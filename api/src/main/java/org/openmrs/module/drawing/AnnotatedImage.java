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
package org.openmrs.module.drawing;

import java.awt.image.BufferedImage;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.module.drawing.obs.handler.DrawingHandler;

/**
 *
 */
public class AnnotatedImage {
	
	private Log log = LogFactory.getLog(AnnotatedImage.class);
	
	private BufferedImage image;
	
	private ImageAnnotation[] annotations = new ImageAnnotation[0];
	
	private DrawingHandler handler;
	
	public AnnotatedImage(BufferedImage image) {
		setImage(image);
		if (image == null)
			log.info("gmapsimageviewer: Created new AnnotatedImage " + "containing a null image");
		else
			log.info("gmapsimageviewer: Created new AnnotatedImage " + "containing a " + image.getWidth() + "x"
			        + image.getHeight() + " image");
	}
	
	/**
	 * @return the image
	 */
	public BufferedImage getImage() {
		return image;
	}
	
	/**
	 * @param image the image to set
	 */
	public void setImage(BufferedImage image) {
		this.image = image;
	}
	
	/**
	 * @return the annotations
	 */
	public ImageAnnotation[] getAnnotations() {
		return annotations;
	}
	
	/**
	 * @param annotations the annotations to set
	 */
	public void setAnnotations(ImageAnnotation[] annotations) {
		this.annotations = annotations;
	}
	
	/**
	 * @return the handler
	 */
	public DrawingHandler getHandler() {
		return handler;
	}
	
	/**
	 * @param handler the handler to set
	 */
	public void setHandler(DrawingHandler handler) {
		this.handler = handler;
	}
}
