/**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 07/04/2024
 * @description This class provides methods for Sending email after adding new season.
 */
public with sharing class SendEmailAfterNewSeasonTriggerHandler {

    static final String SUBJECT = 'New season was added';
    static final String SEASON = ' Season Name: ';
    static final String EMAIL = 'dominika.szuba@accenture.com';
    static final String TVSHOW_NAME = ' TV Show Name: ';

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description The method sends email.
     * 
     * @param ids List of Id from seasons.
     */
    @future(callout=true)
    public static void sendMail(List<Id> ids) {
    List<Season__c> seasons = [SELECT Id, Name, TV_Show__r.Name FROM Season__c WHERE Id IN :ids];

    String body = '';
    for(Season__c season : seasons) {
        body += TVSHOW_NAME + season.TV_Show__r.Name + '<br/>';
    }

    Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
    message.setToAddresses(new String[] { EMAIL });
    message.setSubject(SUBJECT);
    message.setHtmlBody(body);
    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { message });
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description The method handles logic after adding new season.
     * 
     * @param seasons List of Season__c.
     */
    public static void handleAfterInsert(List<Season__c> seasons) {
    	List<Id> insertedIds = new List<Id>();
        for(Season__c season : seasons) {
            insertedIds.add(season.Id);
        }   
        sendMail(insertedIds);
    } 
}