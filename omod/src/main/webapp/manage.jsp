<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/template/header.jsp" %>
<openmrs:require privilege="Edit Observations" otherwise="/login.htm"  />
<openmrs:portlet url="drawingWindow.portlet" id="drawingWindow" moduleId="drawing" parameters="redirectUrl=/module/drawing/manage.form" />



<%@ include file="/WEB-INF/template/footerMinimal.jsp" %>