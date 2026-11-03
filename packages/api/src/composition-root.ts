import { createRedisClient } from "./lib/redis";
import { createSupabaseApiKeysRepository } from "./services/api-keys/supabase-api-keys-repository";
import { createSupabaseAvatarStorage } from "./services/avatars/supabase-avatar-storage";
import { noopCacheService } from "./services/cache/noop-cache-service";
import { createRedisCacheService } from "./services/cache/redis-cache-service";
import { createCoreCatalogService } from "./services/catalog/core-catalog-service";
import { noopRateLimitService } from "./services/ratelimit/noop-rate-limit-service";
import { createRedisRateLimitService } from "./services/ratelimit/redis-rate-limit-service";
import { createSupabaseUsersRepository } from "./services/users/supabase-users-repository";
import { createApiKeysUseCases } from "./use-cases/api-keys/api-keys";
import { createCompaniesUseCases } from "./use-cases/companies/companies";
import { createUsersUseCases } from "./use-cases/users/users";

// Composition root: the only place that picks implementations and wires
// adapters (`services/`) into use cases (`use-cases/`). One instance per warm
// serverless isolate, built on first import.

// Adapters
const redis = createRedisClient();
const cacheService = redis
  ? createRedisCacheService({ redis })
  : noopCacheService;
const rateLimitService = redis
  ? createRedisRateLimitService({ redis })
  : noopRateLimitService;
const apiKeysRepository = createSupabaseApiKeysRepository();
const catalogService = createCoreCatalogService();
const usersRepository = createSupabaseUsersRepository();
const avatarStorage = createSupabaseAvatarStorage();

// Use cases
export const apiKeysUseCases = createApiKeysUseCases({
  cacheService,
  rateLimitService,
  apiKeysRepository,
});

export const companiesUseCases = createCompaniesUseCases({
  catalogService,
});

export const usersUseCases = createUsersUseCases({
  usersRepository,
  avatarStorage,
  // Adapts the api-keys module to the port users owns.
  apiKeysRevoker: {
    revokeAllForUser: apiKeysUseCases.revokeUserApiKeysUseCase,
  },
});
