export class SelectorGroup {
	constructor(private readonly selectors: string[]) {}

	asString() {
		return this.selectors.join(",");
	}

	getSelectors() {
		return this.selectors;
	}
}

export const Selectors = {
	fullName: new SelectorGroup(["#fullName", 'input[name="fullName"]', 'input[name="applicantName"]']),
	email: new SelectorGroup(["#email", 'input[type="email"]', 'input[name="email"]']),
	phone: new SelectorGroup(["#phone", 'input[type="tel"]', 'input[name="phone"]']),
	company: new SelectorGroup(["#currentCompany", 'input[name="currentCompany"]', "#company"]),
	linkedin: new SelectorGroup(["#linkedinUrl", 'input[name="linkedinUrl"]', "#linkedin"]),
	resume: new SelectorGroup(["#resume", 'input[type="file"]', 'input[name="resume"]']),
	submit: new SelectorGroup(["#submitBtn", 'button[type="submit"]', 'input[type="submit"]', 'button:has-text("Submit")']),
	successMessage: new SelectorGroup(["#successMessage", "text=Application Submitted", "text=Success", "text=Thank you"]),
	delayedField: new SelectorGroup(["#currentCompany", "#companyGroup.visible input"]),
};
