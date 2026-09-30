# JeevanMitra — Mastitis Early Warning (React + Supabase)

A React front end for early forecasting of bovine mastitis. Three logins —
Farmer, Veterinarian, Government official — see a shared herd, a
high-risk priority list, a per-cow detail page with 30-day trends, and a
monthly-statistics view across all 18 monitored parameters. English,
Tamil and Hindi are built in.

## Run it locally

```bash
npm install
npm run dev
```

Without any Supabase project configured, the app runs entirely on a
built-in 6-cow demo herd (3 no-risk, 1 moderate, 2 high risk), so you can
open it and click around immediately.

## Connect Supabase

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and fill in your project URL and anon key:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxx
   ```

3. Create the `readings` table (SQL editor in Supabase):

   ```sql
   create table readings (
     id bigint generated always as identity primary key,
     animal_id text not null,
     farm_id text not null,
     district text,
     breed text,
     age int,
     lactation int,
     vet_name text,
     vet_phone text,
     owner_name text,
     owner_phone text,
     recorded_at date not null,
     activity float8,
     posture float8,
     rumination float8,
     skin_temperature float8,
     udder_temperature float8,
     thermal_asymmetry float8,
     milk_yield float8,
     milk_flow float8,
     milk_conductivity float8,
     milk_temperature float8,
     milk_ph float8,
     activity_change float8,
     rumination_change float8,
     temperature_deviation float8,
     yield_change float8,
     conductivity_change float8,
     "pH_deviation" float8,
     historical_trend float8,
     scc float8
   );

   -- Adjust to your real access rules before going live; this just lets
   -- signed-in users read the herd.
   alter table readings enable row level security;
   create policy "read for authenticated users"
     on readings for select
     using (auth.role() = 'authenticated');
   ```

   One row per animal per reading (insert as often as your sensors report —
   daily is enough for the 30-day cow-detail charts). `scc`, `breed`, `age`
   and `lactation` are optional; leave them null if you don't have them yet.

4. (Optional) Real sign-in with roles: create a `profiles` table keyed by
   `auth.users.id` with a `role` column (`farmer` | `vet` | `gov`) and a
   `farm_id` for farmers, then create users in Supabase Auth. Without this
   table, the app trusts whichever role button the person picks on the
   login screen — fine for a demo, not for production.

   ```sql
   create table profiles (
     id uuid primary key references auth.users(id),
     role text not null check (role in ('farmer','vet','gov')),
     farm_id text
   );
   ```

5. (Optional) Persist veterinarian clinical outcomes in Supabase. Demo mode
   stores assessments in this browser; configured Supabase mode expects this
   table. The policy limits reads and inserts to veterinarian profiles.

   ```sql
   create table vet_assessments (
     id uuid primary key default gen_random_uuid(),
     animal_id text not null,
     farm_id text,
     vet_id uuid references auth.users(id),
     ai_risk_score float8 not null,
     ai_risk_category text not null,
     assessment jsonb not null,
     created_at timestamptz not null default now()
   );

   alter table vet_assessments enable row level security;
   create policy "vets read their farm assessments"
     on vet_assessments for select to authenticated
     using (exists (
       select 1 from profiles p
       where p.id = auth.uid() and p.role = 'vet'
         and (p.farm_id is null or p.farm_id = vet_assessments.farm_id)
     ));
   create policy "vets save their assessments"
     on vet_assessments for insert to authenticated
     with check (
       vet_id = auth.uid() and exists (
         select 1 from profiles p where p.id = auth.uid() and p.role = 'vet'
       )
     );
   ```

   Trend charts use `skin_temperature` as body temperature and `posture` as a
   rest proxy. Add `ambient_temperature` and `humidity` to sensor rows to
   enable those series; otherwise the controls are shown as unavailable.

6. (Optional) Persist appointment bookings in Supabase. Demo mode stores
   bookings in this browser. Create the table after `profiles` so farmers can
   book a cow and veterinarians can see farm appointments.

   ```sql
   create table vet_appointments (
     id uuid primary key default gen_random_uuid(),
     animal_id text not null,
     farm_id text not null,
     booked_by uuid not null references auth.users(id),
     appointment_at timestamptz not null unique,
     reason text not null default '',
     status text not null default 'Booked',
     created_at timestamptz not null default now()
   );

   alter table vet_appointments enable row level security;
   create policy "farmers and vets read appointments"
     on vet_appointments for select to authenticated
     using (
       booked_by = auth.uid() or exists (
         select 1 from profiles p
         where p.id = auth.uid() and p.role = 'vet'
           and (p.farm_id is null or p.farm_id = vet_appointments.farm_id)
       )
     );
   create policy "farmers book appointments for their farm"
     on vet_appointments for insert to authenticated
     with check (
       booked_by = auth.uid() and exists (
         select 1 from profiles p
         where p.id = auth.uid() and p.role = 'farmer'
           and p.farm_id = vet_appointments.farm_id
       )
     );
   create policy "farmers cancel their own appointments"
     on vet_appointments for update to authenticated
     using (
       booked_by = auth.uid() and status = 'Booked' and exists (
         select 1 from profiles p
         where p.id = auth.uid() and p.role = 'farmer'
           and p.farm_id = vet_appointments.farm_id
       )
     )
     with check (
       booked_by = auth.uid() and status = 'Cancelled' and exists (
         select 1 from profiles p
         where p.id = auth.uid() and p.role = 'farmer'
           and p.farm_id = vet_appointments.farm_id
       )
     );
   ```

## Where things live

- `src/lib/risk.js` — the 18 parameters, their groups/units, and the
  composite risk score (0–100, bucketed into No risk / Low / Moderate /
  High). Tune the score formula here once you have a trained model —
  swap it for a call to your ML service.
- `src/data/useReadings.js` — loads from Supabase if configured, otherwise
  falls back to `src/data/demoData.js`.
- `src/components/CowDetail.jsx` — the per-cow page. `KEY_CARD_KEYS` in
  `risk.js` controls which metrics show as the top-of-page key cards
  (currently udder temperature, SCC, conductivity, yield); the full
  18-parameter breakdown is always shown further down the page.
- `src/i18n.js` — English/Tamil/Hindi strings and parameter labels.

## Digital twin

Data loading is isolated in `useReadings.js`, so swapping in a live feed
or a realtime Supabase subscription later shouldn't require touching any
screen component.
