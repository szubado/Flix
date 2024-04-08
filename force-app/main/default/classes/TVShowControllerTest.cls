@isTest
private with sharing class TVShowControllerTest {
  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description The method sets up data for tests.
   */
    @testSetup
    static void setup() {
        List<TV_Show__c> testShows = new List<TV_Show__c>();
        for (Integer i = 0; i < 5; i++) {
            TV_Show__c testShow = new TV_Show__c(Name = 'Test' + i, Description__c = 'Description Test');
            testShows.add(testShow);
        }
        insert testShows;
    }

  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description This method returns tv show by name.
   */
    @isTest
    static void shouldReturnTvShowByName() {
        TV_Show__c tvShow = [SELECT Id, Name, Img__c
            FROM TV_Show__c LIMIT 1];

        Test.startTest();
        TV_Show__c returnedTvShow = TVShowController.getTVShowByName(tvShow.Name);
        Test.stopTest();

        System.assertEquals('Test0', returnedTvShow.Name, 'Name of returned tv show is incorrect.');
    }

  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description This method returns list of tv shows by name.
   */
    @isTest
    static void shouldReturnTvShowsOrderedByName() {

        Test.startTest();
        List<TV_Show__c> returnedTvShows = TVShowController.getTVShows();
        Test.stopTest();

        System.assertEquals(5, returnedTvShows.size(), 'Amount of returned tv shows is incorrect.');

        for (Integer i = 0; i < returnedTvShows.size() - 1; i++) {
            System.assert(returnedTvShows[i].Name <= returnedTvShows[i + 1].Name, 'TV Shows are not sorted alphabetically');
        }
    }

  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description This method returns tv show by id.
   */
    @isTest
    static void shouldReturnTvShowsById() {
        TV_Show__c tvShow = [SELECT Id, Name, Img__c, Description__c, Trailer_Link__c, City__c
        FROM TV_Show__C LIMIT 1];

        Test.startTest();
        List<TV_Show__c> returnedTvShows = new List<TV_Show__c>();
        returnedTvShows.add(TVShowController.getTVShowsById(tvShow.Id));
        Test.stopTest();

        System.assertEquals(1, returnedTvShows.size(), 'Name of returned tv show is incorrect.');
    }
 }