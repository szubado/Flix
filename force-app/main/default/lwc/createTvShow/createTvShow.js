import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import getTVShowByName from '@salesforce/apex/TVShowController.getTVShowByName';

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
    successMessage;

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
    async createTVShow() {
        try {
            const result = await getTVShowByName({ name: this.name });
            if (result) {
                this.errorMessage = 'A TV show with this name already exists.';
            } else {
                await this.createNewRecord();
            }
        } catch (error) {
            console.error('Error checking existing TV show:', error);
        }
    }

    /**
     * @author Dominika Szuba <dominika.szuba@accenture.com>
     * @date 04/04/2024
     * @description This method handles logic of creating TV_Show__c record.
     * 
     * @param name name of a TV_Show__c.
     */
    createNewRecord() {
        const fields = {
            'Name': this.name,
            'Description__c': this.description,
            'Img__c': this.posterUrl,
        };
        createRecord({ apiName: 'TV_Show__c', fields })
            .then(tvShow => {
                console.log('New TV Show created with Id:', tvShow.id);
                this.successMessage = 'TV show record was created.';
            })
            .catch(error => {
                console.error('Error creating TV Show:', error);
            });
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
