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
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.context.Context;
import org.openmrs.util.OpenmrsUtil;

/**
 *
 */
public class DrawingUtil {
	
	private static final String drawingDirectory = "DrawingTemplates";
	
	private static Log log = LogFactory.getLog(DrawingUtil.class);
	
	public static String imageToBase64(BufferedImage img) throws IOException {
		
		return imageToBase64(img, null);
	}
	
	public static String imageToBase64(BufferedImage img, String extension) throws IOException {
		String encodedImage = null;
		if (StringUtils.isBlank(extension))
			extension = "png";
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		try {
			ImageIO.write(img, extension, baos);
			encodedImage = "data:image/" + extension + ";base64," + Base64.encodeBase64String(baos.toByteArray());
		}
		catch (Exception e) {
			log.error("cannot write image", e);
		}
		finally {
			baos.close();
		}
		return encodedImage;
	}
	
	public static String imageToBase64(File file) throws IOException {
		
		String extension = getExtension(file.getName());
		if (isImage(file.getName()) && !extension.equals("raw")) {
			BufferedImage bi = ImageIO.read(file);
			return imageToBase64(bi, extension);
		}
		
		return null;
		
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
		if (StringUtils.isNotBlank(request.getParameter("annotationCounter" + id))) {
			int annotationsCount = Integer.parseInt(request.getParameter("annotationCounter" + id));
			for (int i = 0; i < annotationsCount; i++) {
				String s = request.getParameter("annotation" + id + i);
				String[] data = s.split("\\|");
				if (data == null || data.length < 5) {
					log.error("incorrect annotation format");
					continue;
				}
				annotations.add(new ImageAnnotation(Integer.parseInt(data[0]), new Position(Integer.parseInt(data[1]),
				        Integer.parseInt(data[2])), data[3], new Date(), Context.getAuthenticatedUser(), data[4]));
			}
		}
		return annotations.toArray(new ImageAnnotation[0]);
	}
	
	public static List<File> getTemplates() {
		
		File folder = getDrawingDirectory();
		List<File> templates = new ArrayList<File>();
		if (folder.list().length == 0) {
			//Add files from module resources
		}
		for (File f : folder.listFiles()) {
			if (f.isFile() && isImage(f.getName()))
				templates.add(f);
			
		}
		
		return templates;
		
	}
	
	public static File getDrawingDirectory(){
		File file = OpenmrsUtil.getDirectoryInApplicationDataDirectory(drawingDirectory);
		if(file.list().length == 0){
			loadDefaultTemplates(file);
			return file;
		}else
			return file;
	}
	
	public static void loadDefaultTemplates(File file){
		
		
	}
	
	public static String getTemplateAsBase64ByName(String name) throws IOException{
		 
		File file = new File(getDrawingDirectory(),name);
		if (!file.exists()){
			log.error("unable to find the file");
			return null;
		}else
         return imageToBase64(file);
         
	}
	
	public static boolean isImage(String fileName) {
		String extension = getExtension(fileName);
		if (extension.toUpperCase().equals("JPG") || extension.toUpperCase().equals("PNG")
		        || extension.toUpperCase().equals("JPEG"))
			return true;
		else
			return false;
	}
	
	public static String getExtension(String filename) {
		String[] filenameParts = filename.split("\\.");
		
		log.debug("titles length: " + filenameParts.length);
		
		String extension = (filenameParts.length < 2) ? filenameParts[0] : filenameParts[filenameParts.length - 1];
		extension = (null != extension && !"".equals(extension)) ? extension : "raw";
		
		return extension;
	}
	public static String[] getAllTemplateNames(){
		File dir=getDrawingDirectory();
		return dir.list();
	}
	
}
