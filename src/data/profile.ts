/** Profile data describing the site owner, shared by the structured data, the Markdown representation, and the footer. */
const profile = {
	/** Full legal name. */
	name: 'Alexander Joo-Hyun Sullivan',
	/** Personal brand and handle used across the site and social accounts. */
	brand: 'AlexJSully',
	/** Canonical site URL, with trailing slash. */
	url: 'https://alexjsully.me/',
	/** One-line role summary. */
	tagline: 'Software Developer & Bioinformatician',
	/** Professional summary used as the structured-data description and the Markdown About section. */
	description:
		'Alexander Joo-Hyun Sullivan is a Canadian software developer and bioinformatician at Verily, building patient-facing health apps, research data platforms, and open-source FHIR tooling. An MSc graduate of the University of Toronto, Alexander built open-source web tools for exploring plant genomics data at the Bio-Analytic Resource for Plant Biology.',
	/** Public contact email address. */
	email: 'alexjsully.connect@outlook.com',
	/** Current job title. */
	jobTitle: 'Software Developer',
	/** Current employer. */
	employer: 'Verily',
	/** Alma mater. */
	alumniOf: 'University of Toronto',
	/** ISO 3166-1 alpha-2 country code; no finer-grained location is published. */
	addressCountry: 'CA',
	/** Site-relative path of the downloadable résumé. */
	resumePath: '/resume/Resume.pdf',
	/** Public repository holding this site's source code. */
	sourceRepository: 'https://github.com/AlexJSully/AlexJSully-Portfolio',
	/** Profiles that identify the owner but have no footer icon; the footer's accounts live in `@data/socials`. */
	externalProfiles: {
		/** ORCID record, the authoritative list of publications. */
		orcid: 'https://orcid.org/0000-0002-4463-4473',
		/** Google Scholar profile. */
		googleScholar: 'https://scholar.google.ca/citations?user=1nr3eaAAAAAJ&hl=en',
		/** Instagram account. */
		instagram: 'https://www.instagram.com/alex.j.sullly/',
		/** Threads account. */
		threads: 'https://www.threads.net/@alex.j.sullly',
	},
};

export default profile;
