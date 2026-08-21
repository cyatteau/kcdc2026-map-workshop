# City Explorer Workshop Data

The KCDC 2026 workshop uses curated local GeoJSON snapshots of historic places.

## Prepared cities

- Kansas City
- Chicago
- Seattle
- Washington, DC

## Common schema

Every workshop feature contains:

- `id`
- `name`
- `category`
- `description`
- Point geometry in WGS84 longitude/latitude coordinates

Some datasets also preserve useful source fields such as address, architect, construction date, designation date, status, or source ID.

## Workshop categories

The source datasets use different schemas, so the workshop files normalize features into these shared categories:

- Culture & Community
- Education & Religion
- Civic & Institutional
- Commercial & Industrial
- Residential

These categories are workshop classifications and are not necessarily official classifications from the source agencies.

## Sources

### Kansas City

Source dataset: **KC Register of Historic Places**

The workshop file was curated from the official Kansas City historic places dataset. Original polygon or multipolygon features used in the workshop were converted to representative points.

### Chicago

Source dataset: **Individual Landmarks**

The workshop file was curated from Chicago's official individual landmarks data. Original landmark geometries used in the workshop were converted to representative points when necessary.

### Seattle

Source dataset: **Landmarks**

The source data used EPSG:2926 coordinates. The workshop file reprojects those coordinates to WGS84 / EPSG:4326 so they can be used directly as standard GeoJSON in Leaflet.

### Washington, DC

Source dataset: **Historic Landmarks Points**

The workshop file was curated from the official historic landmarks point dataset.

## Data preparation

Raw source downloads should be stored in:

`data/raw/`

Normalized workshop-ready datasets should be stored in:

`data/cities/`

The workshop-ready files are:

- `kansas-city.geojson`
- `chicago.geojson`
- `seattle.geojson`
- `washington-dc.geojson`

The workshop application should load these local snapshots rather than depend on live data services during the session.
