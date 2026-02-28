-- Reference code: fetch and update cost by reference (anon-safe via RPC)

CREATE OR REPLACE FUNCTION get_cost_by_reference(p_ref_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'id', c.id,
    'school_id', c.school_id,
    'academic_year', c.academic_year,
    'grade_level', c.grade_level,
    'tuition_fee', c.tuition_fee,
    'food_fee', c.food_fee,
    'book_fee', c.book_fee,
    'uniform_fee', c.uniform_fee,
    'school_name', s.name,
    'city', s.city,
    'district', s.district,
    'address', s.address,
    'latitude', s.latitude,
    'longitude', s.longitude,
    'school_type', s.type
  ) INTO result
  FROM costs c
  JOIN schools s ON s.id = c.school_id
  WHERE c.reference_code = p_ref_code;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION update_cost_by_reference(
  p_ref_code TEXT,
  p_tuition_fee NUMERIC,
  p_food_fee NUMERIC DEFAULT NULL,
  p_book_fee NUMERIC DEFAULT NULL,
  p_uniform_fee NUMERIC DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_latitude NUMERIC DEFAULT NULL,
  p_longitude NUMERIC DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id UUID;
  v_updated INTEGER;
BEGIN
  SELECT school_id INTO v_school_id
  FROM costs
  WHERE reference_code = p_ref_code;

  IF v_school_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE costs SET
    tuition_fee = p_tuition_fee,
    food_fee = p_food_fee,
    book_fee = p_book_fee,
    uniform_fee = p_uniform_fee
  WHERE reference_code = p_ref_code;

  IF p_address IS NOT NULL OR p_latitude IS NOT NULL OR p_longitude IS NOT NULL THEN
    UPDATE schools SET
      address = COALESCE(p_address, address),
      latitude = COALESCE(p_latitude, latitude),
      longitude = COALESCE(p_longitude, longitude)
    WHERE id = v_school_id;
  END IF;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION get_cost_by_reference(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION update_cost_by_reference(TEXT, NUMERIC, NUMERIC, NUMERIC, NUMERIC, TEXT, NUMERIC, NUMERIC) TO anon;
