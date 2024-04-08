import { LightningElement, wire, api, track } from 'lwc';
import getEpisodesById from '@salesforce/apex/EpisodeController.getEpisodesById';

/**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 07/04/2024
 * @description This class provides methods for getting Episode__c details.
 */
export default class EpisodeDetails extends LightningElement {
    @api episodeId;
    @track selectedEpisodeId;

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method assigns data to selectedEpisodeId.
     */
    @wire(getEpisodesById, { episodeId: "$episodeId"})
    wiredEpisode({ error, data }) {
        if (data) {
          this.selectedEpisodeId = data;
        } else if (error) {
          console.error(error);
        }
    }
}