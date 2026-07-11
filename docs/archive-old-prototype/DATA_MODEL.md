# RideTune Data Model

## Data Principles

The data model must support growth without forcing the app to invent precision.

Every motorcycle setup recommendation depends on the quality of the underlying data. The app must distinguish between confirmed OEM values and estimated or incomplete records.

## Data Status

Every motorcycle version and relevant suspension setting should carry a data status:

- `confirmed`;
- `needs_review`;
- `estimated`;
- `community_submitted`;
- `deprecated`.

Display rules:

- `confirmed`: exact baseline values may be shown if present.
- `needs_review`: show directional guidance and warn the user.
- `estimated`: avoid exact clicks/turns unless clearly labelled as estimated.
- `community_submitted`: show a validation warning.
- `deprecated`: keep for old saved setups, but avoid recommending it as current data.

Warning copy:

> OEM values are not confirmed yet. Use this setup only as initial guidance.

Portuguese:

> Valores OEM ainda não confirmados. Usa este setup apenas como orientação inicial.

## Core Tables

### user_profiles

Stores user preferences.

Fields:

- id;
- display_name;
- language;
- preferred_units;
- preferred_theme;
- primary_user_bike_id;
- plan;
- created_at.

### brands

Fields:

- id;
- name;
- country;
- is_active;
- created_at.

### motorcycles

Fields:

- id;
- brand_id;
- model;
- category;
- is_active;
- is_pro_model;
- created_at.

Categories:

- adventure;
- trail;
- touring;
- sport_touring;
- naked;
- sport;
- cruiser;
- scooter;
- other.

### motorcycle_versions

Fields:

- id;
- motorcycle_id;
- year_start;
- year_end;
- version_name;
- market;
- electronic_suspension;
- semi_active_suspension;
- automatic_preload;
- data_status;
- notes;
- created_at.

### suspension_specs

One record per motorcycle version and suspension end.

Fields:

- id;
- version_id;
- end;
- suspension_type;
- travel_mm;
- recommended_sag_min_percent;
- recommended_sag_max_percent;
- spring_notes;
- data_status;
- source_id;
- created_at.

`end` values:

- fork;
- shock.

### suspension_adjusters

One record per available adjuster.

Fields:

- id;
- suspension_spec_id;
- kind;
- available;
- unit;
- min_value;
- max_value;
- baseline_value;
- direction;
- data_status;
- notes;
- created_at.

`kind` values:

- preload;
- rebound;
- compression;
- high_speed_compression;
- low_speed_compression.

`unit` values:

- clicks_out;
- turns;
- steps;
- mm;
- electronic_mode;
- not_applicable.

### oem_settings

Stores OEM setting profiles.

Fields:

- id;
- version_id;
- name;
- payload_kg;
- riding_mode;
- settings;
- data_status;
- source_id;
- created_at.

Examples:

- standard;
- comfort;
- sport;
- rider_luggage;
- rider_passenger;
- off_road.

### user_bikes

Fields:

- id;
- user_id;
- version_id;
- nickname;
- year;
- vin_last6;
- current_odometer_km;
- notes;
- created_at.

### load_profiles

Fields:

- id;
- user_id;
- name;
- rider_weight_kg;
- gear_weight_kg;
- passenger_enabled;
- passenger_weight_kg;
- side_cases_enabled;
- side_cases_weight_kg;
- top_case_enabled;
- top_case_weight_kg;
- extra_bag_enabled;
- extra_bag_weight_kg;
- total_payload_kg;
- created_at.

### setup_recommendations

Stores generated recommendation snapshots.

Fields:

- id;
- user_id;
- user_bike_id;
- load_profile_id;
- scenario;
- surface_type;
- riding_style;
- data_status_at_generation;
- recommendation;
- safety_warnings;
- created_at.

### saved_setups

Fields:

- id;
- user_id;
- user_bike_id;
- setup_recommendation_id;
- name;
- rider_notes;
- rider_feel;
- rating;
- validated_by_sag;
- photos;
- created_at;
- updated_at.

### sag_measurements

Fields:

- id;
- user_id;
- user_bike_id;
- load_profile_id;
- front_full_extension_mm;
- front_bike_only_mm;
- front_rider_mm;
- rear_full_extension_mm;
- rear_bike_only_mm;
- rear_rider_mm;
- front_static_sag_mm;
- front_rider_sag_mm;
- rear_static_sag_mm;
- rear_rider_sag_mm;
- front_rider_sag_percent;
- rear_rider_sag_percent;
- result_status;
- notes;
- measured_at.

### symptom_diagnostics

Fields:

- id;
- symptom_key;
- title_en;
- title_pt;
- possible_cause_en;
- possible_cause_pt;
- first_test_en;
- first_test_pt;
- if_worse_en;
- if_worse_pt;
- safety_rule_en;
- safety_rule_pt;
- required_adjusters;
- applies_to_surfaces;
- created_at.

### admin_sources

Fields:

- id;
- source_type;
- title;
- url;
- document_reference;
- confidence_level;
- notes;
- created_by;
- created_at.

### subscriptions

Fields:

- id;
- user_id;
- provider;
- provider_customer_id;
- plan;
- status;
- current_period_end;
- created_at.

## Electronic Suspension Support

When a motorcycle has electronic or semi-active suspension, the app should avoid mechanical click guidance unless the model also supports manual adjustment.

Recommendation examples:

- Select Rider + Luggage.
- Select Rider + Passenger.
- Enable Auto Preload, if available.
- Use Dynamic/Sport for a firmer feel.
- Use Road/Comfort for long-distance touring.
- Check that automatic preload is active.

## Recommendation Safety Rules

The engine must consider:

- total payload;
- rider base weight;
- gear weight;
- passenger;
- side cases;
- top case;
- extra bag;
- motorcycle category;
- suspension type;
- available adjusters;
- riding surface;
- preferred riding style;
- OEM data status.

General behavior:

- more payload means more rear preload and often more rear rebound control;
- passenger means stronger rear support and load-limit warnings;
- luggage means more rear support but preserve touring comfort;
- passenger plus luggage means heavier warnings and conservative testing guidance;
- bad surfaces should avoid excessive compression stiffness;
- sport/curves can allow firmer support;
- light off-road should prioritize traction and free suspension movement.

If data is incomplete, recommend direction and method, not exact values.

