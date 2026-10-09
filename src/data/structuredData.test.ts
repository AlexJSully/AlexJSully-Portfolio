import profile from '@data/profile';
import socials from '@data/socials';
import structuredData from './structuredData';

/**
 * Finds the single node of a schema.org type.
 * @param type Schema.org `@type`
 * @returns The node with that type
 */
function nodeOfType(type: string): Record<string, unknown> {
	const nodes = structuredData.filter((node) => node['@type'] === type);
	expect(nodes).toHaveLength(1);
	return nodes[0] as Record<string, unknown>;
}

describe('structuredData', () => {
	it('serialises to JSON for the layout script tag without losing a value', () => {
		expect(JSON.parse(JSON.stringify(structuredData))).toStrictEqual(structuredData);
	});

	it('describes the Person with a description, email, and contact point', () => {
		const person = nodeOfType('Person');

		expect(person.description).toBe(profile.description);
		expect(person.email).toBe(profile.email);
		expect(person.contactPoint).toMatchObject({ '@type': 'ContactPoint', email: profile.email });
	});

	it('gives the Organization a contact point with an email and contact type', () => {
		expect(nodeOfType('Organization').contactPoint).toEqual(
			expect.objectContaining({
				'@type': 'ContactPoint',
				contactType: expect.any(String),
				email: profile.email,
			}),
		);
	});

	it.each(['Person', 'Organization'])('gives the %s a country-only postal address from the profile', (type) => {
		expect(nodeOfType(type).address).toEqual({
			'@type': 'PostalAddress',
			addressCountry: profile.addressCountry,
		});
	});

	it('lists every social account and external profile as sameAs, from the same data the footer reads', () => {
		const sameAs = nodeOfType('Person').sameAs;

		expect(sameAs).toEqual(expect.arrayContaining(socials.map((social) => social.url)));
		expect(sameAs).toEqual(expect.arrayContaining(Object.values(profile.externalProfiles)));
	});

	it('links the Organization to the Person as its founder', () => {
		expect(nodeOfType('Organization').founder).toEqual({ '@id': nodeOfType('Person')['@id'] });
	});
});
