sed -i "s/target_meetings: data.target_meetings || 15,/target_meetings: data.target_meetings || 15,\n    fee_per_meeting: data.fee_per_meeting || 0,/" src/actions/classes.ts
sed -i "s/target_meetings: data.target_meetings,/target_meetings: data.target_meetings,\n      fee_per_meeting: data.fee_per_meeting || 0,/" src/actions/classes.ts
