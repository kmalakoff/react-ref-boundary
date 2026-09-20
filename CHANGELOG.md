# Changelog

## [1.1.0] - 2026-09-20

### Fixed

- Keep boundary registrations stable across rerenders and make registration cleanup safe to call more than once.

### Changed

- BoundaryRef describes an object ref. RefContextType.addRef accepts object refs and exposes its cleanup function; callback refs are no longer accepted by its type.
- Boundary ref collections are readonly. TypeScript callers must inspect rather than mutate the registry.
- useRef accepts null initial values with corresponding nullable return types.
- Declare the existing React Hooks requirement as React >=16.8.0.
