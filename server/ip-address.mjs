/**
 * Helper function to detect the local IPv4 address
 * see https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/util/prepareURLs.js
 */

import defaultGateway from 'default-gateway'
import address from 'address'

export function local() {
  try {
    // This can only return an IPv4 address
    const gateway = defaultGateway.v4.sync()
    const ipAddress = address.ip(gateway && gateway.interface)

    // Check if the address is a private ip
    // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
    if (ipAddress && /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(ipAddress)) {
      return ipAddress
    }
  } catch {} // eslint-disable-line no-empty
}
