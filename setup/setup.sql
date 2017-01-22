CREATE TABLE imageindex
(
    id serial primary key,
    filepath varchar(300) UNIQUE NOT NULL,
    date date,
    focallength double precision,
    aperture double precision,
    iso integer,
    lensmodel varchar(100),
    location varchar(200),
    cameramodel varchar(100)
);