// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  /**
   * @type [{
  *   quantity: number
  *   percentage: number
  * }]
  */
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "[]"
  );

  if (!configuration.length) return EMPTY_DISCOUNT

  // const targets = input.cart.lines
  //   .filter(line => configuration.filter((conf) => {
  //     return line.quantity >= conf.quantity
  //   }) &&
  //     line.merchandise.__typename == "ProductVariant")
  //   .map(line => {
  //     const variant = /** @type {ProductVariant} */ (line.merchandise);
  //     return /** @type {Target} */ ({
  //       productVariant: {
  //         id: variant.id
  //       }
  //     });
  //   });

  // if (!targets.length) {
  //   console.error("No cart lines qualify for volume discount.");
  //   return EMPTY_DISCOUNT;
  // }

  const deals = configuration.map((c) => {
    const targets = input.cart.lines
    .filter(line => line.quantity >= c.quantity &&
      line.merchandise.__typename == "ProductVariant")
    .map(line => {
      const variant = /** @type {ProductVariant} */ (line.merchandise);
      return /** @type {Target} */ ({
        productVariant: {
          id: variant.id
        }
      });
    });

    return {
      targets,
      value: {
        percentage: {
          value: c.percentage
        }
      },
    }
  })

  if (!deals.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        "targets": [
          {
            "productVariant": {
              "id": "gid://shopify/ProductVariant/47844778115345"
            }
          },
        ],
        "value": {
          "percentage": {
            "value": 10
          }
        }
      },
      {
        "targets": [
          {
            "productVariant": {
              "id": "gid://shopify/ProductVariant/47844791714065"
            }
          }
        ],
        "value": {
          "percentage": {
            "value": 30
          }
        }
      }
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.All
  };
};
