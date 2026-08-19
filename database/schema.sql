-- Microservicio de Inventario - Esquema de base de datos
-- Motor: PostgreSQL (Supabase)

create table if not exists inventario (
  id uuid primary key default gen_random_uuid(),
  producto_id text not null unique,
  cantidad_disponible integer not null default 0 check (cantidad_disponible >= 0),
  cantidad_reservada integer not null default 0 check (cantidad_reservada >= 0),
  umbral_minimo integer not null default 0 check (umbral_minimo >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventario_producto_id on inventario (producto_id);

-- Mantiene updated_at al dia en cada UPDATE
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_inventario_updated_at on inventario;
create trigger trg_inventario_updated_at
  before update on inventario
  for each row
  execute function set_updated_at();

-- Funcion auxiliar: productos cuyo stock disponible esta en o por debajo del umbral minimo
create or replace function inventario_bajo_stock()
returns setof inventario as $$
  select * from inventario where cantidad_disponible <= umbral_minimo order by cantidad_disponible asc;
$$ language sql stable;

-- Datos de ejemplo para pruebas
insert into inventario (producto_id, cantidad_disponible, cantidad_reservada, umbral_minimo)
values
  ('PROD-001', 50, 5, 10),
  ('PROD-002', 3, 0, 10),
  ('PROD-003', 120, 20, 15)
on conflict (producto_id) do nothing;
