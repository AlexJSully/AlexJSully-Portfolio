# Accessibility in UI code

Rules for `.tsx` and `.jsx` components, and for any TypeScript or JavaScript that builds or changes the page, that a reviewer can decide by reading the code. Each rule cites the [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) page it comes from, or the Web Content Accessibility Guidelines (WCAG) success criterion where MDN only lists the criterion, and quotes it.

Read it on every review that touches UI code. A finding names the element, the rule, and the replacement, the same as any other finding in this skill. A rule whose answer depends on rendered output, such as a contrast ratio computed from a theme, is a finding only where the value sits in the code under review; otherwise it belongs to a rendered check such as an automated scan, which [test-standards.md](test-standards.md#accessibility-assertions) covers.

## Contents

- Semantics and roles
- Keyboard and focus
- Dialogs and route changes
- Announcing changes
- Forms and accessible names
- Images, links, and tables
- Colour, contrast, motion, and target size

## Semantics and roles

- **A native element comes before an ARIA role.** "The first rule of ARIA use is 'If you can use a native HTML element or attribute with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so.'" ([ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA#before_using_aria)).
- **An element with a click handler is a `<button>`, or an `<a href>` when it navigates.** A `<div>` or `<span>` with `onClick` is reachable by mouse only. Where a native element is impossible, it needs `role="button"`, `tabIndex={0}`, and a key handler for Enter and Space: "If using role="button" instead of the semantic `<button>` or `<input type="button">` elements, you will need to make the element focusable and define event handlers for click and keydown events" ([button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/button_role#description)).
- **A custom widget exposes its name, role, and state**, and updates the state attribute (`aria-expanded`, `aria-pressed`, `aria-checked`, `aria-selected`) in the same code path that changes the visual state. WCAG 4.1.2: "The name and role of user interface components (e.g., form inputs, buttons, links, etc.) should be programmatically determinable" ([Understanding WCAG: Robust](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Robust)).
- **Heading levels descend without skipping.** "Do not skip heading levels: always start from `<h1>`, followed by `<h2>` and so on", and "Prefer using only one `<h1>` per page". A heading chosen for its font size rather than its level is the usual cause ([heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements#usage_notes)). WCAG 2.4.6 adds that headings and labels "clearly describe the purpose of the content" ([Understanding WCAG: Operable](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Operable)).
- **The document root carries `lang`.** "WCAG Success Criterion 3.1.1 requires that a page language is specified in a way which may be 'programmatically determined' (i.e., via the lang attribute)." A passage in another language carries its own ([lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang#accessibility_concerns)).

## Keyboard and focus

- **No positive `tabIndex`.** "You are recommended to only use 0 and -1 as tabindex values. Avoid using tabindex values greater than 0" ([tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex#accessibility_concerns)).
- **Never remove the focus outline without a replacement.** "Assigning outline a value of 0 or none will remove the browser's default focus style. If an element can be interacted with it must have a visible focus indicator." A style setting `outline: none` or `outline: 0` is a finding unless the same element gets a `:focus-visible` style ([outline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline#accessibility), [:focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible#accessibility)).
- **Focus moves with `element.focus()`**, which "sets focus on the specified element, if it can be focused" ([HTMLElement.focus()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)). A target that is not interactive, such as a heading, needs `tabIndex={-1}` first; `tabIndex={0}` would add it to the tab order, where "that's not appropriate in this case" ([React accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/React_accessibility#prepare_the_heading)).
- **Removing the focused element moves focus somewhere deliberate.** When an action deletes the element that held focus, focus goes to a nearby element such as the list's heading, because otherwise "the focus vanishes" ([React accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/React_accessibility#focusing_when_the_user_deletes_a_task)).
- **Focus and input never change the context on their own.** WCAG 3.2.1: "When a control or other page feature receives focus, it should not change the context in a way that may confuse or disorientate the user." WCAG 3.2.2: "When data is inputted into a control, or a setting is changed, context should not be changed unexpectedly." A `focus` or `change` handler that navigates, submits, or opens a new view is the finding ([Understanding WCAG: Understandable](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Understandable)).

## Dialogs and route changes

- **A modal is a `<dialog>` opened with `showModal()`.** "It is recommended to use the .show() or .showModal() method to render dialogs, rather than the open attribute." `showModal()` makes the rest of the page inert and closes on Esc, both of which a hand-built modal has to reimplement ([dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#accessibility)).
- **Initial focus is set deliberately.** "The autofocus attribute should be added to the element the user is expected to interact with immediately upon opening a modal dialog" ([dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#additional_notes)).
- **Closing returns focus to the trigger.** "After the dialog is dismissed, keyboard focus should be moved back to where it was before it moved into the dialog. Otherwise the focus can be dropped to the beginning of the page." Code that closes a custom dialog without calling `focus()` on the stored trigger is the finding ([dialog role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/dialog_role#focus_management)).
- **A client-side route change moves focus and updates `document.title`.** Replacing the view without a page load leaves focus on an element that no longer exists, so move it to the new view's main heading, given `tabIndex={-1}`, as for a deleted element above. Each view sets its own title, since "Titles should be unique to every page of a website"; MDN notes that "dynamically updating a page's title will not be automatically announced by screen readers", which is why focus moves too ([title](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/title#accessibility)).

## Announcing changes

All from [ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions).

- **A live region exists before its text changes.** "Establish the live region before updating its content. Start with an empty live region", and "The most reliable way to ensure that live regions are registered is to include them in the initial markup." A component that mounts the region and its message in the same render is the finding.
- **Polite by default.** "Normally, only aria-live="polite" is used", or `role="status"`. `aria-live="assertive"` or `role="alert"` is for errors and other time-sensitive messages only: "aria-live="assertive" should only be used for time-sensitive/critical notifications that absolutely require the user's immediate attention."

## Forms and accessible names

- **Every form control has a programmatically associated label**: a `<label htmlFor>` naming the control's `id`, a `<label>` wrapping it, or `aria-labelledby`. "The label text is not only visually associated with its corresponding text input; it is programmatically associated with it too" ([label](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label#associating_a_label_with_a_form_control)). A placeholder is not one: "It is not a label, and should not be used as a substitute, because it isn't" ([input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#placeholders_are_not_accessible)).
- **The accessible name contains the visible label.** WCAG 2.5.3: "For each user interface component that includes a visible text label, make sure the accessible name matches (or includes) the visible text in the label." An `aria-label` that replaces the visible text with different words is the finding, because a speech-input user says what they see ([Understanding WCAG: Operable](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Operable)).
- An icon-only button still needs an accessible name, from `aria-label` or visually hidden text, under the WCAG 4.1.2 rule in **Semantics and roles**.

## Images, links, and tables

- **Every `<img>` has `alt`.** A decorative image takes `alt=""`, which "indicates that this image is not a key part of the content (it's decoration or a tracking pixel), and that non-visual browsers may omit it from rendering"; an informative one describes what it conveys ([img](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#alt)).
- **Link text makes sense out of context.** "The content inside a link should indicate where the link goes, even out of context." "Click here", "here", and "read more" are the findings ([a](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#strong_link_text)).
- **A data table marks its headers with `<th scope>`**, `scope="col"` or `scope="row"`: "certain assistive technologies may fail to infer correctly, so specifying header scope may improve user experiences" ([th](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th#usage_notes)). A table used only for layout, or a grid of `<div>` elements presented as a table, is the finding.

## Colour, contrast, motion, and target size

- **Colour is never the only signal.** WCAG 1.4.1 requires that "color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element." An error state shown only by a red border, or a status shown only by a coloured dot, needs text or an icon beside it ([use of color](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Use_of_color)).
- **Contrast, where both colours are literal in the code.** "Text and its background should have a contrast ratio of at least 4.5:1", and larger text "at least 3:1" ([color contrast](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast)). Flag a pair only where both values are in the diff; a value resolved from a theme is the rendered check's.
- **Animation driven from script checks the reduced-motion preference.** The media feature "is used to detect if a user has enabled a setting on their device to minimize the amount of non-essential motion" ([prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)). A CSS rule can read it with `@media`, but an animation started from JavaScript reaches it only through `window.matchMedia('(prefers-reduced-motion: reduce)').matches` ([matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)); one started without that check is the finding.
- **Pointer targets are at least 24 by 24 CSS pixels.** WCAG 2.5.8: "Target size for pointer inputs should be at least 24px wide by 24px tall", with exceptions for spacing and inline text ([Understanding WCAG: Operable](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Operable)). Flag a size set in the code below that.
