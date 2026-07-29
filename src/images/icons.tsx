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
 * Wraps an SVG component in Material-UI's `SvgIcon` so it inherits theme colour and sizing.
 *
 * Every icon below is a one-line application of this, and each accepts the full
 * {@link SvgIconProps} set, including `color`, `fontSize`, and `sx`.
 * @param icon The SVG component to wrap
 * @param props MUI SvgIcon props (color, fontSize, etc.)
 * @returns JSX element rendering the wrapped SVG icon
 * @see https://mui.com/material-ui/api/svg-icon/
 */
function generateIconJSX(icon: ComponentType, props: SvgIconProps): ReactElement {
	return <SvgIcon component={icon} inheritViewBox {...props} />;
}

/** Renders the Bio-Analytic Resource (BAR) logo. */
export const BarIcon = (props: SvgIconProps): ReactElement => generateIconJSX(BAR as ComponentType, props);
/** Renders the Bluesky logo. */
export const BlueSkyIcon = (props: SvgIconProps): ReactElement => generateIconJSX(BlueSky as ComponentType, props);
/** Renders the GitHub logo. */
export const GitHubIcon = (props: SvgIconProps): ReactElement => generateIconJSX(GitHub as ComponentType, props);
/** Renders the Go gopher mascot. */
export const GolangGopherIcon = (props: SvgIconProps): ReactElement =>
	generateIconJSX(GolangGopher as ComponentType, props);
/** Renders the Google Play Store logo. */
export const GooglePlayStoreIcon = (props: SvgIconProps): ReactElement =>
	generateIconJSX(GooglePlayStore as ComponentType, props);
/** Renders the Impact Depth project logo. */
export const ImpactDepthIcon = (props: SvgIconProps): ReactElement =>
	generateIconJSX(ImpactDepth as ComponentType, props);
/** Renders the Instagram logo. */
export const InstagramIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Instagram as ComponentType, props);
/** Renders the iOS logo. */
export const iOSIcon = (props: SvgIconProps): ReactElement => generateIconJSX(iOS as ComponentType, props);
/** Renders the LinkedIn logo. */
export const LinkedInIcon = (props: SvgIconProps): ReactElement => generateIconJSX(LinkedIn as ComponentType, props);
/** Renders the Meta logo. */
export const MetaIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Meta as ComponentType, props);
/** Renders the MPX project logo. */
export const MPXIcon = (props: SvgIconProps): ReactElement => generateIconJSX(MPX as ComponentType, props);
/** Renders the Open VSX Registry logo. */
export const OpenVSXIcon = (props: SvgIconProps): ReactElement => generateIconJSX(OpenVSX as ComponentType, props);
/** Renders a publication icon, used for published papers. */
export const PublishIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Publish as ComponentType, props);
/** Renders the SciGrade project logo. */
export const SciGradeIcon = (props: SvgIconProps): ReactElement => generateIconJSX(SciGrade as ComponentType, props);
/** Renders the Small Dev Talk project logo. */
export const SmallDevTalkIcon = (props: SvgIconProps): ReactElement =>
	generateIconJSX(SmallDevTalk as ComponentType, props);
/** Renders the Threads logo. */
export const ThreadsIcon = (props: SvgIconProps): ReactElement => generateIconJSX(threads as ComponentType, props);
/** Renders the Twitch logo. */
export const TwitchIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Twitch as ComponentType, props);
/** Renders the University of Toronto logo. */
export const UofTIcon = (props: SvgIconProps): ReactElement => generateIconJSX(UofT as ComponentType, props);
/** Renders the Verily logo. */
export const VerilyIcon = (props: SvgIconProps): ReactElement => generateIconJSX(Verily as ComponentType, props);
/** Renders the Visual Studio Code logo. */
export const VSCodeIcon = (props: SvgIconProps): ReactElement => generateIconJSX(VSCode as ComponentType, props);
/** Renders the X (formerly Twitter) logo. */
export const XIcon = (props: SvgIconProps): ReactElement => generateIconJSX(X as ComponentType, props);
