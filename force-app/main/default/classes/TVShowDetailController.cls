public with sharing class TVShowDetailController {
    @AuraEnabled(cacheable=true)
    public static List<Season__c> getSeasonsByTvShowId(String tvShowId) {
        return [SELECT Id, Name
                FROM Season__c
                WHERE TV_Show__c = :tvShowId 
                ORDER BY Name];
    }

    @AuraEnabled
    public static List<Episode__c> getEpisodesBySeasonId(String selectedSeasonId) {
        return [SELECT Id, Name, Season__c
                FROM Episode__c
                WHERE Season__c = :selectedSeasonId 
                ORDER BY Name];
    }

    @AuraEnabled
    public static List<User> getUserById(String userId) {
        return [SELECT Id, Name, UserRoleId
                FROM User
                WHERE Id = :userId 
                LIMIT 1];
    }
}