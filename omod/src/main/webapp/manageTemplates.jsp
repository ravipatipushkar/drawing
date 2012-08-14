<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/template/header.jsp" %>
<openmrs:require privilege="Edit Observations" otherwise="/login.htm"  />
<script type="text/javascript">
$j(document).ready(function(){
   $j('.templateName').click(function() {
            $j.post(openmrsContextPath + "/module/drawing/getTemplate.form",{templateName: $j(this).html()}, function(data) {
                //alert('got data'+data);
                $j('.templateImage').attr('src', data);
            }).error(function() {
                alert('Unable load Templates');
            }).success(function() {
                //  alert('success');
            }).complete(function() {
                // alert('complete');
            });

        });
		$j('.templateName').hover(function() {
            $j(this).css({
                color: '#1AAD9B'
            });
        }, function() {
            $j(this).css({
                color: 'black'
            });
        });
		
		$j.expr[':'].Contains = function(a, i, m) { 
            return $j(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
         };
		
		$j('#searchTemplates').keyup(function(){
		     var search=$j(this).val();
			  $j('.templateName').parent().show();
			  if($j.trim(search) != ' ')
			  $j('.templateName:not(:Contains('+search+'))').parent().hide();
		});
		
		$j('.deleteIcon img').click(function(){
			if(confirm("Do you want to delete this template"))
			 {
				var v=$j(this).parent().next();
				 $j.get(openmrsContextPath + "/module/drawing/deleteTemplate.form?templateName=" + v.html());
				$j(v).parent().remove();
				$j('.templateImage').attr('src', openmrsContextPath+"/moduleResources/drawing/images/preview.png");
				$j('.templateImage').css('width',$j('.templateImage').parent().width());
				$j('.templateImage').css('height',$j('.templateImage').parent().height());
				
			 }
		});

});

</script>

<style type="text/css">
.templateImage{
  width:100%;
  height:100%;
}
</style>
<h2><spring:message code="drawing.manageTemplates"/></h2>
<c:choose>
		<c:when test="${not empty encodedTemplateNames}">
			<div style="position:relative">
				<div style="width:30%;height:100%;float:left;border:1px;;margin-bottom:10px">
				    <b class="boxHeader"><spring:message code="drawing.availableTemplates"/></b>
					<div class="box" style="height:500px">
					Search:<input type="search" id="searchTemplates" placeholder="search..."/>
						<div style="overflow-y: scroll;overflow-x:hidden;height:465px">
		       				<table>
		       				 <c:forEach var="encodedTemplateName" items="${encodedTemplateNames}">
							 <tr>
							     <td class="deleteIcon"><img class="deleteIcon" src="<openmrs:contextPath/>/moduleResources/drawing/images/delete_icon.png" style="cursor:pointer"></td>
                    			 <td class="templateName" style="cursor:pointer">${encodedTemplateName}</td>
                 			  </tr>
							 </c:forEach>
               				</table>
						</div>
					</div>
				</div>
				<div style="float:left;width:69%;margin-left:10px;margin-bottom:10px" >
					<b class="boxHeader" style=""><spring:message code="drawing.preview"/></b>
					<div class="box" style="height:500px">
		        		 <img  src="<openmrs:contextPath/>/moduleResources/drawing/images/preview.png" class="templateImage"/>

					</div>
				</div>
				
			</div>
		</c:when>
		<c:otherwise>
		      <spring:message code="drawing.noTemplatesUploaded"/>
		</c:otherwise>
</c:choose>
				<div style="clear:both;margin-top:10px" >
					<b class="boxHeader" style=""> <spring:message code="drawing.addNewTemplate"/></b>
					<div class="box">
						<form method="post" enctype="multipart/form-data">
							<table>
								<tr>
									<td><spring:message code="drawing.templateName"/>:</td>
		  							<td><input type="text" id="templateName" name="templateName" /><i>(optional if no name is provided the file name will be used as the name of the template)</i></td>
        					   </tr>
          						<tr>
             						<td><spring:message code="drawing.template"/>:</td>
			 						<td><input type="file" id="template" name="template" /><i>(supported formats - jpeg,jpg,png)</i></td>
			 					</tr>
        					</table>
							<input type="submit" value="<spring:message code="drawing.addTemplate"/>">
        				</form>		
					</div>
				</div>
<%@ include file="/WEB-INF/template/footer.jsp" %>