/**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 07/04/2024
 * @description This class provides methods for TV_Show__c object details.
 */
public with sharing class TVShowDetailController {
    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description The method returns list of Season__c with their associated Episode__c.
     * 
     * @param tvShowId TV_Show__c object Id.
     */
    @AuraEnabled(cacheable=true)
    public static List<Season__c> getSeasonsByTvShowId(String tvShowId) {
        return [SELECT Id, Name, TV_Show__c, (SELECT Id, Name, Description__c FROM Episodes__r ORDER BY Name)
                FROM Season__c
                WHERE TV_Show__c = :tvShowId 
                ORDER BY Name];
    }
    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description The method returns list of Episode__c with Season__c equal to paremeter.
     * 
     * @param selectedSeasonId Season__c object Id.
     */
    @AuraEnabled
    public static List<Episode__c> getEpisodesBySeasonId(String selectedSeasonId) {
        return [SELECT Id, Name, Season__c
                FROM Episode__c
                WHERE Season__c = :selectedSeasonId 
                ORDER BY Name];
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description The method returns Season__c with TV_Show__c equal to paremeter.
     * 
     * @param tvShowId TV_Show__c object Id.
     */
    @AuraEnabled
    public static Season__c getSeasonByTvShowId(String tvShowId) {
        List<Season__c> seasonList = [SELECT Id, Name, TV_Show__c
                FROM Season__c
                WHERE TV_Show__c = :tvShowId];
        if(!seasonList.isEmpty()) {
            return seasonList[0];
        } else {
            return null;
        }
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description The method returns List of userRoles for current user.
     * 
     * @param tvShowId TV_Show__c object Id.
     */
    @AuraEnabled(cacheable=true)
    public static List<String> getUserRoles() {
        List<String> userRoles = new List<String>();
        for(UserRole userRole : [SELECT Name FROM UserRole WHERE Id IN (SELECT UserRoleId FROM User WHERE Id = :UserInfo.getUserId())]) {
            userRoles.add(userRole.Name);
        }
        return userRoles;
    }
}