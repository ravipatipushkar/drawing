package org.openmrs.module.drawing.handlers;


import java.util.Map;

import org.openmrs.module.drawing.elements.DrawingSubmissionElement;
import org.openmrs.module.htmlformentry.BadFormDesignException;
import org.openmrs.module.htmlformentry.FormEntrySession;
import org.openmrs.module.htmlformentry.FormSubmissionController;
import org.openmrs.module.htmlformentry.handler.SubstitutionTagHandler;

public class DrawingHandler extends SubstitutionTagHandler {

	

	@Override
	protected String getSubstitution(FormEntrySession session,
			FormSubmissionController controllerActions,
			Map<String, String> parameters) throws BadFormDesignException {
		DrawingSubmissionElement element = new DrawingSubmissionElement(session.getContext(), parameters);
		session.getSubmissionController().addAction(element);
		return element.generateHtml(session.getContext());
	}

}
