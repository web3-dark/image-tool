## ADDED Requirements

### Requirement: Adjustable compression quality slider
The system SHALL provide a quality adjustment slider from 10% to 100%.

#### Scenario: Display quality slider
- **WHEN** image is loaded for processing
- **THEN** system displays quality slider with minimum 10%, maximum 100%, default 80%

#### Scenario: Adjust quality value
- **WHEN** user moves quality slider
- **THEN** system updates quality value display in real-time

#### Scenario: Direct quality input
- **WHEN** user can type in quality value field
- **THEN** system accepts numeric input 10-100 and validates input

### Requirement: Format-specific quality settings
The system SHALL support quality settings appropriate for each format.

#### Scenario: JPEG quality settings
- **WHEN** JPEG is selected as target format
- **THEN** system applies quality slider to JPEG compression (0-100 scale)

#### Scenario: PNG compression settings
- **WHEN** PNG is selected as target format
- **THEN** system provides lossless compression without quality slider (or treats as 100%)

#### Scenario: WebP quality settings
- **WHEN** WebP is selected as target format
- **THEN** system applies quality setting to WebP encoding

#### Scenario: AVIF quality settings
- **WHEN** AVIF is selected as target format
- **THEN** system applies quality setting to AVIF encoding

### Requirement: Quality presets
The system SHALL provide quick-select quality presets.

#### Scenario: Low quality preset
- **WHEN** user selects "Low" preset
- **THEN** system sets quality to 40%

#### Scenario: Medium quality preset
- **WHEN** user selects "Medium" preset
- **THEN** system sets quality to 70%

#### Scenario: High quality preset
- **WHEN** user selects "High" preset
- **THEN** system sets quality to 90%

#### Scenario: Custom quality option
- **WHEN** user selects "Custom" preset
- **THEN** system reveals quality slider for manual adjustment

### Requirement: Estimated output size
The system SHALL estimate output file size based on quality settings.

#### Scenario: Show estimated size
- **WHEN** quality slider moves
- **THEN** system displays estimated output file size

#### Scenario: Size comparison badge
- **WHEN** estimated size is calculated
- **THEN** system shows size reduction percentage compared to original

#### Scenario: Update estimate dynamically
- **WHEN** user adjusts quality or format
- **THEN** system updates estimated size estimate in real-time
