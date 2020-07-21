
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
var haveMedicalData = 0;
$(function () {
    $("#sandBoxPatientUrl").val("https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/");
    $("#sandBoxInsuranceUrl").val("https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/");
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
			//"scope": "user/Patient.read user/Schedule.read user/Slot.read user/Appointment.write user/Patient.write patient/Appointment.read patient/Condition.read patient/Observation.read patient/Patient.read patient/Schedule.read patient/Slot.read patient/Appointment.write patient/Condition.write patient/Patient.write user/Appointment.read online_access openid profile",
			"scope": "user/Appointment.write user/Appointment.read user/Patient.read user/Patient.write user/Slot.read online_access openid profile",
			"serverUrl": "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/",
			"fhirServiceUrl": "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/",
			"redirectUri": "https://censwteam.github.io/VolkSaas/SmartApp.html"
	}); 
	
}
function GetToken()
{
	FHIR.oauth2.ready(function(smart) {
		  var authToken = smart.state.tokenResponse.access_token;
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
    var DOB, Gender, MRN, Ethnicity, Address, City, State, District, PostalCode, Country, Phone, MaritalStatus, TemperatureOral, Weight, Height, BloodPressure, IOPLeft, 
	Glaucoma, VisualAcuityRight, VisualAcuityLeft, GlucoseFasting, RBC, WBC, HGB, DiabetesType, IOPRight, Cholesterol, Subscriber, Beneficiary, CoverageStartDate, 
	CoverageEndDate, Payor, GroupName, GroupValue,SystolicBP,DiastolicBP;
    	HGB = ""; Cholesterol = ""; Subscriber=""; Beneficiary=""; CoverageStartDate=""; 
    	CoverageEndDate=""; Payor=""; GroupName=""; GroupValue="";IOPLeft="";IOPRight="";Glaucoma="";
    if (practitionerID !== "" && fromDate !== "" && toDate !== "") {
        //console.log("url - " + "https://fhir-open.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Appointment?date=ge" + fromFullFormat + "&date=lt" + toFullFormat + "&practitioner=" + practitionerID + "");
        $.ajax({
            headers: {
                Accept: "application/json+fhir",
                "Content-Type": "application/json+fhir",
		"Authorization":"Bearer " + authToken
            },
            beforeSend: function () {
                $('#loadingimage').show();
            },
            url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Appointment?practitioner=" + practitionerID + "&date=ge" + fromFullFormat + "&date=lt" + toFullFormat + "&slot-type=http://snomed.info/sct|408443003"  ,
	    //url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Slot?slot-type=http://snomed.info/sct|408443003&start=ge2020-07-08&start=lt2020-07-08&_count=5" ,	
            //url: "https://fhir-open.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Appointment?date=ge" + fromFullFormat + "&date=lt" + toFullFormat + "&practitioner=" + practitionerID + "&code=http://snomed.info/sct%7C408443003" ,
            dataType: "json",
            //async: false,
            success: function (response) {

                var stringfyJsonResponse = JSON.stringify(response);
		    console.log("appointments " + stringfyJsonResponse);
                var parsePatientInfo = JSON.parse(stringfyJsonResponse);
                if ( parsePatientInfo.entry !== undefined) {
                    //data.push(["Appointment ID", "Appointment Status", "Standard Code", "Service Type", "Start", "End", "Duration Min", "Patient ID", "Patient Name", "Practitioner ID", "Practitioner Name", "Location ID", "Location"]);
                    //data.push(["Patient Name", "Status", "Start", "End", "DOB", "Gender", "MRN", "Ethnicity", "Address", "City", "State", "District", "Postal Code", "Country", "Phone", "Marital Status", "Temperature Oral", "Weight", "Height", "Systolic BP", "Diastolic BP", "IOP-Left", "Glaucoma", "Visual Acuity Right", "Visual Acuity Left", "Glucose Fasting", "RBC", "WBC", "HGB", "Diabetes Type", "IOP-Right", "Cholesterol", "Subscriber", "Beneficiary", "Coverage Start Date", "Coverage End Date", "Payor", "Group Name", "Group Value"]);
		   data.push(["practitioner ID", "Patient Name", "Status", "Start", "End", "DOB", "Gender", "MRN", "Ethnicity", "Address", "City", "State", "District", "Postal Code", "Country", "Phone", "Marital Status", "Temperature Oral", "Weight", "Height", "Systolic BP", "Diastolic BP", "Glucose Fasting", "RBC", "WBC", "HGB", "IOP Left","IOP Right", "Glaucoma", "Visual Acuity Right", "Visual Acuity Left"]);
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
                            isLastElement = entryresource == entryItems.length - 1;
                            if (entryresource == "resource") {
                                ServiceTypeText = "";
                                AppointmentID = entryResItems.id;
                                AppointmentStatus = entryResItems.status;
			      if(AppointmentStatus == "booked" || AppointmentStatus == "arrived")
			      {	      
                                if (entryResItems.serviceType != null) {
                                    $.each(entryResItems.serviceType, function (entryService, entryServiceItems) {
                                        if (entryServiceItems.coding != null) {
                                            system = "";
                                            code = "";
                                            $.each(entryServiceItems.coding, function (entryCoding, entryCodingItems) {
                                                $.each(entryCodingItems, function (entryCoding1, entryCodingItems1) {
                                                    if (entryCoding1 == "system") {
                                                        system = entryCodingItems1;
                                                    }
                                                    if (entryCoding1 == "code") {
                                                        code = entryCodingItems1;
                                                    }
                                                });
                                                if (system != "" && code != "") {
                                                    StandardCode = system + "| " + code;
                                                }
                                            });
                                        }
                                    });

                                    ServiceTypeText = entryResItems.description;

                                }
                                var startDate = new Date(entryResItems.start);
                                var endDate = new Date(entryResItems.end);

                                Start = startDate.getFullYear() + "-" + ((startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)) + "-" + (startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate()) + " " + (startDate.getHours() < 10 ? "0" + startDate.getHours() : startDate.getHours()) + ":" + (startDate.getMinutes() < 10 ? "0" + startDate.getMinutes() : startDate.getMinutes()) + ":" + (startDate.getSeconds() < 10 ? "0" + startDate.getSeconds() : startDate.getSeconds()); //startDate.getFullYear() + "-" + ((startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)) + "-" + (startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate()) + " " + startDate.getHours() + ":" + startDate.getMinutes() + ":" + startDate.getSeconds(); //startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate(); //entryResItems.start;
                                End = endDate.getFullYear() + "-" + ((endDate.getMonth() + 1) < 10 ? "0" + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)) + "-" + (endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate()) + " " + (endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours()) + ":" + (endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes()) + ":" + (endDate.getSeconds() < 10 ? "0" + endDate.getSeconds() : endDate.getSeconds());  //endDate.getFullYear() + "-" + ((endDate.getMonth() + 1) < 10 ? "0" + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)) + "-" + (endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate()) + " " + endDate.getHours() + ":" + endDate.getMinutes() + ":" + endDate.getSeconds(); //endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate(); //entryResItems.end;

                                DurationMin = entryResItems.minutesDuration;

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
                                            if (PatientID > 0) {
                                                console.log("PatientID - " + PatientID);
                                                $.ajax({
						    headers: {
                                                        Accept: "application/json+fhir",
                                                        "Content-Type": "application/json+fhir",
							"Authorization":"Basic " + authToken
							//"Access-Control-Allow-Origin", "*"
                                                    },
                                                    beforeSend: function () {
                                                        $('#loadingimage').show();
                                                    },
						    //crossOrigin: true,	
                                                    //url: enumConfig.PATIENT_API_URL + enumConfig.PATIENT_RESOURCE_NAME + "?_id=" + PatientID,
						    url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Patient?_id=" + PatientID,	
					            //url: enumConfig.PATIENT_API_URL + enumConfig.PATIENT_RESOURCE_NAME + "/" + PatientID,
                                                    dataType: "json",
                                                    async: false,
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

                                                                var mrnText = parsePatientInfo.entry[0].resource.identifier[0].type.text;
                                                                if (mrnText == "MRN") {
                                                                    MRN = parsePatientInfo.entry[0].resource.identifier[0].value;
                                                                }

                                                                Gender = parsePatientInfo.entry[0].resource.gender;
                                                                DOB = parsePatientInfo.entry[0].resource.birthDate;

                                                                if (parsePatientInfo.entry[0].resource.extension != null) {
                                                                    if (parsePatientInfo.entry[0].resource.extension.extension != null) {
                                                                        Ethnicity = parsePatientInfo.entry[0].resource.extension.extension[3].valueString;
                                                                    }

                                                                }
                                                                if (parsePatientInfo.entry[0].resource.address != null) {
                                                                    Address = parsePatientInfo.entry[0].resource.address[0].text;
                                                                    City = parsePatientInfo.entry[0].resource.address[0].city;
                                                                    State = parsePatientInfo.entry[0].resource.address[0].state;
                                                                    PostalCode = parsePatientInfo.entry[0].resource.address[0].postalCode;
                                                                    Country = parsePatientInfo.entry[0].resource.address[0].country;
                                                                    District = parsePatientInfo.entry[0].resource.address[0].district;

                                                                    if (parsePatientInfo.entry[0].resource.maritalStatus != null) {
                                                                        MaritalStatus = parsePatientInfo.entry[0].resource.maritalStatus.text;
                                                                    }

                                                                    if (parsePatientInfo.entry[0].resource.telecom != null) {
                                                                        Phone = parsePatientInfo.entry[0].resource.telecom[0].value;

                                                                        if (parsePatientInfo.entry[0].resource.telecom[1] != null) {
                                                                            // Email = parsePatientInfo.entry[0].resource.telecom[1].value;
                                                                            // $("#resourcePatientEmail").val(email);
                                                                        }

                                                                    }

                                                                }
                                                                else {

                                                                }
                                                            }
                                                        }

                                                    },
                                                    error: function (response) {
							  var stringfyJsonResponse = JSON.stringify(response);   
							var parseInfo = JSON.parse(stringfyJsonResponse);
							    console.log("Patient" + parseInfo);
                                                    }
                                                });
												// // medical history
                                                TemperatureOral = "";Height="";Weight="";
                                                GlucoseFasting = "";BloodPressure="";RBC="";
                                                WBC="";HGB="";SystolicBP="";DiastolicBP="";
						Glaucoma ==""; VisualAcuityRight="";VisualAcuityLeft="";
                                                DiabetesType="";IOPLeft="";IOPRight="";    
						    $.ajax({
							type: "GET",
						    headers: {
                                                         Accept: "application/json+fhir",
                                                        "Content-Type": "application/json+fhir",
							Authorization:"Basic " + authToken
							//"Access-Control-Allow-Origin": "https://censwteam.github.io/",
							//"Authorization":"Bearer " + authToken    
							//"Access-Control-Allow-Origin": "*"
                                                    },
						    beforeSend: function () {

                                                    },
                                                    complete: function () {

                                                    },
						    //url: enumConfig.PATIENT_API_URL + enumConfig.CONDITION_RESOURCE_NAME + "?patient="+PatientID, //   
						    url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Condition?patient=" + PatientID,			
						    //url: "https://fhir-ehr.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/Patient?_id=" + PatientID + "&code=http://loinc.org|8302-2",	    
                                                    dataType: "json",
                                                    async: false,
                                                    success: function (response) {
							    console.log("condition response" + response);
						    },
                                                    error: function (response) {
                                                       var stringfyJsonResponse = JSON.stringify(response);   
					                console.log("error Condition" + stringfyJsonResponse);
                                                    }
                                                });
                                                
                                            }
                                        });

                                    });

                                }

                                //console.log(jsonData);
                                //data.push(["" + AppointmentID + "", "" + AppointmentStatus + "", "" + StandardCode + "", "" + ServiceTypeText + "", "" + Start + "", "" + End + "", "" + DurationMin + "", "" + PatientID + "", "" + PatientName + "", "" + practitionerID + "", "" + PractitionerName + "", "" + LocationID + "", "" + Location + ""]);
                                data.push(["" + practitionerID + "", "" + PatientName + "", "" + AppointmentStatus + "", "" + Start + "", "" + End + "", "" + DOB + "", "" + Gender + "", "" + MRN + "", "" + Ethnicity + "", "" + Address + "", "" + City + "", "" + State + "", "" + District + "", "" + PostalCode + "", "" + Country + "", "" + Phone + "", "" + MaritalStatus + "","" + TemperatureOral + "","" + Weight + "","" + Height + "","" + SystolicBP + "","" + DiastolicBP + "","" + GlucoseFasting + "","" + RBC + "","" + WBC + "", "" + HGB + "","" + IOPLeft + "", "" + IOPRight + "", "" + Glaucoma + "", "" + VisualAcuityRight + "", "" + VisualAcuityLeft + ""]);
                                //data.push(["Patient Name", "Status", "Start", "End", "DOB","Gender","MRN","Ethnicity","Address","City","State","District","Postal Code","Country","Phone","Marital Status","Temperature Oral","Weight","Height","Systolic BP","Diastolic BP","IOP-Left","Glaucoma","Visual Acuity Right","Visual Acuity Left","Glucose Fasting","RBC","WBC","HGB","Diabetes Type","IOP-Right","Cholesterol","Subscriber","Beneficiary","Coverage Start Date","Coverage End Date","Payor","Group Name","Group Value"]);
                                //data.push([jsonData]);  "Temperature Oral", "Weight", "Height", "Systolic BP", "Diastolic BP", "Glucose Fasting", "RBC", "WBC", "HGB"

                            }
                          }
                        });
                        //console.log("*********END********"); 
                        //console.log("isLastElement" + isLastElement);

			
                        //data.push(jsonData);

                    });

                    //jsonData += "]}";
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


                //$('#scheduleInfo').DataTable();

                $('#loadingimage').hide();
            },
            error: function (response) {
		    var stringfyJsonResponse = JSON.stringify(response);   
					                console.log("error Condition" + stringfyJsonResponse);
                $('#loadingimage').hide();
            }
        });
        //$('#scheduleInfo').dataTable();
        $('#scheduleInfo').DataTable();

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
