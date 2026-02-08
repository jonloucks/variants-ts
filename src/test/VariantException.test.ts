import { throws } from "node:assert";

import { VariantException } from "@jonloucks/variants-ts/api/VariantException";

describe('VariantException Tests', () => {
  it('without message throws IllegalArgumentException', () => {
    throws(() => {
      new VariantException(null as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Message must be present.'
    });
  });

  it('with message, has correct name and message', () => {
    throws(() => {
      throw new VariantException("Problem.");
    }, {
      name: 'VariantException',
      message: "Problem."
    });
  });

  it('rethrow with Error caught with message, has correct name and message', () => {
    throws(() => {
      VariantException.rethrow(new Error("Inner problem."), "Outer Problem.");
    }, {
      name: 'VariantException',
      message: "Outer Problem."
    });
  });

  it('rethrow with Error caught without message, has correct name and message', () => {
    throws(() => {
      VariantException.rethrow(new Error("Inner problem."));
    }, {
      name: 'VariantException',
      message: "Inner problem."
    });
  });

  it('rethrow with null caught without message, has correct name and message', () => {
    throws(() => {
      VariantException.rethrow(null);
    }, {
      name: 'VariantException',
      message: "Unknown type of caught value."
    });
  });

    it('rethrow with number caught without message, has correct name and message', () => {
    throws(() => {
      VariantException.rethrow(13);
    }, {
      name: 'VariantException',
      message: "Unknown type of caught value."
    });
  });

  it('rethrow with null caught with message, has correct name and message', () => {
    throws(() => {
      VariantException.rethrow(null, "Outer Problem.");
    }, {
      name: 'VariantException',
      message: "Outer Problem."
    });
  });


  it('rethrow with VariantException caught with message, has correct name and message', () => {
    throws(() => {
      VariantException.rethrow(new VariantException("Inner Problem."), "Outer Problem.");
    }, {
      name: 'VariantException',
      message: "Inner Problem."
    });
  });
});
