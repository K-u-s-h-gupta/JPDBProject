let jpdbBaseUrl =  "http://api.login2explore.com:5577"
let jpdbIRL = "/api/irl"
let jpdbIML = "/api/iml"
let stdDBName = "SCHOOL-DB"
let stdrelationName = "STUDENT-TABLE"
let connToken = "90938123|-31949270485600041|90955034"

$('#rollno').focus();

function resetForm(){
    $('#rollno').val("");
    $('#fullname').val("")
    $('#class').val("")
    $('#birthdate').val("")
    $('#address').val("")
    $('#endate').val("")
    $('#rollno').prop('disabled', false);
    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    $('#rollno').focus();
}

function ValidateData(){
    let rollno = $('#rollno').val()
    let fullname = $('#fullname').val()
    let className = $('#class').val()
    let birthdate = $('#birthdate').val()
    let address = $('#address').val()
    let endate = $('#endate').val()
    
    if(rollno == ""){
        alert("Roll Number is missing")
        $('#rollno').focus()
        return ""
    }
    if(fullname == ""){
        alert("Full Name is missing")
        $('#fullname').focus()
        return ""
    }
    if(className == ""){
        alert("Class is missing")
        $('#class').focus()
        return ""
    }
    if(birthdate == ""){
        alert("Date of Birth is missing")
        $('#birthdate').focus()
        return ""
    }
    if(address == ""){
        alert("Address is missing")
        $('#address').focus()
        return ""
    }
    if(endate == ""){
        alert("Enrollment Date is missing")
        $('#endate').focus()
        return ""
    }

    let jsonStrObj = {
        rollno: rollno,
        fullname: fullname,
        class: className,
        birthdate: birthdate,
        address: address,
        enrollment_date: endate 
    }
    return JSON.stringify(jsonStrObj);
}

function saveData(){
    let jsonStrObj = ValidateData();

    let putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, stdrelationName)

    jQuery.ajaxSetup({async:false})
    let resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIML)
    jQuery.ajaxSetup({async:true})

    resetForm()
    $('#rollno').focus
}

function changeData(){
    $('#change').prop('disabled', true)

    jsonchg = ValidateData()
    let updateRequest = createUPDATERecordRequest(connToken, jsonchg, stdDBName, stdrelationName, localStorage.getItem('record'))

    jQuery.ajaxSetup({async:false})
    let resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML)
    jQuery.ajaxSetup({async:true})

    resetForm();
    $('#rollno').focus()
}

function getrollnoAsJsonObj(){
    let rollno = $('#rollno').val()

    let jsonStrObj = {
        rollno: rollno
    }
    return JSON.stringify(jsonStrObj);
}
function saveRecNo2LS(jsonObj){
    let lvData = JSON.parse(jsonObj.data)
    localStorage.setItem('record', lvData.rec_no)
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj)
    let record = JSON.parse(jsonObj.data).record
    $('#fullname').val(record.fullname)
    $('#birthdate').val(record.birthdate)
    $('#class').val(record.class)
    $('#address').val(record.address)
    $('#endate').val(record.enrollment_date)
}

function getStd(){
    let rollnoJsonObj = getrollnoAsJsonObj()
    let getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdrelationName, rollnoJsonObj)

    jQuery.ajaxSetup({async:false})
    let resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL)
    jQuery.ajaxSetup({async:true})
    console.log(resJsonObj)
    if(resJsonObj.status === 400){
        $('#save').prop('disabled', false)
        $('#reset').prop('disabled', false)
        $('#fullname').focus();
    }else if(resJsonObj.status === 200){
        $('#rollno').prop('disabled', true)
        fillData(resJsonObj)
        $('#change').prop('disabled', false)
        $('#reset').prop('disabled', false)
        $('#fullname').focus();
    }
}