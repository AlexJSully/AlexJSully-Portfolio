import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Avatar from '@components/banner/Avatar';

/** The banner at the top of the page */
export default function Banner() {
	/** Material-UI theme */
	const theme = useTheme();
	/** Whether or not the screen is small */
	const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Box
			component='div'
			sx={{
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				minHeight: '60vh',
				justifyContent: 'center',
				margin: '3rem auto',
				position: 'relative',
				width: 'fit-content',
			}}
		>
			<Avatar />

			<Typography
				aria-label='Name'
				component='h1'
				sx={{
					fontSize: 'clamp(1.5rem, 2.5rem, 2.5rem)',
					fontWeight: 'bold',
					marginTop: '1rem',
					textAlign: 'center',
					textTransform: 'uppercase',
					zIndex: 1,
				}}
			>
				{`Alexander${!smallScreen ? ' Joo-Hyun ' : ' '}Sullivan`.split('').map((char, index) => (
					<Box
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						component='span'
						sx={{
							cursor: 'default',
							textShadow: '1px 2px 3px #666',
							transition: 'all 1s ease',
							'&:hover': {
								color: 'rgb(43, 255, 0)',
								transition: 'all 0.5s ease',
							},
						}}
					>
						{char}
					</Box>
				))}
			</Typography>

			<Typography
				sx={{
					fontSize: 'clamp(1.5rem, 2rem, 3rem)',
					marginTop: '1.5rem',
					textAlign: 'center',
					textShadow: '1px 2px 3px #000',
				}}
			>
				Software Developer & Bioinformatician
			</Typography>
		</Box>
	);
}
