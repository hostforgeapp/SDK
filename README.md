# @hostforge/sdk

Official TypeScript SDK for the HostForge API with bulletproof security and full TypeScript support.

## 🚀 Features

- ✅ **Secure Order System** - Deployment variables never exposed to client
- ✅ **Full TypeScript Support** - Complete type definitions included
- ✅ **Automatic Price Calculation** - Price modifiers handled server-side
- ✅ **Balance Management** - Built-in balance checking
- ✅ **Profile Management** - Update profile, change password, manage avatars
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Token Management** - Automatic JWT handling
- ✅ **Easy Integration** - Simple, intuitive API
- ✅ **Smart Filters** - Get active, expired, or expiring products instantly

## 📦 Installation

\`\`\`bash
npm install @hostforge/sdk
\`\`\`

## 🎯 Quick Start

\`\`\`typescript
import { createHostForgeClient } from '@hostforge/sdk';

// Initialize the SDK
const hostforge = createHostForgeClient({
  projectId: 'your-project-id',
  apiUrl: 'https://hostforge.palior.com/api', // optional
});

// Login
const { token, user } = await hostforge.login({
  email: 'user@example.com',
  password: 'password123',
});

// Browse packages
const packages = await hostforge.getPackages();

// Create order (SECURE METHOD)
const order = await hostforge.createPackageOrder(
  1,              // Package ID
  [42, 87],       // Variable Group Item IDs
  'SUMMER2025'    // Optional discount code
);

// Get customer's products
const activeProducts = await hostforge.getActiveProducts();
const expiringSoon = await hostforge.getExpiringSoonProducts();
\`\`\`

## 📚 Product Management Quick Reference

\`\`\`typescript
// Get all products
const all = await sdk.getCustomerProducts();

// Filter by status
const active = await sdk.getActiveProducts();           // Only active
const pending = await sdk.getPendingProducts();         // Being provisioned
const suspended = await sdk.getSuspendedProducts();     // Suspended
const terminated = await sdk.getTerminatedProducts();   // Terminated

// Filter by expiration
const expired = await sdk.getExpiredProducts();         // Already expired
const expiringSoon = await sdk.getExpiringSoonProducts(); // Expiring soon

// Custom filters
const gameservers = await sdk.getCustomerProducts({
  status: 'active',
  type: 1  // product_type_id
});

// Get single product (with credentials)
const product = await sdk.getCustomerProduct(123);
console.log(product.credentials); // Panel login, FTP, etc.
\`\`\`

## 👤 Profile Management

\`\`\`typescript
// Update profile information
await hostforge.updateProfile({
  first_name: 'Max',
  last_name: 'Mustermann',
  phone: '+49123456789',
  // Optional address fields
  street: 'Musterstraße',
  house_number: '42A',
  zip: '12345',
  city: 'Berlin',
  country: 'DE'
});

// Change password
await hostforge.updatePassword({
  current_password: 'oldPassword123',
  new_password: 'newPassword456',
  new_password_confirmation: 'newPassword456'
});

// Upload avatar
const file = document.querySelector('input[type="file"]').files[0];
const { avatar_url } = await hostforge.uploadAvatar(file);

// Delete avatar
await hostforge.deleteAvatar();
\`\`\`

## 🛒 Ordering with Variable Groups

### New Format (Recommended)
```typescript
// Use variable group slugs as keys with option slugs/IDs as values
const order = await hostforge.createPackageOrderWithVariables(
  1,  // Package ID
  {
    betriebssystem: 'ubuntu-2210',  // or use ID: 2
    speicher: '1tb-ssd',             // or use ID: 5
    cpus: 4
  },
  'DISCOUNT',      // Optional discount code
  3                // Optional runtime group ID
);
```

### Legacy Format (Still Supported)
```typescript
// Old method with selected_items array
const order = await hostforge.createPackageOrder(
  1,              // Package ID
  [42, 87],       // Variable Group Item IDs
  'SUMMER2025',   // Optional discount code
  3               // Optional runtime group ID
);
```

## 🖥️ Dedicated Server Marketplace

Browse dedicated servers from multiple providers:

```typescript
// Get all dedicated servers
const response = await hostforge.getAllDedicatedServers();
console.log(`Found ${response.count} servers`);

// Filter by location and price
const servers = await hostforge.getAllDedicatedServers({
  location_id: '1',
  min_price: 50,
  max_price: 200,
  sort_by: 'price',
  sort_order: 'asc'
});

// Filter by specific module/provider
const hostapiServers = await hostforge.getAllDedicatedServers({
  module: 'hostapi-dedicated'
});

// Purchase a dedicated server
const order = await hostforge.purchaseModuleProduct('hostapi-dedicated', {
  product_id: 'prod_12345',
  product_type_id: 4,
  deployment_config: {
    hostname: 'server01.example.com',
    template: 'ubuntu-22'
  },
  runtime_group_id: 3,
  discount_code: 'SUMMER2025'
});
```

## 🔌 Dynamic Products / Modules

Work with products from specific modules:

```typescript
// Get products from a module
const products = await hostforge.getModuleProducts('hostapi-dedicated', {
  location_id: '1',
  min_price: 100
});

// Get single product
const product = await hostforge.getModuleProduct('hostapi-dedicated', 'prod_12345');

// Validate before purchase
const validation = await hostforge.validateModuleProduct('hostapi-dedicated', 'prod_12345');
if (validation.valid) {
  // Product is available
}

// Get available locations
const locations = await hostforge.getModuleLocations('hostapi-dedicated');
```

## 📝 Contract Management

Manage recurring contracts with monthly/quarterly/annual billing:

```typescript
// Get billing cycles
const cycles = await hostforge.getBillingCycles();

// Create a contract
const contract = await hostforge.createContract({
  package_id: 1,
  billing_cycle_id: 2, // Monthly
  betriebssystem: 'ubuntu-2210',
  speicher: '1tb-ssd',
  discount_code: 'PROMO',
  sepa_mandate_id: 3  // Optional
});

// Get all contracts
const contracts = await hostforge.getContracts();

// Get only active contracts
const activeContracts = await hostforge.getContracts({ status: 'active' });

// Cancel a contract
await hostforge.cancelContract(123);

// Reactivate a cancelled contract
await hostforge.reactivateContract(123);

// Convert prepaid product to contract
const newContract = await hostforge.convertProductToContract(456, 2);

// Update auto-renewal
await hostforge.updateContractAutoRenewal(123, true);

// Convert contract back to prepaid
await hostforge.convertContractToPrepaid(123);
```

## 💳 SEPA Mandate Management

Manage SEPA direct debit mandates for contracts:

```typescript
// Validate IBAN
const validation = await hostforge.validateIban('DE89370400440532013000');
if (validation.valid) {
  console.log('Valid IBAN from:', validation.country, validation.bank_name);
}

// Create SEPA mandate
const mandate = await hostforge.createSepaMandate({
  iban: 'DE89370400440532013000',
  bic: 'COBADEFFXXX',
  account_holder: 'Max Mustermann',
  is_default: true
});

// Get all SEPA mandates
const mandates = await hostforge.getSepaMandates();

// Get only active mandates
const activeMandates = await hostforge.getSepaMandates('active');

// Get single mandate
const mandate = await hostforge.getSepaMandate(123);

// Cancel mandate
await hostforge.cancelSepaMandate(123);

// Assign mandate to contract
await hostforge.updateContractSepaMandate(contractId, mandateId);
```

## ❌ Failed Payments

Handle and retry failed contract payments:

```typescript
// Get all failed payments
const failedPayments = await hostforge.getFailedPayments();

// Get only pending failed payments
const pending = await hostforge.getFailedPayments('pending');

// Retry a failed payment
await hostforge.retryFailedPayment(123);

// Manually resolve a failed payment
await hostforge.resolveFailedPayment(123);
```

