@isTest
private with sharing class TVShowDetailControllerTest {
  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description The method sets up data for tests.
   */
    @testSetup
    static void setup() {
        TV_Show__c testShow = new TV_Show__c(Name = 'Test', Description__c = 'Description Test');
        insert testShow;

        List<Season__c> seasons = new List<Season__c>();
        Season__c testSeason2 = new Season__c(Name = 'Test', TV_Show__c = testShow.Id);
        seasons.add(testSeason2);

        for(Integer i = 0; i < 5; i ++ ) {
            Season__c testSeason = new Season__c();
            testSeason.Name = 'Test Season';
            testSeason.TV_Show__c = testShow.Id;
            seasons.add(testSeason);
        }
        insert seasons;

        List<Episode__c> episodes = new List<Episode__c>();
    	for(Integer i = 0; i < 5; i ++) {
        	Episode__c episode = new Episode__c();
            episode.Name = 'Test Episode' + i;
            episode.Description__c = 'Test description';
            episode.Season__c = testSeason2.Id;
            episodes.add(episode);
    	}
        insert episodes;
    }

  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description This method returns seasons by tv show Id ordered by name.
   */
    @isTest
    static void shouldReturnSeasonsByTvShowIdAlphabetically() {
        TV_Show__c tvShow = [SELECT Id, Name FROM TV_Show__C LIMIT 1];

        Test.startTest();
        List<Season__c> returnedSeasons = TVShowDetailController.getSeasonsByTvShowId(tvShow.Id);
        Test.stopTest();

        System.assertEquals(6, returnedSeasons.size(), 'Amount of returned seasons is incorrect.');

        for (Integer i = 0; i < returnedSeasons.size() - 1; i++) {
            System.assert(returnedSeasons[i].Name <= returnedSeasons[i + 1].Name, 'Seasons are not sorted alphabetically');
        }
    }

  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description This method returns episodes by season Id ordered by name.
   */
    @isTest
    static void shouldReturnEpisodesBySeasonIdAlphabetically() {
        Season__c season = [SELECT Id, Name FROM Season__c LIMIT 1];

        Test.startTest();
        List<Episode__c> returnedEpisodes = TVShowDetailController.getEpisodesBySeasonId(season.Id);
        Test.stopTest();

        System.assertEquals(5, returnedEpisodes.size(), 'Amount of returned episodes is incorrect.');

        for (Integer i = 0; i < returnedEpisodes.size() - 1; i++) {
            System.assert(returnedEpisodes[i].Name <= returnedEpisodes[i + 1].Name, 'Episodes are not sorted alphabetically');
        }
    }

  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description This method returns season by tv show Id.
   */
    @isTest
    static void shouldReturnSeasonByTvShow() {
        TV_Show__c tvShow = [SELECT Id, Name FROM TV_Show__C LIMIT 1];

        Test.startTest();
        Season__c returnedSeason2 = TVShowDetailController.getSeasonByTvShowId(tvShow.Id);
        Test.stopTest();

        System.assertEquals('Test', returnedSeason2.Name, 'Amount of returned seasons is incorrect.');
    }
}