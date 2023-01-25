/* 
    Creation : 25-Jan-2023 
    Author   : Manoj Raghavan
    File     : script.js

    Version history and changes:
    1.0 - Creation - 
          Alarm Clock App using  :
          HTML/CSS/JAVASCRIPT/LocalStorage/IIFE/Revealing Module Pattern/Event Delegation
    2.0 - 
*/

var AlarmApp = (function() {
    let alarms = [];
    var display = document.getElementById("display");
    var hours = document.getElementById('hours');
    var minutes = document.getElementById('minutes');
    var seconds = document.getElementById('seconds');
    var ampm = document.getElementById('am-pm');
    var setAlarm = document.getElementById('setAlarm');
    
    /*
      Function : retrieveLocalStorage()
      Description : Restore Alarms from local storage on start up
    
    */
    function retrieveLocalStorage() {
        var alarmsLocal = JSON.parse(localStorage.getItem("alarms"));
        
        if (alarmsLocal != null && alarmsLocal.length>0 ) {
            console.log("retrieved");
            alarms = alarmsLocal;     
        }
        renderAlarms();   
    }
    
    /*
      Function : setTimeMenu()
      Description : Display the menu options list for hours/minutes/seconds 
    
    */
    function setTimeMenu() {
        for (i=1; i <= 12; i++) {
            hours.options[hours.options.length] = new Option( i < 10 ? "0" + i : i, i);           
        }
        for (i=0; i <= 59; i++) {
            minutes.options[minutes.options.length] = new Option(i < 10 ? "0" + i : i, i);
        }
        for (i=0; i <= 59; i++) {
            seconds.options[seconds.options.length] = new Option(i < 10 ? "0" + i : i, i);
        }
    
    }
    
    /*
      Function : displayCurrentTime()
      Description : Display the current time in 12 hr format in the Time display panel
    
    */
    function displayCurrentTime () {
        
        var currTime = document.getElementById('timePanel');
        setInterval(() => {
            currTime.innerHTML = getCurrentTime();
        },1000);   
    
    }
    
    /*
      Function : getCurrentTime()
      Description : Get the current time in 12 hr format
    
    */
    function getCurrentTime() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    
        hours = hours > 12 ? hours-12 : hours;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
    
        time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    
        return time;
    }
    
    /*
      Function : addAlarmToDom()
      Description : Add the new Alarm to the Dom
    
    */
    function addAlarmToDom(alarm) {
        var alarmItem = document.createElement('div');
        let hours = alarm.time.hours;
        let minutes = alarm.time.minutes;
        let seconds = alarm.time.seconds;
        let ampm = alarm.time.ampm;
        let CurrId = alarm.id;
    
        alarmItem.innerHTML = `
            <div class="alarm"> 
                <span> ${hours}:${minutes}:${seconds} ${ampm}</span>
                <button class ="delete"  data-id=${CurrId}> Delete </button>        
            </div> 
        
        `
        display.appendChild(alarmItem);
    
    }
    
    /*
      Function : renderAlarms()
      Description : Render all the Alarms to the DOM
    
    */
    function renderAlarms () {
    
        display.innerHTML ="";
        for ( let i = 0; i < alarms.length; i++ ) {
            addAlarmToDom(alarms[i]);
        }   
    }
    
    /*
      Function : deleteAlarm()
      Description : Delete the Alarm with the passed Id and then render all Alarms to the DOM
    
    */
    function deleteAlarm(alarmId) {
    
        var newAlarms = alarms.filter( (elem) => {
            return elem.id != alarmId
        } );
        alarms = newAlarms;
        renderAlarms(alarms);
        localStorage.setItem("alarms", JSON.stringify(alarms));
    }
    
    /*
      Function : handleSetAlarm()
      Description : 
        - Create the new Alarm
        - Add to the Alarms list
        - Add the alarm to the DOM
        - Update Local Storage
    
    */    
    function handleSetAlarm (event) {
        var date = new Date();
    
        if ( alarms.length == 6) {
            window.alert("Alarms Limit Reached...Can set max of 6 alarms!");
            return;
        }
    
        hrs_selected = hours.options[hours.selectedIndex].value;
        min_selected = minutes.options[minutes.selectedIndex].value;
        seconds_selected = seconds.options[seconds.selectedIndex].value;
        ampm.selected = ampm.options[ampm.selectedIndex].value;
        console.log("hrs_selected" + hrs_selected);
    
        // Pad with leading zero if <10
        hrs_selected = hrs_selected < 10 ? "0" + hrs_selected: hrs_selected;
        min_selected = min_selected < 10 ? "0" + min_selected: min_selected;
        seconds_selected = seconds_selected < 10 ? "0" + seconds_selected: seconds_selected;
        ampm.selected = ampm.selected < 10 ? "0" + ampm.selected: ampm.selected;
        console.log("hrs_selected" + hrs_selected);
    
        // Build a new alarm object
        var alarm = {
            "time" : {"hours": hrs_selected,
                       "minutes" : min_selected,
                       "seconds" : seconds_selected,
                       "ampm" : ampm.selected },
            "id" : Date.now().toString(),
            "now" : Date.now()
        }
    
        // Push the new alarm to the alarm list
        alarms.push(alarm);

        // Add the new alarm to the DOM
        addAlarmToDom(alarm);

        // Update the local storage
        localStorage.setItem("alarms", JSON.stringify(alarms));
        
    }
    
    /*
      Function : handleClickEvents()
      Description : Handle all click events through EVENT DELEGATION
        - Set Alarm
        - Delete
    
    */   
    function handleClickEvents (event) {
        console.log(event.target.className);
        console.log("event.target.id " + event.target.id);
        console.log("event.target.dataset.id " + event.target.dataset.id);
    
        console.log(alarms);
    
        // Handle the click events for 'delete' and 'setAlarm' ie new alarm
        if ( event.target.className == 'delete') {
            var id = event.target.dataset.id;
            deleteAlarm(event.target.dataset.id);
        } else if (event.target.className == 'setAlarm' ) {
            console.log("set alarm");
            handleSetAlarm(event);
        }
    
    }
    
    /*
      Function : pollAlarms()
      Description : Poll all alarms and when an alarm goes off, alert in the browser
    
      */
    function pollAlarms() {
        
        // Poll alarms list every 500 milli second
        var intervalId = setInterval(() => checkAlarms(), 500);
    
    }
    
    /*
      Function : checkAlarms()
      Description : Check all alarms and compare each with current time and alert if an alarm goes off
        
    */
    function checkAlarms (){
    
        console.log("checkAlarms");
    
        var currTime = getCurrentTime();
        
        if ( alarms.length > 0 ) {
    
            for ( let i = 0; i < alarms.length; i++) {
                let timeStr = alarms[i].time.hours + ":" + alarms[i].time.minutes + ":" + alarms[i].time.seconds +" " + alarms[i].time.ampm;
                //console.log(currTime);
                //console.log(timeStr);
    
                if (currTime == timeStr ) 
                {
                    window.alert("Alarm Notification : " + timeStr)
                }
            }
        }
        
    }
    
    
    /*
      Function : initializeApp()
      Description : Initialize the app 
        
    */
    function initializeApp () {
        /* Retrieve the alarms array from the Local Storage */
        retrieveLocalStorage();
    
        /* Display the current Time in 12 hour format */
        displayCurrentTime();
    
        /* Display the menu for hours/minutes/seconds */
        setTimeMenu();
    
        /* Use event delegation for handling all click events in the App ( setAlarm and Delete) */
        document.addEventListener('click', handleClickEvents);
    
        /* Poll for active alarms and trigger the alarm notification */
        pollAlarms();
    }
    
    /* Initiatize the app */
    initializeApp ();
    
    /* Return the functions we want to reveal to the external world */
    return {
        initialize: initializeApp
    }
}) ();

