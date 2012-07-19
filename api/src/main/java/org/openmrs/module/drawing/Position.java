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


/**
 *
 */
public class Position {
	private int x, y;

     public Position(int x,int y){
    	 this.x=x;
    	 this.y=y;
     }
	
     public Position(Position p){
    	 this.x=p.getX();
    	 this.y=p.getY();
     }
     
     
    /**
     * @return the x
     */
    public int getX() {
    	return x;
    }

	
    /**
     * @param x the x to set
     */
    public void setX(int x) {
    	this.x = x;
    }

	
    /**
     * @return the y
     */
    public int getY() {
    	return y;
    }

	
    /**
     * @param y the y to set
     */
    public void setY(int y) {
    	this.y = y;
    }
	
	
}
