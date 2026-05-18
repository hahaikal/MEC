sed -i 's/fee_per_meeting: data.fee_per_meeting || 0,/fee_per_meeting: data.fee_per_meeting || 0,\n    program_id: data.program_id || null,/g' src/actions/classes.ts
