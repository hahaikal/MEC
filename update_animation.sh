#!/bin/bash
cat << 'INNER_EOF' > temp_anim.tsx
<<<<<<< SEARCH
                                <div className="flex items-center gap-2">
                                  {isMonthExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  <span className="text-base">{monthDisplay}</span>
                                </div>
=======
                                <div className="flex items-center gap-2">
                                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMonthExpanded ? 'rotate-0' : '-rotate-90'}`} />
                                  <span className="text-base">{monthDisplay}</span>
                                </div>
>>>>>>> REPLACE
<<<<<<< SEARCH
                                        <div className="flex items-center gap-2">
                                          {isDayExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                          <span className="text-sm font-medium">{dayDisplay}</span>
                                          <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-2">
                                            {dailyPayments.length} trx
                                          </span>
                                        </div>
=======
                                        <div className="flex items-center gap-2">
                                          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDayExpanded ? 'rotate-0' : '-rotate-90'}`} />
                                          <span className="text-sm font-medium">{dayDisplay}</span>
                                          <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-2">
                                            {dailyPayments.length} trx
                                          </span>
                                        </div>
>>>>>>> REPLACE
<<<<<<< SEARCH
                          {/* Day Rows (if month is expanded) */}
                          {isMonthExpanded && Object.entries(daysMap)
                            .sort(([a], [b]) => b.localeCompare(a)) // Sort days descending
                            .map(([dayKey, dailyPayments]) => {
=======
                          {/* Day Rows (if month is expanded) */}
                          {Object.entries(daysMap)
                            .sort(([a], [b]) => b.localeCompare(a)) // Sort days descending
                            .map(([dayKey, dailyPayments]) => {
>>>>>>> REPLACE
<<<<<<< SEARCH
                                  {/* Day Header Row */}
                                  <TableRow className="bg-slate-50 dark:bg-slate-900/30">
=======
                                  {/* Day Header Row */}
                                  <TableRow className={cn("bg-slate-50 dark:bg-slate-900/30", !isMonthExpanded && "hidden")}>
>>>>>>> REPLACE
<<<<<<< SEARCH
                                  {/* Transaction Rows (if day is expanded) */}
                                  {isDayExpanded && dailyPayments.map((payment: any) => {
=======
                                  {/* Transaction Rows (if day is expanded) */}
                                  {dailyPayments.map((payment: any) => {
>>>>>>> REPLACE
<<<<<<< SEARCH
                                      <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors group">
                                        <TableCell className="px-6 pl-14 font-medium">
                                          <div className="flex flex-col">
                                            <span>{payment.students?.name || 'Unknown'}</span>
                                            <span className="text-xs text-muted-foreground">{payment.students?.email}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-sm capitalize">{paymentMonthName}</TableCell>
                                        <TableCell className="text-right font-semibold text-emerald-600">
                                          {formatRupiah(Number(payment.amount))}
                                          {payment.discount_amount > 0 && (
                                             <div className="text-xs text-muted-foreground line-through decoration-red-400">
                                               Disc: {formatRupiah(Number(payment.discount_amount))}
                                             </div>
                                          )}
                                        </TableCell>
                                        <TableCell className="text-sm capitalize">{payment.payment_method?.replace('_', ' ')}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                          {payment.payment_date ? format(new Date(payment.payment_date), 'HH:mm') : '-'}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            {getStatusIcon(payment.payment_status)}
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${getStatusColor(payment.payment_status)}`}>
                                              {payment.payment_status}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
=======
                                      <TableRow key={payment.id} className={cn("hover:bg-muted/30 transition-colors group", (!isMonthExpanded || !isDayExpanded) && "hidden")}>
                                        <TableCell className="px-6 pl-14 font-medium py-3">
                                            <div className="flex flex-col">
                                              <span>{payment.students?.name || 'Unknown'}</span>
                                              <span className="text-xs text-muted-foreground">{payment.students?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm capitalize py-3">{paymentMonthName}</TableCell>
                                        <TableCell className="text-right font-semibold text-emerald-600 py-3">
                                            {formatRupiah(Number(payment.amount))}
                                            {payment.discount_amount > 0 && (
                                              <div className="text-xs text-muted-foreground line-through decoration-red-400">
                                                Disc: {formatRupiah(Number(payment.discount_amount))}
                                              </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm capitalize py-3">{payment.payment_method?.replace('_', ' ')}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground py-3">
                                            {payment.payment_date ? format(new Date(payment.payment_date), 'HH:mm') : '-'}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-2">
                                              {getStatusIcon(payment.payment_status)}
                                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${getStatusColor(payment.payment_status)}`}>
                                                {payment.payment_status}
                                              </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-3">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                      </TableRow>
>>>>>>> REPLACE
INNER_EOF
