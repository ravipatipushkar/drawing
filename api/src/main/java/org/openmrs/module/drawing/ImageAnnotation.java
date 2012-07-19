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

import java.util.Date;

import org.openmrs.User;
import org.openmrs.api.context.Context;

/**
 *
 */
public class ImageAnnotation {
	
	private Position location;
	
	private String text;
	
	private User user;
	
	private Date date;
	
	private Status status;
	
	private int id;
	
	public ImageAnnotation(int annotationId, Position location, String text, Date date, User user,String status) {
		this.location = location;
		this.id = annotationId;
		this.text = text;
		this.date = date;
		this.user = user;
		setStatus(status);
	}
	
	public ImageAnnotation(int annotationId, Position location, String text, Date date, User user,Status status) {
		this.location = location;
		this.id = annotationId;
		this.text = text;
		this.date = date;
		this.user = user;
		setStatus(status);
	}
	
	public enum Status {
		
		UNCHANGED, CHANGED, DELETE
		
	}
	
	public String getText() {
		return text;
	}
	
	public User getUser() {
		return user;
	}
	
	public Date getDate() {
		return date;
	}
	
	public int getId() {
		return id;
	}
	
	/**
	 * @return the location
	 */
	public Position getLocation() {
		return location;
	}
	
	/**
	 * @param location the location to set
	 */
	public void setLocation(Position location) {
		this.location = location;
	}
	
	public String getUserAsString() {
		return user.getGivenName() + " " + user.getFamilyName();
	}
	
	public String getDateAsString() {
		return Context.getDateFormat().format(date);
	}

	
    public Status getStatus() {
    	return status;
    }

	
    public void setStatus(Status status) {
    	this.status = status;
    }
    
    public void setStatus(String status) {
    	if("unchanged".equalsIgnoreCase(status))
			this.status=Status.UNCHANGED;
		else if("changed".equalsIgnoreCase(status))
			this.status=Status.CHANGED;
		else
			this.status=Status.DELETE;
    }
	
}
