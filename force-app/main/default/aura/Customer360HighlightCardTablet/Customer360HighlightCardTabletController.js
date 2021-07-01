({
    doInit: function(component, event, helper) {
       var pullMargin = component.get("v.pullMargin");
        console.log(pullMargin);
        if(pullMargin == true) {
            var toggleText = component.find("card");
            $A.util.toggleClass(toggleText, "card-pull-margin");
            console.log("pull margin set");
        }; 
        component.find('recordHandler').reloadRecord(true)
       // $A.get("e.force:refreshView").fire();
    },
    handleMenuSelect: function(component, event, helper) {
        var selectedMenuItemValue = event.getParam("value");
    },
    closeModal:function(component,event,helper){    
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
        component.find("recordHandler").reloadRecord();
    },
    cancel:function(component,event,helper){    
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        component.find("recordHandler").reloadRecord();
    },
    openmodal: function(component,event,helper) {
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open'); 
    },
    handleRecordUpdated: function(component, event, helper) {
        try{
            var eventParams = event.getParams();
            if(eventParams.changeType === "CHANGED") {
                // get the fields that changed for this record
                var changedFields = eventParams.changedFields;
                console.log('Fields that are changed: ' + JSON.stringify(changedFields));            
                // record is changed, so refresh the component (or other component logic)
                // var resultsToast = $A.get("e.force:showToast");
                // resultsToast.setParams({
                //    "title": "Saved",
                //    "message": "The record was updated."
                // });
                // resultsToast.fire();
                component.find("recordHandler").reloadRecord();

            } else if(eventParams.changeType === "LOADED") {
                console.log('Setting PIC');
                console.log(component.get("v.fields.Cust360_Contact_Picture_URL__c"));
                // get Avatar Image once record is loaded
                component.set("v.customerAvatarUrl",component.get("v.fields.Cust360_Contact_Picture_URL__c"));
                console.log(component.get("v.customerAvatarUrl"));
                
            } else if(eventParams.changeType === "REMOVED") {
                // record is deleted and removed from the cache
            } else if(eventParams.changeType === "ERROR") {
                // there’s an error while loading, saving or deleting the record
            }
        }catch(e){
            console.error(e);
        }
        
    },
    handleSaveRecord: function(component, event, helper) {                
        component.find("recordHandler").saveRecord($A.getCallback(function(saveResult) {
            // NOTE: If you want a specific behavior(an action or UI behavior) when this action is successful 
            // then handle that in a callback (generic logic when record is changed should be handled in recordUpdated event handler)
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                var cmpTarget = component.find('Modalbox');
                var cmpBack = component.find('Modalbackdrop');
                $A.util.removeClass(cmpBack,'slds-backdrop--open');
                $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
            } else if (saveResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "ERROR") {
                console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        }));
    },
    onIdChange: function(c,e,h){
    c.find('recordHandler').reloadRecord(true)
}
})