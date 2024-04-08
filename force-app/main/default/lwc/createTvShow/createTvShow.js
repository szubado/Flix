import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import getTVShowByName from '@salesforce/apex/TVShowController.getTVShowByName';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/**
 * @author Dominika Szuba <dominika.szuba@accenture.com>
 * @date 04/04/2024
 * @description This class provides methods for creating new TV_Show__c object.
 */
export default class CreateTvShow extends LightningElement {
    name;
    description;
    posterUrl;
    showModal = false;
    errorMessage;
    urlErrorMessage;
    generalMessage;
    descriptionErrorMessage;

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
     * @date 03/04/2024
     * @description This method checks if TV_Show__c record already exists.
     * 
     * @param name name of a TV_Show__c.
     */
    createTVShow() {
        getTVShowByName({ name: this.name })
            .then(result => {
                if (result) {
                    this.errorMessage = 'A TV show with this name already exists.';
                } else {
                    this.createNewRecord();
                }
            })
            .catch(error => {
                console.error('Error checking existing TV show:', error);
            });
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 04/04/2024
     * @description This method handles logic of creating TV_Show__c record.
     * 
     * @param name name of a TV_Show__c.
     */
    createNewRecord() {
        if (!this.name || !this.description || !this.posterUrl) {
            this.generalMessage = 'Records cannot be empty.';
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
        const fields = {
            'Name': this.name,
            'Description__c': this.description,
            'Img__c': this.posterUrl,
        };
        createRecord({ apiName: 'TV_Show__c', fields })
            .then(tvShow => {
                console.log('New TV Show created with Id:', tvShow.id);
                this.createToast();
                this.closeModal();
            })
            .catch(error => {
                console.error('Error creating TV Show:', error);
            });
    }
    
    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 06/04/2024
     * @description This method handles creating of toast.
     */
    createToast() {
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'TV Show created successfully',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
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
     * @description This method handles clearing input form.
     */
    clearForm() {
        const formElements = this.template.querySelectorAll('input');
        formElements.forEach(element => {
            element.value = '';
        });
    }
}