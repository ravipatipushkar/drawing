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
package org.openmrs.module.drawing.obs.handler;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Obs;
import org.openmrs.User;
import org.openmrs.api.context.Context;
import org.openmrs.module.drawing.AnnotatedImage;
import org.openmrs.module.drawing.ImageAnnotation;
import org.openmrs.module.drawing.ImageAnnotation.Status;
import org.openmrs.module.drawing.Position;
import org.openmrs.obs.ComplexData;
import org.openmrs.obs.handler.ImageHandler;
import org.openmrs.web.WebConstants;
import org.w3c.dom.DOMImplementation;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 */
public class DrawingHandler extends ImageHandler {
	
	private Log log = LogFactory.getLog(DrawingHandler.class);
	static int i=0;
	/**
	 * @see org.openmrs.obs.handler.ImageHandler#saveObs(org.openmrs.Obs)
	 */
	@Override
	public Obs saveObs(Obs obs) {
		ComplexData c = obs.getComplexData();
		AnnotatedImage ai = (AnnotatedImage) c.getData();
		obs.setComplexData(new ComplexData(c.getTitle(), ai.getImage()));
		Obs o = super.saveObs(obs);
		for (ImageAnnotation annotation : ai.getAnnotations())
			saveAnnotation(o, annotation, annotation.getStatus() == Status.DELETE);
		log.info("drawing:saving complexObs:" + o);
		
		return o;
	}
	
	public Obs getObs(Obs obs, String view) {
		File imageFile = getComplexDataFile(obs);
		BufferedImage img = null;
		try {
			img = ImageIO.read(imageFile);
		}
		catch (IOException e) {
			log.error("Trying to read file: " + imageFile.getAbsolutePath(), e);
		}
		AnnotatedImage aimage = loadMetadata(obs, new AnnotatedImage(img));
		
		String url = "/" + WebConstants.WEBAPP_NAME + "/module/drawing/manage.form?obsId=" + obs.getId();
		if (view == WebConstants.HYPERLINK_VIEW) {
			obs.setComplexData(new ComplexData(imageFile.getName(), url));
		} else if (view == WebConstants.HTML_VIEW) {
			String html = "<a href=\"" + url + "\">" + imageFile.getName() + "</a>";
			obs.setComplexData(new ComplexData(imageFile.getName(), html));
		} else {
			obs.setComplexData(new ComplexData(imageFile.getName(), aimage));
		}
		return obs;
	}
	
	/**
	 * Parses the XML metadata file (if it exists) loads the metadata into the given AnnotatedImage
	 * and returns it.
	 * 
	 * @param obs
	 */
	public AnnotatedImage loadMetadata(Obs obs, AnnotatedImage image) {
		
		File metadataFile = getComplexMetadataFile(obs);
		
		image.setHandler(this);
		
		ArrayList<ImageAnnotation> annotations = new ArrayList<ImageAnnotation>();
		if (metadataFile.exists() && metadataFile.canRead()) {
			try {
				DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
				DocumentBuilder builder = factory.newDocumentBuilder();
				Document xmldoc = builder.parse(metadataFile);
				NodeList annotationNodeList = xmldoc.getElementsByTagName("Annotation");
				
				for (int i = 0; i < annotationNodeList.getLength(); i++) {
					try {
						Node node = annotationNodeList.item(i);
						NamedNodeMap attributes = node.getAttributes();
						String text = node.getTextContent();
						String idString = attributes.getNamedItem("id").getNodeValue();
						String date = attributes.getNamedItem("date").getNodeValue();
						String userid = attributes.getNamedItem("userid").getNodeValue();
						String xcoordinate = attributes.getNamedItem("xcoordinate").getNodeValue();
						String ycoordinate = attributes.getNamedItem("ycoordinate").getNodeValue();
						
						// int annotationid = Integer.parseInt(idString);
						//Pixel pixel = new Pixel(Integer.parseInt(xcoordinate), Integer.parseInt(ycoordinate));
						Position position = new Position(Integer.parseInt(xcoordinate), Integer.parseInt(ycoordinate));
						User user = Context.getUserService().getUser(Integer.parseInt(userid));
						annotations.add(new ImageAnnotation(Integer.parseInt(idString), position, text, new Date(Long
						        .parseLong(date)), user, Status.UNCHANGED));
					}
					catch (NumberFormatException e) {
						// Skip that annotation
					}
				}
				
			}
			catch (Exception e) {
				//Likely ParserConfigurationException, SAXException or IOException.
				//Fail silently, log the error and return the image with no annotations.
				log.error("Error loading annotations", e);
			}
		}
		image.setAnnotations(annotations.toArray(new ImageAnnotation[0]));
		
		return image;
	}
	
	public void saveAnnotation(Obs obs, ImageAnnotation annotation, boolean delete) {
		try {
			log.info("drawing: Saving annotation for obs " + obs.getObsId());
			
			File metadataFile = getComplexMetadataFile(obs);
			log.info("drawing: Using file " + metadataFile.getCanonicalPath());
			
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document xmldoc;
			Element annotationsParent;
			int newId = 0;
			
			if (metadataFile.exists()) {
				xmldoc = builder.parse(metadataFile);
				annotationsParent = (Element) xmldoc.getElementsByTagName("Annotations").item(0);
				NodeList annotationNodeList = xmldoc.getElementsByTagName("Annotation");
				
				for (int i = 0; i < annotationNodeList.getLength(); i++) {
					NamedNodeMap attributes = annotationNodeList.item(i).getAttributes();
					String idString = attributes.getNamedItem("id").getNodeValue();
					int existingId = Integer.parseInt(idString);
					if (existingId == annotation.getId() && !(annotation.getStatus() == Status.UNCHANGED)) {
						annotationsParent.removeChild(annotationNodeList.item(i));
						System.out.println("removed annotation");
						break;
					}
					if (existingId >= newId)
						newId = existingId + 1;
				}
			} else {
				metadataFile.createNewFile();
				DOMImplementation domImpl = builder.getDOMImplementation();
				xmldoc = domImpl.createDocument(null, "ImageMetadata", null);
				Element root = xmldoc.getDocumentElement();
				annotationsParent = xmldoc.createElementNS(null, "Annotations");
				root.appendChild(annotationsParent);
			}
			
			if (!delete && annotation.getStatus() != Status.UNCHANGED) {
				if (annotation.getId() >= 0)
					newId = annotation.getId();
				
				Element e = xmldoc.createElementNS(null, "Annotation");
				Node n = xmldoc.createTextNode(annotation.getText());
				e.setAttributeNS(null, "id", newId + "");
				e.setAttributeNS(null, "xcoordinate", annotation.getLocation().getX() + "");
				e.setAttributeNS(null, "ycoordinate", annotation.getLocation().getY() + "");
				e.setAttributeNS(null, "userid", annotation.getUser().getUserId() + "");
				e.setAttributeNS(null, "date", annotation.getDate().getTime() + "");
				e.appendChild(n);
				annotationsParent.appendChild(e);
			}
			
			Transformer transformer = TransformerFactory.newInstance().newTransformer();
			transformer.setOutputProperty(OutputKeys.ENCODING, "UTF8");
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			transformer.transform(new DOMSource(xmldoc), new StreamResult(metadataFile));
			
			log.info("drawing: Saving annotation complete");
			
		}
		catch (Exception e) {
			log.error("drawing: Error saving image metadata: " + e.getClass() + " " + e.getMessage());
		}
	}
	
	/**
	 * Convenience method to create and return a file for the stored metadata file
	 * 
	 * @param obs
	 * @return
	 */
	public static File getComplexMetadataFile(Obs obs) {
		File imageFile = ImageHandler.getComplexDataFile(obs);
		try {
			return new File(imageFile.getCanonicalPath() + ".xml");
		}
		catch (IOException e) {
			return new File(imageFile.getAbsolutePath() + ".xml");
		}
	}
	
}
