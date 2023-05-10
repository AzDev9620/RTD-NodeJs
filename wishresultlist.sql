 SELECT
  o.id
   ,o.elon
   ,o.images
   ,o.link
   ,o.t
   ,o.u
   ,o.elon->'maininfo'->>'importance' AS importance
   ,o.elon->'maininfo'->'address'->'section' AS section
   ,CASE WHEN elon->'maininfo'->'address'->'section' <@ hudud THEN elon->'maininfo'->'ownertel'  ELSE  NULL  END AS ownertel
 FROM olx o
   ,(SELECT result FROM wish w1 WHERE w1.id=27) w
 LEFT OUTER  JOIN hudud h ON h.uid=3
--AND   o.elon->'maininfo'->'address' -> 'section' <@ hudud
  WHERE  ( o.id::text)::jsonb <@ w.result
  ORDER BY o.id ASC;