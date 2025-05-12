import { logAnalyticsEvent } from '@configs/firebase';
import { aaaahhhh } from '@helper/aaaahhhh';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function Avatar() {
	/** The number of times the profile pic has been hovered */
	const hoverProfilePic = useRef(0);
	/** The total number of sneezes */
	const totalSneeze = useRef(0);
	/** Whether or not the profile pic is sneezing */
	const sneezing = useRef(false);

    /** The sneeze images to be rendered */
    const imageList = {
        default: '/images/drawn/profile_pic_drawn.webp',
        sneeze_1: '/images/drawn/profile_pic_drawn_2.webp',
        sneeze_2: '/images/drawn/profile_pic_drawn_3.webp',
        sneeze_3: '/images/drawn/profile_pic_drawn_4.webp',
    };

    /** The image to be rendered */
    const [image, setImage] = useState(imageList['default']);

	/** Handle the sneeze animation */
	const handleTriggerSneeze = () => {
		hoverProfilePic.current += 1;

		if (hoverProfilePic.current % 5 === 0 && !sneezing.current) {
			totalSneeze.current += 1;

			if (totalSneeze.current >= 6) {
				logAnalyticsEvent('trigger_aaaahhhh', {
					name: 'trigger_aaaahhhh',
					type: 'hover',
				});

				aaaahhhh();
			} else {
				// Prevent multiple sneezes at once
				sneezing.current = true;

				setImage(imageList[`sneeze_1`]);

				setTimeout(() => {
					setImage(imageList[`sneeze_2`]);

					setTimeout(() => {
						setImage(imageList[`sneeze_3`]);

						setTimeout(() => {
							setImage(imageList[`default`]);

							sneezing.current = false;
						}, 1000);
					}, 300);
				}, 500);

				logAnalyticsEvent('trigger_sneeze', {
					name: 'trigger_sneeze',
					type: 'hover',
				});
			}
		}
	};

	/** Debounce the sneeze animation */
	const debounceSneeze = debounce(handleTriggerSneeze, 100);

    return (

			<Image
				alt='Alexander Sullivan head drawn and stylized'
				aria-label='Profile Picture for Alexander Sullivan'
				data-testid='profile_pic'
				height={500}
				onClick={debounceSneeze}
				onMouseEnter={debounceSneeze}
				priority
				src={image}
				style={{
					borderRadius: '50%',
					marginTop: '2rem',
					maxHeight: 'min(40vw, 40vh, 300px)',
					maxWidth: 'min(40vw, 40vh, 300px)',
					position: 'relative',
					zIndex: 1,
				}}
				width={500}
			/>
    )
}