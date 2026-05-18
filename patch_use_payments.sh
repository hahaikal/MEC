sed -i 's/.single()/.order('\''enrolled_at'\'', { ascending: false }).limit(1).single()/g' src/lib/hooks/use-payments.ts
