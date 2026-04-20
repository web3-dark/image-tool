## ADDED Requirements

### Requirement: Convert to JPEG format
The system SHALL convert images from PNG, GIF, WebP, and AVIF to JPEG format with quality adjustment.

#### Scenario: Convert PNG to JPEG
- **WHEN** user uploads PNG and selects JPEG as target format
- **THEN** system converts PNG to JPEG with selected quality level

#### Scenario: Convert GIF to JPEG
- **WHEN** user uploads GIF and selects JPEG as target format
- **THEN** system converts GIF to JPEG (uses first frame if animated)

#### Scenario: Maintain aspect ratio during conversion
- **WHEN** user converts between formats
- **THEN** system maintains original image dimensions and aspect ratio

### Requirement: Convert to PNG format
The system SHALL convert images from JPEG, GIF, WebP, and AVIF to PNG format.

#### Scenario: Convert JPEG to PNG
- **WHEN** user uploads JPEG and selects PNG as target format
- **THEN** system converts JPEG to PNG with full color depth

#### Scenario: Add transparency support
- **WHEN** user converts to PNG format
- **THEN** system supports transparency/alpha channel in PNG output

### Requirement: Convert to WebP format
The system SHALL convert images to WebP format when supported by browser.

#### Scenario: Convert to WebP
- **WHEN** user selects WebP as target format and browser supports it
- **THEN** system converts to WebP with quality settings applied

#### Scenario: WebP browser compatibility check
- **WHEN** system loads
- **THEN** system detects WebP support and enables/disables WebP option accordingly

### Requirement: Convert to AVIF format
The system SHALL support AVIF format conversion when browser and libraries support it.

#### Scenario: Convert to AVIF
- **WHEN** user selects AVIF as target format and support is available
- **THEN** system converts to AVIF format

#### Scenario: AVIF availability indicator
- **WHEN** AVIF is not supported
- **THEN** system disables AVIF option with explanation message

### Requirement: Support GIF format
The system SHALL support GIF as both input and output format.

#### Scenario: Upload GIF
- **WHEN** user uploads GIF file
- **THEN** system accepts GIF and displays it for processing

#### Scenario: Animated GIF handling
- **WHEN** user uploads animated GIF
- **THEN** system processes first frame for conversion (documents animation limitation)
