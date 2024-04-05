import { LightningElement } from 'lwc';
import getTVShows from '@salesforce/apex/TVShowController.getTVShows';
import { NavigationMixin } from 'lightning/navigation';

/**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 04/04/2024
 * @description This class provides methods for displaying TV_Show__c.
 */
export default class TvShowList extends NavigationMixin(LightningElement) {
    tvShows;
	error;

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 04/04/2024
     * @description This method keeps list of TV_Show__c up to date and assigns results to variable tvShows.
     */
    connectedCallback() {
		getTVShows()
		.then(result => {
			this.tvShows = result;
		})
		.catch(error => {
			this.error = error;
		});	}

	/**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 04/04/2024
     * @description This method navigates to TV_Show__c record page.
     */

	
	handleTvShowClick(event) {
        const tvShowId = event.target.dataset.id;
		this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: tvShowId,
                objectApiName: 'TV_Show__c',
                actionName: 'view'
            }
        });
    }		
}

