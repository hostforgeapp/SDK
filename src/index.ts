import axios, { AxiosInstance, AxiosError } from 'axios';

// Export helpers
export * from './helpers';

export interface HostForgeConfig {
  projectId: string;
  apiUrl?: string;
  token?: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  zip?: string;
  city?: string;
  country?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  username?: string;
  company?: string;
  phone?: string;
  street?: string;
  house_number?: string;
  zip?: string;
  city?: string;
  country?: string;
}

export interface UpdatePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface DomainCheckResult {
  domain: string;
  available: boolean;
  premium: boolean;
  price: string | null;
}

export interface TLDPrice {
  tld: string;
  create: string;
  renew: string;
  transfer: string;
  restore: string | null;
  offer: boolean;
  offerTypes: string[];
}

export interface DomainInfo {
  domain: string;
  status: 'pending' | 'registering' | 'active' | 'failed' | 'suspended' | 'expired';
  nameservers: string[];
  whois_privacy: boolean;
  auto_renew: boolean;
  expires_at: string;
  created_at: string;
}

export interface DNSRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'ALIAS' | 'MX' | 'SRV' | 'TXT' | 'CAA' | 'PTR' | 'TLSA' | 'DS' | 'DNSKEY' | 'NS';
  name: string;
  content: string;
  ttl: number;
  priority: number | null;
}

export interface DNSRecordInput {
  type: 'A' | 'AAAA' | 'CNAME' | 'ALIAS' | 'MX' | 'SRV' | 'TXT' | 'CAA' | 'PTR' | 'TLSA' | 'DS' | 'DNSKEY' | 'NS';
  name: string;
  content: string;
  ttl?: number;
  priority?: number;
}

export interface NewsletterCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface NewsletterSubscriptionStatus {
  general: boolean;
  maintenance: boolean;
}

// ==================== DEDICATED SERVER MARKETPLACE ====================

export interface DedicatedServerProduct {
  id: string | number;
  name: string;
  final_price: number;
  metadata: {
    location_id?: number;
    location_name?: string;
    cpu?: string;
    ram?: string;
    disk?: string;
    [key: string]: any;
  };
  module_name: string;
  module_display_name: string;
}

export interface DedicatedServerFilters {
  location_id?: string;
  min_price?: number;
  max_price?: number;
  module?: string;
  sort_by?: 'price';
  sort_order?: 'asc' | 'desc';
}

export interface DedicatedServerResponse {
  success: boolean;
  data: DedicatedServerProduct[];
  count: number;
  module_stats: {
    [moduleName: string]: {
      count: number;
      available: boolean;
    };
  };
}

// ==================== DYNAMIC PRODUCTS / MODULES ====================

export interface ModuleProduct {
  id: string | number;
  name: string;
  description?: string;
  final_price: number;
  metadata: Record<string, any>;
  location?: {
    id: number;
    name: string;
  };
}

export interface ModuleProductFilters {
  location_id?: string;
  min_price?: number;
  max_price?: number;
  [key: string]: any;
}

export interface ModuleLocation {
  id: number;
  name: string;
  country?: string;
  available: boolean;
}

export interface ModulePurchaseRequest {
  product_id: string | number;
  product_type_id: number;
  deployment_config?: Record<string, any>;
  discount_code?: string;
  runtime_group_id?: number;
  billing_mode?: 'prepaid' | 'contract';
  billing_cycle_id?: number;
  sepa_mandate_id?: number;
}

export interface ModuleValidationResult {
  valid: boolean;
  errors?: string[];
  product: ModuleProduct;
}

// ==================== CONTRACTS ====================

export interface BillingCycle {
  id: number;
  name: string;
  slug: string;
  months: number;
  price_multiplier: number;
  is_active: boolean;
}

export interface Contract {
  id: number;
  customer_product_id: number;
  billing_cycle_id: number;
  billing_cycle: BillingCycle;
  recurring_price: number;
  setup_fee: number;
  status: 'active' | 'cancelled' | 'pending_cancellation';
  next_billing_date: string;
  cancellation_date: string | null;
  minimum_term_end_date: string | null;
  auto_renewal_enabled: boolean;
  sepa_mandate_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ContractSettings {
  billing_cycles: BillingCycle[];
  default_billing_cycle_id: number;
  allow_sepa: boolean;
  minimum_term_months: number;
  cancellation_notice_days: number;
}

export interface CreateContractRequest {
  package_id?: number;
  configuration_id?: number;
  billing_cycle_id: number;
  sepa_mandate_id?: number;
  discount_code?: string;
  [key: string]: any; // Variable groups
}

// ==================== SEPA MANDATES ====================

export interface SepaMandate {
  id: number;
  customer_id: number;
  reference: string;
  iban: string;
  bic: string | null;
  account_holder: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  mandate_date: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSepaMandateRequest {
  iban: string;
  bic?: string;
  account_holder: string;
  is_default?: boolean;
}

export interface IbanValidationResult {
  valid: boolean;
  iban: string;
  country: string;
  bank_name?: string;
  errors?: string[];
}

// ==================== FAILED PAYMENTS ====================

export interface FailedPayment {
  id: number;
  customer_id: number;
  contract_id: number;
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'retrying' | 'resolved' | 'abandoned';
  retry_count: number;
  max_retries: number;
  next_retry_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: number;
  customer_id: number;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  phone: string | null;
  street: string | null;
  house_number: string | null;
  zip: string | null;
  city: string | null;
  country: string | null;
  has_address: boolean;
}

export interface VariableGroupItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  price_modifier: number;
  is_featured: boolean;
  variable_group: {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    module_slug: string | null;
  };
}

/**
 * Grouped variable group options (new API format)
 * Key is the variable group slug, value contains group metadata and options
 */
export interface VariableGroupOptions {
  [groupSlug: string]: {
    id: number;
    name: string;
    slug: string;
    options: Array<{
      id: number;
      name: string;
      slug: string;
      description: string | null;
      price_modifier: number;
      is_featured: boolean;
    }>;
  };
}

/**
 * Package feature with icon
 */
export interface PackageFeature {
  icon: string;
  feature: string;
}

/**
 * Runtime Group - Defines available runtime options (7 days, 30 days, etc.)
 * for products. Prices are calculated based on a 30-day base price.
 */
export interface RuntimeGroup {
  id: number;
  name: string;
  slug: string;
  days: number;
  price_multiplier: number;
  price: number;
  formatted_price: string;
  is_default: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  features?: PackageFeature[];
  price: number;
  sale_price: number | null;
  on_sale: boolean;
  discount?: any;
  product_type?: {
    id: number;
    name: string;
    slug: string;
    is_hosting: boolean;
  };
  module_slug: string | null;
  config?: any;
  custom_options?: any[];
  variable_groups?: any[];
  variable_group_options?: VariableGroupOptions;
  runtime_groups?: RuntimeGroup[];
}

export interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

export interface ProductType {
  id: number;
  name: string;
  slug: string;
  module_name?: string;
  icon: string;
}

export interface CustomerProduct {
  id: number;
  product_type: ProductType;
  is_domain: boolean;
  package_name: string | null;
  configuration: Record<string, any> | null;
  price_paid: number;
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  external_id: string | null;
  credentials?: Record<string, any>;
  expires_at: string | null;
  is_expired: boolean;
  is_expiring_soon: boolean;
  created_at: string;
  updated_at?: string;
}

/** @deprecated Use CustomerProduct instead */
export interface Order {
  id: number;
  product_id: number;
  status: string;
  expires_at: string | null;
}

export class HostForgeSDK {
  private client: AxiosInstance;
  private projectId: string;
  private token: string | null = null;

  constructor(config: HostForgeConfig) {
    this.projectId = config.projectId;
    this.token = config.token || null;

    const baseURL = config.apiUrl || 'https://hostforge.palior.com/api';

    this.client = axios.create({
      baseURL: `${baseURL}/project/${this.projectId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add auth token to requests if available
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Handle errors uniformly
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.data) {
          throw new Error(error.response.data.message || 'API request failed');
        }
        throw error;
      }
    );
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  // ==================== AUTH ====================

  /**
   * Register a new customer
   */
  async register(data: RegisterData): Promise<ApiResponse> {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  /**
   * Login and receive JWT token
   */
  async login(credentials: LoginCredentials): Promise<{ token: string; user: any }> {
    const response = await this.client.post<ApiResponse>('/auth/login', credentials);
    if (response.data.data?.token) {
      this.setToken(response.data.data.token);
      return response.data.data;
    }
    throw new Error('Login failed: No token received');
  }

  /**
   * Logout (invalidate token)
   */
  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    this.token = null;
  }

  /**
   * Get current user info
   */
  async me(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/auth/me');
    return response.data.data;
  }

  /**
   * Refresh JWT token
   */
  async refresh(): Promise<{ token: string }> {
    const response = await this.client.post<ApiResponse>('/auth/refresh');
    if (response.data.data?.token) {
      this.setToken(response.data.data.token);
      return response.data.data;
    }
    throw new Error('Token refresh failed');
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await this.client.post('/auth/forgot-password', { email });
    return response.data;
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, email: string, password: string, passwordConfirmation: string): Promise<ApiResponse> {
    const response = await this.client.post('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  }

  // ==================== PROFILE ====================

  /**
   * Update customer profile
   *
   * @param data - Profile data to update (all fields optional)
   *
   * @example
   * // Update name and phone
   * await sdk.updateProfile({
   *   first_name: 'Max',
   *   last_name: 'Mustermann',
   *   phone: '+49123456789'
   * });
   *
   * @example
   * // Update complete address
   * await sdk.updateProfile({
   *   first_name: 'Max',
   *   last_name: 'Mustermann',
   *   street: 'Musterstraße',
   *   house_number: '42A',
   *   zip: '12345',
   *   city: 'Berlin',
   *   country: 'DE'
   * });
   */
  async updateProfile(data: UpdateProfileData): Promise<CustomerProfile> {
    const response = await this.client.put<ApiResponse<CustomerProfile>>('/profile', data);
    return response.data.data!;
  }

  /**
   * Change customer password
   *
   * @param data - Password change data with current and new password
   *
   * @example
   * await sdk.updatePassword({
   *   current_password: 'oldPassword123',
   *   new_password: 'newPassword456',
   *   new_password_confirmation: 'newPassword456'
   * });
   */
  async updatePassword(data: UpdatePasswordData): Promise<ApiResponse> {
    const response = await this.client.put('/profile/password', data);
    return response.data;
  }

  /**
   * Upload customer avatar
   *
   * @param file - The avatar image file (JPEG, PNG, GIF, WEBP, max 2MB)
   *
   * @example
   * const file = event.target.files[0];
   * const result = await sdk.uploadAvatar(file);
   * console.log(result.avatar_url);
   */
  async uploadAvatar(file: File | Blob): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await this.client.post<ApiResponse<{ avatar_url: string }>>('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  }

  /**
   * Delete customer avatar
   *
   * @example
   * await sdk.deleteAvatar();
   */
  async deleteAvatar(): Promise<ApiResponse> {
    const response = await this.client.delete('/profile/avatar');
    return response.data;
  }

  // ==================== CATEGORIES ====================

  /**
   * Get all categories
   */
  async getCategories(): Promise<any[]> {
    const response = await this.client.get<ApiResponse>('/categories');
    return response.data.data?.categories || [];
  }

  /**
   * Get single category
   */
  async getCategory(id: number): Promise<any> {
    const response = await this.client.get<ApiResponse>(`/categories/${id}`);
    return response.data.data?.category;
  }

  // ==================== PRODUCTS ====================

  /**
   * Get all products (packages and configurations) with runtime groups
   *
   * @param productTypeId - Optional filter by product type
   * @param featured - Optional filter for featured products only
   *
   * @example
   * // Get all products
   * const products = await sdk.getProducts();
   *
   * @example
   * // Get featured products for a specific type
   * const products = await sdk.getProducts(1, true);
   */
  async getProducts(productTypeId?: number, featured?: boolean): Promise<{ packages: Product[]; configurations: Product[] }> {
    const params: any = {};
    if (productTypeId) params.type = productTypeId;
    if (featured) params.featured = 'true';

    const response = await this.client.get<ApiResponse>('/products', { params });
    return response.data.data || { packages: [], configurations: [] };
  }

  // ==================== PACKAGES ====================

  /**
   * Get all packages (optionally filtered by product_type_id)
   */
  async getPackages(productTypeId?: number): Promise<Product[]> {
    const params = productTypeId ? { product_type_id: productTypeId } : {};
    const response = await this.client.get<ApiResponse>('/packages', { params });
    return response.data.data?.packages || [];
  }

  /**
   * Get single package
   */
  async getPackage(id: number): Promise<Product> {
    const response = await this.client.get<ApiResponse>(`/packages/${id}`);
    return response.data.data?.package;
  }

  /**
   * Get package variable groups
   */
  async getPackageVariables(id: number): Promise<any> {
    const response = await this.client.get<ApiResponse>(`/packages/${id}/variables`);
    return response.data.data;
  }

  // ==================== ORDERS / CUSTOMER PRODUCTS ====================

  /**
   * Get all customer products (orders) with optional filters
   *
   * @param options - Filter options
   * @param options.status - Filter by status: 'pending', 'active', 'suspended', 'terminated'
   * @param options.type - Filter by product_type_id
   *
   * @example
   * // Get all products
   * const products = await sdk.getCustomerProducts();
   *
   * @example
   * // Get only active products
   * const activeProducts = await sdk.getCustomerProducts({ status: 'active' });
   *
   * @example
   * // Get all gameservers (product_type_id = 1)
   * const gameservers = await sdk.getCustomerProducts({ type: 1 });
   */
  async getCustomerProducts(options?: { status?: 'pending' | 'active' | 'suspended' | 'terminated'; type?: number }): Promise<CustomerProduct[]> {
    const params: any = {};
    if (options?.status) params.status = options.status;
    if (options?.type) params.type = options.type;

    const response = await this.client.get<ApiResponse>('/orders', { params });
    return response.data.data || [];
  }

  /**
   * Get all active customer products (not expired, not terminated)
   */
  async getActiveProducts(): Promise<CustomerProduct[]> {
    return this.getCustomerProducts({ status: 'active' });
  }

  /**
   * Get all expired customer products
   */
  async getExpiredProducts(): Promise<CustomerProduct[]> {
    const allProducts = await this.getCustomerProducts();
    return allProducts.filter(p => p.is_expired);
  }

  /**
   * Get only domain products
   *
   * @param status - Optional status filter
   *
   * @example
   * // Get all domains
   * const domains = await sdk.getDomainProducts();
   *
   * @example
   * // Get only active domains
   * const activeDomains = await sdk.getDomainProducts('active');
   */
  async getDomainProducts(status?: 'pending' | 'active' | 'suspended' | 'terminated'): Promise<CustomerProduct[]> {
    const allProducts = await this.getCustomerProducts(status ? { status } : undefined);
    return allProducts.filter(p => p.is_domain);
  }

  /**
   * Get only hosting/server products (non-domains)
   *
   * @param status - Optional status filter
   *
   * @example
   * // Get all hosting products
   * const hostingProducts = await sdk.getHostingProducts();
   *
   * @example
   * // Get only active hosting products
   * const activeHosting = await sdk.getHostingProducts('active');
   */
  async getHostingProducts(status?: 'pending' | 'active' | 'suspended' | 'terminated'): Promise<CustomerProduct[]> {
    const allProducts = await this.getCustomerProducts(status ? { status } : undefined);
    return allProducts.filter(p => !p.is_domain);
  }

  /**
   * Get all products expiring soon
   */
  async getExpiringSoonProducts(): Promise<CustomerProduct[]> {
    const allProducts = await this.getCustomerProducts();
    return allProducts.filter(p => p.is_expiring_soon && !p.is_expired);
  }

  /**
   * Get pending customer products (being provisioned)
   */
  async getPendingProducts(): Promise<CustomerProduct[]> {
    return this.getCustomerProducts({ status: 'pending' });
  }

  /**
   * Get suspended customer products
   */
  async getSuspendedProducts(): Promise<CustomerProduct[]> {
    return this.getCustomerProducts({ status: 'suspended' });
  }

  /**
   * Get terminated customer products
   */
  async getTerminatedProducts(): Promise<CustomerProduct[]> {
    return this.getCustomerProducts({ status: 'terminated' });
  }

  /**
   * @deprecated Use getCustomerProducts() instead
   * Legacy method for backwards compatibility
   */
  async getOrders(): Promise<Order[]> {
    const response = await this.client.get<ApiResponse>('/orders');
    return response.data.data || [];
  }

  /**
   * @deprecated Use createPackageOrderWithVariables() instead
   * Create new order for a package (legacy method)
   *
   * SECURITY NOTE: selected_items are Item IDs only.
   * Deployment variables (like eggId, nestId) are NEVER sent from client.
   * They are fetched server-side from the database for security.
   *
   * @param packageId - The package ID to order
   * @param selectedItems - Array of Variable Group Item IDs for customization
   * @param discountCode - Optional discount code
   * @param runtimeGroupId - Optional runtime group ID to specify subscription duration
   *
   * @example
   * // Order a Minecraft server with specific egg selection and 7-day runtime
   * const order = await sdk.createPackageOrder(1, [42, 87], 'SUMMER2025', 3);
   */
  async createPackageOrder(packageId: number, selectedItems?: number[], discountCode?: string, runtimeGroupId?: number): Promise<any> {
    const response = await this.client.post<ApiResponse>('/orders', {
      type: 'package',
      package_id: packageId,
      selected_items: selectedItems || [],
      discount_code: discountCode,
      runtime_group_id: runtimeGroupId,
    });
    return response.data.data;
  }

  /**
   * Create new order for a package with variable groups (new format)
   *
   * This method uses the new variable group format where you specify
   * options by variable group slug and option ID/slug.
   *
   * @param packageId - The package ID to order
   * @param variableGroups - Object with variable group slugs as keys and option IDs or slugs as values
   * @param discountCode - Optional discount code
   * @param runtimeGroupId - Optional runtime group ID to specify subscription duration
   *
   * @example
   * // Order with new format using slugs
   * const order = await sdk.createPackageOrderWithVariables(1, {
   *   betriebssystem: 'ubuntu-2210',
   *   speicher: '1tb-ssd'
   * }, 'SUMMER2025', 3);
   *
   * @example
   * // Order with new format using IDs
   * const order = await sdk.createPackageOrderWithVariables(1, {
   *   betriebssystem: 2,
   *   speicher: 5
   * });
   */
  async createPackageOrderWithVariables(
    packageId: number,
    variableGroups?: Record<string, string | number>,
    discountCode?: string,
    runtimeGroupId?: number
  ): Promise<any> {
    const requestData: any = {
      type: 'package',
      package_id: packageId,
      ...variableGroups,
    };

    if (discountCode) {
      requestData.discount_code = discountCode;
    }

    if (runtimeGroupId) {
      requestData.runtime_group_id = runtimeGroupId;
    }

    const response = await this.client.post<ApiResponse>('/orders', requestData);
    return response.data.data;
  }

  /**
   * Create new order for a configuration
   *
   * @param configurationId - The configuration ID to order
   * @param config - Configuration values (RAM, CPU, etc.)
   * @param discountCode - Optional discount code
   * @param runtimeGroupId - Optional runtime group ID to specify subscription duration
   *
   * @example
   * // Order a custom VPS configuration with 6-month runtime
   * const order = await sdk.createConfigurationOrder(1, { ram: 16, cpu: 4, disk: 100 }, 'PROMO', 4);
   */
  async createConfigurationOrder(configurationId: number, config: Record<string, any>, discountCode?: string, runtimeGroupId?: number): Promise<any> {
    const response = await this.client.post<ApiResponse>('/orders', {
      type: 'configuration',
      configuration_id: configurationId,
      config,
      discount_code: discountCode,
      runtime_group_id: runtimeGroupId,
    });
    return response.data.data;
  }

  /**
   * @deprecated Use createPackageOrder() or createConfigurationOrder() instead
   * Legacy method for backwards compatibility
   */
  async createOrder(data: { product_type: string; product_id: number; configuration?: any; discount_code?: string }): Promise<any> {
    const response = await this.client.post<ApiResponse>('/orders', data);
    return response.data.data;
  }

  /**
   * Get single customer product by ID (with credentials if applicable)
   */
  async getCustomerProduct(id: number): Promise<CustomerProduct> {
    const response = await this.client.get<ApiResponse>(`/orders/${id}`);
    return response.data.data;
  }

  /**
   * @deprecated Use getCustomerProduct() instead
   * Legacy method for backwards compatibility
   */
  async getOrder(id: number): Promise<Order> {
    const response = await this.client.get<ApiResponse>(`/orders/${id}`);
    return response.data.data;
  }

  /**
   * Renew order
   *
   * @param id - The order/product ID to renew
   * @param runtimeGroupId - Optional runtime group ID to specify renewal duration
   *
   * @example
   * // Renew with same runtime as original order
   * await sdk.renewOrder(123);
   *
   * @example
   * // Renew with different runtime (e.g., switch from 30 days to 180 days)
   * await sdk.renewOrder(123, 4);
   */
  async renewOrder(id: number, runtimeGroupId?: number): Promise<ApiResponse> {
    const response = await this.client.post(`/orders/${id}/renew`, {
      runtime_group_id: runtimeGroupId,
    });
    return response.data;
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: number): Promise<ApiResponse> {
    const response = await this.client.post(`/orders/${id}/cancel`);
    return response.data;
  }

  // ==================== TICKETS ====================

  /**
   * Get all tickets
   */
  async getTickets(): Promise<Ticket[]> {
    const response = await this.client.get<ApiResponse>('/tickets');
    return response.data.data?.tickets || [];
  }

  /**
   * Create ticket
   */
  async createTicket(data: { subject: string; message: string; priority?: string }): Promise<any> {
    const response = await this.client.post<ApiResponse>('/tickets', data);
    return response.data.data;
  }

  /**
   * Get single ticket
   */
  async getTicket(id: number): Promise<any> {
    const response = await this.client.get<ApiResponse>(`/tickets/${id}`);
    return response.data.data?.ticket;
  }

  /**
   * Add message to ticket
   */
  async addTicketMessage(id: number, message: string): Promise<ApiResponse> {
    const response = await this.client.post(`/tickets/${id}/messages`, { message });
    return response.data;
  }

  // ==================== DEPOSITS ====================

  /**
   * Initiate deposit
   * @param amount - Deposit amount (min: 3, max: 250)
   * @param paymentMethodId - Payment method ID
   * @param returnUrl - URL to return to after payment
   */
  async initiateDeposit(amount: number, paymentMethodId: number, returnUrl: string): Promise<any> {
    const response = await this.client.post<ApiResponse>('/deposit/initiate', {
      amount,
      payment_method_id: paymentMethodId,
      return_url: returnUrl
    });
    return response.data.data;
  }

  /**
   * Get deposit status
   */
  async getDepositStatus(transactionId: string): Promise<any> {
    const response = await this.client.get<ApiResponse>(`/deposit/status/${transactionId}`);
    return response.data.data;
  }

  /**
   * Get active deposit bonus
   */
  async getActiveBonus(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/deposit/active-bonus');
    return response.data.data;
  }

  // ==================== PAYMENT METHODS ====================

  /**
   * Get available payment methods
   */
  async getPaymentMethods(): Promise<any[]> {
    const response = await this.client.get<ApiResponse>('/payment-methods');
    return response.data.data?.payment_methods || [];
  }

  // ==================== DISCOUNT CODES ====================

  /**
   * Validate discount code
   */
  async validateDiscountCode(code: string, productId?: number): Promise<any> {
    const response = await this.client.post<ApiResponse>('/discount-codes/validate', { code, product_id: productId });
    return response.data.data;
  }

  // ==================== PRODUCT ACTIONS ====================

  /**
   * Start product
   */
  async startProduct(productId: number): Promise<ApiResponse> {
    const response = await this.client.post(`/products/${productId}/start`);
    return response.data;
  }

  /**
   * Stop product
   */
  async stopProduct(productId: number): Promise<ApiResponse> {
    const response = await this.client.post(`/products/${productId}/stop`);
    return response.data;
  }

  /**
   * Reboot product
   */
  async rebootProduct(productId: number): Promise<ApiResponse> {
    const response = await this.client.post(`/products/${productId}/reboot`);
    return response.data;
  }

  /**
   * Reinstall product
   */
  async reinstallProduct(productId: number): Promise<ApiResponse> {
    const response = await this.client.post(`/products/${productId}/reinstall`);
    return response.data;
  }

  /**
   * Backup product
   */
  async backupProduct(productId: number): Promise<ApiResponse> {
    const response = await this.client.post(`/products/${productId}/backup`);
    return response.data;
  }

  /**
   * Reset product password
   */
  async resetProductPassword(productId: number): Promise<ApiResponse> {
    const response = await this.client.post(`/products/${productId}/reset-password`);
    return response.data;
  }

  /**
   * Get product status
   */
  async getProductStatus(productId: number): Promise<any> {
    const response = await this.client.get<ApiResponse>(`/products/${productId}/status`);
    return response.data.data;
  }

  // ==================== PRICE CALCULATION HELPERS ====================

  /**
   * Calculate total price for a package with selected variable group items
   *
   * @param basePrice - The base price of the package (per 30 days)
   * @param selectedItemIds - Array of selected Variable Group Item IDs
   * @param variableGroupOptions - Available variable group items from the package
   *
   * @returns Object containing base price, total surcharge, and final price
   *
   * @example
   * const package = await sdk.getPackage(1);
   * const priceBreakdown = sdk.calculatePackagePrice(
   *   package.price,
   *   [2, 5],  // Selected Minecraft Forge (+2.00) and Windows OS (+15.00)
   *   package.variable_group_options
   * );
   * // Result: { basePrice: 10.00, surcharge: 17.00, totalPrice: 27.00 }
   */
  calculatePackagePrice(basePrice: number, selectedItemIds: number[], variableGroupOptions?: VariableGroupItem[]): {
    basePrice: number;
    surcharge: number;
    totalPrice: number;
    selectedItems: VariableGroupItem[];
  } {
    // Validate inputs
    if (typeof basePrice !== 'number' || isNaN(basePrice) || basePrice < 0) {
      throw new Error('Invalid base price: must be a positive number');
    }

    if (!Array.isArray(selectedItemIds)) {
      throw new Error('Invalid selectedItemIds: must be an array');
    }

    // Calculate surcharge from selected items
    const surcharge = variableGroupOptions?.reduce((total, item) => {
      if (selectedItemIds.includes(item.id)) {
        const modifier = item.price_modifier ?? 0;
        return total + (typeof modifier === 'number' && !isNaN(modifier) ? modifier : 0);
      }
      return total;
    }, 0) || 0;

    const selectedItems = variableGroupOptions?.filter(item => selectedItemIds.includes(item.id)) || [];

    return {
      basePrice: Math.round(basePrice * 100) / 100,
      surcharge: Math.round(surcharge * 100) / 100,
      totalPrice: Math.round((basePrice + surcharge) * 100) / 100,
      selectedItems,
    };
  }

  /**
   * Calculate total price for a package with variable groups (new format)
   *
   * @param basePrice - The base price of the package (per 30 days)
   * @param selectedVariables - Object with variable group slugs as keys and option slugs as values
   * @param variableGroupOptions - Available variable group options from the package (new grouped format)
   *
   * @returns Object containing base price, total surcharge, and final price
   *
   * @example
   * const package = await sdk.getPackage(1);
   * const priceBreakdown = sdk.calculatePackagePriceV2(
   *   package.price,
   *   { betriebssystem: 'ubuntu-2210', speicher: '1tb-ssd' },
   *   package.variable_group_options
   * );
   * // Result: { basePrice: 10.00, surcharge: 17.00, totalPrice: 27.00 }
   */
  calculatePackagePriceV2(
    basePrice: number,
    selectedVariables: Record<string, string | number>,
    variableGroupOptions?: VariableGroupOptions
  ): {
    basePrice: number;
    surcharge: number;
    totalPrice: number;
    selectedOptions: Array<{ groupSlug: string; optionSlug: string; priceModifier: number }>;
  } {
    // Validate inputs
    if (typeof basePrice !== 'number' || isNaN(basePrice) || basePrice < 0) {
      throw new Error('Invalid base price: must be a positive number');
    }

    if (!selectedVariables || typeof selectedVariables !== 'object') {
      throw new Error('Invalid selectedVariables: must be an object');
    }

    let surcharge = 0;
    const selectedOptions: Array<{ groupSlug: string; optionSlug: string; priceModifier: number }> = [];

    if (variableGroupOptions) {
      // Iterate through selected variables
      for (const [groupSlug, valueIdOrSlug] of Object.entries(selectedVariables)) {
        const group = variableGroupOptions[groupSlug];
        if (!group) continue;

        // Find the option by ID or slug
        const option = group.options.find(opt =>
          opt.id === valueIdOrSlug || opt.slug === valueIdOrSlug
        );

        if (option) {
          const modifier = option.price_modifier ?? 0;
          surcharge += typeof modifier === 'number' && !isNaN(modifier) ? modifier : 0;
          selectedOptions.push({
            groupSlug,
            optionSlug: option.slug,
            priceModifier: modifier,
          });
        }
      }
    }

    return {
      basePrice: Math.round(basePrice * 100) / 100,
      surcharge: Math.round(surcharge * 100) / 100,
      totalPrice: Math.round((basePrice + surcharge) * 100) / 100,
      selectedOptions,
    };
  }

  /**
   * Calculate final price with runtime group adjustment
   *
   * @param basePrice30Days - Base price for 30 days (with surcharges already applied)
   * @param runtimeGroup - The selected runtime group
   *
   * @returns Final price adjusted for the runtime duration
   *
   * @example
   * const runtime = { days: 180, price_multiplier: 0.85, ... };
   * const finalPrice = sdk.calculateRuntimePrice(27.00, runtime);
   * // Result: 137.70 (27.00 / 30 * 180 * 0.85)
   */
  calculateRuntimePrice(basePrice30Days: number, runtimeGroup: RuntimeGroup): number {
    // Validate inputs
    if (typeof basePrice30Days !== 'number' || isNaN(basePrice30Days) || basePrice30Days < 0) {
      throw new Error('Invalid base price: must be a positive number');
    }

    if (!runtimeGroup || typeof runtimeGroup.days !== 'number' || typeof runtimeGroup.price_multiplier !== 'number') {
      throw new Error('Invalid runtime group: missing days or price_multiplier');
    }

    const pricePerDay = basePrice30Days / 30;
    const totalPrice = pricePerDay * runtimeGroup.days;
    const finalPrice = totalPrice * runtimeGroup.price_multiplier;

    return Math.round(finalPrice * 100) / 100;
  }

  /**
   * Calculate complete price breakdown for a package order
   *
   * @param packageData - Package object from getPackage() or getPackages()
   * @param selectedItemIds - Array of selected Variable Group Item IDs
   * @param runtimeGroupId - Optional runtime group ID (defaults to 30 days if not specified)
   *
   * @returns Complete price breakdown with all components
   *
   * @example
   * const package = await sdk.getPackage(1);
   * const breakdown = sdk.calculateFullPrice(package, [2, 5], 3);
   * console.log(breakdown);
   * // {
   * //   basePrice: 10.00,
   * //   surcharge: 17.00,
   * //   price30Days: 27.00,
   * //   runtime: { name: '6 Monate', days: 180, ... },
   * //   finalPrice: 137.70,
   * //   savings: 24.30
   * // }
   */
  calculateFullPrice(packageData: Product, selectedItemIds: number[] = [], runtimeGroupId?: number): {
    basePrice: number;
    surcharge: number;
    price30Days: number;
    runtime: RuntimeGroup | null;
    finalPrice: number;
    savings: number;
    selectedItems: VariableGroupItem[];
  } {
    // Validate package data
    if (!packageData || typeof packageData.price !== 'number') {
      throw new Error('Invalid package data: missing or invalid price');
    }

    // Calculate base price + surcharges
    const priceCalc = this.calculatePackagePrice(
      packageData.price,
      selectedItemIds || [],
      packageData.variable_group_options
    );

    // Find selected runtime or default
    let runtime: RuntimeGroup | null = null;
    if (runtimeGroupId && packageData.runtime_groups) {
      runtime = packageData.runtime_groups.find(r => r.id === runtimeGroupId) || null;
    }

    // Calculate final price
    let finalPrice = priceCalc.totalPrice;
    let savings = 0;

    if (runtime) {
      const fullPrice = (priceCalc.totalPrice / 30) * runtime.days;
      finalPrice = this.calculateRuntimePrice(priceCalc.totalPrice, runtime);
      savings = fullPrice - finalPrice;
    }

    return {
      basePrice: priceCalc.basePrice,
      surcharge: priceCalc.surcharge,
      price30Days: priceCalc.totalPrice,
      runtime,
      finalPrice: Math.round(finalPrice * 100) / 100,
      savings: Math.round(Math.max(0, savings) * 100) / 100, // Ensure savings are never negative
      selectedItems: priceCalc.selectedItems,
    };
  }

  // ==================== DOMAINS ====================

  /**
   * Check domain availability
   *
   * @param domain - Domain name to check (e.g., "example.com")
   * @param provider - Optional provider slug (e.g., "skrime")
   *
   * @example
   * const result = await sdk.checkDomainAvailability('example.de');
   * if (result.available) {
   *   console.log(`Domain available for ${result.price}`);
   * }
   */
  async checkDomainAvailability(domain: string, provider?: string): Promise<DomainCheckResult> {
    const response = await this.client.post<ApiResponse<{ data: DomainCheckResult }>>('/domain/check', {
      domain,
      provider,
    });
    return response.data.data!.data;
  }

  /**
   * Get domain pricelist
   *
   * @example
   * const pricelist = await sdk.getDomainPricelist();
   * console.log(pricelist.find(tld => tld.tld === 'com'));
   */
  async getDomainPricelist(): Promise<TLDPrice[]> {
    const response = await this.client.get<ApiResponse<{ data: TLDPrice[] }>>('/domain/pricelist');
    return response.data.data!.data;
  }

  /**
   * Get domain information for a customer product
   *
   * @param productId - Customer product ID (domain product)
   *
   * @example
   * const domainInfo = await sdk.getDomainInfo(123);
   * console.log(domainInfo.status, domainInfo.expires_at);
   */
  async getDomainInfo(productId: number): Promise<DomainInfo> {
    const response = await this.client.get<ApiResponse<{ data: DomainInfo }>>(`/domain/${productId}`);
    return response.data.data!.data;
  }

  /**
   * Update domain nameservers
   *
   * @param productId - Customer product ID (domain product)
   * @param nameservers - Array of nameservers (2-6 nameservers)
   *
   * @example
   * await sdk.updateDomainNameservers(123, [
   *   'ns1.example.com',
   *   'ns2.example.com'
   * ]);
   */
  async updateDomainNameservers(productId: number, nameservers: string[]): Promise<ApiResponse> {
    const response = await this.client.put(`/domain/${productId}/nameservers`, { nameservers });
    return response.data;
  }

  /**
   * Toggle WHOIS privacy for a domain
   *
   * @param productId - Customer product ID (domain product)
   * @param enabled - true to enable, false to disable
   *
   * @example
   * // Enable WHOIS privacy
   * await sdk.toggleDomainWhoisPrivacy(123, true);
   */
  async toggleDomainWhoisPrivacy(productId: number, enabled: boolean): Promise<ApiResponse> {
    const response = await this.client.post(`/domain/${productId}/whois-privacy`, { enabled });
    return response.data;
  }

  /**
   * Get domain auth code (EPP code) for transfer
   *
   * @param productId - Customer product ID (domain product)
   *
   * @example
   * const result = await sdk.getDomainAuthCode(123);
   * console.log('Auth code:', result.auth_code);
   */
  async getDomainAuthCode(productId: number): Promise<{ auth_code: string }> {
    const response = await this.client.get<ApiResponse<{ data: { auth_code: string } }>>(`/domain/${productId}/auth-code`);
    return response.data.data!.data;
  }

  /**
   * Get DNS records for a domain
   *
   * @param productId - Customer product ID (domain product)
   *
   * @example
   * const records = await sdk.getDomainDNSRecords(123);
   * console.log(records);
   */
  async getDomainDNSRecords(productId: number): Promise<DNSRecord[]> {
    const response = await this.client.get<ApiResponse<{ data: DNSRecord[] }>>(`/domain/${productId}/dns`);
    return response.data.data!.data;
  }

  /**
   * Update DNS records for a domain (replaces all existing records)
   *
   * @param productId - Customer product ID (domain product)
   * @param records - Array of DNS records to set
   *
   * @example
   * await sdk.updateDomainDNSRecords(123, [
   *   {
   *     type: 'A',
   *     name: '@',
   *     content: '192.168.1.1',
   *     ttl: 3600
   *   },
   *   {
   *     type: 'CNAME',
   *     name: 'www',
   *     content: 'example.com',
   *     ttl: 3600
   *   }
   * ]);
   */
  async updateDomainDNSRecords(productId: number, records: DNSRecordInput[]): Promise<ApiResponse> {
    const response = await this.client.put(`/domain/${productId}/dns`, { records });
    return response.data;
  }

  // ==================== DEDICATED SERVER MARKETPLACE ====================

  /**
   * Get all dedicated servers from marketplace
   *
   * Fetches dedicated server products from all available modules with dynamic-marketplace capability.
   * Results can be filtered by location, price range, and specific module.
   *
   * @param filters - Optional filters for location, price, module, and sorting
   *
   * @example
   * // Get all dedicated servers
   * const response = await sdk.getAllDedicatedServers();
   * console.log(`Found ${response.count} servers across ${Object.keys(response.module_stats).length} providers`);
   *
   * @example
   * // Filter by location and price range
   * const servers = await sdk.getAllDedicatedServers({
   *   location_id: '1',
   *   min_price: 50,
   *   max_price: 200,
   *   sort_by: 'price',
   *   sort_order: 'asc'
   * });
   *
   * @example
   * // Get servers from specific module only
   * const hostapiServers = await sdk.getAllDedicatedServers({
   *   module: 'hostapi-dedicated'
   * });
   */
  async getAllDedicatedServers(filters?: DedicatedServerFilters): Promise<DedicatedServerResponse> {
    const params: any = {};
    if (filters?.location_id) params.location_id = filters.location_id;
    if (filters?.min_price) params.min_price = filters.min_price;
    if (filters?.max_price) params.max_price = filters.max_price;
    if (filters?.module) params.module = filters.module;
    if (filters?.sort_by) params.sort_by = filters.sort_by;
    if (filters?.sort_order) params.sort_order = filters.sort_order;

    const response = await this.client.get<DedicatedServerResponse>('/dedicated-servers/all', { params });
    return response.data;
  }

  // ==================== DYNAMIC PRODUCTS / MODULES ====================

  /**
   * Get products from a specific module
   *
   * @param moduleName - The module name (e.g., 'hostapi-dedicated', 'fireapi-vps')
   * @param filters - Optional filters for location, price, etc.
   *
   * @example
   * // Get all products from HostAPI module
   * const products = await sdk.getModuleProducts('hostapi-dedicated');
   *
   * @example
   * // Get products with filters
   * const products = await sdk.getModuleProducts('hostapi-dedicated', {
   *   location_id: '1',
   *   min_price: 100
   * });
   */
  async getModuleProducts(moduleName: string, filters?: ModuleProductFilters): Promise<ModuleProduct[]> {
    const params: any = {};
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) {
          params[key] = filters[key];
        }
      });
    }

    const response = await this.client.get<ApiResponse<ModuleProduct[]>>(`/modules/${moduleName}/products`, { params });
    return response.data.data || [];
  }

  /**
   * Get single product from a module
   *
   * @param moduleName - The module name
   * @param productId - The product ID from the module
   *
   * @example
   * const product = await sdk.getModuleProduct('hostapi-dedicated', 'prod_12345');
   */
  async getModuleProduct(moduleName: string, productId: string | number): Promise<ModuleProduct> {
    const response = await this.client.get<ApiResponse<ModuleProduct>>(`/modules/${moduleName}/products/${productId}`);
    return response.data.data!;
  }

  /**
   * Validate a module product before purchase
   *
   * @param moduleName - The module name
   * @param productId - The product ID to validate
   *
   * @example
   * const validation = await sdk.validateModuleProduct('hostapi-dedicated', 'prod_12345');
   * if (validation.valid) {
   *   console.log('Product is valid and available for purchase');
   * }
   */
  async validateModuleProduct(moduleName: string, productId: string | number): Promise<ModuleValidationResult> {
    const response = await this.client.post<ApiResponse<ModuleValidationResult>>(`/modules/${moduleName}/products/validate`, {
      product_id: productId
    });
    return response.data.data!;
  }

  /**
   * Purchase a product from a module
   *
   * @param moduleName - The module name
   * @param purchaseData - Purchase configuration including product ID, type, and deployment config
   *
   * @example
   * // Purchase a dedicated server with prepaid billing
   * const order = await sdk.purchaseModuleProduct('hostapi-dedicated', {
   *   product_id: 'prod_12345',
   *   product_type_id: 4,
   *   deployment_config: {
   *     hostname: 'server01.example.com',
   *     template: 'ubuntu-22'
   *   },
   *   runtime_group_id: 3,
   *   discount_code: 'SUMMER2025'
   * });
   *
   * @example
   * // Purchase with contract billing
   * const order = await sdk.purchaseModuleProduct('hostapi-dedicated', {
   *   product_id: 'prod_12345',
   *   product_type_id: 4,
   *   billing_mode: 'contract',
   *   billing_cycle_id: 2,
   *   sepa_mandate_id: 3
   * });
   */
  async purchaseModuleProduct(moduleName: string, purchaseData: ModulePurchaseRequest): Promise<any> {
    const response = await this.client.post<ApiResponse>(`/modules/${moduleName}/purchase`, purchaseData);
    return response.data.data;
  }

  /**
   * Get available locations for a module
   *
   * @param moduleName - The module name
   *
   * @example
   * const locations = await sdk.getModuleLocations('hostapi-dedicated');
   * locations.forEach(loc => console.log(loc.name, loc.country));
   */
  async getModuleLocations(moduleName: string): Promise<ModuleLocation[]> {
    const response = await this.client.get<ApiResponse<ModuleLocation[]>>(`/modules/${moduleName}/locations`);
    return response.data.data || [];
  }

  // ==================== CONTRACTS ====================

  /**
   * Get all contracts for the customer
   *
   * @param filters - Optional status filter
   *
   * @example
   * // Get all contracts
   * const contracts = await sdk.getContracts();
   *
   * @example
   * // Get only active contracts
   * const activeContracts = await sdk.getContracts({ status: 'active' });
   */
  async getContracts(filters?: { status?: 'active' | 'cancelled' | 'pending_cancellation' }): Promise<Contract[]> {
    const params: any = {};
    if (filters?.status) params.status = filters.status;

    const response = await this.client.get<ApiResponse<Contract[]>>('/contracts', { params });
    return response.data.data || [];
  }

  /**
   * Get single contract by ID
   *
   * @param id - Contract ID
   *
   * @example
   * const contract = await sdk.getContract(123);
   * console.log('Next billing:', contract.next_billing_date);
   */
  async getContract(id: number): Promise<Contract> {
    const response = await this.client.get<ApiResponse<Contract>>(`/contracts/${id}`);
    return response.data.data!;
  }

  /**
   * Create a new contract (order with contract billing)
   *
   * @param contractData - Contract configuration including package/config ID, billing cycle, etc.
   *
   * @example
   * // Create contract for a package with variable groups
   * const contract = await sdk.createContract({
   *   package_id: 1,
   *   billing_cycle_id: 2, // Monthly
   *   betriebssystem: 'ubuntu-2210',
   *   speicher: '1tb-ssd',
   *   discount_code: 'PROMO',
   *   sepa_mandate_id: 3
   * });
   */
  async createContract(contractData: CreateContractRequest): Promise<any> {
    const response = await this.client.post<ApiResponse>('/orders', {
      type: contractData.package_id ? 'package' : 'configuration',
      billing_mode: 'contract',
      ...contractData
    });
    return response.data.data;
  }

  /**
   * Cancel a contract
   *
   * @param id - Contract ID
   *
   * @example
   * await sdk.cancelContract(123);
   */
  async cancelContract(id: number): Promise<ApiResponse> {
    const response = await this.client.post(`/contracts/${id}/cancel`);
    return response.data;
  }

  /**
   * Reactivate a cancelled contract
   *
   * @param id - Contract ID
   *
   * @example
   * await sdk.reactivateContract(123);
   */
  async reactivateContract(id: number): Promise<ApiResponse> {
    const response = await this.client.post(`/contracts/${id}/reactivate`);
    return response.data;
  }

  /**
   * Convert a prepaid product to contract billing
   *
   * @param productId - Customer product ID
   * @param billingCycleId - Billing cycle ID for the contract
   *
   * @example
   * // Convert to monthly contract
   * const contract = await sdk.convertProductToContract(456, 2);
   */
  async convertProductToContract(productId: number, billingCycleId: number): Promise<Contract> {
    const response = await this.client.post<ApiResponse<Contract>>(`/products/${productId}/convert-to-contract`, {
      billing_cycle_id: billingCycleId
    });
    return response.data.data!;
  }

  /**
   * Update contract auto-renewal setting
   *
   * @param id - Contract ID
   * @param enabled - Enable or disable auto-renewal
   *
   * @example
   * // Enable auto-renewal
   * await sdk.updateContractAutoRenewal(123, true);
   */
  async updateContractAutoRenewal(id: number, enabled: boolean): Promise<ApiResponse> {
    const response = await this.client.put(`/contracts/${id}/auto-renewal`, { enabled });
    return response.data;
  }

  /**
   * Update SEPA mandate for a contract
   *
   * @param id - Contract ID
   * @param sepaMandateId - SEPA mandate ID (or null to remove)
   *
   * @example
   * // Assign SEPA mandate to contract
   * await sdk.updateContractSepaMandate(123, 5);
   *
   * @example
   * // Remove SEPA mandate
   * await sdk.updateContractSepaMandate(123, null);
   */
  async updateContractSepaMandate(id: number, sepaMandateId: number | null): Promise<ApiResponse> {
    const response = await this.client.put(`/contracts/${id}/sepa-mandate`, { sepa_mandate_id: sepaMandateId });
    return response.data;
  }

  /**
   * Convert contract to prepaid (one-time payment) billing
   *
   * @param id - Contract ID
   *
   * @example
   * await sdk.convertContractToPrepaid(123);
   */
  async convertContractToPrepaid(id: number): Promise<ApiResponse> {
    const response = await this.client.post(`/contracts/${id}/convert-to-prepaid`);
    return response.data;
  }

  /**
   * Get contract settings and available billing cycles
   *
   * @example
   * const settings = await sdk.getContractSettings();
   * console.log('Available billing cycles:', settings.billing_cycles);
   */
  async getContractSettings(): Promise<ContractSettings> {
    const response = await this.client.get<ApiResponse<ContractSettings>>('/contract-settings');
    return response.data.data!;
  }

  /**
   * Get available billing cycles
   *
   * @example
   * const cycles = await sdk.getBillingCycles();
   * cycles.forEach(cycle => console.log(cycle.name, cycle.months));
   */
  async getBillingCycles(): Promise<BillingCycle[]> {
    const response = await this.client.get<ApiResponse<BillingCycle[]>>('/contract-settings/billing-cycles');
    return response.data.data || [];
  }

  // ==================== SEPA MANDATES ====================

  /**
   * Get all SEPA mandates for the customer
   *
   * @param status - Optional status filter
   *
   * @example
   * // Get all SEPA mandates
   * const mandates = await sdk.getSepaMandates();
   *
   * @example
   * // Get only active mandates
   * const activeMandates = await sdk.getSepaMandates('active');
   */
  async getSepaMandates(status?: 'active' | 'pending' | 'cancelled' | 'expired'): Promise<SepaMandate[]> {
    const params: any = {};
    if (status) params.status = status;

    const response = await this.client.get<ApiResponse<SepaMandate[]>>('/sepa-mandates', { params });
    return response.data.data || [];
  }

  /**
   * Get single SEPA mandate by ID
   *
   * @param id - SEPA mandate ID
   *
   * @example
   * const mandate = await sdk.getSepaMandate(123);
   * console.log('IBAN:', mandate.iban);
   */
  async getSepaMandate(id: number): Promise<SepaMandate> {
    const response = await this.client.get<ApiResponse<SepaMandate>>(`/sepa-mandates/${id}`);
    return response.data.data!;
  }

  /**
   * Create a new SEPA mandate
   *
   * @param mandateData - SEPA mandate data including IBAN, BIC, and account holder
   *
   * @example
   * const mandate = await sdk.createSepaMandate({
   *   iban: 'DE89370400440532013000',
   *   bic: 'COBADEFFXXX',
   *   account_holder: 'Max Mustermann',
   *   is_default: true
   * });
   */
  async createSepaMandate(mandateData: CreateSepaMandateRequest): Promise<SepaMandate> {
    const response = await this.client.post<ApiResponse<SepaMandate>>('/sepa-mandates', mandateData);
    return response.data.data!;
  }

  /**
   * Cancel a SEPA mandate
   *
   * @param id - SEPA mandate ID
   *
   * @example
   * await sdk.cancelSepaMandate(123);
   */
  async cancelSepaMandate(id: number): Promise<ApiResponse> {
    const response = await this.client.post(`/sepa-mandates/${id}/cancel`);
    return response.data;
  }

  /**
   * Validate an IBAN
   *
   * @param iban - IBAN to validate
   *
   * @example
   * const result = await sdk.validateIban('DE89370400440532013000');
   * if (result.valid) {
   *   console.log('Valid IBAN from:', result.country, result.bank_name);
   * }
   */
  async validateIban(iban: string): Promise<IbanValidationResult> {
    const response = await this.client.post<ApiResponse<IbanValidationResult>>('/sepa-mandates/validate-iban', { iban });
    return response.data.data!;
  }

  // ==================== FAILED PAYMENTS ====================

  /**
   * Get all failed payments for the customer
   *
   * @param status - Optional status filter
   *
   * @example
   * // Get all failed payments
   * const failedPayments = await sdk.getFailedPayments();
   *
   * @example
   * // Get only pending failed payments
   * const pending = await sdk.getFailedPayments('pending');
   */
  async getFailedPayments(status?: 'pending' | 'retrying' | 'resolved' | 'abandoned'): Promise<FailedPayment[]> {
    const params: any = {};
    if (status) params.status = status;

    const response = await this.client.get<ApiResponse<FailedPayment[]>>('/failed-payments', { params });
    return response.data.data || [];
  }

  /**
   * Retry a failed payment
   *
   * @param id - Failed payment ID
   *
   * @example
   * await sdk.retryFailedPayment(123);
   */
  async retryFailedPayment(id: number): Promise<ApiResponse> {
    const response = await this.client.post(`/failed-payments/${id}/retry`);
    return response.data;
  }

  /**
   * Mark a failed payment as resolved (manual resolution)
   *
   * @param id - Failed payment ID
   *
   * @example
   * await sdk.resolveFailedPayment(123);
   */
  async resolveFailedPayment(id: number): Promise<ApiResponse> {
    const response = await this.client.post(`/failed-payments/${id}/resolve`);
    return response.data;
  }

  // ==================== NEWSLETTER ====================

  /**
   * Subscribe to newsletter category
   *
   * @param category - Newsletter category slug ('general' or 'maintenance')
   *
   * @example
   * // Subscribe to general newsletter
   * await sdk.subscribeToNewsletter('general');
   *
   * @example
   * // Subscribe to maintenance newsletter
   * await sdk.subscribeToNewsletter('maintenance');
   */
  async subscribeToNewsletter(category: 'general' | 'maintenance'): Promise<ApiResponse> {
    const response = await this.client.post('/newsletter/subscribe', { category });
    return response.data;
  }

  /**
   * Unsubscribe from newsletter using token
   *
   * @param token - Unsubscribe token from email
   * @param category - Newsletter category slug ('general', 'maintenance', or 'all')
   *
   * @example
   * // Unsubscribe from general newsletter
   * await sdk.unsubscribeFromNewsletter('abc123token', 'general');
   *
   * @example
   * // Unsubscribe from all newsletters
   * await sdk.unsubscribeFromNewsletter('abc123token', 'all');
   */
  async unsubscribeFromNewsletter(token: string, category: 'general' | 'maintenance' | 'all'): Promise<ApiResponse> {
    const response = await this.client.post('/newsletter/unsubscribe', { token, category });
    return response.data;
  }

  /**
   * Get newsletter subscription status (requires authentication)
   *
   * @example
   * const status = await sdk.getNewsletterSubscriptionStatus();
   * console.log('General:', status.general, 'Maintenance:', status.maintenance);
   */
  async getNewsletterSubscriptionStatus(): Promise<NewsletterSubscriptionStatus> {
    const response = await this.client.get<ApiResponse<NewsletterSubscriptionStatus>>('/newsletter/status');
    return response.data.data!;
  }

  /**
   * Get available newsletter categories (public endpoint)
   *
   * @example
   * const categories = await sdk.getNewsletterCategories();
   * categories.forEach(cat => console.log(cat.name, cat.slug));
   */
  async getNewsletterCategories(): Promise<NewsletterCategory[]> {
    const response = await this.client.get<ApiResponse<NewsletterCategory[]>>('/newsletter/categories');
    return response.data.data!;
  }

  // ========================================
  // Result-based convenience methods
  // These methods return Result<T> for better error handling
  // ========================================

  /**
   * Login with Result wrapper (no exceptions thrown)
   *
   * @example
   * const result = await sdk.tryLogin({ email: 'user@example.com', password: 'secret' });
   *
   * if (result.isSuccess()) {
   *   const token = result.getData();
   *   console.log('Login successful:', token);
   * } else {
   *   const error = result.getError();
   *   console.error('Login failed:', error.message);
   *   if (error.isValidationError()) {
   *     console.log('Validation errors:', error.getValidationErrors());
   *   }
   * }
   */
  async tryLogin(credentials: LoginCredentials): Promise<import('./helpers').Result<string>> {
    const { Result, HostForgeError } = await import('./helpers');
    try {
      const token = await this.login(credentials);
      return Result.ok(token);
    } catch (error) {
      if (error instanceof HostForgeError) {
        return Result.fail(error);
      }
      return Result.fail(new HostForgeError(error instanceof Error ? error.message : 'Login failed'));
    }
  }

  /**
   * Initiate deposit with Result wrapper
   *
   * @example
   * const result = await sdk.tryInitiateDeposit(50.00, 1, 'https://mysite.com/return');
   *
   * result
   *   .onSuccess(data => window.location.href = data.payment_url)
   *   .onFailure(error => alert(error.message));
   */
  async tryInitiateDeposit(
    amount: number,
    paymentMethodId: number,
    returnUrl: string
  ): Promise<import('./helpers').Result<{ payment_url: string; transaction_id: number; reference: string; amount: number }>> {
    const { Result, HostForgeError } = await import('./helpers');
    try {
      const data = await this.initiateDeposit(amount, paymentMethodId, returnUrl);
      return Result.ok(data);
    } catch (error) {
      if (error instanceof HostForgeError) {
        return Result.fail(error);
      }
      return Result.fail(new HostForgeError(error instanceof Error ? error.message : 'Deposit initiation failed'));
    }
  }

  /**
   * Check domain availability with Result wrapper
   *
   * @example
   * const [error, result] = await safe(sdk.tryCheckDomainAvailability('example.com'));
   *
   * if (error) {
   *   console.error('Failed to check domain:', error.message);
   * } else if (result.isSuccess()) {
   *   const domain = result.getData();
   *   if (domain.available) {
   *     console.log('Domain is available! Price:', domain.price);
   *   }
   * }
   */
  async tryCheckDomainAvailability(domain: string, provider?: string): Promise<import('./helpers').Result<DomainCheckResult>> {
    const { Result, HostForgeError } = await import('./helpers');
    try {
      const data = await this.checkDomainAvailability(domain, provider);
      return Result.ok(data);
    } catch (error) {
      if (error instanceof HostForgeError) {
        return Result.fail(error);
      }
      return Result.fail(new HostForgeError(error instanceof Error ? error.message : 'Domain check failed'));
    }
  }

  /**
   * Start a product with Result wrapper
   *
   * @example
   * const result = await sdk.tryStartProduct(123);
   *
   * result.onSuccess(() => {
   *   console.log('Server start command queued');
   * }).onFailure(error => {
   *   if (error.code === 422) {
   *     alert('Cannot start server in current status');
   *   }
   * });
   */
  async tryStartProduct(productId: number): Promise<import('./helpers').Result<{ success: boolean; message: string; product_id: number }>> {
    const { Result, HostForgeError } = await import('./helpers');
    try {
      const data = await this.startProduct(productId);
      return Result.ok(data);
    } catch (error) {
      if (error instanceof HostForgeError) {
        return Result.fail(error);
      }
      return Result.fail(new HostForgeError(error instanceof Error ? error.message : 'Failed to start product'));
    }
  }

  /**
   * Get customer products with automatic retry on failure
   *
   * @example
   * const products = await sdk.getCustomerProductsWithRetry(3, 2000);
   */
  async getCustomerProductsWithRetry(maxAttempts: number = 3, delayMs: number = 1000): Promise<CustomerProduct[]> {
    const { retry } = await import('./helpers');
    return retry(() => this.getCustomerProducts(), maxAttempts, delayMs);
  }

  /**
   * Wait for deposit to complete (polling)
   *
   * @example
   * try {
   *   const deposit = await sdk.initiateDeposit(50, 1, 'https://...');
   *   // ... redirect user to payment ...
   *
   *   // Poll for completion (max 5 minutes)
   *   const transaction = await sdk.waitForDepositCompletion(
   *     deposit.reference,
   *     { timeoutMs: 300000, intervalMs: 5000 }
   *   );
   *
   *   if (transaction.status === 'completed') {
   *     console.log('Payment received!');
   *   }
   * } catch (error) {
   *   console.error('Timeout or error:', error);
   * }
   */
  async waitForDepositCompletion(
    referenceId: string,
    options: { intervalMs?: number; timeoutMs?: number } = {}
  ): Promise<any> {
    const { poll } = await import('./helpers');
    return poll(
      () => this.getDepositStatus(referenceId),
      (transaction) => transaction.status === 'completed' || transaction.status === 'failed',
      options
    );
  }

  /**
   * Bulk operation: Start multiple products
   *
   * @example
   * const productIds = [1, 2, 3, 4, 5];
   * const results = await sdk.startProductsBatch(productIds, 2); // max 2 concurrent
   * console.log(`Started ${results.length} products`);
   */
  async startProductsBatch(productIds: number[], concurrency: number = 3): Promise<any[]> {
    const { batchProcess } = await import('./helpers');
    return batchProcess(
      productIds,
      (id) => this.startProduct(id),
      concurrency
    );
  }

  /**
   * Safe wrapper for any SDK method - returns [error, data] tuple
   *
   * @example
   * const [error, products] = await sdk.safe(() => sdk.getCustomerProducts());
   *
   * if (error) {
   *   console.error('Failed:', error.message);
   *   return;
   * }
   *
   * console.log('Products:', products);
   */
  async safe<T>(fn: () => Promise<T>): Promise<[null, T] | [import('./helpers').HostForgeError, null]> {
    const { safe } = await import('./helpers');
    return safe(fn);
  }
}

// Factory function for easy initialization
export function createHostForgeClient(config: HostForgeConfig): HostForgeSDK {
  return new HostForgeSDK(config);
}

export default HostForgeSDK;
