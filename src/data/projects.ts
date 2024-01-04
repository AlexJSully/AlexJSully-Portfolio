const projects = [
	{
		name: 'Masterpiece X',
		id: 'mpx',
		description: 'Update, maintain and create new features for web and back-end systems',
		employer: 'Brinx Software Inc',
		'most-recent-title': 'Full Stack Developer',
		type: 'Employment',
		url: 'https://app.masterpiecex.com/',
		urls: [
			{
				text: 'Web App',
				icon: '/images/icons/mpx.svg',
				url: 'https://app.masterpiecex.com/',
			},
			{
				text: 'Meta Quest VR',
				icon: '/images/icons/meta.svg',
				url: 'https://www.oculus.com/experiences/quest/5502306219889537',
			},
		],
		color: '#18181C',
		dates: {
			startDate: '2021-12',
			endDate: '2023-12',
		},
		showcase: true,
	},
	{
		name: 'Impact Depth',
		id: 'impact-depth',
		description: 'Visualize citation flow for a publication of interest',
		employer: 'Personal Project',
		'most-recent-title': 'Creator',
		type: 'Personal Project',
		url: 'https://impactdepth.com/',
		urls: [
			{
				text: 'Web App',
				icon: '/images/icons/impactdepth.svg',
				url: 'https://impactdepth.com/',
			},
		],
		color: '#0000e3',
		dates: {
			startDate: '2021-05',
			endDate: '2021-08',
		},
		showcase: true,
	},
	{
		name: "ePlant's Plant eFP",
		id: 'eplant-plant-efp',
		description: 'Designed the updated widget version of the eFP tissue expression viewer for ePlant',
		employer: 'University of Toronto - BAR/Provart Lab',
		'most-recent-title': 'Data Visualization Programmer',
		publication: 'https://doi.org/10.1101/2021.04.28.441805',
		type: 'Employment',
		url: 'https://github.com/BioAnalyticResource/ePlant_Plant_eFP',
		urls: [
			{
				text: 'GitHub',
				icon: '/images/icons/github.svg',
				url: 'https://github.com/BioAnalyticResource/ePlant_Plant_eFP',
			},
			{
				text: 'Publication',
				icon: '/images/icons/publish.svg',
				url: 'https://doi.org/10.1101/2021.04.28.441805',
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
		name: 'GAIA',
		id: 'gaia',
		description: 'Generates a summary or answers a question regarding a gene',
		employer: 'University of Toronto - BAR/Provart Lab',
		'most-recent-title': 'Project Lead',
		type: 'School (MSc)',
		url: 'https://bar.utoronto.ca/gaia/',
		urls: [
			{
				text: 'Web App',
				icon: '/images/icons/bar.svg',
				url: 'https://bar.utoronto.ca/gaia/',
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
		name: 'SciGrade',
		id: 'scigrade',
		description: 'Teach CRISPR gRNA design',
		employer: 'University of Toronto - Human Biology Department',
		'most-recent-title': 'Full-Stack Developer',
		type: 'School (Volunteer)',
		url: 'https://scigrade.com/',
		urls: [
			{
				text: 'Web App',
				icon: '/images/icons/scigrade.svg',
				url: 'https://scigrade.com/',
			},
			{
				text: 'GitHub',
				icon: '/images/icons/github.svg',
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
		employer: 'University of Toronto - BAR/Provart Lab',
		'most-recent-title': 'Data Visualization Programmer',
		publication: 'https://doi.org/10.1111/tpj.14468',
		type: 'Employment',
		url: 'https://bar.utoronto.ca/eFP-Seq_Browser/',
		urls: [
			{
				text: 'Web App',
				icon: '/images/icons/bar.svg',
				url: 'https://bar.utoronto.ca/eFP-Seq_Browser/',
			},
			{
				text: 'GitHub',
				icon: '/images/icons/github.svg',
				url: 'https://github.com/BioAnalyticResource/eFP-Seq_Browser',
			},
			{
				text: 'Publication',
				icon: '/images/icons/publish.svg',
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
		employer: 'University of Toronto - iGEM Toronto',
		'most-recent-title': 'Laboratory Research Lead',
		type: 'School (Club)',
		url: 'http://2016.igem.org/Team:Toronto',
		urls: [
			{
				text: 'Website',
				icon: '/images/icons/uoft.svg',
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
		employer: 'Small Dev Talk',
		'most-recent-title': 'Co-creator & Journalist',
		type: 'Personal Project',
		url: 'https://smalldevtalk.net/',
		urls: [
			{
				text: 'Web app',
				icon: '/images/icons/smalldevtalk.svg',
				url: 'https://smalldevtalk.net/',
			},
		],
		thumbnailFileType: 'svg',
		color: '#ffffff',
		dates: {
			startDate: '2013-03',
			endDate: '2016-04',
		},
		showcase: false,
	},
];

export default projects;
