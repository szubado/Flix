trigger SendEmailAfterNewSeason on Season__c (after insert) {
    if(trigger.isAfter && trigger.isInsert){
        SendEmailAfterNewSeasonTriggerHandler.handleAfterInsert(Trigger.new);
    }
}