/**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 03/04/2024
 * @description This class provides methods for TV_Show__c object.
 */
public with sharing class TVShowController {
    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 03/04/2024
     * @description The method returns list of TV_Show__c with their Id, Name, Img__c.
     */
      @AuraEnabled(cacheable=true)
      public static List<TV_Show__C> getTVShows() {
          return [SELECT Id, Name, Img__c
                  FROM TV_Show__C
                  ORDER BY Name];
      }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 03/04/2024
     * @description The method returns list of TV_Show__c with Name equal to parameter.
     * 
     * @param name name of a TV_Show__c.
     */
    @AuraEnabled
    public static TV_Show__c getTVShowByName(String name) {
        List<TV_Show__c> showList = [SELECT Id, Name, Img__c
                FROM TV_Show__C
                WHERE Name = :name];
                if(!showList.isEmpty()) {
                    return showList[0];
                } else {
                    return null;
                }
    }
}