import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import BAR from './icons/bar.svg';
import BlueSky from './icons/bluesky.svg';
import GitHub from './icons/github.svg';
import ImpactDepth from './icons/impactdepth.svg';
import Instagram from './icons/instagram.svg';
import LinkedIn from './icons/linkedin.svg';
import Meta from './icons/meta.svg';
import MPX from './icons/mpx.svg';
import Publish from './icons/publish.svg';
import SciGrade from './icons/scigrade.svg';
import SmallDevTalk from './icons/smalldevtalk.svg';
import threads from './icons/threads.svg';
import Twitch from './icons/twitch.svg';
import UofT from './icons/uoft.svg';
import Verily from './icons/verily.svg';
import X from './icons/x.svg';

/**
 * Generates a JSX element for the given SVG icon.
 * @returns The JSX element representing the SVG icon.
 */
function generateIconJSX(
	/** The SVG icon to generate JSX for. */
	icon: any,
	/** The properties to apply to the SVG icon. */
	props: any,
) {
	return <SvgIcon component={icon} inheritViewBox {...props} />;
}

export const BarIcon = (props: SvgIconProps) => generateIconJSX(BAR, props);
export const BlueSkyIcon = (props: SvgIconProps) => generateIconJSX(BlueSky, props);
export const GitHubIcon = (props: SvgIconProps) => generateIconJSX(GitHub, props);
export const ImpactDepthIcon = (props: SvgIconProps) => generateIconJSX(ImpactDepth, props);
export const InstagramIcon = (props: SvgIconProps) => generateIconJSX(Instagram, props);
export const LinkedInIcon = (props: SvgIconProps) => generateIconJSX(LinkedIn, props);
export const MPXIcon = (props: SvgIconProps) => generateIconJSX(MPX, props);
export const MetaIcon = (props: SvgIconProps) => generateIconJSX(Meta, props);
export const PublishIcon = (props: SvgIconProps) => generateIconJSX(Publish, props);
export const SciGradeIcon = (props: SvgIconProps) => generateIconJSX(SciGrade, props);
export const SmallDevTalkIcon = (props: SvgIconProps) => generateIconJSX(SmallDevTalk, props);
export const ThreadsIcon = (props: SvgIconProps) => generateIconJSX(threads, props);
export const TwitchIcon = (props: SvgIconProps) => generateIconJSX(Twitch, props);
export const UofTIcon = (props: SvgIconProps) => generateIconJSX(UofT, props);
export const VerilyIcon = (props: SvgIconProps) => generateIconJSX(Verily, props);
export const XIcon = (props: SvgIconProps) => generateIconJSX(X, props);
