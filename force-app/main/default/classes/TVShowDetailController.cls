public with sharing class TVShowDetailController {
    @AuraEnabled(cacheable=true)
    public static List<Season__c> getSeasonsByTvShowId(String tvShowId) {
        return [SELECT Id, Name, (SELECT Id, Name FROM Episodes__r)
                FROM Season__c
                WHERE TV_Show__c = :tvShowId 
                ORDER BY Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<Episode__c> getEpisodesBySeasonId(String seasonId) {
        return [SELECT Id, Name, Season__c
                FROM Episode__c
                WHERE Season__c = :seasonId 
                ORDER BY Name];
    }
}