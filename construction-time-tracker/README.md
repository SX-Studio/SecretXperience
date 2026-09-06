# Site Time Tracker

A small, standalone time-tracking app for a construction company. Employees clock in and out
from their phone, pick the work site they are on, and optionally record the license plate of
the vehicle they drive that day. The two owners get an admin overview with totals, a chart,
statistics and a CSV export.

No names are stored anywhere. An employee is identified only by their mobile number.

The whole app is one file: `index.html`. It has no build step and no dependencies.

## What employees see

1. **Sign in** with their mobile number (no name asked, no password).
2. **Clock screen**
   - Work site: drop-down list managed by the admin, plus "Other location (type it yourself)".
   - License plate: optional, remembered for the next day.
   - Daily notes: optional free text, saved with the shift.
   - Big **START** / **STOP** button. The timer keeps running even when the phone is locked or
     the page is closed, because the start time is stored, not the elapsed time.
   - On **STOP** the app calculates the hours automatically: gross time minus the break
     (default 30 minutes, only for shifts longer than 6 hours; both are settings) and shows
     the counted hours plus the total for the day.
   - **Manual entry**: forgot to press start? Enter date, start and end time instead.
     The same break rule is applied.
3. **My hours**: this week, this month, and earlier entries with totals.

## What the admin sees (Admin tab, PIN protected)

- **On site now**: who is clocked in, where, since when.
- **Overview** for a period: Day, Week, week 1 to 4 of the current month, Month, or any
  custom date range. Filters by work site, mobile number and license plate.
- **Statistics**: total hours, shifts, days worked, employees, average per day, break time.
- **Chart**: hours per day, per employee, per site or per license plate.
- **Totals per employee** and a grand total.
- **Entries** table. Tap an entry to see its notes, gross time and break. Entries can be deleted.
- **Export CSV** of the filtered entries (semicolon separated, opens directly in Excel).
- **Work sites**: add and remove sites in the drop-down list.
- **Settings**: break rule, shared database, change the admin PIN.

The first time the Admin tab is opened, it asks to choose the PIN.

The app is in English and Dutch. The button in the top right switches language; it starts in
Dutch on phones set to Dutch.

## How to run it

**Simplest:** put `index.html` on any web host (GitHub Pages, Netlify, the company website,
a folder on a hosting package) and send the link to the employees. On the phone, open the link
and choose "Add to Home Screen" so it behaves like an app. Opening the file directly from the
phone's storage also works.

Data is stored in the browser of each phone. That is enough to try it out, but the owners
can then only see hours that were entered on their own phone. To see everyone's hours in one
place, switch on the shared database.

## Shared database (recommended for real use)

The app can store everything in a free [Supabase](https://supabase.com) project so that all
phones and the office share the same data.

1. Create a free Supabase account and a new project.
2. Open **SQL Editor**, paste the contents of `supabase-schema.sql`, and run it.
3. Open **Project Settings > API** and copy the **Project URL** and the **anon public** key.
4. In the app, go to **Admin > Settings > Shared database**, paste both values, and press
   "Save and reload". Do this on every phone (or send the employees the two values).
5. Set the admin PIN once. In shared mode the PIN and the break rule are stored in the database,
   so they are the same on every phone.

The anon key gives read and write access to the three tables, so anyone who has the key can
read all hours. Treat it like a company password: share it with employees only. If stricter
access control is ever needed, Supabase login and row-level policies can be added on top of
the same tables.

## Data stored per shift

| Field     | Meaning                                             |
|-----------|-----------------------------------------------------|
| phone     | Employee ID (mobile number). No name.               |
| site      | Work site from the list, or a typed location        |
| plate     | License plate of the vehicle that day (optional)    |
| start_at  | Clock-in time                                       |
| end_at    | Clock-out time (empty while still clocked in)       |
| break_min | Break deducted automatically, in minutes            |
| hours     | Counted hours: (end - start) minus the break        |
| notes     | Daily notes (optional)                              |
| manual    | True when entered by hand instead of start/stop     |

## Files

- `index.html`: the complete app.
- `supabase-schema.sql`: tables for the optional shared database.
- `README.md`: this file.

This project is independent of the SecretXperience website in the same repository. It shares
no code or styling with it and can be moved to its own repository as is.
