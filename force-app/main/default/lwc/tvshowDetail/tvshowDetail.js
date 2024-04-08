import { LightningElement, api, wire, track } from 'lwc';
import getSeasonsByTvShowId from '@salesforce/apex/TVShowDetailController.getSeasonsByTvShowId';
import getTVShowsById from '@salesforce/apex/TVShowController.getTVShowsById';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue, updateRecord, deleteRecord, createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getSeasonByTvShowId from '@salesforce/apex/TVShowDetailController.getSeasonByTvShowId';
const CITY = 'TV_Show__c.City__c';
import TVSHOW_OBJECT from "@salesforce/schema/TV_Show__c";
import ID_FIELD from "@salesforce/schema/TV_Show__c.Id";
import NAME_FIELD from "@salesforce/schema/TV_Show__c.Name";
import DESCRIPTION_FIELD from "@salesforce/schema/TV_Show__c.Description__c";
import POSTER_URL_FIELD from "@salesforce/schema/TV_Show__c.Img__c";
const USER_ROLE = 'User';
import getUserRoles from '@salesforce/apex/TVShowDetailController.getUserRoles';

/**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 07/04/2024
 * @description This class provides methods for handling TV_Show__c details.
 */
export default class TvshowDetail extends NavigationMixin(LightningElement) {
    @api tvShowId;
    seasons = [];
    @track episodes = [];
    @track tvShows = {};
    @api recordId;
    @track selectedSeasonId;
    @track selectedEpisodeId;
    mapMarkers = [];
    showModal = false;
    showSeasonModal = false;
    name;
    description;
    posterUrl;
    errorMessage;
    seasonName;
    fetchedData;
    isDeleteButtonVisible;
    seasonMessage;
    generalmessage;

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method gets map records and assigns them to mapMarkers.
     */
    @wire(getRecord, { recordId: '$recordId', fields: CITY })
    loadMap({ error, data }) {
        if (error) {
            console.error('Map error', error);
        } else if (data) {
            const City = getFieldValue(data, CITY);
            this.mapMarkers = [{
                location: { City },
            }];
        }
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method gets Season__c records and assigns them to seasons.
     */
    @wire(getSeasonsByTvShowId, { tvShowId: "$recordId" })
    wiredSeasons({ error, data }) {
        if (data) {
            this.fetchedData = data;
            this.seasons = data.map(season => ({
                label: season.Name,
                value: season.Id
            }))
        } else if (error) {
            console.error('Błąd pobierania sezonów:', error);
        }
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method gets event value and assigns it to selectedSeasonId.
     */
    chooseSeason(event){
        this.selectedSeasonId = event.target.value;
        this.handleShowEpisodes();
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method formats episode details for display.
     */
    handleShowEpisodes() {
        this.episodes = this.fetchedData.find(obj => obj.Id == this.selectedSeasonId).Episodes__r;
        this.episodes = this.episodes.map(episode => ({
            label: episode.Name,
            value: episode.Id
        }));
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method gets event value and assigns it to selectedEpisodeId.
     */
    chooseEpisode(event){
        this.selectedEpisodeId = event.target.value;
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method gets TV_Show__c details and assigns them to tvShows.
     */
    @wire(getTVShowsById, { tvShowId: "$recordId" })
    wiredTvShows({ error, data }) {
        if (data) {
            this.tvShows = data;
        } else if (error) {
            console.error('Błąd pobierania tv shows:', error);
        }
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method handles delete record button action.
     */
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

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description TThis method handles refresh of record page.
     */
    refreshTVShowsList() {
        return refreshApex(this.tvShows);
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 08/04/2024
     * @description TThis method checks if current user is an admin.
     */
    @wire(getUserRoles)
    wiredUserRoles({ error, data }) {
        if (data) {
            this.isDeleteButtonVisible = !data.includes(USER_ROLE);
        } else if (error) {
            console.error('Error fetching user roles:', error);
        }
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
        const fieldName = event.target.dataset.field;
        this[fieldName] = event.target.value;
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 04/04/2024
     * @description This method handles changes in update form.
     */
    handleChange(event) {
        const fieldName = event.target.dataset.field;
        if (fieldName === 'name') {
            this.name = event.target.value;
        } else if (fieldName === 'description') {
            this.description = event.target.value;
        } else if (fieldName === 'posterUrl') {
            this.posterUrl = event.target.value;
        }
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method gets TV_Show__c details and assigns them to tvShows.
     */
        @wire(getTVShowsById, { tvShowId: "$recordId" })
        wiredTvShows({ error, data }) {
            if (data) {
                this.tvShows = data;
            } else if (error) {
                console.error('Błąd pobierania tv shows:', error);
            }
        }
    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method handles update record button action.
     */
    updateTVShow() {
        if (!this.name || !this.description || !this.posterUrl) {
            this.errorMessage = 'Records cannot be empty';
            return;
        }
        if (!this.posterUrl.startsWith('https://fwcdn.pl')) {
            this.urlErrorMessage = 'Image URL must start with => https://fwcdn.pl';
            return;
        }
        if (this.description.length < 10) {
            this.descriptionErrorMessage = 'Description must be at least 10 characters long.';
            return;
        }
        const fields = {};

        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[NAME_FIELD.fieldApiName] = this.name;
        fields[DESCRIPTION_FIELD.fieldApiName] = this.description;
        fields[POSTER_URL_FIELD.fieldApiName] = this.posterUrl;

        const recordInput = {
            fields: fields
          };

        updateRecord(recordInput)
        .then(result => {
            console.log('TV Show updated successfully:', result);
            this.createToast('Success', 'TV Show updated successfully', 'success');
            this.closeModal();
        })
        .catch(error => {
            console.error('Error updating TV Show:', error);
            this.createToast('Error', 'Error updating TV Show', 'error');
        });
}
           

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method handles creating of toast message.
     */
    createToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 04/04/2024
     * @description This method handles opening of modal.
     */
    openSeasonModal() {
        this.showSeasonModal = true;
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 04/04/2024
     * @description This method handles closing of modal.
     */
    closeSeasonModal() {
        this.showSeasonModal = false;
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method handles checking if season already exists.
     */
    handleAddSeason() {
        getSeasonByTvShowId({ tvShowId: this.tvShowId })
        .then(result => {
            if (result) {
                this.errorMessage = 'This season already exists.';
            } else {
                this.createNewSeason();
            }
        })
        .catch(error => {
            console.error('Error checking existing Season:', error);
        });
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 07/04/2024
     * @description This method handles logic of adding new Season.
     */
    createNewSeason() {
        if (!this.seasonName.startsWith('Season ')) {
            this.seasonMessage = 'Season name must start with => "Season ". E.g. Season 1';
            return;
        }
        const fields = {
            'Name': this.seasonName,
            'TV_Show__c': this.recordId,
        };
        createRecord({ apiName: 'Season__c', fields })
        .then(newSeason => {
            this.createToast('Success', 'Season was added successfully', 'success');
            this.closeSeasonModal();
        })
        .catch(error => {
            console.error('Error creating Season:', error);
        });
    }
}