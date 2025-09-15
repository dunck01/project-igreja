// Export all services for easy importing
export { authService } from './authService';
export { eventService } from './eventService';
export { registrationService } from './registrationService';
export { configService } from './configService';
export { uploadService } from './uploadService';
export { httpClient } from './httpClient';

// Export types
export type { AuthUser, LoginCredentials } from './authService';
export type { EventsQuery, CreateEventData, UpdateEventData } from './eventService';
export type { RegistrationsQuery, CreateRegistrationData } from './registrationService';
export type { SiteConfig, ConfigsResponse, CreateConfigData } from './configService';
export type { Upload, UploadsQuery } from './uploadService';
export type { ApiResponse, PaginatedResponse } from './httpClient';
