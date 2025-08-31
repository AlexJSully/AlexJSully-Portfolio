import {
	BarIcon,
	GitHubIcon,
	ImpactDepthIcon,
	MPXIcon,
	MetaIcon,
	PublishIcon,
	SciGradeIcon,
	SmallDevTalkIcon,
	UofTIcon,
	VerilyIcon,
} from '@images/icons';
import { SvgIconProps } from '@mui/material';

/** Project data */
interface Projects {
	/** The name of the project. */
	name: string;
	/** The unique identifier for the project (ex. associated with the image file name). */
	id: string;
	/** A description of the project. */
	description?: string;
	/** The employer for the project. */
	employer?: string;
	/** The URL for the employer (must be provided IF `employer` was provided). */
	employerURL?: string;
	/** The title of the project. */
	title: string;
	/** Publication URL for the project. */
	publication?: string;
	/** The type of project work (ex Employment, Personal Project, School, etc...). */
	type?: string;
	/** The URL for the project. */
	url: string;
	/** URLs for the buttons to showcase the project. */
	urls: {
		/** The text for the button. */
		text: string;
		/** The tooltip for the button. */
		tooltip: string;
		/** The icon for the button. */
		icon: (props: SvgIconProps) => React.ReactElement;
		/** The URL for the button. */
		url: string;
	}[];
	/** The color for the project. */
	color: string;
	/** The dates for the project. */
	dates?: {
		/** The start date for the project. */
		startDate: string;
		/** The end date for the project. */
		endDate: string;
	};
	/** Whether to showcase the project (if hidden behind show more button or not) */
	showcase?: boolean;
	/** The object fit for the project image (defaults to cover if nothing provided). */
	objectFit?: string;
	/** The YouTube URL for the project. */
	youtubeURL?: string;
}

/** Project data */
const projects: Projects[] = [
	{
		name: 'Verily Workbench',
		id: 'workbench',
		description:
			'Verily Workbench enables researchers to access, analyze and collaborate on complex datasets with the governance and policy oversight to help safely support research.',
		employer: 'Verily',
		employerURL: 'https://verily.com/',
		title: 'Software Developer II',
		type: 'Employment',
		url: 'https://verily.com/solutions/platform/workbench',
		urls: [
			{
				text: 'Web App',
				tooltip: 'Visit the Verily Workbench web app',
				icon: VerilyIcon,
				url: 'https://workbench.verily.com/',
			},
		],
		color: '#047a6b',
		dates: {
			startDate: '2021-12',
			endDate: 'current',
		},
		showcase: true,
		youtubeURL: 'https://www.youtube.com/embed/x4uIs3s6P_I?mute=1&cc_load_policy=1&controls=1',
	},
	{
		name: 'FHIRPath Go',
		id: 'fhirpath',
		description:
			'Go implementation of the FHIRPath specification, implemented directly with the google/fhir proto definitions.',
		employer: 'Verily',
		employerURL: 'https://verily.com/',
		title: 'Software Developer II',
		type: 'Employment',
		url: 'https://github.com/verily-src/fhirpath-go',
		urls: [
			{
				text: 'GitHub',
				tooltip: 'Visit the open-source GitHub repository for FHIRPath Go',
				icon: GitHubIcon,
				url: 'https://github.com/verily-src/fhirpath-go',
			},
		],
		color: '#047a6b',
		dates: {
			startDate: '2021-12',
			endDate: 'current',
		},
		showcase: true,
		objectFit: 'contain',
		youtubeURL: 'https://www.youtube.com/embed/jCyQ-g-6pv0?mute=1&cc_load_policy=1&controls=1',
	},
	{
		name: 'Masterpiece X',
		id: 'mpx',
		description: 'Update, maintain and create new features for web and back-end systems',
		employer: 'Brinx Software Inc',
		employerURL: 'https://www.masterpiecex.com/',
		title: 'Full Stack Developer',
		type: 'Employment',
		url: 'https://app.masterpiecex.com/',
		urls: [
			{
				text: 'Web App',
				tooltip: 'Visit the Masterpiece X web app',
				icon: MPXIcon,
				url: 'https://app.masterpiecex.com/',
			},
			{
				text: 'Meta Quest VR',
				tooltip: 'Download the Meta Quest VR app for Masterpiece X',
				icon: MetaIcon,
				url: 'https://www.oculus.com/experiences/quest/5502306219889537',
			},
		],
		color: '#00EAB7',
		dates: {
			startDate: '2021-12',
			endDate: '2023-12',
		},
		showcase: true,
		youtubeURL: 'https://www.youtube.com/embed/O1TlGOmSQ4M?mute=1&cc_load_policy=1&controls=1',
	},
	{
		name: 'Impact Depth',
		id: 'impact-depth',
		description: 'Visualize citation flow for a publication of interest',
		title: 'Creator',
		type: 'Personal Project',
		url: 'https://impactdepth.com/',
		urls: [
			{
				text: 'Web App',
				tooltip: 'Visit the Impact Depth web app',
				icon: ImpactDepthIcon,
				url: 'https://impactdepth.com/',
			},
		],
		color: '#0000e3',
		dates: {
			startDate: '2021-05',
			endDate: '2021-08',
		},
		showcase: false,
	},
	{
		name: "ePlant's Plant eFP",
		id: 'eplant-plant-efp',
		description: 'Designed the updated widget version of the eFP tissue expression viewer for ePlant',
		employer: 'University of Toronto',
		employerURL: 'https://bar.utoronto.ca/',
		title: 'Software Engineer',
		publication: 'https://doi.org/10.1101/2021.04.28.441805',
		type: 'Employment',
		url: 'https://github.com/BioAnalyticResource/ePlant_Plant_eFP',
		urls: [
			{
				text: 'GitHub',
				tooltip: 'Visit the GitHub repository for the ePlant Plant eFP widget',
				icon: GitHubIcon,
				url: 'https://github.com/BioAnalyticResource/ePlant_Plant_eFP',
			},
			{
				text: 'Publication',
				tooltip: 'Read the official publication for the ePlant Plant eFP widget',
				icon: PublishIcon,
				url: 'https://doi.org/10.1093/nar/gkae920',
			},
			{
				text: 'Pre-print',
				tooltip: 'Read the pre-print publication for the ePlant Plant eFP widget',
				icon: PublishIcon,
				url: 'https://doi.org/10.1101/2021.04.28.441805',
			},
		],
		color: '#cddaa7',
		dates: {
			startDate: '2019-04',
			endDate: '2021-08',
		},
		showcase: true,
	},
	{
		name: 'GAIA',
		id: 'gaia',
		description: 'Generates a summary or answers a question regarding a gene',
		employer: 'University of Toronto',
		employerURL: 'https://bar.utoronto.ca/',
		title: 'Bioinformatician',
		type: 'School (MSc)',
		url: 'https://bar.utoronto.ca/gaia/',
		urls: [
			{
				text: 'Web App',
				tooltip: 'Visit the GAIA web app',
				icon: BarIcon,
				url: 'https://bar.utoronto.ca/gaia/',
			},
			{
				text: 'Publication',
				tooltip: 'Read the publication for GAIA',
				icon: PublishIcon,
				url: 'https://doi.org/10.1093/nar/gkae920',
			},
		],
		color: '#cddaa7',
		dates: {
			startDate: '2019-04',
			endDate: '2021-08',
		},
		showcase: false,
	},
	{
		name: 'SciGrade',
		id: 'scigrade',
		description: 'Teach CRISPR gRNA design',
		employer: 'University of Toronto',
		employerURL: 'https://www.hmb.utoronto.ca/',
		title: 'Full Stack Developer',
		type: 'School (Volunteer)',
		url: 'https://scigrade.com/',
		urls: [
			{
				text: 'Web App',
				tooltip: 'Visit the SciGrade web app',
				icon: SciGradeIcon,
				url: 'https://scigrade.com/',
			},
			{
				text: 'GitHub',
				tooltip: 'Visit the GitHub repository for SciGrade',
				icon: GitHubIcon,
				url: 'https://github.com/AlexJSully/SciGrade',
			},
		],
		color: '#ffffff',
		dates: {
			startDate: '2017-08',
			endDate: '2018-10',
		},
		showcase: false,
	},
	{
		name: 'eFP-Seq Browser',
		id: 'efp-seq-browser',
		description: 'An RNA-Seq based gene expression visualizer web-tool',
		employer: 'University of Toronto',
		employerURL: 'https://bar.utoronto.ca/',
		title: 'Data Visualization Programmer',
		publication: 'https://doi.org/10.1111/tpj.14468',
		type: 'Employment',
		url: 'https://bar.utoronto.ca/eFP-Seq_Browser/',
		urls: [
			{
				text: 'Web App',
				tooltip: 'Visit the eFP-Seq Browser web app',
				icon: BarIcon,
				url: 'https://bar.utoronto.ca/eFP-Seq_Browser/',
			},
			{
				text: 'GitHub',
				tooltip: 'Visit the GitHub repository for eFP-Seq Browser',
				icon: GitHubIcon,
				url: 'https://github.com/BioAnalyticResource/eFP-Seq_Browser',
			},
			{
				text: 'Publication',
				tooltip: 'Read the publication for eFP-Seq Browser',
				icon: PublishIcon,
				url: 'https://doi.org/10.1111/tpj.14468',
			},
		],
		color: '#cddaa7',
		dates: {
			startDate: '2016-09',
			endDate: '2021-06',
		},
		showcase: true,
	},
	{
		name: 'Gold Biosensing',
		id: 'biosensing',
		description: 'Developed a synthetic gene using GolS/GolB to detect aqueous gold',
		employer: 'University of Toronto',
		employerURL: 'https://igem.skule.ca/',
		title: 'Laboratory Research Lead',
		type: 'School (Club)',
		url: 'http://2016.igem.org/Team:Toronto',
		urls: [
			{
				text: 'Website',
				tooltip: 'View the iGEM Toronto 2016 gold biosensing website for lab results and more',
				icon: UofTIcon,
				url: 'http://2016.igem.org/Team:Toronto',
			},
		],
		color: '#002554',
		dates: {
			startDate: '2015-10',
			endDate: '2016-11',
		},
		showcase: false,
	},
	{
		name: 'Small Dev Talk',
		id: 'smalldevtalk',
		description: 'News, interviews and showcases of the latest in the indie scene',
		title: 'Co-creator & Journalist',
		type: 'Personal Project',
		url: 'https://smalldevtalk.net/',
		urls: [
			{
				text: 'Web app',
				tooltip: 'Visit the Small Dev Talk web app',
				icon: SmallDevTalkIcon,
				url: 'https://smalldevtalk.net/',
			},
			{
				text: 'GitHub',
				tooltip: 'Visit the GitHub repository for Small Dev Talk',
				icon: GitHubIcon,
				url: 'https://github.com/AlexJSully/Small-Dev-Talk',
			},
		],
		color: '#ffffff',
		dates: {
			startDate: '2013-03',
			endDate: '2016-04',
		},
		showcase: false,
	},
];

export default projects;
