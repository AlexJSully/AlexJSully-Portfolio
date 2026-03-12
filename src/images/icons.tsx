import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { ComponentType, ReactElement } from 'react';
import BAR from './icons/bar.svg';
import BlueSky from './icons/bluesky.svg';
import GitHub from './icons/github.svg';
import GolangGopher from './icons/golanggopher.svg';
import GooglePlayStore from './icons/googleplay.svg';
import ImpactDepth from './icons/impactdepth.svg';
import Instagram from './icons/instagram.svg';
import iOS from './icons/ios.svg';
import LinkedIn from './icons/linkedin.svg';
import Meta from './icons/meta.svg';
import MPX from './icons/mpx.svg';
import OpenVSX from './icons/openvsx.svg';
import Publish from './icons/publish.svg';
import SciGrade from './icons/scigrade.svg';
import SmallDevTalk from './icons/smalldevtalk.svg';
import threads from './icons/threads.svg';
import Twitch from './icons/twitch.svg';
import UofT from './icons/uoft.svg';
import Verily from './icons/verily.svg';
import VSCode from './icons/vscode.svg';
import X from './icons/x.svg';

/**
 * Wraps an SVG icon component with Material-UI SvgIcon for consistent styling and sizing.
 * @param icon The SVG component to wrap
 * @param props MUI SvgIcon props (color, fontSize, etc.)
 * @returns JSX element rendering the wrapped SVG icon
 */
function generateIconJSX(icon: ComponentType, props: SvgIconProps): ReactElement {
	return <SvgIcon component={icon} inheritViewBox {...props} />;
}

export const BarIcon = (props: SvgIconProps): ReactElement => generateIconJSX(BAR as ComponentType, props);
export const BlueSkyIcon = (props: SvgIconProps): ReactElement => generateIconJSX(BlueSky as ComponentType, props);
export const GitHubIcon = (props: SvgIconProps): ReactElement => generateIconJSX(GitHub as ComponentType, props);
export const GolangGopherIcon = (props: SvgIconProps): ReactElement =>
	generateIconJSX(GolangGopher as ComponentType, props);
export const GooglePlayStoreIcon = (props: SvgIconProps): ReactElement =>
	generateIconJSX(GooglePlayStore as ComponentType, props);
export const ImpactDepthIcon = (props: SvgIconProps): ReactElement =>
	generateIconJSX(ImpactDepth as ComponentType, props);
export const InstagramIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Instagram as ComponentType, props);
export const iOSIcon = (props: SvgIconProps): ReactElement => generateIconJSX(iOS as ComponentType, props);
export const LinkedInIcon = (props: SvgIconProps): ReactElement => generateIconJSX(LinkedIn as ComponentType, props);
export const MetaIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Meta as ComponentType, props);
export const MPXIcon = (props: SvgIconProps): ReactElement => generateIconJSX(MPX as ComponentType, props);
export const OpenVSXIcon = (props: SvgIconProps): ReactElement => generateIconJSX(OpenVSX as ComponentType, props);
export const PublishIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Publish as ComponentType, props);
export const SciGradeIcon = (props: SvgIconProps): ReactElement => generateIconJSX(SciGrade as ComponentType, props);
export const SmallDevTalkIcon = (props: SvgIconProps): ReactElement =>
	generateIconJSX(SmallDevTalk as ComponentType, props);
export const ThreadsIcon = (props: SvgIconProps): ReactElement => generateIconJSX(threads as ComponentType, props);
export const TwitchIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Twitch as ComponentType, props);
export const UofTIcon = (props: SvgIconProps): ReactElement => generateIconJSX(UofT as ComponentType, props);
export const VerilyIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Verily as ComponentType, props);
export const VSCodeIcon = (props: SvgIconProps): ReactElement => generateIconJSX(VSCode as ComponentType, props);
export const XIcon = (props: SvgIconProps): ReactElement => generateIconJSX(X as ComponentType, props);
