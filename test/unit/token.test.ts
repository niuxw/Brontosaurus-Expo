/**
 * @author WMXPY
 * @namespace brontosaurus
 * @description Token
 * @package Unit Test
 */

import { expect } from 'chai';
import * as Chance from 'chance';

describe('Given a {Token} class', (): void => {

    const chance: Chance.Chance = new Chance("brontosaurus-expo-token");

    it('Placeholder', (): void => {

        expect(chance.string().length).to.be.greaterThan(5);
    });
});
