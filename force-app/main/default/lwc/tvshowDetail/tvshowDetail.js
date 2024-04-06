import { LightningElement, api, wire, track } from 'lwc';
import getSeasonsByTvShowId from '@salesforce/apex/TVShowDetailController.getSeasonsByTvShowId';
import getEpisodesBySeasonId from '@salesforce/apex/TVShowDetailController.getSeasonsByTvShowId';
import getTVShowsById from '@salesforce/apex/TVShowController.getTVShowsById';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue, updateRecord, deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const CITY = 'TV_Show__c.City__c';
import TVSHOW_OBJECT from "@salesforce/schema/TV_Show__c";
import ID_FIELD from "@salesforce/schema/TV_Show__c.Id";
import NAME_FIELD from "@salesforce/schema/TV_Show__c.Name";
import DESCRIPTION_FIELD from "@salesforce/schema/TV_Show__c.Description__c";
import IMG_FIELD from "@salesforce/schema/TV_Show__c.Img__c";
import Id from '@salesforce/user/Id';
import getUserById from '@salesforce/apex.TVShowDetailController.getUserById';

export default class TvshowDetail extends NavigationMixin(LightningElement) {
    tvShowId;
    @track seasons = {};
    @track episodes = [];
    @track tvShows = {};
    @api recordId;
    @track selectedSeasonId;
    @track selectedEpisodeId;
    mapMarkers = [];
    showModal = false;
    name;
    description;
    posterUrl;
    errorMessage;
    tvShowData;
    originalTvShowData; 
    userId = Id;
    userRole;

    @wire(getUserById, { userId: '$userId' })
    wiredUser({ error, data }) {
        if (data) {
            this.userRole = data.UserRoleId;
            console.log('Role:',  this.userRole);
        } else if (error) {
            console.error('Error fetching user:', error);
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: CITY })
    loadMap({ error, data }) {
        if (error) {
            console.error('Błąd mapy', error);
        } else if (data) {
            const City = getFieldValue(data, CITY);
            this.mapMarkers = [{
                location: { City },
            }];
        }
    }

/*     connectedCallback() {
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(currentUrl);
        this.tvShowId = urlParams.get('tvShowId');
    } */

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
        this.selectedSeasonId = event.target.value;
        this.handleShowEpisodes();
    }

    handleShowEpisodes() {
        getEpisodesBySeasonId({ selectedSeasonId: this.selectedSeasonId })
        .then(result => {
            console.log('selectedSeasonId:', this.selectedSeasonId);
            console.log('Result:', result); 
            this.episodes = result.map(episode => ({
                label: episode.Name,
                value: episode.Id
            }));
            console.log('Episodes:', episodes); 
        })
        .catch(error => {
            console.error('Błąd pobierania odcinków:', error);
        });
    }

    chooseEpisode(event){
        this.selectedEpisodeId = event.target.value;
        console.log('selectedEpisode:', this.selectedEpisodeId);
    }

    @wire(getTVShowsById, { tvShowId: "$recordId" })
    wiredTvShows({ error, data }) {
        if (data) {
            this.tvShows = data;
        } else if (error) {
            console.error('Błąd pobierania tv shows:', error);
        }
    }

    handleClick() {
        deleteRecord(this.recordId)
        .then(() => {
            this.createToast('Success', 'TV Show was deleted successfully', 'success');
            window.location.href = '/';
        })
        .catch((error) => {
            console.log(error);
        })
    }

    refreshTVShowsList() {
        return refreshApex(this.tvShows);
    }

/**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 04/04/2024
 * @description This method handles opening of modal.
 */
    openModal() {
        this.showModal = true;
    }

    /**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 04/04/2024
 * @description This method handles closing of modal.
 */
    closeModal() {
        this.showModal = false;
    }
    

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 04/04/2024
     * @description This method handles changes in input form.
     */
        handleFieldChange(event) {
            if (event.target.name === "name") {
    
                //this is name input textbox
                this.name = event.target.value;
                console.log('name:', this.name);
            } else if (event.target.name === "description") {
              
                //this is industry input textbox
                this.description = event.target.value;
                console.log('name:', this.description);
              } /* else if (event.target.name === "posterUrl") {
              
                //this is rating input textbox
                this.posterUrl = event.target.value;
                console.log('name:', this.posterUrl);
              } */
        }
    
        handleupdateClick() {
            const fields = {};

            fields[ID_FIELD.fieldApiName] = this.recordId;
            fields[NAME_FIELD.fieldApiName] = this.tvShows.Name;
            fields[DESCRIPTION_FIELD.fieldApiName] = this.tvShows.Description__c;
/*             fields[IMG_FIELD.fieldApiName] = this.Img__c;
 */            
            const recordInput = {
                fields: fields
            };
            updateRecord(recordInput).then((record) => {
                console.log('fields:', fields);
                console.log(record);
            });
        }       

    createToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }


}   



