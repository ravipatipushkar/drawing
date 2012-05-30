package org.openmrs.module.drawing.extension.html;

import org.openmrs.module.web.extension.PatientDashboardTabExt;

public class DrawingPatientDashboardExt extends PatientDashboardTabExt {

	@Override
	public String getPortletUrl() {
		return "drawingWindow";
	}

	@Override
	public String getRequiredPrivilege() {
		return "Edit Observations";
	}

	@Override
	public String getTabId() {
		return "drawing";
	}

	@Override
	public String getTabName() {
		return "Drawing Editor";
	}

}
