import { LightningElement } from 'lwc';
import getTVShows from '@salesforce/apex/TVShowController.getTVShows';

export default class TvShowList extends LightningElement {
    tvShows;
	error;
	/* appResources = {
		bearSilhouette: `${ursusResources}/standing-bear-silhouette.png`,
	}; */
	connectedCallback() {
		this.loadTvShow();
	}
	loadTvShow() {
		getTVShows()
			.then(result => {
				this.tvShows = result;
			})
			.catch(error => {
				this.error = error;
			});
	}
}
