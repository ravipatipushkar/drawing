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

import java.io.File;
import java.io.FilenameFilter;

/**
 * @see DrawingConstants#ACCEPTDEXTENSIONS Filer the files with extensions defined in the
 *      DrawingConstants#ACCEPTDEXTENSIONS from other files
 */
public class ExtensionFilter implements FilenameFilter {
	
	/**
	 * @see java.io.FilenameFilter#accept(java.io.File, java.lang.String)
	 */
	@Override
	public boolean accept(File dir, String name) {
		
		return DrawingUtil.isImage(DrawingUtil.getExtension(name));
		
	}
	
}
