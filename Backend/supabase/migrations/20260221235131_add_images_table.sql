create table images (
  id bigint generated always as identity primary key,
  image_name text not null,
  public_url text not null,
  created_at timestamp with time zone default now()
);