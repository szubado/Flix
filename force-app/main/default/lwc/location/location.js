import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
const NAME_FIELD = 'TV_Show__c.Name';
const LOCATION_CITY = 'TV_Show__c.City__c';
const btvShowFields = [
	NAME_FIELD,
	LOCATION_CITY,
];

export default class Location extends LightningElement {
    @api recordId;
    name;
    mapMarkers = [];
    @wire(getRecord, { recordId: '$recordId', fields: btvShowFields })
    loadTvShow({ error, data }) {
      if (error) {
        console.error(error);
      } else if (data) {
        this.name =  getFieldValue(data, NAME_FIELD);
        const City = getFieldValue(data, LOCATION_CITY);
        this.mapMarkers = [{
          city: { City },
          title: this.name,
          description: `TV Show was created in: ${City}`
        }];
      }
    }
    get cardTitle() {
      return (this.name) ? `${this.name}'s location` : 'Tv Show location';
    }
}