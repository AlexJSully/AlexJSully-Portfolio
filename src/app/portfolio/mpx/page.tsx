'use client';

import ModelViewer from '@components/portfolio/mpx/ModelViewer';
import { Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function MPX() {
	return (
		<Stack
			direction='column'
			sx={{
				minHeight: '100vh',
				width: '100%',
			}}
		>
			{/* Landing */}
			<Stack
				alignItems='center'
				direction={{
					xs: 'column',
					sm: 'row',
				}}
				justifyContent='center'
				sx={{
					background: 'linear-gradient(14deg, rgba(19,21,24,1) 18%, rgba(24,36,54,1) 100%)',
					filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#131518",endColorstr="#182436",GradientType=1)',
					height: '100%',
					minHeight: '60vh',
					width: '100%',
				}}
			>
				{/* Text */}
				<Stack
					alignItems='center'
					direction='column'
					justifyContent='center'
					spacing={2}
					sx={{
						margin: 'auto',
						minWidth: '50vw',
						width: '100%',
					}}
				>
					<Typography
						sx={{
							fontSize: '2.5rem',
							letterSpacing: '.15rem',
							margin: 'auto 2rem',
							overflow: 'hidden',
							width: '100%',
							maxWidth: {
								xs: '100%',
								sm: '80%',
							},
						}}
					>
						Text-to-3D Generative AI for Models & Animations
					</Typography>

					<Stack
						direction='row'
						spacing={2}
						sx={{
							'MuiButton-root': {
								borderRadius: 28,
							},
						}}
					>
						<Link
							href='https://app.masterpiecex.com/'
							rel='noopener noreferrer'
							style={{
								color: 'inherit',
								textDecoration: 'none',
							}}
							target='_blank'
						>
							<Button
								sx={{
									alignItems: 'center',
									background: 'linear-gradient(126deg, #0EEBBB 0%, #F90 100%)',
									color: '#000',
									display: 'flex',
									fontWeight: 600,
									transition: 'all .2s ease-in-out',
									':hover': {
										background: 'linear-gradient(180deg, #99FFE9 0%, #99FFE9 100%)',
									},
								}}
								variant='contained'
							>
								<Image
									alt='Logo'
									height={24}
									src='/images/icons/mpx.svg'
									style={{
										filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
										marginRight: '1rem',
									}}
									width={24}
								/>{' '}
								Web App
							</Button>
						</Link>

						<Link
							href='https://www.meta.com/experiences/5502306219889537/'
							rel='noopener noreferrer'
							style={{
								color: 'inherit',
								textDecoration: 'none',
							}}
							target='_blank'
						>
							<Button
								sx={{
									alignItems: 'center',
									background: '#00EAB7',
									color: '#000',
									display: 'flex',
									fontWeight: 600,
									transition: 'all .2s ease-in-out',
									':hover': {
										background: '#99FFE9',
									},
								}}
								variant='contained'
							>
								<Image
									alt='Logo'
									height={24}
									src='/images/icons/meta.svg'
									style={{
										filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
										marginRight: '1rem',
									}}
									width={24}
								/>{' '}
								Meta Quest App
							</Button>
						</Link>
					</Stack>
				</Stack>

				{/* ThreeJS viewer */}
				<ModelViewer />
			</Stack>
		</Stack>
	);
}
