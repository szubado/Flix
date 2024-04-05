import { LightningElement, api, wire, track } from 'lwc';
import getSeasonsByTvShowId from '@salesforce/apex/TVShowDetailController.getSeasonsByTvShowId';
import getEpisodesBySeasonId from '@salesforce/apex/TVShowDetailController.getSeasonsByTvShowId';
import getTVShowsById from '@salesforce/apex/TVShowController.getTVShowsById';
import { NavigationMixin } from 'lightning/navigation';


export default class TvshowDetail extends NavigationMixin(LightningElement) {
    tvShowId;
    @track seasons = {};
    @track episodes = {};
    @track tvShows = {};
    @api recordId;
    selectedSeasonId;


    @wire(getSeasonsByTvShowId, { tvShowId: "$recordId" })
    wiredSeasons({ error, data }) {
        if (data) {
            this.seasons = data.map(season => ({
                label: season.Name,
                value: season.Id
            }))
        } else if (error) {
            console.error('Błąd pobierania sezonów:', error);
        }
    }

    chooseSeason(event){
        this.recordId = event.target.value;
        this.handleShowEpisodes();
    }

    @wire(getTVShowsById, { tvShowId: "$recordId" })
    wiredTvShows({ error, data }) {
        if (data) {
            this.tvShows = data;
        } else if (error) {
            console.error('Błąd pobierania odcinków:', error);
        }
    }
}   



