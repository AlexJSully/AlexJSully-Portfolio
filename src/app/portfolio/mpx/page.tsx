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
					width: '100%',
					minHeight: '60vh',
					height: '100%',
					background: 'linear-gradient(14deg, rgba(19,21,24,1) 18%, rgba(24,36,54,1) 100%)',
					filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#131518",endColorstr="#182436",GradientType=1)',
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
						width: '100%',
						minWidth: '50vw',
					}}
				>
					<Typography
						sx={{
							letterSpacing: '.15rem',
							fontSize: '2.5rem',
							width: '100%',
							overflow: 'hidden',
							margin: 'auto 2rem',
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
							style={{
								textDecoration: 'none',
								color: 'inherit',
							}}
						>
							<Button
								sx={{
									background: 'linear-gradient(126deg, #0EEBBB 0%, #F90 100%)',
									color: '#000',
									transition: 'all .2s ease-in-out',
									fontWeight: 600,
									display: 'flex',
									alignItems: 'center',
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
										marginRight: '1rem',
										filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
									}}
									width={24}
								/>{' '}
								Web App
							</Button>
						</Link>

						<Link
							href='https://www.meta.com/experiences/5502306219889537/'
							style={{
								textDecoration: 'none',
								color: 'inherit',
							}}
						>
							<Button
								sx={{
									background: '#00EAB7',
									color: '#000',
									transition: 'all .2s ease-in-out',
									fontWeight: 600,
									display: 'flex',
									alignItems: 'center',
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
										marginRight: '1rem',
										filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
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
