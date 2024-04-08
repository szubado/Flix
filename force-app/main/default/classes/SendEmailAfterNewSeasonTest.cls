@isTest
private class SendEmailAfterNewSeasonTest {
  /**
   * @author Dominika Szuba <dominika.szuba@accenture.com>
   * @date 08/04/2024
   * @description This method verifies number of future calls.
   */
    @isTest
    private static void testSendEmail(){
        TV_Show__c testShow = new TV_Show__c();
        testShow.Name = 'Test Show';
        testShow.Description__c = 'Test description';
        insert testShow;
        
        List<Season__c> seasons = new List<Season__c>();
    	for(Integer i = 0; i < 5; i ++) {
        	Season__c season = new Season__c();
            season.Name = 'Test Season' + i;
            season.TV_Show__c = testShow.Id;
            seasons.add(season);
    	}
        insert seasons;

        List<Id> insertedIds = new List<Id>();
        for(Season__c season : seasons) {
            insertedIds.add(season.Id);
        }   

        Test.startTest();
        SendEmailAfterNewSeasonTriggerHandler.sendMail(insertedIds);
        Integer invocations = Limits.getFutureCalls();
        System.assertEquals(1, invocations, 'One email should be sent.');
        Test.stopTest();
    }
}