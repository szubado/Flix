/**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 07/04/2024
 * @description This class provides methods for Episode__c object.
 */
public with sharing class EpisodeController {
    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 03/04/2024
     * @description The method returns list of Episode__c with their Id, Name, Season__c, Description__c.
     * 
     * @param episodeId Episode__c Id.
     */
    @AuraEnabled(cacheable=true)
    public static List<Episode__c> getEpisodesById(String episodeId) {
        return [SELECT Id, Name, Season__c, Description__c, Episode_Number__c
                FROM Episode__c
                WHERE Id = :episodeId];
    }
}