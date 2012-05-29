<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/template/header.jsp"%>

<%@ include file="template/localHeader.jsp"%>

<p>Hello ${user.systemId}!</p>

<openmrs:portlet url="drawingWindow.portlet" id="drawingWindow" moduleId="drawing" />


<%@ include file="/WEB-INF/template/footer.jsp"%>