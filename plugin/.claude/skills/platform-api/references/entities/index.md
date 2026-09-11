# Entities and their routes

Generated from the platform's OpenAPI document. Do not edit by hand — the next refresh overwrites it.

The route is the string a plugin passes as the entity, and it is often not the entity's name: the invoice entity answers on `invoices`. Look the entity up here before writing a call — a name that reads right and is wrong returns a 404 that says nothing about why.

Both columns are addresses, for two different APIs. `host.api.get('invoices')` reaches the business API and takes the **route**. `/api/statistics?model=…` reaches the statistics endpoint and takes the **entity name**. They differ more often than not — `CustomerInvoice` against `invoices`, `SalaryTransaction` against `salarytrans` — and passing one where the other belongs is refused with `Model 'x' not found`, which a wrapped response reports as a 200 with no rows.

269 entities answer on a collection route. The rest exist only as part of another entity, expanded or posted with it, and are described on the domain pages that use them.

| Entity | Route | Verbs | Actions |
| --- | --- | --- | --- |
| AGAPeriod | `agaperiods` | GET | 11 |
| AGASums | `agasums` | GET, POST, PUT, DELETE | 3 |
| AGAZone | `AGAZones` | GET | 3 |
| Absence | `Absence` | GET, POST, PUT, DELETE | 5 |
| Account | `accounts` | GET, POST, PUT, DELETE | 29 |
| AccountGroup | `accountgroups` | GET, POST, PUT, DELETE | 2 |
| AccountGroupSet | `accountgroupsets` | GET, POST, PUT, DELETE | 2 |
| AccountMandatoryDimension | `accountmandatorydimension` | GET, POST, PUT, DELETE | 11 |
| AccountVatType | `accountvattype` | GET, POST, PUT, DELETE | 5 |
| AccountVatTypeLink | `accountvattypelink` | GET, POST, PUT, DELETE | 2 |
| AccountVisibilityGroup | `accountvisibilitygroups` | GET, POST, PUT, DELETE | 2 |
| AccountingLockDateLogItem | `accountinglockdate` | GET, POST, PUT, DELETE | 2 |
| Accrual | `accruals` | GET, POST, PUT, DELETE | 2 |
| Address | `contacts/{contactid}/addresses` | GET, POST, PUT, DELETE | 2 |
| Agreement | `agreements` | GET, POST, PUT, DELETE | 3 |
| Altinn | `altinn` | GET, POST, PUT, DELETE | 23 |
| AltinnAccountLink | `altinnaccountlinks` | GET, POST, PUT, DELETE | 6 |
| AltinnReceipt | `altinnreceipts` | GET, POST, PUT | 5 |
| AltinnSigning | `altinnsigning` | GET, POST, PUT, DELETE | 3 |
| AmeldingData | `amelding` | GET, POST, DELETE | 18 |
| AmeldingPayment | `ameldingpayments` | GET, POST, PUT, DELETE | 2 |
| AnnualAccount | `annualaccounts` | GET, POST, PUT, DELETE | 9 |
| AnnualAccountNoteInfo | `annualaccountnoteinfo` | GET, POST, PUT, DELETE | 5 |
| AnnualAccountSignature | `annualaccountsignatures` | GET, POST, PUT, DELETE | 2 |
| AnnualSettlement | `annualsettlement` | GET, POST, PUT, DELETE | 99 |
| AnnualSettlementCheckList | `annualsettlementchecklist` | GET, POST, PUT, DELETE | 2 |
| ApiKey | `apikeys` | GET, POST, PUT, DELETE | 6 |
| Approval | `approvals` | GET | 5 |
| ApprovalRule | `approvalrules` | GET, POST, PUT, DELETE | 2 |
| ApprovalRuleLink | `ApprovalRuleLinks` | GET, POST, PUT, DELETE | 5 |
| ApprovalRuleLinkGroup | `ApprovalRuleLinkGroups` | GET, POST, PUT, DELETE | 3 |
| ApprovalSubstitute | `approvalsubstitutes` | GET, POST, PUT, DELETE | 2 |
| Asset | `assets` | GET, POST, PUT, DELETE | 32 |
| AuditLog | `auditlogs` | GET | 3 |
| Bank | `banks` | GET, POST, PUT, DELETE | 7 |
| BankAccount | `bankaccounts` | GET, POST, PUT, DELETE | 20 |
| BankInformation | `bankinformation` | GET, POST, PUT, DELETE | 6 |
| BankIntegrationAgreement | `bank-agreements` | GET, PUT, DELETE | 19 |
| BankRule | `bankrules` | GET, POST, PUT, DELETE | 2 |
| BankStatement | `bankstatements` | GET, POST, PUT, DELETE | 17 |
| BankStatementEntry | `bankstatemententries` | GET, POST, PUT, DELETE | 5 |
| BankStatementMatch | `bankstatementmatch` | GET, POST, DELETE | 3 |
| BankStatementRule | `bankstatementrules` | GET, POST, PUT, DELETE | 5 |
| BasicAmount | `basicamounts` | GET | 2 |
| BatchInvoice | `batchinvoices` | GET, POST, PUT, DELETE | 6 |
| Budget | `budgets` | GET, POST, PUT, DELETE | 11 |
| BudgetEntry | `budgetentries` | GET, POST, PUT, DELETE | 2 |
| BusinessRelation | `business-relations` | GET, POST, PUT, DELETE | 3 |
| CampaignTemplate | `campaigntemplate` | GET, POST, PUT, DELETE | 6 |
| Child | `children` | GET, POST, PUT, DELETE | 3 |
| Comment | `comments` | GET, POST, PUT, DELETE | 4 |
| CommentChatReadHistory | `CommentChatReadHistory` | GET, POST, PUT, DELETE | 3 |
| Company | `companies` | GET, DELETE | 19 |
| CompanyAccountingSettings | `companyaccountingsettings` | GET, POST, PUT, DELETE | 3 |
| CompanyBankAccount | `companybankaccounts` | GET, POST, PUT, DELETE | 2 |
| CompanyReport | `company-report` | GET, POST, PUT, DELETE | 2 |
| CompanySalary | `companysalary` | GET, POST, PUT, DELETE | 4 |
| CompanySettings | `companysettings` | GET, POST, PUT, DELETE | 14 |
| CompanyType | `companytypes` | GET, POST, PUT, DELETE | 2 |
| CompanyVacationRate | `companyvacationrates` | GET, POST, PUT, DELETE | 3 |
| ComponentLayout | `componentlayouts` | GET, POST, PUT, DELETE | 2 |
| Contact | `contacts` | GET, POST, PUT, DELETE | 2 |
| Contract | `contracts` | GET, POST, PUT, DELETE | 7 |
| ContractAddress | `contractaddresses` | GET, POST, PUT, DELETE | 2 |
| ContractAsset | `contractassets` | GET, POST, PUT, DELETE | 2 |
| ContractDebugLog | `contractdebuglogs` | GET, POST, PUT, DELETE | 2 |
| ContractParameter | `contractparameters` | GET, POST, PUT, DELETE | 2 |
| ContractRunLog | `contractrunlogs` | GET, POST, PUT, DELETE | 2 |
| ContractTransaction | `contracttransactions` | GET, POST, PUT, DELETE | 2 |
| ContractTrigger | `contracttriggers` | GET, POST, PUT, DELETE | 2 |
| CostAllocation | `costallocations` | GET, POST, PUT, DELETE | 5 |
| CostAllocationItem | `costallocationitems` | GET, POST, PUT, DELETE | 2 |
| Country | `countries` | GET, POST, PUT, DELETE | 3 |
| Currency | `currencies` | GET, POST, PUT, DELETE | 6 |
| CurrencyCode | `currencycodes` | GET, POST, PUT, DELETE | 2 |
| CurrencyOverride | `currencyoverrides` | GET, POST, PUT, DELETE | 2 |
| CustomField | `custom-fields` | GET, POST, PUT, DELETE | 3 |
| CustomLiquidityPayment | `liquiditypayment` | GET, POST, PUT, DELETE | 3 |
| CustomStorage | `customstorage` | GET, POST, PUT, DELETE | 3 |
| Customer | `customers` | GET, POST, PUT, DELETE | 11 |
| CustomerGroup | `customergroups` | GET, POST, PUT, DELETE | 3 |
| CustomerInvoice | `invoices` | GET, POST, PUT, DELETE | 30 |
| CustomerInvoiceItem | `invoiceitems` | GET, POST, PUT, DELETE | 3 |
| CustomerInvoiceReminder | `invoicereminders` | GET, POST, PUT, DELETE | 35 |
| CustomerInvoiceReminderRule | `invoicereminderrules` | GET, POST, PUT, DELETE | 2 |
| CustomerInvoiceReminderSettings | `invoiceremindersettings` | GET, POST, PUT, DELETE | 3 |
| CustomerOrder | `orders` | GET, POST, PUT, DELETE | 14 |
| CustomerOrderItem | `orderitems` | GET, POST, PUT, DELETE | 5 |
| CustomerQuote | `quotes` | GET, POST, PUT, DELETE | 14 |
| CustomerQuoteItem | `quoteitems` | GET, POST, PUT, DELETE | 2 |
| DebtCollectionAutomation | `debtcollectionautomation` | GET, POST, PUT, DELETE | 2 |
| DebtCollectionSettings | `debtcollectionsettings` | GET, POST, PUT, DELETE | 2 |
| Department | `departments` | GET, POST, PUT, DELETE | 3 |
| Dimension10 | `Dimension10` | GET, POST, PUT, DELETE | 3 |
| Dimension5 | `Dimension5` | GET, POST, PUT, DELETE | 3 |
| Dimension6 | `Dimension6` | GET, POST, PUT, DELETE | 3 |
| Dimension7 | `Dimension7` | GET, POST, PUT, DELETE | 3 |
| Dimension8 | `Dimension8` | GET, POST, PUT, DELETE | 3 |
| Dimension9 | `Dimension9` | GET, POST, PUT, DELETE | 3 |
| DimensionSettings | `dimensionsettings` | GET, POST, PUT, DELETE | 2 |
| Dimensions | `dimensions` | GET | 3 |
| DistributionPlan | `distributions` | GET, POST, PUT, DELETE | 18 |
| EHFLog | `ehf` | GET, POST, PUT, DELETE | 8 |
| EmailLog | `emails` | GET, POST, PUT, DELETE | 3 |
| Employee | `employees` | GET, POST, PUT, DELETE | 15 |
| EmployeeCategory | `employeecategories` | GET, POST, PUT, DELETE | 8 |
| EmployeeLeave | `EmployeeLeave` | GET, POST, PUT, DELETE | 12 |
| EmployeeLeaveCategory | `employeeleavecategories` | GET, POST, PUT, DELETE | 2 |
| EmployeeTaxCard | `taxcards` | GET, POST, PUT, DELETE | 2 |
| Employment | `employments` | GET, POST, PUT, DELETE | 4 |
| EmploymentSalaryHistory | `employmentsalaryhistories` | GET | 3 |
| EmploymentValidValues | `employmentvalidvalues` | GET, POST, PUT, DELETE | 2 |
| EntityLock | `entitylock` | GET, POST | 4 |
| EventSubscriber | `eventsubscribers` | GET, POST, PUT, DELETE | 2 |
| Eventplan | `eventplans` | GET, POST, PUT, DELETE | 2 |
| ExpressionFilter | `expressionfilters` | GET, POST, PUT, DELETE | 2 |
| ExternalMigration | `rollback` | GET, POST, PUT, DELETE | 7 |
| ExternalOffer | `external-offers` | GET, POST | 7 |
| ExternalStorageReference | `externalstoragereference` | GET, POST, PUT, DELETE | 2 |
| FactoringSettings | `factoringsettings` | GET, POST, PUT, DELETE | 4 |
| FieldLayout | `fieldlayouts` | GET, POST, PUT, DELETE | 2 |
| File | `files` | GET, POST, PUT, DELETE | 31 |
| FileTag | `filetags` | GET, POST, DELETE | 2 |
| FinancialDeadline | `deadlines` | GET, POST, PUT, DELETE | 4 |
| FinancialReportComment | `financial-report-comments` | GET, POST, PUT, DELETE | 4 |
| FinancialYear | `financialyears` | GET, POST, PUT, DELETE | 4 |
| Grant | `grants` | GET, POST, PUT, DELETE | 2 |
| ImportReferenceLog | `importreferencelogs` | GET, POST, PUT, DELETE | 2 |
| IncomeReportData | `income-reports` | GET, POST, PUT, DELETE | 8 |
| IncomeReportInquiry | `income-report-inquiries` | GET, POST, PUT, DELETE | 4 |
| InvoiceAccrualDefinition | `invoiceaccrualdefinitions` | GET, POST, PUT, DELETE | 2 |
| InvoiceCharge | `invoicecharges` | GET, POST, PUT, DELETE | 2 |
| InvoiceWriteoffSettings | `invoicewriteoffsettings` | GET, POST, PUT, DELETE | 2 |
| ItemSource | `itemsources` | GET, POST, PUT, DELETE | 3 |
| ItemSourceDetail | `itemsourcedetails` | GET, POST, PUT, DELETE | 2 |
| JournalEntry | `journalentries` | GET, POST, PUT, DELETE | 20 |
| JournalEntryLine | `journalentrylines` | GET, PUT | 5 |
| JournalEntryLineDraft | `journalentrylinedrafts` | GET, POST, PUT, DELETE | 2 |
| JournalEntryMode | `journalEntryModes` | GET, POST, PUT, DELETE | 2 |
| JournalEntryType | `journalentrytypes` | GET | 2 |
| Language | `languages` | GET, POST, PUT, DELETE | 2 |
| LedgerSuggestion | `ledgersuggestions` | GET | 3 |
| Model | `models` | GET, PUT | 2 |
| Municipal | `Municipals` | GET, POST, PUT, DELETE | 2 |
| MunicipalAGAZone | `MunicipalAGAZones` | GET | 2 |
| Notification | `notifications` | GET, POST, DELETE | 8 |
| NumberSeries | `number-series` | GET, POST, PUT, DELETE | 8 |
| NumberSeriesInvalidOverlap | `number-series-invalid-overlaps` | GET, POST, PUT, DELETE | 2 |
| NumberSeriesTask | `number-series-tasks` | GET, POST, PUT, DELETE | 3 |
| NumberSeriesType | `number-series-types` | GET, POST, PUT, DELETE | 2 |
| Object | `skatteetaten` | GET, POST, PUT, DELETE | 7 |
| OpenAIResponse | `ai-generate` | GET, DELETE | 4 |
| OtpExportWagetype | `otpexportwagetypes` | GET, POST, PUT, DELETE | 2 |
| Paycheck | `paycheck` | GET, POST, PUT, DELETE | 7 |
| Payment | `payments` | GET, POST, PUT, DELETE | 19 |
| PaymentBatch | `paymentbatches` | GET, POST, PUT, DELETE | 41 |
| PaymentCode | `paymentCodes` | GET, POST, PUT, DELETE | 2 |
| PaymentInfoType | `paymentinfotype` | GET, POST, PUT, DELETE | 6 |
| PaymentMethod | `paymentmethod` | GET, POST, PUT, DELETE | 2 |
| PaymentReceipt | `paymentreceipts` | GET, POST, PUT, DELETE | 3 |
| PayrollRun | `payrollrun` | GET, POST, PUT, DELETE | 48 |
| PensionScheme | `pensionschemes` | GET, POST, PUT, DELETE | 3 |
| PensionSchemeSupplier | `pensionschemesuppliers` | GET, POST, PUT, DELETE | 2 |
| Period | `periodes` | GET, POST, PUT, DELETE | 2 |
| PeriodSeries | `period-series` | GET, POST, PUT, DELETE | 2 |
| PeriodSumGroup | `periodsumgroups` | GET | 4 |
| PeriodTemplate | `period-templates` | GET, POST, PUT, DELETE | 2 |
| Permission | `permissions` | GET, DELETE | 2 |
| PostPost | `postposts` | GET, POST, PUT, DELETE | 8 |
| PostalCode | `postalcodes` | GET | 3 |
| PredefinedDescription | `predefineddescriptions` | GET, POST, PUT, DELETE | 4 |
| PriceDeal | `price-deals` | GET, POST, PUT, DELETE | 2 |
| Product | `products` | GET, POST, PUT, DELETE | 23 |
| ProductCategory | `productcategories` | GET, POST, PUT, DELETE | 2 |
| ProductCategoryLink | `productcategorylinks` | GET, POST, PUT, DELETE | 2 |
| Project | `projects` | GET, POST, PUT, DELETE | 9 |
| ProjectResource | `projects-resources` | GET, POST, PUT, DELETE | 2 |
| ProjectResourceSchedule | `projects-schedules-resources` | GET, POST, PUT, DELETE | 2 |
| ProjectTask | `projects-tasks` | GET, POST, PUT, DELETE | 4 |
| ProjectTaskSchedule | `projects-tasks-schedules` | GET, POST, PUT, DELETE | 2 |
| ReInvoice | `reinvoicing` | GET, POST, PUT, DELETE | 20 |
| Reconcile | `reconcile` | GET, POST, PUT, DELETE | 10 |
| RecurringInvoice | `recurringinvoices` | GET, POST, PUT, DELETE | 9 |
| RecurringInvoiceItem | `recurringinvoiceitems` | GET | 2 |
| RecurringInvoiceLog | `RecurringInvoicelogs` | GET, DELETE | 2 |
| ReferencePoint | `referencepoints` | GET, POST, PUT, DELETE | 2 |
| Region | `regions` | GET, POST, PUT, DELETE | 2 |
| Regulative | `regulatives` | GET, POST, PUT, DELETE | 5 |
| RegulativeGroup | `regulativegroups` | GET, POST, PUT, DELETE | 2 |
| ReportDefinition | `report-definitions` | GET, POST, PUT, DELETE | 6 |
| ReportDefinitionDataSource | `report-definition-data-sources` | GET, POST, PUT, DELETE | 2 |
| ReportDefinitionParameter | `report-definition-parameters` | GET, POST, PUT, DELETE | 2 |
| Responsible | `responsibles` | GET, POST, PUT, DELETE | 2 |
| Role | `roles` | GET, POST, PUT, DELETE | 2 |
| STYRKCode | `STYRK` | GET | 3 |
| SalaryBalance | `salarybalances` | GET, POST, PUT, DELETE | 8 |
| SalaryBalanceLine | `salarybalancelines` | GET, POST, PUT, DELETE | 2 |
| SalaryBalanceTemplate | `salarybalancetemplates` | GET, POST, PUT, DELETE | 2 |
| SalaryBalanceTemplateWageType | `salarybalancetemplatewagetypes` | GET, POST, PUT, DELETE | 2 |
| SalaryPostingDraft | `salarypostingdrafts` | GET, POST, PUT, DELETE | 2 |
| SalaryTemplateCollection | `salarytemplatecollections` | GET, POST, PUT, DELETE | 2 |
| SalaryTransaction | `salarytrans` | GET, POST, PUT, DELETE | 23 |
| SalaryTransactionSums | `salarysums` | GET | 8 |
| SalaryTransactionSupplement | `supplements` | GET, PUT | 2 |
| SalaryTransactionTemplate | `salarytransactiontemplates` | GET, POST, PUT, DELETE | 3 |
| Seller | `sellers` | GET, POST, PUT, DELETE | 2 |
| SellerLink | `sellerlinks` | GET, POST, PUT, DELETE | 2 |
| ShareholderRegisterStatement | `shareholderregisterstatement` | GET, POST, PUT, DELETE | 11 |
| Sharing | `sharings` | GET, POST, PUT | 4 |
| SigningBasket | `signingbaskets` | GET, POST, PUT, DELETE | 11 |
| StaticRegister | `StaticRegister` | GET, POST, PUT, DELETE | 2 |
| StatusLog | `statuslogs` | GET | 2 |
| String | `codelists` | GET, POST, PUT, DELETE | 6 |
| SubCompany | `subcompanies` | GET, POST, PUT, DELETE | 2 |
| SubEntity | `subentities` | GET, POST, PUT, DELETE | 3 |
| SubEntityHistoricAga | `subentitieshistoricaga` | GET, POST, PUT, DELETE | 2 |
| SupplementaryPaymentWageType | `supplementarypaymentwagetypes` | GET, POST, PUT, DELETE | 2 |
| Supplier | `suppliers` | GET, POST, PUT, DELETE | 10 |
| SupplierGoods | `suppliergoods` | GET, POST, PUT, DELETE | 6 |
| SupplierInvoice | `supplierinvoices` | GET, POST, PUT, DELETE | 31 |
| Task | `tasks` | GET, POST, PUT, DELETE | 6 |
| TaxReport | `taxreport` | GET, POST, PUT, DELETE | 2 |
| Team | `teams` | GET, POST, PUT, DELETE | 7 |
| TeamPosition | `teampositions` | GET, POST, PUT, DELETE | 2 |
| Terms | `terms` | GET, POST, PUT, DELETE | 4 |
| Tracelink | `orderitems/{itemid}/tracelinks` | GET, POST, PUT, DELETE | 6 |
| Transition | `transitions` | GET | 2 |
| TransitionThreshold | `thresholds` | GET, POST, PUT, DELETE | 2 |
| Translatable | `translatables` | GET, POST, PUT, DELETE | 2 |
| Translation | `translations` | GET, POST, PUT, DELETE | 2 |
| Travel | `travels` | GET, POST, PUT, DELETE | 7 |
| TravelLine | `travellines` | GET, POST, PUT, DELETE | 3 |
| TravelType | `traveltype` | GET, POST, PUT, DELETE | 2 |
| UniQueryDefinition | `uniquerydefinitions` | GET, POST, PUT, DELETE | 3 |
| UniQueryField | `uniqueryfields` | GET, POST, PUT, DELETE | 2 |
| UniQueryFilter | `uniqueryfilters` | GET, POST, PUT, DELETE | 2 |
| UnifiedGarnishment | `unifiedgarnishments` | GET, POST, PUT, DELETE | 4 |
| UnitOfMeasure | `unitofmeasures` | GET, POST, PUT, DELETE | 2 |
| User | `users` | GET, POST, PUT, DELETE | 20 |
| UserNotificationSettings | `usernotificationsettings` | GET, POST, PUT, DELETE | 5 |
| UserRole | `userroles` | GET, POST, PUT, DELETE | 4 |
| UserVerification | `user-verifications` | GET, POST, DELETE | 5 |
| VacationDays | `vacation` | GET, POST, PUT, DELETE | 4 |
| VacationPayDaysDeduction | `VacationPayDaysDeductions` | GET, POST, PUT, DELETE | 2 |
| VacationPayLine | `VacationPayLines` | GET, POST, PUT, DELETE | 8 |
| VacationRateEmployee | `employeevacationrates` | GET, POST, PUT, DELETE | 2 |
| ValueItem | `valueitems` | GET, POST, PUT, DELETE | 2 |
| ValueList | `valuelists` | GET, POST, PUT, DELETE | 2 |
| VatCodeGroup | `vatcodegroups` | GET, POST, PUT, DELETE | 2 |
| VatDeduction | `vatdeductions` | GET, POST, PUT, DELETE | 2 |
| VatDeductionGroup | `vatdeductiongroups` | GET, POST, PUT, DELETE | 2 |
| VatPost | `vatposts` | GET, POST, PUT, DELETE | 3 |
| VatReport | `vatreports` | GET, POST, PUT, DELETE | 71 |
| VatReportDimensionValue | `vatreportdimensionvalues` | GET, POST, PUT, DELETE | 2 |
| VatReportForm | `vatreportforms` | GET, POST, PUT, DELETE | 2 |
| VatReportReference | `vatreportreferences` | GET, POST, PUT, DELETE | 2 |
| VatReportSetting | `vatreportsettings` | GET, POST, PUT, DELETE | 3 |
| VatType | `vattypes` | GET, POST, PUT, DELETE | 10 |
| WageType | `wagetypes` | GET, POST, PUT, DELETE | 15 |
| WageTypeRateHistory | `wagetyperatehistories` | GET, POST, PUT, DELETE | 2 |
| WageTypeTranslation | `wagetypetranslations` | GET, POST, PUT, DELETE | 2 |
| WorkBalance | `workbalances` | GET, POST, PUT, DELETE | 2 |
| WorkItem | `workitems` | GET, POST, PUT, DELETE | 2 |
| WorkItemGroup | `workitemgroups` | GET, POST, PUT, DELETE | 7 |
| WorkProfile | `workprofiles` | GET, POST, PUT, DELETE | 2 |
| WorkRelation | `workrelations` | GET, POST, PUT, DELETE | 4 |
| WorkTimeOff | `worktimeoff` | GET, POST, PUT, DELETE | 2 |
| WorkType | `worktypes` | GET, POST, PUT, DELETE | 3 |
| Worker | `workers` | GET, POST, PUT, DELETE | 3 |
