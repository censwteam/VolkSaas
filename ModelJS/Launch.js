	
var patientBasicInformation = {
    resourcePatientID: "",
    resourcePatientFullName: '',
    resourcePatientFamilName: '',
    resourcePatientGivenName: '',
    resourcePatientMRN: '',
    resourcePatientDOB: '',
    resourcePatientGender: '',
    resourcePatientEthnicity: ''
}
var authToken = "";
var haveMedicalData = 0;
$(function () {
    $("#sandBoxPatientUrl").val("https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/");
    $("#sandBoxInsuranceUrl").val("https://fhir-open.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/");
    $("#resourcePatient").val("Patient");
    $("#resourceCoverage").val("Coverage");
    $("#resourceObservation").val("Observation");
    $("#searchPatientName").focus();
});
$(function () {
    $('#searchStartDate').datetimepicker({
        "allowInputToggle": false,
        "showClose": false,
        "showClear": false,
        "showTodayButton": false,
        "format": "YYYY-MM-DD"
    });
    $('#searchEndDate').datetimepicker({
        "allowInputToggle": true,
        "showClose": true,
        "showClear": true,
        "showTodayButton": true,
        "format": "YYYY-MM-DD"
    });
});
function CreateCondition()
{
	var patientId = "Patient/" + $("#patient").val();
	var conditionCode = $("#condition").val();
	//var conditionText = $("#condition option:selected").innerText; 
	var conditionText = $("#condition option:selected").html();
	var currDateTime = new Date($.now());
	//var updatedOn = ""+currDateTime.getFullYear()+"-"+(currDateTime.getMonth() + 1)+"-"+currDateTime.getDate()+"T"+currDateTime.getHours()+":"+currDateTime.getMinutes()+":"+currDateTime.getSeconds()+"Z";	
	var updatedOn = currDateTime.getFullYear() + "-" + ((currDateTime.getMonth() + 1) < 10 ? "0" + (currDateTime.getMonth() + 1) : (currDateTime.getMonth() + 1)) + "-" + (currDateTime.getDate() < 10 ? "0" + currDateTime.getDate() : currDateTime.getDate()) + "T" + (currDateTime.getHours() < 10 ? "0" + currDateTime.getHours() : currDateTime.getHours()) + ":" + (currDateTime.getMinutes() < 10 ? "0" + currDateTime.getMinutes() : currDateTime.getMinutes()) + ":" + (currDateTime.getSeconds() < 10 ? "0" + currDateTime.getSeconds() : currDateTime.getSeconds()+ "Z");;	
	//alert(currDateTime.getDate()+"-"+(currDateTime.getMonth() + 1)+"-"+currDateTime.getFullYear()+" "+currDateTime.getHours()+":"+currDateTime.getMinutes()+":"+currDateTime.getSeconds());
	var _json =
//[
       {
	  "resourceType": "Condition",
	  "patient": {
	    "reference": "" + patientId + ""
	  },
	"code": {
	    "coding": [
		{
		    "system": "http://snomed.info/sct",
		    "code": "" + conditionCode + "",
		    "display": "Problem"
		}
	    ],
	    "text": "" + conditionText + ""
	},
	"category": {
	    "coding": [
		{
		    "system": "http://argonaut.hl7.org",
		    "code": "problem",
		    "display": "Problem"
		}
	    ],
	    "text": "Problem"
	},
	  "clinicalStatus": "active",
	  "verificationStatus": "confirmed",
	  "abatementDateTime": "" + updatedOn + ""
	}
	
	
//]
	
	 $.ajax({
	    type: "POST",	 
            headers: {
                Accept: "application/json+fhir",
                "Content-Type": "application/json+fhir",
		"Authorization":"Bearer " + authToken
            },
            beforeSend: function () {
                $('#loadingimage').show();
            },
            //url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Appointment?practitioner=" + practitionerID + "&code=http://snomed.info/sct| 408443003" + "&date=ge" + fromFullFormat + "&date=lt" + toFullFormat  ,
            //url: "https://fhir-open.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Appointment?date=ge" + fromFullFormat + "&date=lt" + toFullFormat + "&practitioner=" + practitionerID + "&code=http://snomed.info/sct%7C408443003" ,
	    url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Condition",	 
            //dataType: "json",
            //async: false,
	    data: JSON.stringify(_json),
            success: function (response) {
		    console.log("response" + response);
	    },
	    complete: function () {
		     $('#loadingimage').hide();
		    //GetFundusPhotographyScheduledPatient(authToken);
	    }
		 
	 });
}
function Authenticate()
{
	FHIR.oauth2.authorize({
			target: "_self",
			width: 400,
			height: 450,
			completeInTarget: true,
			"client_id": "9283c310-51b9-4104-9fa6-958b78e54ac9",
			"iss":  "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/",
			//"scope": "patient/AllergyIntolerance.read patient/Appointment.read patient/Binary.read patient/CarePlan.read patient/Condition.read patient/Contract.read patient/Device.read patient/DiagnosticReport.read patient/DocumentReference.read patient/Encounter.read patient/Goal.read patient/Immunization.read patient/MedicationAdministration.read patient/MedicationOrder.read patient/MedicationStatement.read patient/Observation.read patient/Patient.read patient/Person.read patient/Procedure.read patient/ProcedureRequest.read patient/RelatedPerson.read patient/Schedule.read patient/Slot.read patient/Appointment.write patient/Condition.write patient/MedicationStatement.write user/AllergyIntolerance.read user/Appointment.read user/Binary.read user/CarePlan.read user/Condition.read user/Contract.read user/Device.read user/DiagnosticReport.read user/DocumentReference.read user/Encounter.read user/Goal.read user/Immunization.read user/MedicationAdministration.read user/MedicationOrder.read user/MedicationStatement.read user/Observation.read user/Patient.read  user/Person.read user/Practitioner.read user/Procedure.read user/ProcedureRequest.read user/RelatedPerson.read user/Schedule.read user/Slot.read user/AllergyIntolerance.write user/Appointment.write user/Condition.write user/DocumentReference.write user/MedicationStatement.write user/Patient.write online_access openid profile",
			"scope": "user/Appointment.read user/Condition.read user/Observation.read user/Patient.read user/Schedule.read user/Slot.read user/Appointment.write user/Condition.write user/Patient.write online_access openid profile",
			//"scope": "user/Appointment.write user/Appointment.read user/Patient.read user/Patient.write user/Slot.read online_access openid profile",
			"serverUrl": "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/",
			"fhirServiceUrl": "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/",
			"redirectUri": "https://censwteam.github.io/VolkSaas/SmartApp.html"
	}); 
	
}
function GetToken()
{
	FHIR.oauth2.ready(function(smart) {
		  authToken = smart.state.tokenResponse.access_token;
		  if(authToken != "")
		  {
			GetFundusPhotographyScheduledPatient(authToken);
		 }
	}, function(response)
	{
		var errorMessage = response.toString();
		var arr = errorMessage.split(":");
		if(arr != null)
		{
			if(arr[0] == "Error")
			{
				alert("App session ends / not Authenticated. Please click to Authenticate / refresh the session.")
			}
		}
		
	});
}
function GetFundusPhotographyScheduledPatient(authToken) {
    ClearAllData();
    haveMedicalData = 0;
	if(authToken != "")
	{
    var fromDate = $("#searchStartDate").val();
    var toDate = $("#searchEndDate").val();
    var practitionerID = $("#searchPractitionerID").val();
    var fromFullFormat = $("#searchStartDate").val() + "T00:00:00.000Z";
    var toFullFormat = $("#searchEndDate").val() + "T23:59:59.000Z";
    var AppointmentID;
    var AppointmentStatus;
    var StandardCode;
    var ServiceTypeText;
    var Start;
    var End;
    var DurationMin;
    var PractitionerID;
    var PractitionerName;
    var PatientID;
    var PatientName;
    var Location;
    var LocationID;
    var system, code;
    var jsonData = "";
    var data = new Array();
    var isLastElement = 0;
    var DOB, Gender, MRN, Ethnicity, Address, City, State, District, PostalCode, Country, Phone, MaritalStatus, TemperatureOral, Weight, Height, BloodPressure, IOPLeft, Glaucoma, VisualAcuityRight, VisualAcuityLeft, GlucoseFasting, RBC, WBC, HGB, DiabetesType, IOPRight, Cholesterol, Subscriber, Beneficiary, CoverageStartDate, CoverageEndDate, Payor, GroupName, GroupValue;
    HGB = ""; Cholesterol = ""; Subscriber=""; Beneficiary=""; CoverageStartDate=""; CoverageEndDate=""; Payor=""; GroupName=""; GroupValue="";IOPLeft="";IOPRight="";SystolicBP="";DiastolicBP="";
    if (practitionerID !== "" && fromDate !== "" && toDate !== "") {
      //  console.log("url - " + "https://fhir-open.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Appointment?date=ge" + fromFullFormat + "&date=lt" + toFullFormat + "&practitioner=" + practitionerID + "");
        $.ajax({
            headers: {
                Accept: "application/json+fhir",
                "Content-Type": "application/json+fhir",
		"Authorization":"Bearer " + authToken
            },
            beforeSend: function () {
                $('#loadingimage').show();
            },
            url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Appointment?practitioner=" + practitionerID + "&code=http://snomed.info/sct| 408443003" + "&date=ge" + fromFullFormat + "&date=lt" + toFullFormat  ,
            //url: "https://fhir-open.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Appointment?date=ge" + fromFullFormat + "&date=lt" + toFullFormat + "&practitioner=" + practitionerID + "&code=http://snomed.info/sct%7C408443003" ,
            dataType: "json",
            //async: false,
            success: function (response) {

                var stringfyJsonResponse = JSON.stringify(response);
                var parsePatientInfo = JSON.parse(stringfyJsonResponse);
                if ( parsePatientInfo.entry !== undefined) {
                    //data.push(["Appointment ID", "Appointment Status", "Standard Code", "Service Type", "Start", "End", "Duration Min", "Patient ID", "Patient Name", "Practitioner ID", "Practitioner Name", "Location ID", "Location"]);
                    //data.push(["Patient Name", "Status", "Start", "End", "DOB", "Gender", "MRN", "Ethnicity", "Address", "City", "State", "District", "Postal Code", "Country", "Phone", "Marital Status", "Temperature Oral", "Weight", "Height", "Systolic BP", "Diastolic BP", "IOP-Left", "Glaucoma", "Visual Acuity Right", "Visual Acuity Left", "Glucose Fasting", "RBC", "WBC", "HGB", "Diabetes Type", "IOP-Right", "Cholesterol", "Subscriber", "Beneficiary", "Coverage Start Date", "Coverage End Date", "Payor", "Group Name", "Group Value"]);
					data.push(["practitioner ID", "Patient Name", "Status", "Start", "End", "DOB", "Gender", "MRN", "Ethnicity", "Address", "City", "State", "District", "Postal Code", "Country", "Phone", "Marital Status", "Weight", "Height", "Systolic BP", "Diastolic BP", "Glucose Fasting", "RBC", "WBC", "HGB", "IOP Left","IOP Right", "Glaucoma", "Visual Acuity Right", "Visual Acuity Left"]);
                    //data.push(["" + PatientName + "", "" + AppointmentStatus + "", "" + StandardCode + "", "" + Start + "", "" + End + "", "" + DurationMin + "", "" + ServiceTypeText + "", "" + PractitionerName + "", "" + Location + ""]);
                    //data.push(["AppointmentID", "AppointmentStatus"]);
                    //jsonData += '{ "data":[';
                    //jsonData += "[";
                    $.each(parsePatientInfo.entry, function (entryHeader, entryItems) {
                        jsonData = "";
                        console.log("entry loop - ");
                        StandardCode = "";
                        Start = "";
                        End = "";
                        DurationMin = "";

                        //console.log("*********START********");   

                        $.each(entryItems, function (entryresource, entryResItems) 
                        {
                            console.log("resource loop - ");
                            //isLastElement = entryresource == entryItems.length - 1;
                            if (entryresource == "resource") {
                                ServiceTypeText = "";
                                AppointmentID = entryResItems.id;
                                AppointmentStatus = entryResItems.status;
                                
                                var startDate = new Date(entryResItems.start);
                                var endDate = new Date(entryResItems.end);

                                Start = startDate.getFullYear() + "-" + ((startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)) + "-" + (startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate()) + " " + (startDate.getHours() < 10 ? "0" + startDate.getHours() : startDate.getHours()) + ":" + (startDate.getMinutes() < 10 ? "0" + startDate.getMinutes() : startDate.getMinutes()) + ":" + (startDate.getSeconds() < 10 ? "0" + startDate.getSeconds() : startDate.getSeconds()); //startDate.getFullYear() + "-" + ((startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)) + "-" + (startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate()) + " " + startDate.getHours() + ":" + startDate.getMinutes() + ":" + startDate.getSeconds(); //startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate(); //entryResItems.start;
                                End = endDate.getFullYear() + "-" + ((endDate.getMonth() + 1) < 10 ? "0" + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)) + "-" + (endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate()) + " " + (endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours()) + ":" + (endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes()) + ":" + (endDate.getSeconds() < 10 ? "0" + endDate.getSeconds() : endDate.getSeconds());  //endDate.getFullYear() + "-" + ((endDate.getMonth() + 1) < 10 ? "0" + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)) + "-" + (endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate()) + " " + endDate.getHours() + ":" + endDate.getMinutes() + ":" + endDate.getSeconds(); //endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate(); //entryResItems.end;

                                DurationMin = entryResItems.minutesDuration;
				//$('#patient').val('');
				$('#patient'). empty();
                                if (entryResItems.participant != null) {
                                    $.each(entryResItems.participant, function (entryCoding2, entryCodingItems2) {
                                        //console.log("entryCoding2 - " + entryCoding2 + "entryCodingItems2 " + entryCodingItems2.type.text);  
                                        $.each(entryCodingItems2.type, function (entryParticipantType, entryParticipantTypeItems) {
                                            //console.log("entryParticipantType - " + entryParticipantType + "entryParticipantTypeItems " + entryParticipantTypeItems.text);  
                                            if (entryParticipantTypeItems.text == "Patient") {
                                                $.each(entryCodingItems2.actor, function (entryCoding3, entryCodingItems3) {
                                                    //console.log("entryCoding3 - " + entryCoding3 + "entryCodingItems3 " + entryCodingItems3);  
                                                    if (entryCoding3 == "reference") {
                                                        entryCodingItems3 = entryCodingItems3.split('/')[1];
                                                        PatientID = entryCodingItems3;
                                                    }
                                                    if (entryCoding3 == "display") {
                                                        PatientName = entryCodingItems3;
                                                    }
                                                });
                                                //console.log("PatientID - " + PatientID+ " PatientName" + PatientName);
						$('#patient').append($('<option/>', { value: PatientID, text : PatientName }));
                                            }
                                            else if (entryParticipantTypeItems.text == "Resource") {
                                                $.each(entryCodingItems2.actor, function (entryCoding4, entryCodingItems4) {
                                                    //console.log("entryCoding3 - " + entryCoding3 + "entryCodingItems3 " + entryCodingItems3);  
                                                    if (entryCoding4 == "reference") {
                                                        practitionerID = entryCodingItems4;
                                                    }
                                                    if (entryCoding4 == "display") {
                                                        PractitionerName = entryCodingItems4;
                                                    }
                                                });
                                                //console.log("practitionerID - " + practitionerID+ " PractitionerName" + PractitionerName);
                                            }
                                            else {
                                                LocationID = "";
                                                Location = "";
                                                $.each(entryCodingItems2.actor, function (entryCoding5, entryCodingItems5) {
                                                    var locationResource = entryCodingItems5.split('/');
                                                    if (entryCoding5 == "reference" && locationResource[0] === "Location") {
                                                        //console.log("entryCoding5 - " + entryCoding5 + " entryCodingItems5" + locationResource[0]);
                                                        if (entryCoding5 == "reference") {
                                                            LocationID = entryCodingItems5;
                                                        }
                                                        if (entryCoding5 == "display") {
                                                            Location = entryCodingItems5;
                                                        }
                                                    }

                                                });
                                                //console.log("LocationID - " + LocationID+ " Location" + Location);
                                            }
                                            
                                        });

                                    });

                                }

                                //console.log(jsonData);
                                //data.push(["" + AppointmentID + "", "" + AppointmentStatus + "", "" + StandardCode + "", "" + ServiceTypeText + "", "" + Start + "", "" + End + "", "" + DurationMin + "", "" + PatientID + "", "" + PatientName + "", "" + practitionerID + "", "" + PractitionerName + "", "" + LocationID + "", "" + Location + ""]);
                                //data.push(["" + practitionerID + "", "" + PatientName + "", "" + AppointmentStatus + "", "" + Start + "", "" + End + "", "" + DOB + "", "" + Gender + "", "" + MRN + "", "" + Ethnicity + "", "" + Address + "", "" + City + "", "" + State + "", "" + District + "", "" + PostalCode + "", "" + Country + "", "" + Phone + "", "" + MaritalStatus + "","" + TemperatureOral + "","" + Weight + "","" + Height + "","" + SystolicBP + "","" + DiastolicBP + "","" + GlucoseFasting + "","" + RBC + "","" + WBC + "", "" + HGB + "","" + IOPLeft + "", "" + IOPRight + "", "" + Glaucoma + "", "" + VisualAcuityRight + "", "" + VisualAcuityLeft + ""]);
                                //data.push(["Patient Name", "Status", "Start", "End", "DOB","Gender","MRN","Ethnicity","Address","City","State","District","Postal Code","Country","Phone","Marital Status","Temperature Oral","Weight","Height","Systolic BP","Diastolic BP","IOP-Left","Glaucoma","Visual Acuity Right","Visual Acuity Left","Glucose Fasting","RBC","WBC","HGB","Diabetes Type","IOP-Right","Cholesterol","Subscriber","Beneficiary","Coverage Start Date","Coverage End Date","Payor","Group Name","Group Value"]);
                                //data.push([jsonData]);  "Temperature Oral", "Weight", "Height", "Systolic BP", "Diastolic BP", "Glucose Fasting", "RBC", "WBC", "HGB"

                            }

                        });
                        //console.log("*********END********"); 
                        //console.log("isLastElement" + isLastElement);


                        //data.push(jsonData);

                    });

                    //jsonData += "]}";
                }
				else{
					if (data.length > 0) {
						var table = $("<table id='scheduleInfo' class='table table-striped table-bordered' />");
						table[0].border = "1";

						//Get the count of columns.
						var columnCount = data[0].length;

						//Add the header row.
						var row = $(table[0].insertRow(-1));
						for (var i = 0; i < columnCount; i++) {
							var headerCell = $("<th />");
							headerCell.html(data[0][i]);
							row.append(headerCell);
						}

						//Add the data rows.
						for (var i = 1; i < data.length; i++) {
							row = $(table[0].insertRow(-1));
							for (var j = 0; j < columnCount; j++) {
								var cell = $("<td />");
								cell.html(data[i][j]);
								row.append(cell);
							}
						}

						var dvTable = $("#scheduleTable");
						dvTable.html("");
						dvTable.append(table);
					}
					else {
						dvTable = $("#scheduleTable");
						dvTable.html("No Records..");
					}
				}
                //console.log(data);
                //var result = jQuery.parseJSON(data);
                //var jsondataa=$.parseJSON('{"response":[["name0","id0","amt0"],["name1","id1","amt1"]]}');
                //$.each(result, function(i, d) {
                //var row='<tr>';
                //$.each(d, function(j, e) {
                //    row+='<td>'+e+'</td>';
                //});
                //row+='</tr>';
                //$('#scheduleTable tbody').append(row);
                //});                
                


                //$('#scheduleInfo').DataTable();

                $('#loadingimage').hide();
            },
			 complete: function () {
				 console.log("PatientID " + PatientID);
				 if (PatientID > 0) {
					$.ajax({
						headers: {
							Accept: "application/json+fhir",
							"Content-Type": "application/json+fhir",
							"Authorization":"Bearer " + authToken
						},
						beforeSend: function () {
							$('#loadingimage').show();
						},
						//url: enumConfig.PATIENT_API_URL + enumConfig.PATIENT_RESOURCE_NAME + "?_id=" + PatientID,
						    url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Patient?_id=" + PatientID,
						dataType: "json",
						//async: false,
						success: function (response) {
							MRN = "";Gender="";DOB="";
							Ethnicity="";Address="";City="";
							State="";PostalCode="";Country="";
							District="";MaritalStatus="";Phone="";
							var stringfyJsonResponse = JSON.stringify(response);
							//console.log("Response - " + stringfyJsonResponse);
							var parsePatientInfo = JSON.parse(stringfyJsonResponse);

							if (parsePatientInfo.entry != null) {
								if (parsePatientInfo.entry[0].resource != null) {
									//console.log("maritalstatus " + parsePatientInfo.entry[0].resource.identifier[0].type.text);
									if(parsePatientInfo.entry[0].resource.identifier.length > 1)
									{
										var mrnText = parsePatientInfo.entry[0].resource.identifier[1].type.text;
										if (mrnText == "MRN") {
											MRN = parsePatientInfo.entry[0].resource.identifier[1].value;
										}
									}
									else
									{
										var mrnText = parsePatientInfo.entry[0].resource.identifier[0].type.text;
										if (mrnText == "MRN") {
											MRN = parsePatientInfo.entry[0].resource.identifier[0].value;
										}
									}
									
									console.log("gender" + parsePatientInfo.entry[0].resource.gender);
									Gender = parsePatientInfo.entry[0].resource.gender;
									DOB = parsePatientInfo.entry[0].resource.birthDate;

									if (parsePatientInfo.entry[0].resource.extension != null) {
										if (parsePatientInfo.entry[0].resource.extension.extension != null) {
											Ethnicity = parsePatientInfo.entry[0].resource.extension.extension[2].valueString;
										}
									}
									if (parsePatientInfo.entry[0].resource.address != null) {
										Address = parsePatientInfo.entry[0].resource.address[0].text;
										City = parsePatientInfo.entry[0].resource.address[0].city;
										State = parsePatientInfo.entry[0].resource.address[0].state;
										PostalCode = parsePatientInfo.entry[0].resource.address[0].postalCode;
										Country = parsePatientInfo.entry[0].resource.address[0].country;
										District = parsePatientInfo.entry[0].resource.address[0].district;
									//console.log("maritalstatus " + parsePatientInfo.entry[0].resource.maritalStatus.text);
										if (parsePatientInfo.entry[0].resource.maritalStatus != null) {
											MaritalStatus = parsePatientInfo.entry[0].resource.maritalStatus.text;
										}

										if (parsePatientInfo.entry[0].resource.telecom != null) {
											Phone = parsePatientInfo.entry[0].resource.telecom[0].value;
										}

									}
									else {

									}
									
								}
							}
								
						},
						complete: function () {
							 // // medical history
							SystolicBP="";DiastolicBP="";Height="";Weight="";
							$.ajax({
								headers: {
									Accept: "application/json+fhir",
									"Content-Type": "application/json+fhir",
									"Authorization":"Bearer " + authToken
								},
								//url: enumConfig.PATIENT_API_URL + enumConfig.OBSERVATION_RESOURCE_NAME + "?category=vital-signs&patient=" + PatientID + "&_count=100",
								//url: enumConfig.PATIENT_API_URL + enumConfig.OBSERVATION_RESOURCE_NAME + "?category=vital-signs&patient=" + PatientID + "&_count=100",
								url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Observation?category=vital-signs&patient=" + PatientID + "&_count=100",
								dataType: "json",
								//async: false,
								success: function (response) {
									var stringfyJsonResponse = JSON.stringify(response);
									var parsePatientMedicalHistoryInfo = JSON.parse(stringfyJsonResponse);
									if (parsePatientMedicalHistoryInfo != null) {
										$.each(parsePatientMedicalHistoryInfo, function (index, value) {
											if (index == "entry") { // entry array
												$.each(value, function (entryHeader, entryItems) {
													$.each(entryItems, function (resourceHeader, resourceItems) {
														if (resourceHeader != null) {
															//console.log("resourceHeader- " + resourceHeader + " resourceItems- " + resourceItems);
															if (resourceHeader == "resource") //resource array
															{
																$.each(resourceItems, function (resourceInnerHeader, resourceInnerItems) {
																	
																	if(resourceInnerHeader == "component")
																	{
																		$.each(resourceInnerItems, function (componentHeader, componentItems) {
																			if(componentItems.code.text == "Systolic Blood Pressure Sitting" || componentItems.code.text == "Systolic Blood Pressure")
																			{
																				SystolicBP= componentItems.valueQuantity.value;
																			}
																			if(componentItems.code.text == "Diastolic Blood Pressure Sitting" || componentItems.code.text == "Diastolic Blood Pressure")
																			{
																				DiastolicBP = componentItems.valueQuantity.value;
																			}
																			//console.log("text- " + componentItems.code.text);
																			//console.log("valuequantity - " + componentItems.valueQuantity.value);
																																						
																		});
																	}
																	if(resourceInnerHeader == "valueQuantity")
																	{
																		//console.log("myvalue== " + resourceItems.code.text);
																		if(resourceItems.code.text == "Weight Measured")
																		{
																			$.each(resourceInnerItems, function (VQHeader, VQItems) {
																				if(VQHeader == "value")
																				{
																					Weight= VQItems;
																				}																				
																			});
																		}
																		if(resourceItems.code.text == "Height/Length Measured")
																		{
																			$.each(resourceInnerItems, function (VQHeader, VQItems) {
																				if(VQHeader == "value")
																				{
																					Height= VQItems;
																				}																				
																			});
																		}
																	}
																});
															}														
														}
													});
												});
											}
										});
										
									}
								},	
								complete: function () {
									GlucoseFasting = "";
									RBC="";
									WBC="";		
									HGB="";	
									$.ajax({
											headers: {
												Accept: "application/json+fhir",
												"Content-Type": "application/json+fhir",
												"Authorization":"Bearer " + authToken
											},
											//url: enumConfig.PATIENT_API_URL + enumConfig.OBSERVATION_RESOURCE_NAME + "?category=vital-signs&patient=" + PatientID + "&_count=100",
											//url: enumConfig.PATIENT_API_URL + enumConfig.OBSERVATION_RESOURCE_NAME + "?category=laboratory&patient=" + PatientID + "&_count=100",
											url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Observation?category=laboratory&patient=" + PatientID + "&_count=100",
											dataType: "json",
											//async: false,
											success: function (response) {
												var stringfyJsonResponse = JSON.stringify(response);
												var parsePatientMedicalHistoryInfo = JSON.parse(stringfyJsonResponse);
												if (parsePatientMedicalHistoryInfo != null) 
												{
												$.each(parsePatientMedicalHistoryInfo, function (index, value) {
													if (index == "entry") { // entry array
														$.each(value, function (entryHeader, entryItems) {
															$.each(entryItems, function (resourceHeader, resourceItems) {
																if (resourceHeader != null) {
																	//console.log("resourceHeader- " + resourceHeader + " resourceItems- " + resourceItems);
																	if (resourceHeader == "resource") //resource array
																	{
																		$.each(resourceItems, function (resourceInnerHeader, resourceInnerItems) {
																			
																			if(resourceInnerHeader == "valueQuantity")
																			{
																				//console.log("myvalue== " + resourceItems.code.text);
																				if(resourceItems.code.text == "Glucose Lvl")
																				{
																					$.each(resourceInnerItems, function (VQHeader, VQItems) {
																						if(VQHeader == "value")
																						{
																							GlucoseFasting= VQItems;
																						}																				
																					});
																				}
																				if(resourceItems.code.text == "RBC")
																				{
																					$.each(resourceInnerItems, function (VQHeader, VQItems) {
																						if(VQHeader == "value")
																						{
																							RBC= VQItems;
																						}																				
																					});
																				}
																				if(resourceItems.code.text == "Instr WBC")
																				{
																					$.each(resourceInnerItems, function (VQHeader, VQItems) {
																						if(VQHeader == "value")
																						{
																							WBC= VQItems;
																						}																				
																					});
																				}
																				if(resourceItems.code.text == "Hgb")
																				{
																					$.each(resourceInnerItems, function (VQHeader, VQItems) {
																						if(VQHeader == "value")
																						{
																							HGB= VQItems;
																						}																				
																					});
																				}
																			}
																		});
																	}														
																}
															});
														});
													}
												});
												
						
												}
																							
											},	
											complete: function () {
												Glaucoma =="";
                                                VisualAcuityRight="";
                                                VisualAcuityLeft="";
                                                DiabetesType="";
                                                IOPLeft="";
                                                IOPRight="";
						// $.ajax({
													// headers: {
                                                        // accept: "application/json+fhir",
                                                        // "content-type": "application/json+fhir",
														// "authorization":"bearer " + authtoken
                                                    // },
                                                    // beforesend: function () {

                                                    // },
													 // //url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/condition?patient=" + patientid+"&_count=100",	
													 // url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/condition?patient=" + patientid+"&code=http://snomed.info/sct| 417555004"
													// datatype: "json",
                                                    // //async: false,
                                                    // success: function (response) {
														// var stringfyjsonresponse = json.stringify(response);
														// var parseinfo = json.parse(stringfyjsonresponse);
														// if (parseinfo.entry != null)														
														// {
															// $.each(parseinfo, function (index, value) 
															// {
																// if (index == "entry") 
																// { 
																	// $.each(value, function (entryheader, entryitems) 
																	// {
																		// if (resourceheader != null) 
																		// {
																			// if (resourceheader == "resource") //resource array
																			// {
																				// $.each(resourceitems, function (resourceinnerheader, resourceinneritems) {
																					// console.log("myvalue== " + resourceitems.code.text);
																					// if(resourceitems.code.text == "intraocular pressure left eye")
																					// {
																						// iopleft = resourceinneritems;
																					// }
																				// }
																			// }
																		// }
																	// }
																// }
															// }
														// }
													// },
													// complete:  function () {
														 // // intraocular pressure right eye
														 // $.ajax({
																// headers: {
																	// accept: "application/json+fhir",
																	// "content-type": "application/json+fhir",
																	// "authorization":"bearer " + authtoken
																// },
																// beforesend: function () {

																// },
																// url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/condition?patient=" + patientid+"&code=http://snomed.info/sct| 417723001"
																// datatype: "json",
																// success: function (response) {
																	// var stringfyjsonresponse = json.stringify(response);
																	// var parseinfo = json.parse(stringfyjsonresponse);
																	// if (parseinfo.entry != null)														
																	// {
																		// $.each(parseinfo, function (index, value) 
																		// {
																			// if (index == "entry") 
																			// { 
																				// $.each(value, function (entryheader, entryitems) 
																				// {
																					// if (resourceheader != null) 
																					// {
																						// if (resourceheader == "resource") //resource array
																						// {
																							// $.each(resourceitems, function (resourceinnerheader, resourceinneritems) {
																								// console.log("myvalue== " + resourceitems.code.text);
																								// if(resourceitems.code.text == "intraocular pressure right eye")
																								// {
																									// iopright = resourceinneritems;
																								// }
																							// }
																						// }
																					// }
																				// }
																			// }
																		// }
																	// }
																// },
																// complete:  function () {
																	// //glaucoma
																	 // $.ajax({
																			// headers: {
																				// accept: "application/json+fhir",
																				// "content-type": "application/json+fhir",
																				// "authorization":"bearer " + authtoken
																			// },
																			// beforesend: function () {

																			// },
																			// url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/condition?patient=" + patientid+"&code=http://snomed.info/sct| 23986001"
																			// datatype: "json",
																			// success: function (response) {
																				// var stringfyjsonresponse = json.stringify(response);
																				// var parseinfo = json.parse(stringfyjsonresponse);
																				// if (parseinfo.entry != null)														
																				// {
																					// $.each(parseinfo, function (index, value) 
																					// {
																						// if (index == "entry") 
																						// { 
																							// $.each(value, function (entryheader, entryitems) 
																							// {
																								// if (resourceheader != null) 
																								// {
																									// if (resourceheader == "resource") //resource array
																									// {
																										// $.each(resourceitems, function (resourceinnerheader, resourceinneritems) {
																											// console.log("myvalue== " + resourceitems.code.text);
																											// if(resourceitems.code.text == "glaucoma")
																											// {
																												// glaucoma= resourceinneritems;
																											// }
																										// }
																									// }
																								// }
																							// }
																						// }
																					// }
																				// }
																			// },
																			// complete:  function () {
																					// // visual acuity left
																			// $.ajax({
																				// headers: {
																					// accept: "application/json+fhir",
																					// "content-type": "application/json+fhir",
																					// "authorization":"bearer " + authtoken
																				// },
																				// beforesend: function () {

																				// },
																				// url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/condition?patient=" + patientid+"&code=http://snomed.info/sct| 386708005"
																				// datatype: "json",
																				// success: function (response) {
																					// var stringfyjsonresponse = json.stringify(response);
																					// var parseinfo = json.parse(stringfyjsonresponse);
																					// if (parseinfo.entry != null)														
																					// {
																						// $.each(parseinfo, function (index, value) 
																						// {
																							// if (index == "entry") 
																							// { 
																								// $.each(value, function (entryheader, entryitems) 
																								// {
																									// if (resourceheader != null) 
																									// {
																										// if (resourceheader == "resource") //resource array
																										// {
																											// $.each(resourceitems, function (resourceinnerheader, resourceinneritems) {
																												// console.log("myvalue== " + resourceitems.code.text);
																												// if(resourceitems.code.text == "visual acuity - left eye")
																												// {
																													// visualacuityleft = resourceinneritems;	
																												// }
																											// }
																										// }
																									// }
																								// }
																							// }
																						// }
																					// }
																				// },
																				// complete:  function () {
																					// //visual acuity right
																				// $.ajax({
																					// headers: {
																						// accept: "application/json+fhir",
																						// "content-type": "application/json+fhir",
																						// "authorization":"bearer " + authtoken
																					// },
																					// beforesend: function () {

																					// },
																					// url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/condition?patient=" + patientid+"&code=http://snomed.info/sct| 386709002"
																					// datatype: "json",
																					// success: function (response) {
																						// var stringfyjsonresponse = json.stringify(response);
																						// var parseinfo = json.parse(stringfyjsonresponse);
																						// if (parseinfo.entry != null)														
																						// {
																							// $.each(parseinfo, function (index, value) 
																							// {
																								// if (index == "entry") 
																								// { 
																									// $.each(value, function (entryheader, entryitems) 
																									// {
																										// if (resourceheader != null) 
																										// {
																											// if (resourceheader == "resource") //resource array
																											// {
																												// $.each(resourceitems, function (resourceinnerheader, resourceinneritems) {
																													// console.log("myvalue== " + resourceitems.code.text);
																													// if(resourceitems.code.text == "visual acuity - right eye")
																													// {
																														// visualacuityright = resourceinneritems;
																													// }
																												// }
																											// }
																										// }
																									// }
																								// }
																							// }
																						// }
																						
																					// },
																					// complete:  function () {
																						
																						// data.push(["" + practitionerid + "", "" + patientname + "", "" + appointmentstatus + "", "" + start + "", "" + end + "", "" + dob + "", "" + gender + "", "" + mrn + "", "" + ethnicity + "", "" + address + "", "" + city + "", "" + state + "", "" + district + "", "" + postalcode + "", "" + country + "", "" + phone + "", "" + maritalstatus + "","" + weight + "","" + height + "","" + systolicbp + "","" + diastolicbp + "","" + glucosefasting + "","" + rbc + "","" + wbc + "", "" + hgb + "","" + iopleft + "", "" + iopright + "", "" + glaucoma + "", "" + visualacuityright + "", "" + visualacuityleft + ""]);
										
																						// if (data.length > 0) {
																							// var table = $("<table id='scheduleinfo' class='table table-striped table-bordered' />");
																							// table[0].border = "1";

																							// //get the count of columns.
																							// var columncount = data[0].length;

																							// //add the header row.
																							// var row = $(table[0].insertrow(-1));
																							// for (var i = 0; i < columncount; i++) {
																								// var headercell = $("<th />");
																								// headercell.html(data[0][i]);
																								// row.append(headercell);
																							// }

																							// //add the data rows.
																							// for (var i = 1; i < data.length; i++) {
																								// row = $(table[0].insertrow(-1));
																								// for (var j = 0; j < columncount; j++) {
																									// var cell = $("<td />");
																									// cell.html(data[i][j]);
																									// row.append(cell);
																								// }
																							// }

																							// var dvtable = $("#scheduletable");
																							// dvtable.html("");
																							// dvtable.append(table);
																						// }
																						// else {
																							// dvtable = $("#scheduletable");
																							// dvtable.html("no records..");
																						// }
																						// $('#loadingimage').hide();
																						
																						
																						
																					// }
																				// });
																				
																				
																				// }																			
																					
																			// });		
																					
																			// }
																	
																	 // });
																	
																	
																	
																// }
														 // });
													// }
												// });
													
													
													
												
												$.ajax({
                                                   headers: {
                                                       Accept: "application/json+fhir",
                                                      "Content-Type": "application/json+fhir",
														"Authorization":"Bearer " + authToken
                                                  },
                                                   beforeSend: function () {

                                                   },
                                                    url: enumConfig.PATIENT_API_URL + enumConfig.CONDITION_RESOURCE_NAME + "?patient="+PatientID+"&_count=100", //            
                                                  url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Condition?patient=" + PatientID+"&_count=100",	
													dataType: "json",
                                                    async: false,
                                                  success: function (response) {
														var stringfyJsonResponse = JSON.stringify(response);
														var parseInfo = JSON.parse(stringfyJsonResponse);
														if (parseInfo.entry != null)														
														{
															$.each(parseInfo, function (index, value) 
															{
																if (index == "entry") 
																{ // entry array
																	$.each(value, function (entryHeader, entryItems) 
																	{
																		$.each(entryItems, function (resourceHeader, resourceItems) 
																		{
																			if (resourceHeader != null) 
																			{
																				console.log("resourceHeader- " + resourceHeader + " resourceItems- " + resourceItems);
																				if (resourceHeader == "resource") //resource array
																				{
																					$.each(resourceItems, function (resourceInnerHeader, resourceInnerItems) {
																						if(resourceInnerHeader == "verificationStatus")
																						{
																							console.log("myvalue== " + resourceItems.code.text);
																							if(resourceItems.code.text == "Glaucoma")
																							{
																								Glaucoma= resourceInnerItems;																							
																							}
																							if(resourceItems.code.text == "Visual acuity - right eye")
																							{
																								VisualAcuityRight = resourceInnerItems;																							
																							}
																							if(resourceItems.code.text == "Visual acuity - left eye")
																							{
																								VisualAcuityLeft = resourceInnerItems;	
																							}
																							if(resourceItems.code.text == "Intraocular pressure left eye")
																							{
																								IOPLeft = resourceInnerItems;																							
																							}
																							if(resourceItems.code.text == "Intraocular pressure right eye")
																							{
																								IOPRight = resourceInnerItems;
																							}
																						}
																					});
																				}														
																			}
																		});
																	});
																}
															});
															
														}
														
													},
													complete:  function () {
														
													data.push(["" + practitionerID + "", "" + PatientName + "", "" + AppointmentStatus + "", "" + Start + "", "" + End + "", "" + DOB + "", "" + Gender + "", "" + MRN + "", "" + Ethnicity + "", "" + Address + "", "" + City + "", "" + State + "", "" + District + "", "" + PostalCode + "", "" + Country + "", "" + Phone + "", "" + MaritalStatus + "","" + Weight + "","" + Height + "","" + SystolicBP + "","" + DiastolicBP + "","" + GlucoseFasting + "","" + RBC + "","" + WBC + "", "" + HGB + "","" + IOPLeft + "", "" + IOPRight + "", "" + Glaucoma + "", "" + VisualAcuityRight + "", "" + VisualAcuityLeft + ""]);
										
													if (data.length > 0) {
														var table = $("<table id='scheduleInfo' class='table table-striped table-bordered' />");
														table[0].border = "1";

														Get the count of columns.
														var columnCount = data[0].length;

														Add the header row.
														var row = $(table[0].insertRow(-1));
														for (var i = 0; i < columnCount; i++) {
															var headerCell = $("<th />");
															headerCell.html(data[0][i]);
															row.append(headerCell);
														}

														Add the data rows.
														for (var i = 1; i < data.length; i++) {
															row = $(table[0].insertRow(-1));
															for (var j = 0; j < columnCount; j++) {
																var cell = $("<td />");
																cell.html(data[i][j]);
																row.append(cell);
															}
														}

														var dvTable = $("#scheduleTable");
														dvTable.html("");
														dvTable.append(table);
													}
													else {
														dvTable = $("#scheduleTable");
														dvTable.html("No Records..");
													}
													$('#loadingimage').hide();

													}
												
												});
												
												
												
											}
									});
									
									
								},									
								 error: function (response) {
									 console.log("error -" + response);
								 }
							});
						 },
						error: function (response) {

						}
					});
				 }
			},
            error: function (response) {
                $('#loadingimage').hide();
            }
        });
        $('#scheduleInfo').dataTable();
        

    }
    else {
        alert("Practioner ID or From Date or To Date should not be empty!");
    }
}
}

function ClearAllData() {
    $("#BasifInformation").text('');
    $("#ContactInformation").text('');
    $("#InsuranceInformation").text('');
    $("#MedicalHistoryInformation").text('');
    $("#resourcePatientMRN").val('');
    $("#resourcePatientFullName").val('');
    $("#resourcePatientFamilyName").val('');
    $("#resourcePatientGivenName").val('');
    $("#resourcePatientGender").val('');
    $("#resourcePatientDOB").val('');
    $("#resourcePatientEthnicity").val('');
    $("#resourcePatientAddress").val('');
    $("#resourcePatientCity").val('');
    $("#resourcePatientState").val('');
    $("#resourcePatientPostalCode").val('');
    $("#resourcePatientCountry").val('');
    $("#resourcePatientDistrict").val('');
    $("#resourcePatientMartialStatus").val('');
    $("#resourcePatientPhone").val('');
    $("#resourcePatientEmail").val('');
    $("#resourcePatientInsuranceSubscriber").val('');
    $("#resourcePatientInsurancePayor").val('');
    $("#resourcePatientInsuranceBeneficiary").val('');
    $("#resourcePatientInsuranceStartDate").val('');
    $("#resourcePatientInsuranceEndDate").val('');
    $("#resourcePatientInsuranceGroupName").val('');
    $("#resourcePatientInsuranceGroupValue").val('');
    $("#resourcePatientTempOral").val('');
    $("#resourcePatientHeight").val('');
    $("#resourcePatientWeight").val('');
    $("#resourcePatientGlucoseFasting").val('');
    $("#resourcePatientWeight").val('');
    $("#resourcePatientRBC").val('');
    $("#resourcePatientWBC").val('');
    $("#resourcePatientHGB").val('');
    $("#resourcePatientSystolicBP").val('');
    $("#resourcePatientDiastolicBP").val('');
    $("#resourcePatientDiabetestType").val('');
    $("#resourcePatientGlaucoma").val('');

}
