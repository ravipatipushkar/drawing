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
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.context.Context;

/**
 *
 */
public class DrawingUtil {
	
	private static Log log = LogFactory.getLog(DrawingUtil.class);
	
	public static String imageToBase64(BufferedImage img) throws IOException {
		String encodedImage = null;
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		try {
			
			ImageIO.write(img, "png", baos);
			encodedImage = "data:image/png;base64," + Base64.encodeBase64String(baos.toByteArray());
			
		}
		catch (Exception e) {
			log.error("cannot write image", e);
			
		}
		finally {
			baos.close();
		}
		return encodedImage;
	}
	
	public static BufferedImage base64ToImage(String base64Data) throws IOException {
		
		if (StringUtils.isBlank(base64Data) || !base64Data.contains(",") || !(base64Data.split(",")[1].length() % 4 == 0)) {
			log.error("String is not Base64 encoded");
			return null;
		}
		byte[] raw = Base64.decodeBase64(base64Data.split(",")[1]);
		ByteArrayInputStream bs = new ByteArrayInputStream(raw);
		BufferedImage img = null;
		try {
			img = ImageIO.read(bs);
		}
		catch (IOException e) {
			log.error("Unable to convert Base64 String to image", e);
		}
		finally {
			bs.close();
		}
		
		return img;
		
	}
	
	public static ImageAnnotation[] getAnnotations(HttpServletRequest request, String id) {
		if (id == null)
			id = "";
		ArrayList<ImageAnnotation> annotations = new ArrayList<ImageAnnotation>();
		int annotationsCount = Integer.parseInt(request.getParameter("annotationCounter" + id));
		for (int i = 0; i < annotationsCount; i++) {
			String s = request.getParameter("annotation" + id + i);
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
