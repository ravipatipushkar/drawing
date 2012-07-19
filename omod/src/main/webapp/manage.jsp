<%@ include file="/WEB-INF/template/include.jsp"%>
		<%@ include file="/WEB-INF/template/headerMinimal.jsp" %>
<c:if test="${empty pushkar} ">manage pushkar is empty</c:if>
<openmrs:portlet url="drawingWindow.portlet" id="drawingWindow" moduleId="drawing" />



<%@ include file="/WEB-INF/template/footerMinimal.jsp" %>