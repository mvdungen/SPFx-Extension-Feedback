
// TODO - Remove code, changed in V4

export default interface IFeedbackValuesRef {
	siteTitle: string;
	siteUrl: string;
	pageTitle: string;
	pageUrl: string;
	Status: string;
	Category: string;
	feedbackBody: string;
}

export interface IPnPFeedbackValuesRef {
	Title: string;
	Body: string;
	SiteUrl: {
		Url: string;
		Description: string;
	};
	PageUrl: {
		Url: string;
		Description: string;
	};
	Status: string;
}

export const PnPFeedbackInitialValues: IPnPFeedbackValuesRef = {
	Title: '',
	Body: '',
	SiteUrl: {
		Url: '',
		Description: '',
	},
	PageUrl: {
		Url: '',
		Description: '',
	},
	Status: 'New',
};