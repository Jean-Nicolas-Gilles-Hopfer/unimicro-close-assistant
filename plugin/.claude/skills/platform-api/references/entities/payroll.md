# Payroll

Generated from the platform's OpenAPI document. Do not edit by hand — the next refresh overwrites it.

Field names are exact. A name that is not listed does not exist, however plausible it sounds — a query that filters on one returns unfiltered rows rather than an error.

These tables serve the statistics endpoint as well as the business API: the field names are what its `select`, `filter` and `orderby` accept, and the relation names are a starting point for its `expand`, which also takes a related model's own name. See the statistics reference for the query syntax they go into.

## Employee — `employees`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Active` | boolean |  |
| `ActiveProjectCostAdjustment` | boolean |  |
| `AdvancePaymentAmount` | number (double) |  |
| `BirthDate` | string (date-time) |  |
| `BusinessRelationID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `DeniedSickDays` | string (date-time) |  |
| `EmployeeLanguageID` | integer (int32) |  |
| `EmployeeLedgerID` | integer (int32) |  |
| `EmployeeNumber` | integer (int32) |  |
| `EmploymentDate` | string (date-time) |  |
| `EmploymentDateOtp` | string (date) |  |
| `EndDate` | string (date) |  |
| `EndDateOtp` | string (date) |  |
| `ForeignWorker` | integer (int32) | 0 = notSet, 1 = ForeignWorkerUSA_Canada, 2 = ForeignWorkerFixedAga |
| `FreeText` | string |  |
| `ID` | integer (int32) |  |
| `IncludeOtpUntilMonth` | integer (int32) |  |
| `IncludeOtpUntilYear` | integer (int32) |  |
| `InternasjonalIDCountry` | string | max 100 |
| `InternasjonalIDType` | integer (int32) | 0 = notSet, 1 = Passportnumber, 2 = SocialSecurityNumber, 3 = TaxIdentificationNumber, 4 = ValueAddedTaxNumber |
| `InternationalID` | string | max 100 |
| `MunicipalityNo` | string | max 255 |
| `OtpExport` | boolean |  |
| `OtpStatus` | integer (int32) | 0 = A, 1 = S, 2 = P, 3 = LP, 4 = AP |
| `PaymentInterval` | integer (int32) | 0 = Standard, 1 = Monthly, 2 = Pr14Days, 3 = Weekly |
| `PhotoID` | integer (int32) |  |
| `Sex` | integer (int32) | 0 = NotDefined, 1 = Woman, 2 = Man |
| `SingleProvider` | boolean |  |
| `SocialSecurityNumber` | string | max 100 |
| `SpecialAGA` | integer (int32) | 0 = Normal, 1 = UsaOrCanada, 2 = SeafarerOverseas |
| `StatusCode` | integer (int32) |  |
| `SubEntityID` | integer (int32) |  |
| `TravelExpenseAccess` | integer (int32) | 0 = NoAccess, 1 = User, 2 = Admin, 3 = UserAndAdmin |
| `TypeOfPaymentOtp` | integer (int32) | 0 = FixedSalary, 1 = HourlyPay, 2 = PaidOnCommission |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UserID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `BusinessRelationInfo` | BusinessRelation |
| `Children` | Child[] |
| `CustomValues` | CustomValues |
| `EmployeeLedger` | Supplier |
| `Employments` | Employment[] |
| `TaxCards` | EmployeeTaxCard[] |
| `VacationDays` | VacationDays[] |
| `VacationRateEmployees` | VacationRateEmployee[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `employees/{id}?action=audit` | query (required) |
| GET | `employees?action=audit` | query (required) |
| POST | `employees?action=create-employee-ledgers` | selection (required) |
| GET | `employees?action=emps-on-transes` | status (required), expand (required) |
| POST | `employees/{id}?action=hard-delete` |  |
| POST | `employees?action=import-employee-vacationpay` | fileID (required), year (required) |
| GET | `employees/{id}?action=next` |  |
| GET | `employees/{id}?action=previous` |  |
| GET | `employees?action=read-tax-cards` | receiptID (required) |
| PUT | `employees/{id}?action=set-end-date` | endDateReason (required), endDate (required) |
| PUT | `employees/{id}?action=set-travel-expense-access` | access (required) |
| PUT | `employees/{id}?action=setcategories` | categories (required) |
| GET | `employees?action=template` |  |
| PUT | `employees/{id}?action=vacationpay-closure` | sixth (required), payrollRunID |
| PUT | `employees/{id}?action=vacationpay-create` | year (required), sixth (required), payrollRunID |

## Employment — `employments`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `DimensionsID` | integer (int32) |  |
| `EmployeeID` | integer (int32) |  |
| `EmployeeNumber` | integer (int32) |  |
| `EmploymentType` | integer (int32) | 0 = notSet, 1 = Permanent, 2 = Temporary, 3 = PermanentLeasedOut, 4 = TemporaryLeasedOut, 5 = TemporaryOnCallSubstitute |
| `EndDate` | string (date-time) |  |
| `EndDateReason` | integer (int32) | 0 = NotSet, 1 = ShouldNotHaveBeenReported, 2 = EmployerHasResignedEmployee, 3 = EmployeeHasResigned, 4 = ChangedAccountingSystemOrAccountant, 5 = ChangeInOrganizationStructureOrChangedJobInternally, … |
| `HourRate` | number (double) |  |
| `HoursPerWeek` | number (double) |  |
| `ID` | integer (int32) |  |
| `JobCode` | string | max 100 |
| `JobName` | string | max 100 |
| `LastSalaryChangeDate` | string (date-time) |  |
| `LastWorkPercentChangeDate` | string (date-time) |  |
| `LedgerAccount` | string | max 100 |
| `MonthRate` | number (double) |  |
| `PayGrade` | string | max 256 |
| `RegulativeGroupID` | integer (int32) |  |
| `RegulativeStepNr` | integer (int32) |  |
| `RemunerationType` | integer (int32) | 0 = notSet, 1 = FixedSalary, 2 = HourlyPaid, 3 = PaidOnCommission, 4 = OnAgreement_Honorar, 5 = ByPerformance |
| `SeniorityDate` | string (date-time) |  |
| `ShipReg` | integer (int32) | 0 = notSet, 1 = NorwegianInternationalShipRegister, 2 = NorwegianOrdinaryShipRegister, 3 = ForeignShipRegister |
| `ShipType` | integer (int32) | 0 = notSet, 1 = Other, 2 = DrillingPlatform, 3 = Tourist |
| `Standard` | boolean |  |
| `StartDate` | string (date-time) |  |
| `StatusCode` | integer (int32) |  |
| `SubEntityID` | integer (int32) |  |
| `TradeArea` | integer (int32) | 0 = notSet, 1 = Domestic, 2 = Foreign |
| `TypeOfEmployment` | integer (int32) | 0 = notSet, 1 = OrdinaryEmployment, 2 = MaritimeEmployment, 3 = FrilancerContratorFeeRecipient, 4 = PensionOrOtherNonEmployedBenefits |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UserDefinedRate` | number (double) |  |
| `WorkPercent` | number (double) |  |
| `WorkingHoursScheme` | integer (int32) | 0 = notSet, 1 = NonShift, 2 = OffshoreWork, 3 = ContinousShiftwork336, 4 = DayAndNightContinous355, 5 = ShiftWork, … |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Dimensions` | Dimensions |
| `Employee` | Employee |
| `EmploymentCustomRateHistories` | EmploymentCustomRateHistory[] |
| `EmploymentSalaryHistories` | EmploymentSalaryHistory[] |
| `EmploymentWorkPercentHistories` | EmploymentWorkPercentHistory[] |
| `Leaves` | EmployeeLeave[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `employments/{id}?action=audit` | query (required) |
| GET | `employments?action=audit` | query (required) |
| GET | `employments/{id}?action=history` |  |
| POST | `employments?action=import-rate-change` | fileID (required) |

## EmployeeCategory — `employeecategories`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `EmployeeCategoryLinkID` | integer (int32) |  |
| `ID` | integer (int32) |  |
| `IsVisible` | boolean |  |
| `Name` | string | max 100 |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `EmployeeCategoryLinks` | EmployeeCategoryLink[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `employeecategories/{id}?action=audit` | query (required) |
| GET | `employeecategories?action=audit` | query (required) |
| GET | `employees/{empno}/category/{id}?action=audit` | query (required) |
| GET | `employees/{empno}/category?action=audit` | query (required) |
| GET | `payrollrun/{runid}/category/{id}?action=audit` | query (required) |
| GET | `payrollrun/{runid}/category?action=audit` | query (required) |
| GET | `employeecategories/{id}?action=employeesoncategory` |  |
| GET | `employeecategories/{id}?action=payrollrunsoncategory` |  |

## EmployeeLeave — `EmployeeLeave`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AbsenceID` | integer (int32) |  |
| `AffectsOtp` | boolean |  |
| `CategoryID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `Description` | string | max 255 |
| `EmploymentID` | integer (int32) |  |
| `FromDate` | string (date-time) |  |
| `ID` | integer (int32) |  |
| `LeavePercent` | number (double) |  |
| `LeaveType` | integer (int32) | 0 = NotSet, 1 = Leave, 2 = LayOff, 3 = Leave_with_parental_benefit, 4 = Military_service_leave, 5 = Educational_leave, … |
| `StatusCode` | integer (int32) |  |
| `ToDate` | string (date-time) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Employment` | Employment |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `EmployeeLeave/{id}?action=audit` | query (required) |
| GET | `EmployeeLeave?action=audit` | query (required) |
| GET | `EmployeeLeave?action=count-employee-leave-for-company` | startDate (required), endDate (required) |
| GET | `EmployeeLeave?action=count-employee-leave-for-employee` | employeeID (required), startDate (required), endDate (required) |
| GET | `EmployeeLeave?action=count-leave-days-in-period` | employeeID (required), startDate (required), endDate (required) |
| GET | `EmployeeLeave?action=count-self-report-days-in-period` | employeeID (required), startDate (required), endDate (required) |
| GET | `EmployeeLeave?action=count-sick-child-days-in-period` | employeeID (required), startDate (required), endDate (required) |
| GET | `EmployeeLeave?action=count-sick-leave-days-in-period` | employeeID (required), startDate (required), endDate (required) |
| GET | `EmployeeLeave?action=count-vacation-days-in-period` | employeeID (required), startDate (required), endDate (required) |
| POST | `EmployeeLeave?action=import-employee-leaves` | fileID (required) |
| POST | `EmployeeLeave?action=post-multiple-employee-leave` |  |
| POST | `EmployeeLeave?action=post-new-employee-leave` |  |

## SalaryTransaction — `salarytrans`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AGAExtra` | number (double) |  |
| `AGAZoneID` | integer (int32) |  |
| `Account` | integer (int32) |  |
| `Amount` | number (double) |  |
| `CalculatedAGAForPeriod` | number (double) |  |
| `ChildSalaryTransactionID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `DimensionsID` | integer (int32) |  |
| `EmployeeID` | integer (int32) |  |
| `EmployeeNumber` | integer (int32) |  |
| `EmploymentCustomRateHistoryID` | integer (int32) |  |
| `EmploymentID` | integer (int32) |  |
| `EmploymentSalaryHistoryID` | integer (int32) |  |
| `EmploymentWorkPercentHistoryID` | integer (int32) |  |
| `FromDate` | string (date-time) |  |
| `HolidayPayDeduction` | boolean |  |
| `ID` | integer (int32) |  |
| `ImportReferenceLogID` | integer (int32) |  |
| `IsAmountFixed` | boolean |  |
| `IsRecurringPost` | boolean |  |
| `JournalEntryLineID` | integer (int32) |  |
| `MunicipalityNo` | string | max 100 |
| `PayrollRunID` | integer (int32) |  |
| `ProjectCostAdjustmentType` | integer (int32) | 0 = None, 1 = AdjustmentTransaction, 2 = BalanceTransaction |
| `Rate` | number (double) |  |
| `RecurringID` | integer (int32) |  |
| `SalaryBalanceID` | integer (int32) |  |
| `SalaryTransactionCarInfoID` | integer (int32) |  |
| `SalaryTransactionTemplateID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `Sum` | number (double) |  |
| `SystemType` | integer (int32) | 0 = None, 1 = PercentTaxDeduction, 2 = HolidayPayBasisLastYear, 4 = TableTaxDeduction, 5 = Holidaypay, 6 = AutoAdvance, … |
| `TaxbasisID` | integer (int32) |  |
| `Text` | string | max 100 |
| `ToDate` | string (date-time) |  |
| `TravelID` | integer (int32) |  |
| `UnifiedGarnishmentID` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VatTypeID` | integer (int32) |  |
| `WageTypeConnectingTransactionID` | integer (int32) |  |
| `WageTypeID` | integer (int32) |  |
| `WageTypeNumber` | integer (int32) |  |
| `WageTypeRateHistoryID` | integer (int32) |  |
| `calcAGA` | number (double) |  |
| `recurringPostValidFrom` | string (date-time) |  |
| `recurringPostValidTo` | string (date-time) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CarInfo` | SalaryTransactionCarInfo |
| `CustomValues` | CustomValues |
| `Dimensions` | Dimensions |
| `Employee` | Employee |
| `SalaryTransactionTemplate` | SalaryTransactionTemplate |
| `Supplements` | SalaryTransactionSupplement[] |
| `Taxbasis` | TaxBasis |
| `Travel` | Travel |
| `UnifiedGarnishment` | UnifiedGarnishment |
| `WageTypeConnectingTransaction` | SalaryTransaction |
| `employment` | Employment |
| `payrollrun` | PayrollRun |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `salarytrans?action=audit` | query (required) |
| GET | `salarytrans/{id}?action=audit` | query (required) |
| GET | `salarytrans?action=calculate-supplementary-payment` | runs (required) |
| POST | `salarytrans?action=complete-trans` |  |
| POST | `salarytrans?action=complete-transactions` |  |
| GET | `salarytrans?action=create-missing-supplementarypayment` | payrollRunID (required) |
| POST | `salarytrans?action=create-recurring-car-transactions` | year (required) |
| POST | `salarytrans?action=create-recurring-transactions-from-template` |  |
| GET | `salarytrans?action=create-salaryhistory-supplementarypayment` | payrollRunID (required), getDeletedPosts |
| DELETE | `salarytrans?action=delete-imported-salary-transactions` | payrollRunID (required), importReferenceLogID (required) |
| DELETE | `salarytrans?action=delete-supplementary-payment` | payrollRunID (required) |
| DELETE | `salarytrans?action=delete-tracelink-supplementarypayment` |  |
| DELETE | `salarytrans?action=delete-travel-transactions` |  |
| GET | `salarytrans?action=has-carrate-constants-for-year` | year (required) |
| GET | `salarytrans?action=import-salary-recurringtransactions-template` |  |
| POST | `salarytrans?action=import-salary-transactions` | fileID (required), payrollRunID (required), importType (required), externalReference |
| GET | `salarytrans?action=import-salary-transactions-template` |  |
| GET | `salarytrans/{id}?action=is-recurring-transaction-deleted` |  |
| GET | `salarytrans?action=is-recurring-transaction-deleted` | employmentID (required) |
| PUT | `salarytrans?action=mark-supplementary-payment-deleted` |  |
| PUT | `salarytrans?action=set-status-supplementary-payment` | historyType (required), status (required) |
| PUT | `salarytrans?action=update-from-employments` |  |
| POST | `salarytrans?action=update-recurring-car-transactions` | year (required) |

## PayrollRun — `payrollrun`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AGAFreeAmount` | number (double) |  |
| `AGAonRun` | number (double) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `Description` | string | max 100 |
| `ExcludeRecurringPosts` | boolean |  |
| `FreeText` | string | max 255 |
| `FromDate` | string (date-time) |  |
| `HolidayPayDeduction` | boolean |  |
| `ID` | integer (int32) |  |
| `IncludeActiveEmployees` | boolean |  |
| `JournalEntryNumber` | string | max 255 |
| `PayDate` | string (date-time) |  |
| `PaycheckFileID` | integer (int32) |  |
| `PeriodisedPayrollDate` | string (date-time) |  |
| `SettlementDate` | string (date-time) |  |
| `StatusCode` | integer (int32) |  |
| `ToDate` | string (date-time) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `needsRecalc` | boolean |  |
| `taxdrawfactor` | integer (int32) | 1 = Standard, 2 = Half, 3 = None |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `agacalculation` | AGACalculation[] |
| `transactions` | SalaryTransaction[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| POST | `payrollrun?action=PayrollJob` |  |
| POST | `payrollrun/{id}?action=approve` |  |
| POST | `payrollrun/{id}?action=assign` |  |
| POST | `payrollrun/{id}?action=assignTo` |  |
| GET | `payrollrun/{id}?action=audit` | query (required) |
| GET | `payrollrun?action=audit` | query (required) |
| PUT | `payrollrun/{id}?action=book` | accountingDate, numberseriesID, bookingType, refresh |
| PUT | `payrollrun/{id}?action=book-periodised` | numberseriesID |
| PUT | `payrollrun/{id}?action=calculate` |  |
| PUT | `payrollrun/{id}?action=calculatejob` |  |
| PUT | `payrollrun/{id}?action=calculateonemp` | empID (required) |
| PUT | `payrollrun?action=calculateonemp` | empID (required) |
| PUT | `payrollrun/{id}?action=control` |  |
| PUT | `payrollrun/{id}?action=email-paychecks` | grouped |
| POST | `payrollrun/{id}?action=employee-ledger-to-salary-transaction` |  |
| GET | `payrollrun/{id}?action=employeesonrun` |  |
| PUT | `payrollrun/{id}?action=generate-salarypostingdraft` |  |
| GET | `payrollrun/{id}?action=get-open-employee-ledger-lines` |  |
| GET | `payrollrun/{id}?action=latest` |  |
| GET | `payrollrun/{id}?action=latestperiod` | currYear (required) |
| GET | `payrollrun/{id}?action=next` | RunID (required), expand |
| GET | `payrollrun?action=otp-export` | runs (required), month (required), year (required), asXml |
| GET | `payrollrun/{id}?action=paymentlist` |  |
| GET | `payrollrun/{id}?action=payments-on-runs` |  |
| PUT | `payrollrun/{id}?action=payslipvault-paychecks` |  |
| GET | `payrollrun/{id}?action=periodised-postingsummary` | refresh, getDimensions |
| GET | `payrollrun/{id}?action=periodised-postingsummary-lines` | journalEntryID (required) |
| GET | `payrollrun/{id}?action=postingsummary` | bookingType, refresh, getDimensions |
| GET | `payrollrun/{id}?action=postingsummary-lines` | bookingType, refresh, getDimensions |
| GET | `payrollrun/{id}?action=postingsummarydraft` |  |
| GET | `payrollrun/{id}?action=previous` | RunID (required), expand |
| POST | `payrollrun/{id}?action=reassign` |  |
| POST | `payrollrun/{id}?action=reassignTo` |  |
| PUT | `payrollrun?action=rebuild` |  |
| PUT | `payrollrun/{id}?action=rebuildBalances` |  |
| PUT | `payrollrun/{id}?action=rebuildpostings` | bookingType, forceRegeneration |
| PUT | `payrollrun/{id}?action=recalculatetax` |  |
| POST | `payrollrun/{id}?action=reject` |  |
| PUT | `payrollrun/{id}?action=resetrun` |  |
| GET | `payrollrun/{id}?action=selectable-employees-on-payroll-run` |  |
| POST | `payrollrun/{id}?action=sendpaymentlist` |  |
| PUT | `payrollrun/{id}?action=setcategories` |  |
| GET | `payrollrun/{id}?action=time-to-salary-selection` | toDate |
| PUT | `payrollrun/{id}?action=vacationpay-closure` | year (required), SplitOnSixth |
| PUT | `payrollrun/{id}?action=vacationpay-from-emp-list` | year (required), SplitOnSixth |
| PUT | `payrollrun/{id}?action=vacationpay-from-vacationpayinfo-list` | year (required) |
| GET | `payrollrun/{id}?action=vacationpay-list` | year, lastyear, filter, showAll |
| PUT | `payrollrun/{id}?action=work-items-to-transes` |  |

## WageType — `wagetypes`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountNumber` | integer (int32) |  |
| `AccountNumber_balance` | integer (int32) |  |
| `AccrualAccountID` | integer (int32) |  |
| `ActiveProjectCostAdjustment` | boolean |  |
| `Base_EmploymentTax` | boolean |  |
| `Base_Payment` | boolean |  |
| `Base_Vacation` | boolean |  |
| `Base_div2` | boolean |  |
| `Base_div3` | boolean |  |
| `Benefit` | string | max 100 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `DaysOnBoard` | boolean |  |
| `Deleted` | boolean |  |
| `Description` | string | max 100 |
| `EmploymentCustomRateID` | integer (int32) |  |
| `FixedSalaryHolidayDeduction` | boolean |  |
| `GetRateFrom` | integer (int32) | 0 = WageType, 1 = MonthlyPayEmployee, 2 = HourlyPayEmployee, 3 = FreeRateEmployee, 4 = EmploymentCustomRate, 5 = WageTypeWithoutHistory |
| `HasExtendedAccrual` | boolean |  |
| `HasFixedAmount` | boolean |  |
| `HideFromPaycheck` | boolean |  |
| `ID` | integer (int32) |  |
| `IncomeType` | string | max 100 |
| `Increment` | number (double) |  |
| `IsEligibleForTaxBasis` | boolean |  |
| `IsFullTaxInHalfTaxPeriod` | boolean |  |
| `Keywords` | string |  |
| `Limit_WageTypeNumber` | integer (int32) |  |
| `Limit_newRate` | number (double) |  |
| `Limit_type` | integer (int32) | 0 = None, 1 = Amount, 2 = Sum |
| `Limit_value` | number (double) |  |
| `NoNumberOfHours` | boolean |  |
| `Postnr` | string | max 100 |
| `Rate` | number (double) |  |
| `RateFactor` | number (double) |  |
| `RatetypeColumn` | integer (int32) | 0 = none, 1 = Employment, 2 = Employee, 3 = Salary_scale |
| `SpecialAgaRule` | integer (int32) | 0 = Regular, 1 = AgaRefund, 2 = AgaPension, 3 = AgaRefund5Percent, 4 = AgaUnderLimit |
| `SpecialTaxAndContributionsRule` | integer (int32) | 0 = Standard, 1 = NettoPayment, 2 = SpesialDeductionForMaritim, 3 = Svalbard, 4 = PayAsYouEarnTaxOnPensions, 5 = JanMayenAndBiCountries, … |
| `SpecialTaxHandling` | string |  |
| `StandardWageTypeFor` | integer (int32) | 0 = None, 1 = TaxDrawTable, 2 = TaxDrawPercent, 3 = HolidayPayThisYear, 4 = HolidayPayLastYear, 5 = HolidayPayWithTaxDeduction, … |
| `StatusCode` | integer (int32) |  |
| `SupplementPackage` | string | max 255 |
| `SystemRequiredWageType` | integer (int32) |  |
| `Systemtype` | string | max 20 |
| `UnionDeductionType` | integer (int32) | 0 = None, 1 = Union, 2 = Insurance, 3 = OUOFund |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `ValidYear` | integer (int32) |  |
| `WageTypeConnectingID` | integer (int32) |  |
| `WageTypeName` | string | max 100 |
| `WageTypeNumber` | integer (int32) |  |
| `taxtype` | integer (int32) | 0 = Tax_None, 1 = Tax_Table, 2 = Tax_Percent, 3 = Tax_0 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `AccrualAccount` | Account |
| `CustomValues` | CustomValues |
| `EmploymentCustomRate` | EmploymentCustomRate |
| `SupplementaryInformations` | WageTypeSupplement[] |
| `WageTypeConnecting` | WageTypeConnecting |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `wagetypes/{id}?action=audit` | query (required) |
| GET | `wagetypes?action=audit` | query (required) |
| GET | `wagetypes?action=changed-wagetypes` |  |
| PUT | `wagetypes?action=create-and-update-connecting-wagetypes` |  |
| PUT | `wagetypes?action=create-and-update-standard-wagetypes` |  |
| PUT | `wagetypes?action=create-wagetypes-for-year` |  |
| GET | `wagetypes?action=get-rate` | wagetypeID (required), employmentID (required), employeeID (required) |
| PUT | `wagetypes?action=reassign-system-wage-types` |  |
| PUT | `wagetypes?action=sync-and-compare-standard-wagetypes` |  |
| PUT | `wagetypes/{id}?action=sync-supplements` |  |
| POST | `wagetypes?action=sync-wagetypes` |  |
| PUT | `wagetypes?action=synchronize` |  |
| GET | `wagetypes/{id}?action=used-in-payrollrun` |  |
| GET | `wagetypes?action=validamelding` | type (required), fordel (required), beskrivelse (required) |
| GET | `wagetypes?action=validate-validvalues` | year (required), period |

## Absence — `Absence`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AbsenceType` | integer (int32) | 1 = Vacation, 2 = SickLeave, 3 = SickChild, 4 = Leave |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `EmploymentID` | integer (int32) |  |
| `FromDate` | string (date-time) |  |
| `ID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `ToDate` | string (date-time) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Employment` | Employment |
| `Leaves` | EmployeeLeave[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `Absence?action=absence-quarterly` | year (required), departmentID, projectID, sex, absencetypes |
| GET | `Absence?action=absence-self-certified-quarterly` | year (required), quarter (required), subEntityID (required) |
| GET | `Absence/{id}?action=audit` | query (required) |
| GET | `Absence?action=audit` | query (required) |
| PUT | `Absence/{id}?action=count-work-days-for-absences` |  |
