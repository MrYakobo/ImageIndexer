CREATE TABLE imageindex (
    id bigint NOT NULL,
    filepath text NOT NULL,
    focallength double precision,
    aperture double precision,
    iso integer,
    lensmodel text,
    location text,
    cameramodel text,
    date date
);