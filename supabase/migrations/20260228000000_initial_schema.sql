-- School-Cost: Initial schema with reference code and verification

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Okullar Tablosu
CREATE TABLE schools (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	city TEXT NOT NULL,
	district TEXT NOT NULL,
	type TEXT CHECK (type IN ('kindergarten', 'primary', 'middle', 'high')),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maliyet Verileri (Anonim)
CREATE TABLE costs (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
	academic_year TEXT NOT NULL,
	grade_level INTEGER NOT NULL,
	tuition_fee NUMERIC(12, 2) NOT NULL,
	food_fee NUMERIC(12, 2),
	book_fee NUMERIC(12, 2),
	uniform_fee NUMERIC(12, 2),
	is_verified BOOLEAN DEFAULT FALSE,
	reference_code TEXT UNIQUE NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for search
CREATE INDEX idx_schools_city ON schools(city);
CREATE INDEX idx_schools_district ON schools(district);
CREATE INDEX idx_schools_type ON schools(type);
CREATE INDEX idx_costs_school_id ON costs(school_id);
CREATE INDEX idx_costs_verified ON costs(is_verified);
CREATE INDEX idx_costs_reference ON costs(reference_code);

-- RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;

-- Herkes okulları okuyabilir
CREATE POLICY "Public read schools" ON schools FOR SELECT USING (true);

-- Herkes okul ekleyebilir (anon)
CREATE POLICY "Public insert schools" ON schools FOR INSERT WITH CHECK (true);

-- Sadece onaylı maliyet verileri görülebilir
CREATE POLICY "Public read verified costs" ON costs FOR SELECT USING (is_verified = true);

-- Herkes maliyet ekleyebilir (anon)
CREATE POLICY "Public insert costs" ON costs FOR INSERT WITH CHECK (true);

-- Güncelleme: Server Action ile reference_code doğrulanarak yapılacak (service role)
