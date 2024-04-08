@isTest
public with sharing class EpisodeControllerTest {
  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description The method sets up data for tests.
   */
    @testSetup
    static void setup() {
        TV_Show__c testShow = new TV_Show__c(Name = 'Test', Description__c = 'Description Test');
        insert testShow;

        Season__c testSeason = new Season__c(Name = 'Test', TV_Show__c = testShow.Id);
        insert testSeason;

        Episode__c testEpisode = new Episode__c(Name = 'Test Season', Season__c = testSeason.Id, Description__c = 'Test description');   
        insert testEpisode;
    }

  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description The method verifies if all episodes are returned alphabetically.
   */
    @isTest
    static void shouldReturnAllEpisodes() {
        Episode__c episode = [SELECT Id, Name FROM Episode__c LIMIT 1];

        Test.startTest();
        List<Episode__c> returnedEpisodes = EpisodeController.getEpisodesById(episode.Id);
        Test.stopTest();
        
        System.assertEquals(1, returnedEpisodes.size(), 'Number of returned episodes is incorrect.');
    }
}