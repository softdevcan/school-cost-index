-- Seed data: 2026 benchmark schools (cold start)
-- Run after migrations

INSERT INTO schools (id, name, city, district, type, latitude, longitude) VALUES
	('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Özel İstanbul Koleji', 'İstanbul', 'Kadıköy', 'primary', 40.9923, 29.0234),
	('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Anadolu Lisesi', 'İstanbul', 'Beşiktaş', 'high', 41.0422, 29.0050),
	('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Güneş Anaokulu', 'Ankara', 'Çankaya', 'kindergarten', 39.9208, 32.8541),
	('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'Yıldız Ortaokulu', 'İzmir', 'Karşıyaka', 'middle', 38.4622, 27.0923),
	('e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'Bilge İlkokulu', 'İstanbul', 'Üsküdar', 'primary', 41.0224, 29.0137),
	('f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 'Marmara Koleji', 'İstanbul', 'Ataşehir', 'high', 40.9927, 29.1244),
	('a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d', 'Minik Kalpler Anaokulu', 'İstanbul', 'Şişli', 'kindergarten', 41.0608, 28.9877),
	('b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', 'Zafer Ortaokulu', 'Ankara', 'Yenimahalle', 'middle', 39.9667, 32.7833);

-- Sample costs (2026-2027, mix verified/unverified for testing)
INSERT INTO costs (school_id, academic_year, grade_level, tuition_fee, food_fee, book_fee, uniform_fee, is_verified, reference_code) VALUES
	('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '2026-2027', 1, 250000, 60000, 40000, 15000, true, 'ref-001-abc'),
	('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '2026-2027', 2, 240000, 58000, 38000, 12000, true, 'ref-002-def'),
	('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', '2026-2027', 9, 350000, 75000, 55000, 20000, true, 'ref-003-ghi'),
	('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', '2026-2027', 0, 100000, 45000, 15000, 8000, true, 'ref-004-jkl'),
	('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', '2026-2027', 5, 280000, 65000, 45000, 18000, true, 'ref-005-mno'),
	('e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', '2026-2027', 1, 245000, 62000, 42000, 14000, false, 'ref-006-pqr'),
	('f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', '2026-2027', 10, 340000, 72000, 50000, 19000, true, 'ref-007-stu'),
	('a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d', '2026-2027', 0, 95000, 42000, 14000, 7500, true, 'ref-008-vwx'),
	('b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', '2026-2027', 6, 275000, 64000, 44000, 17000, false, 'ref-009-yz1');
