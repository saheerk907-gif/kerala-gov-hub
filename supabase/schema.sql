-- ============================================================
-- Kerala Gov Employee Hub — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. GOVERNMENT ORDERS TABLE
CREATE TABLE government_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ml TEXT NOT NULL,              -- Malayalam title
  title_en TEXT,                        -- English title (optional)
  go_number TEXT NOT NULL,              -- e.g., "G.O.(P) No.135/2025/Fin"
  go_date DATE NOT NULL,               -- Date of the GO
  category TEXT NOT NULL DEFAULT 'general', -- da, bonus, leave, medisep, pension, pay, nps, gpf, sli, gis, general
  description_ml TEXT,                  -- Detailed description in Malayalam
  description_en TEXT,                  -- English description (optional)
  pdf_url TEXT,                         -- Link to PDF document
  source_url TEXT,                      -- Link to official source
  is_published BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,      -- Pin important orders to top
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCHEMES TABLE (MEDISEP, GPF, NPS, SLI, GIS, KSR)
CREATE TABLE schemes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,            -- e.g., "medisep", "gpf", "nps"
  title_ml TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_en TEXT,                     -- Short English subtitle
  icon TEXT DEFAULT '📄',
  description_ml TEXT NOT NULL,
  color TEXT DEFAULT 'blue',            -- blue, green, orange, purple, teal, pink
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SCHEME DETAILS (expandable bullet points for each scheme)
CREATE TABLE scheme_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
  label TEXT NOT NULL,                  -- Bold label like "കവറേജ്"
  content_ml TEXT NOT NULL,             -- Malayalam content
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SCHEME TAGS
CREATE TABLE scheme_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
  tag_ml TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 5. QUICK LINKS
CREATE TABLE quick_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ml TEXT NOT NULL,
  title_en TEXT,
  url TEXT NOT NULL,
  icon TEXT DEFAULT '🔗',
  color TEXT DEFAULT 'blue',
  description TEXT,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE STATS
CREATE TABLE site_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label_ml TEXT NOT NULL,
  value INT NOT NULL,
  suffix TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

-- 7. HIGHLIGHT CARDS (Benefits section)
CREATE TABLE highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ml TEXT NOT NULL,
  description_ml TEXT NOT NULL,
  icon TEXT DEFAULT '📋',
  color TEXT DEFAULT 'green',
  is_full_width BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. HIGHLIGHT TAGS
CREATE TABLE highlight_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  highlight_id UUID REFERENCES highlights(id) ON DELETE CASCADE,
  tag_ml TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 9. UPLOADED FILES (PDFs, documents)
CREATE TABLE uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INT,
  mime_type TEXT DEFAULT 'application/pdf',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_orders_category ON government_orders(category);
CREATE INDEX idx_orders_date ON government_orders(go_date DESC);
CREATE INDEX idx_orders_published ON government_orders(is_published);
CREATE INDEX idx_schemes_slug ON schemes(slug);
CREATE INDEX idx_scheme_details_scheme ON scheme_details(scheme_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON government_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER schemes_updated_at BEFORE UPDATE ON schemes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE government_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlight_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read orders" ON government_orders FOR SELECT USING (is_published = true);
CREATE POLICY "Public read schemes" ON schemes FOR SELECT USING (is_published = true);
CREATE POLICY "Public read scheme_details" ON scheme_details FOR SELECT USING (true);
CREATE POLICY "Public read scheme_tags" ON scheme_tags FOR SELECT USING (true);
CREATE POLICY "Public read quick_links" ON quick_links FOR SELECT USING (is_published = true);
CREATE POLICY "Public read stats" ON site_stats FOR SELECT USING (true);
CREATE POLICY "Public read highlights" ON highlights FOR SELECT USING (is_published = true);
CREATE POLICY "Public read highlight_tags" ON highlight_tags FOR SELECT USING (true);
CREATE POLICY "Public read files" ON uploaded_files FOR SELECT USING (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin all orders" ON government_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all schemes" ON schemes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all scheme_details" ON scheme_details FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all scheme_tags" ON scheme_tags FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all quick_links" ON quick_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all stats" ON site_stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all highlights" ON highlights FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all highlight_tags" ON highlight_tags FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all files" ON uploaded_files FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET FOR PDF UPLOADS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public read documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Auth upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — Real Kerala Government Orders
-- ============================================================

-- Stats
INSERT INTO site_stats (label_ml, value, suffix, sort_order) VALUES
  ('സജീവ ജീവനക്കാർ', 500000, '+', 1),
  ('മെഡിസെപ് ഗുണഭോക്താക്കൾ', 30, ' ലക്ഷം+', 2),
  ('മെഡിസെപ് ചികിത്സകൾ', 1920, '+', 3),
  ('എംപാനൽ ആശുപത്രികൾ', 480, '+', 4);

-- Schemes
INSERT INTO schemes (slug, title_ml, title_en, subtitle_en, icon, description_ml, color, sort_order) VALUES
  ('ksr', 'കേരള സർവ്വീസ് ചട്ടങ്ങൾ', 'Kerala Service Rules', 'KSR', '📜', 'നിയമനം, സ്ഥാനക്കയറ്റം, അവധി, ശമ്പളം, ബത്ത, പെരുമാറ്റ ചട്ടങ്ങൾ — KSR Part I, II, III ന്റെ സമ്പൂർണ്ണ വിവരങ്ങൾ.', 'blue', 1),
  ('medisep', 'മെഡിസെപ്', 'MEDISEP', 'Medical Insurance Scheme', '🏥', 'സംസ്ഥാന സർക്കാർ ജീവനക്കാർക്കും പെൻഷൻകാർക്കും കുടുംബാംഗങ്ങൾക്കുമുള്ള സമഗ്ര ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതി. ക്യാഷ്‌ലെസ് ചികിത്സ.', 'green', 2),
  ('gpf', 'ജി.പി.എഫ്', 'GPF', 'General Provident Fund', '🏦', '01.04.2013-ന് മുമ്പ് നിയമിതരായ ജീവനക്കാർക്കുള്ള നിർബന്ധിത സമ്പാദ്യ പദ്ധതി. ആകർഷകമായ പലിശ നിരക്കും നികുതി ആനുകൂല്യവും.', 'orange', 3),
  ('nps', 'എൻ.പി.എസ്', 'NPS', 'National Pension System', '📊', '01.04.2013-ന് ശേഷം ജോലിയിൽ പ്രവേശിച്ച ജീവനക്കാർക്കുള്ള ദേശീയ പെൻഷൻ പദ്ധതി. PFRDA നിയന്ത്രിതം.', 'purple', 4),
  ('sli', 'എസ്.എൽ.ഐ', 'SLI', 'State Life Insurance', '🛡️', 'സംസ്ഥാന ലൈഫ് ഇൻഷുറൻസ് — ജീവിത ഇൻഷുറൻസും സമ്പാദ്യ പദ്ധതിയും ഒന്നിച്ചു ചേർന്ന നിർബന്ധിത പദ്ധതി.', 'teal', 5),
  ('gis', 'ജി.ഐ.എസ്', 'GIS', 'Group Insurance Scheme', '🔒', 'ഗ്രൂപ്പ് ഇൻഷുറൻസ് പദ്ധതി — കുറഞ്ഞ പ്രീമിയത്തിൽ ജീവിത ഇൻഷുറൻസും സമ്പാദ്യ ഫണ്ടും നൽകുന്ന പദ്ധതി.', 'pink', 6);

-- Scheme Details for MEDISEP
INSERT INTO scheme_details (scheme_id, label, content_ml, sort_order) VALUES
  ((SELECT id FROM schemes WHERE slug='medisep'), 'കവറേജ്', '₹5 ലക്ഷം വരെ (Phase II), 1920+ ചികിത്സകൾ ഉൾപ്പെടുന്നു', 1),
  ((SELECT id FROM schemes WHERE slug='medisep'), 'അധിക കവറേജ്', 'ലിവർ ട്രാൻസ്പ്ലാന്റ് ₹18 ലക്ഷം, ഹൃദയ ട്രാൻസ്പ്ലാന്റ് ₹15 ലക്ഷം, ബോൺ മാരോ ₹17 ലക്ഷം', 2),
  ((SELECT id FROM schemes WHERE slug='medisep'), 'ഗുണഭോക്താക്കൾ', 'ജീവനക്കാരൻ, ഭാര്യ/ഭർത്താവ്, ആശ്രിത കുട്ടികൾ (25 വയസ്/ജോലി/വിവാഹം വരെ), ആശ്രിത മാതാപിതാക്കൾ', 3),
  ((SELECT id FROM schemes WHERE slug='medisep'), 'പ്രീമിയം', '₹500 പ്രതിമാസം ശമ്പളത്തിൽ നിന്ന് കുറവ് ചെയ്യുന്നു', 4),
  ((SELECT id FROM schemes WHERE slug='medisep'), 'ആശുപത്രികൾ', '480+ എംപാനൽ ആശുപത്രികൾ (143 സർക്കാർ ആശുപത്രികൾ ഉൾപ്പെടെ)', 5),
  ((SELECT id FROM schemes WHERE slug='medisep'), 'Phase II', 'G.O.(P) No.102/2025/Fin, 14-08-2025: രണ്ടാം ഘട്ടം അനുമതി', 6),
  ((SELECT id FROM schemes WHERE slug='medisep'), 'പോർട്ടൽ', 'medisep.kerala.gov.in | medisepkerala.in', 7);

-- Scheme Details for GPF
INSERT INTO scheme_details (scheme_id, label, content_ml, sort_order) VALUES
  ((SELECT id FROM schemes WHERE slug='gpf'), 'യോഗ്യത', '01.04.2013-ന് മുമ്പ് നിയമിതരായ എല്ലാ സ്ഥിര ജീവനക്കാരും', 1),
  ((SELECT id FROM schemes WHERE slug='gpf'), 'അംശദായം', 'അടിസ്ഥാന ശമ്പളത്തിന്റെ കുറഞ്ഞത് 6%; പരമാവധി അടിസ്ഥാന ശമ്പളം വരെ', 2),
  ((SELECT id FROM schemes WHERE slug='gpf'), 'പലിശ നിരക്ക്', '7.1% പ്രതിവർഷം (കേന്ദ്ര സർക്കാർ പരിഷ്കരിക്കുന്നു)', 3),
  ((SELECT id FROM schemes WHERE slug='gpf'), 'താൽക്കാലിക അഡ്വാൻസ്', 'ബാലൻസിന്റെ 75% വരെ (വിദ്യാഭ്യാസം, ചികിത്സ, ഭവന നിർമ്മാണം)', 4),
  ((SELECT id FROM schemes WHERE slug='gpf'), 'അന്തിമ പിൻവലിക്കൽ', 'വിരമിക്കുമ്പോഴോ മരണത്തിലോ മുഴുവൻ തുകയും', 5);

-- Scheme Details for KSR
INSERT INTO scheme_details (scheme_id, label, content_ml, sort_order) VALUES
  ((SELECT id FROM schemes WHERE slug='ksr'), 'KSR Part I', 'പൊതു ചട്ടങ്ങൾ: നിയമനം, പ്രൊബേഷൻ, സീനിയോറിറ്റി, സ്ഥാനക്കയറ്റം, സ്ഥലം മാറ്റം', 1),
  ((SELECT id FROM schemes WHERE slug='ksr'), 'KSR Part II', 'അവധി ചട്ടങ്ങൾ: ആർജിത അവധി, അർദ്ധ ശമ്പള അവധി, കമ്യൂട്ടഡ് ലീവ്, പ്രസവാവധി, പിതൃത്വ അവധി', 2),
  ((SELECT id FROM schemes WHERE slug='ksr'), 'KSR Part III', 'ശമ്പളവും ബത്തകളും: ശമ്പള നിർണ്ണയം, ഇൻക്രിമെന്റ്, ഡി.എ, എച്ച്.ആർ.എ, യാത്രാ ബത്ത', 3),
  ((SELECT id FROM schemes WHERE slug='ksr'), 'CCA ചട്ടങ്ങൾ', 'കേരള സിവിൽ സർവ്വീസസ് (ക്ലാസിഫിക്കേഷൻ, കൺട്രോൾ & അപ്പീൽ) ചട്ടങ്ങൾ', 4),
  ((SELECT id FROM schemes WHERE slug='ksr'), 'പെരുമാറ്റ ചട്ടങ്ങൾ', 'സർക്കാർ ജീവനക്കാരുടെ പെരുമാറ്റ ചട്ടങ്ങൾ 1960', 5),
  ((SELECT id FROM schemes WHERE slug='ksr'), 'പെൻഷൻ ചട്ടങ്ങൾ', 'KSR Part III (Pension): സ്റ്റാറ്റ്യൂട്ടറി പെൻഷൻ, കുടുംബ പെൻഷൻ', 6);

-- Scheme Details for NPS
INSERT INTO scheme_details (scheme_id, label, content_ml, sort_order) VALUES
  ((SELECT id FROM schemes WHERE slug='nps'), 'ജീവനക്കാരന്റെ വിഹിതം', 'അടിസ്ഥാന ശമ്പളം + DA-യുടെ 10%', 1),
  ((SELECT id FROM schemes WHERE slug='nps'), 'സർക്കാർ വിഹിതം', '14% (10%-ൽ നിന്ന് വർദ്ധിപ്പിച്ചത്)', 2),
  ((SELECT id FROM schemes WHERE slug='nps'), 'PRAN', 'സ്ഥിരം റിട്ടയർമെന്റ് അക്കൗണ്ട് നമ്പർ ഓരോ അംഗത്തിനും', 3),
  ((SELECT id FROM schemes WHERE slug='nps'), 'വിരമിക്കുമ്പോൾ', '60% തുക നികുതി രഹിതം; 40% ആന്വിറ്റി നിർബന്ധം', 4),
  ((SELECT id FROM schemes WHERE slug='nps'), 'നികുതി ആനുകൂല്യം', 'Section 80CCD(1), 80CCD(2), 80CCD(1B) - അധിക ₹50,000', 5);

-- Scheme Details for SLI
INSERT INTO scheme_details (scheme_id, label, content_ml, sort_order) VALUES
  ((SELECT id FROM schemes WHERE slug='sli'), 'കവറേജ്', 'ലൈഫ് ഇൻഷുറൻസ് + ബോണസ് ഉൾപ്പെടെ സമ്പാദ്യ ഘടകം', 1),
  ((SELECT id FROM schemes WHERE slug='sli'), 'പോളിസികൾ', 'സാധാരണ പോളിസി, 5 വർഷ പോളിസി, സ്പെഷ്യൽ പോളിസി', 2),
  ((SELECT id FROM schemes WHERE slug='sli'), 'ബോണസ്', 'വാർഷിക ബോണസ് പ്രഖ്യാപിക്കുന്നു, ഇൻഷ്വേർഡ് തുകയിൽ ചേർക്കും', 3),
  ((SELECT id FROM schemes WHERE slug='sli'), 'വായ്പ', '3 വർഷത്തിനു ശേഷം SLI പോളിസിക്ക് എതിരെ വായ്പ ലഭ്യം', 4),
  ((SELECT id FROM schemes WHERE slug='sli'), 'മരണ ആനുകൂല്യം', 'സേവനത്തിനിടയിൽ മരിച്ചാൽ മുഴുവൻ തുക + ബോണസ് നോമിനിക്ക്', 5);

-- Scheme Details for GIS
INSERT INTO scheme_details (scheme_id, label, content_ml, sort_order) VALUES
  ((SELECT id FROM schemes WHERE slug='gis'), 'ഘടകങ്ങൾ', 'ഇൻഷുറൻസ് ഫണ്ട് (70%) + സേവിംഗ്സ് ഫണ്ട് (30%)', 1),
  ((SELECT id FROM schemes WHERE slug='gis'), 'പ്രീമിയം', '₹120 (Group A), ₹60 (Group B), ₹30 (Group C & D) പ്രതിമാസം', 2),
  ((SELECT id FROM schemes WHERE slug='gis'), 'ഇൻഷുറൻസ് തുക', '₹1,20,000 (A), ₹60,000 (B), ₹30,000 (C & D) മരണത്തിൽ', 3),
  ((SELECT id FROM schemes WHERE slug='gis'), 'GPAIS 2026', 'ജീവൻ രക്ഷ പദ്ധതി: G.O.(P) No.143/2025/Fin — ₹15 ലക്ഷം ഇൻഷുറൻസ്', 4);

-- Scheme Tags
INSERT INTO scheme_tags (scheme_id, tag_ml, sort_order) VALUES
  ((SELECT id FROM schemes WHERE slug='ksr'), 'KSR Part I', 1),
  ((SELECT id FROM schemes WHERE slug='ksr'), 'KSR Part II', 2),
  ((SELECT id FROM schemes WHERE slug='ksr'), 'KSR Part III', 3),
  ((SELECT id FROM schemes WHERE slug='ksr'), 'CCA ചട്ടങ്ങൾ', 4),
  ((SELECT id FROM schemes WHERE slug='medisep'), '₹5 ലക്ഷം കവറേജ്', 1),
  ((SELECT id FROM schemes WHERE slug='medisep'), 'ക്യാഷ്‌ലെസ്', 2),
  ((SELECT id FROM schemes WHERE slug='medisep'), '480+ ആശുപത്രികൾ', 3),
  ((SELECT id FROM schemes WHERE slug='gpf'), 'പലിശ 7.1%', 1),
  ((SELECT id FROM schemes WHERE slug='gpf'), 'നികുതി ഇളവ്', 2),
  ((SELECT id FROM schemes WHERE slug='gpf'), 'വായ്പ സൗകര്യം', 3),
  ((SELECT id FROM schemes WHERE slug='nps'), 'PFRDA', 1),
  ((SELECT id FROM schemes WHERE slug='nps'), '14% സർക്കാർ വിഹിതം', 2),
  ((SELECT id FROM schemes WHERE slug='nps'), 'Tier I & II', 3),
  ((SELECT id FROM schemes WHERE slug='sli'), 'ലൈഫ് കവർ', 1),
  ((SELECT id FROM schemes WHERE slug='sli'), 'സമ്പാദ്യം', 2),
  ((SELECT id FROM schemes WHERE slug='sli'), 'ബോണസ്', 3),
  ((SELECT id FROM schemes WHERE slug='gis'), 'ഗ്രൂപ്പ് കവർ', 1),
  ((SELECT id FROM schemes WHERE slug='gis'), 'മരണ ആനുകൂല്യം', 2),
  ((SELECT id FROM schemes WHERE slug='gis'), 'സേവിംഗ്സ് ഫണ്ട്', 3);

-- Real Government Orders
INSERT INTO government_orders (title_ml, go_number, go_date, category, source_url, is_pinned) VALUES
  ('ക്ഷാമബത്ത 3% — 01/07/2023 മുതൽ', 'G.O.(P) No.15/2026/Fin', '2026-02-04', 'da', 'https://www.finance.kerala.gov.in', true),
  ('ജീവൻ രക്ഷ (GPAIS) 2026 — ₹15 ലക്ഷം ഇൻഷുറൻസ് പുതുക്കൽ', 'G.O.(P) No.143/2025/Fin', '2025-11-10', 'gis', 'https://www.finance.kerala.gov.in', true),
  ('ക്ഷാമബത്ത 4% — 01/01/2023 മുതൽ', 'G.O.(P) No.135/2025/Fin', '2025-10-30', 'da', 'https://www.finance.kerala.gov.in', false),
  ('പ്രത്യേക ഉത്സവബത്ത 2024-25 — പൊതുമേഖലാ ജീവനക്കാർ', 'G.O.(P) No.109/2025/Fin', '2025-08-28', 'bonus', 'https://www.finance.kerala.gov.in', false),
  ('ഓണം അഡ്വാൻസ് 2025 — അനുവദിച്ചു', 'G.O.(P) No.108/2025/Fin', '2025-08-26', 'bonus', 'https://www.finance.kerala.gov.in', false),
  ('ബോണസ് & പ്രത്യേക ഉത്സവബത്ത 2024-25', 'G.O.(P) No.107/2025/Fin', '2025-08-26', 'bonus', 'https://www.finance.kerala.gov.in', false),
  ('ക്ഷാമബത്ത 3% — 01/07/2022 മുതൽ', 'G.O.(P) No.105/2025/Fin', '2025-08-25', 'da', 'https://www.finance.kerala.gov.in', false),
  ('മെഡിസെപ് Phase II — അഡ്മിനിസ്‌ട്രേറ്റിവ് അനുമതി', 'G.O.(P) No.102/2025/Fin', '2025-08-14', 'medisep', 'https://www.finance.kerala.gov.in', true),
  ('പഠനാവധി — കാലതാമസം ഒഴിവാക്കൽ മാർഗ്ഗനിർദ്ദേശങ്ങൾ', 'Circular No.30/2025/Fin', '2025-04-05', 'leave', 'https://www.finance.kerala.gov.in', false),
  ('ആർജിത അവധി സറണ്ടർ 2025-26 — PF-ൽ ക്രെഡിറ്റ്', 'G.O.(P) No.29/2025/Fin', '2025-03-27', 'leave', 'https://www.finance.kerala.gov.in', false),
  ('ക്ഷാമബത്ത 3% — 01/01/2022 മുതൽ', 'G.O.(P) No.29/2025/Fin', '2025-03-20', 'da', 'https://www.finance.kerala.gov.in', false),
  ('ഭിന്നശേഷി കുട്ടികൾക്ക് സ്പെഷ്യൽ കാഷ്വൽ ലീവ് — ചട്ട ഭേദഗതി', 'G.O.(P) No.1/2025/Fin', '2025-01-01', 'leave', 'https://www.finance.kerala.gov.in', false);

-- Quick Links
INSERT INTO quick_links (title_ml, title_en, url, icon, color, description, sort_order) VALUES
  ('SPARK', 'SPARK', 'https://spark.gov.in', '⚡', 'blue', 'Service & Payroll Administrative Repository', 1),
  ('ഇ-ട്രഷറി', 'e-Treasury', 'https://treasury.kerala.gov.in', '🏛️', 'green', 'treasury.kerala.gov.in', 2),
  ('മെഡിസെപ്', 'MEDISEP Portal', 'https://medisep.kerala.gov.in', '🏥', 'orange', 'medisep.kerala.gov.in', 3),
  ('NPS / CRA', 'NPS CRA', 'https://www.npscra.nsdl.co.in', '📊', 'purple', 'npscra.nsdl.co.in', 4),
  ('ധനകാര്യ വകുപ്പ്', 'Finance Dept', 'https://www.finance.kerala.gov.in', '💼', 'teal', 'finance.kerala.gov.in', 5),
  ('SLI പോർട്ടൽ', 'SLI Portal', 'https://sli.kerala.gov.in', '🛡️', 'pink', 'sli.kerala.gov.in', 6),
  ('പെൻഷൻ പോർട്ടൽ', 'Pension Portal', 'https://pension.treasury.kerala.gov.in', '🧓', 'gold', 'pension.treasury.kerala.gov.in', 7),
  ('Kerala.gov.in', 'Kerala Portal', 'https://www.kerala.gov.in', '🌐', 'green', 'ഔദ്യോഗിക സർക്കാർ പോർട്ടൽ', 8);

-- Highlights
INSERT INTO highlights (title_ml, description_ml, icon, color, is_full_width, sort_order) VALUES
  ('പെൻഷനും വിരമിക്കൽ ആനുകൂല്യങ്ങളും', 'സ്റ്റാറ്റ്യൂട്ടറി പെൻഷൻ, കുടുംബ പെൻഷൻ, പെൻഷൻ കമ്യൂട്ടേഷൻ, DCRG, ടെർമിനൽ സറണ്ടർ ആനുകൂല്യങ്ങൾ.', '💰', 'green', false, 1),
  ('അവധി അവകാശങ്ങൾ', 'ആർജിത അവധി, അർദ്ധ ശമ്പള അവധി, കമ്യൂട്ടഡ് ലീവ്, കാഷ്വൽ ലീവ്, പ്രസവാവധി (180 ദിവസം), പിതൃത്വ അവധി (10 ദിവസം).', '📋', 'purple', false, 2),
  ('ശമ്പളവും ബത്തകളും', 'ശമ്പള പരിഷ്കരണ ഉത്തരവുകൾ, ക്ഷാമബത്ത, ഭവന വാടക ബത്ത, യാത്രാ ബത്ത, ഉത്സവ ബത്ത, ബോണസ് — എല്ലാ വിവരങ്ങളും.', '📈', 'teal', true, 3);

-- Highlight Tags
INSERT INTO highlight_tags (highlight_id, tag_ml, sort_order) VALUES
  ((SELECT id FROM highlights WHERE sort_order=1), 'സ്റ്റാറ്റ്യൂട്ടറി പെൻഷൻ', 1),
  ((SELECT id FROM highlights WHERE sort_order=1), 'കുടുംബ പെൻഷൻ', 2),
  ((SELECT id FROM highlights WHERE sort_order=1), 'DCRG', 3),
  ((SELECT id FROM highlights WHERE sort_order=1), 'കമ്യൂട്ടേഷൻ', 4),
  ((SELECT id FROM highlights WHERE sort_order=2), 'ആർജിത അവധി', 1),
  ((SELECT id FROM highlights WHERE sort_order=2), 'പ്രസവാവധി', 2),
  ((SELECT id FROM highlights WHERE sort_order=2), 'കാഷ്വൽ ലീവ്', 3),
  ((SELECT id FROM highlights WHERE sort_order=2), 'പഠനാവധി', 4),
  ((SELECT id FROM highlights WHERE sort_order=3), 'ശമ്പള പരിഷ്കരണം 2019', 1),
  ((SELECT id FROM highlights WHERE sort_order=3), 'DA ഉത്തരവുകൾ', 2),
  ((SELECT id FROM highlights WHERE sort_order=3), 'HRA', 3),
  ((SELECT id FROM highlights WHERE sort_order=3), 'ഉത്സവ ബത്ത', 4),
  ((SELECT id FROM highlights WHERE sort_order=3), 'ഓണം അഡ്വാൻസ്', 5);
