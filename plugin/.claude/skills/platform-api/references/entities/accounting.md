# Accounting

Generated from the platform's OpenAPI document. Do not edit by hand — the next refresh overwrites it.

Field names are exact. A name that is not listed does not exist, however plausible it sounds — a query that filters on one returns unfiltered rows rather than an error.

These tables serve the statistics endpoint as well as the business API: the field names are what its `select`, `filter` and `orderby` accept, and the relation names are a starting point for its `expand`, which also takes a related model's own name. See the statistics reference for the query syntax they go into.

## Account — `accounts`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountGroupID` | integer (int32) | The ID of the account group. |
| `AccountID` | integer (int32) | Balance account-id. Normally only used by Customer, Supplier and Employee accounts linking them to payables or receivables. |
| `AccountName` | string | The name of the account.; max 255 |
| `AccountNumber` | integer (int32) | The account number. |
| `AccountSetupID` | integer (int32) | Reference to the account template when doing synchronization. If combined with Dosynchronize, this account will be updated with the values from the template. The action "PUT /accounts?action=synchronize-standard-account-setup" will trigger the update. |
| `Active` | boolean | A value indicating whether this account is active. |
| `CostAllocationID` | integer (int32) | The ID of the cost allocation associated with this account. |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CurrencyCodeID` | integer (int32) | The ID of the currency code associated with this account. |
| `CustomerID` | integer (int32) | The customer ID associated with this account. |
| `Deleted` | boolean |  |
| `Description` | string | The description of the account.; max 255 |
| `DimensionsID` | integer (int32) | Reference to the forced combination of dimensions for this account. |
| `DoSynchronize` | boolean | Flag indicating if this account should be synchronized with updates from standard accounts |
| `EmployeeID` | integer (int32) | The employee ID associated with this account. |
| `ID` | integer (int32) |  |
| `Keywords` | string | Keywords is used to enhance search on accounts in different views.; max 255 |
| `LockManualPosts` | boolean | A value indicating whether manual entries are locked for this account. |
| `Locked` | boolean | A value indicating whether this account is locked. |
| `SaftMappingAccountID` | integer (int32) | The ID of the SAFT mapping account associated with this account. |
| `StatusCode` | integer (int32) |  |
| `SupplierID` | integer (int32) | The supplier ID associated with this account. |
| `SystemAccount` | boolean | A value indicating whether this account is a system account. |
| `TopLevelAccountGroupID` | integer (int32) | The ID of the top-level account group. |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UsePostPost` | boolean | A value indicating whether to use matching on this account. |
| `UseVatDeductionGroupID` | integer (int32) | The ID of the VAT deduction group to be used for this account. |
| `VatTypeID` | integer (int32) | The ID of the VAT type. |
| `Visible` | boolean | A value indicating whether this account is visible. |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `AccountGroup` | AccountGroup |
| `Alias` | AccountAlias[] |
| `CompatibleAccountGroups` | AccountGroup[] |
| `CostAllocation` | CostAllocation |
| `CustomValues` | CustomValues |
| `Customer` | Customer |
| `Dimensions` | Dimensions |
| `Employee` | Employee |
| `MainAccount` | Account |
| `MandatoryDimensions` | AccountMandatoryDimension[] |
| `SaftMappingAccount` | SaftMappingAccount |
| `SubAccounts` | Account[] |
| `Supplier` | Supplier |
| `TopLevelAccountGroup` | AccountGroup |
| `VatType` | VatType |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `accounts/{accountid}/subaccounts?action=audit` | query (required) |
| GET | `accounts?action=audit` | query (required) |
| GET | `accounts/{id}?action=audit` | query (required) |
| GET | `accounts/{accountid}/subaccounts/{id}?action=audit` | query (required) |
| GET | `accounts?action=balance` | FinancialYear |
| GET | `accounts?action=balance-grouped` | FinancialYear |
| PUT | `accounts?action=bulk-save` |  |
| PUT | `accounts?action=control-and-fill-out-missing-account-links` | checkSaftMapping (required), checkAltInnMapping (required), updateOnlyMissing |
| PUT | `accounts?action=control-and-set-missing-accountgroups` | overrideExistingAccountGroups |
| POST | `accounts?action=convert-account-digits` | digits (required), removeUnused |
| GET | `accounts?action=customer-statement` |  |
| GET | `accounts?action=employee-statement` |  |
| GET | `accounts?action=get-account-usage` | accountID (required) |
| GET | `accounts?action=get-account-usage-detailed` | accountID (required), maxHitPerEntity |
| GET | `accounts?action=get-kpi` | FinancialYear |
| GET | `accounts/{id}?action=is-account-used` |  |
| GET | `accounts?action=payables-by-age` | date, FinancialYear, accountFrom, accountTo, useDueDate, accountType |
| GET | `accounts?action=payables-by-age-detailed` |  |
| GET | `accounts?action=profit-and-loss-grouped` | FinancialYear |
| GET | `accounts?action=profit-and-loss-periodical` | FinancialYear, SumAllYears |
| GET | `accounts?action=profit-and-loss-periodical-dimension` | FinancialYear, SumAllYears |
| GET | `accounts?action=saftmapping-accounts` |  |
| PUT | `accounts?action=set-saftmappings` |  |
| GET | `accounts?action=statement` |  |
| GET | `accounts?action=supplier-statement` |  |
| PUT | `accounts?action=synchronize-standard-account-setup` |  |
| GET | `accounts?action=trialbalance` |  |
| GET | `accounts?action=valid` |  |
| GET | `accounts?action=valid-with-hidden` |  |

## AccountGroup — `accountgroups`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountGroupSetID` | integer (int32) |  |
| `AccountGroupSetupID` | integer (int32) |  |
| `AccountID` | integer (int32) |  |
| `CompatibleAccountID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `GroupNumber` | string | max 10 |
| `ID` | integer (int32) |  |
| `MainGroupID` | integer (int32) |  |
| `Name` | string | max 100 |
| `StatusCode` | integer (int32) |  |
| `Summable` | boolean |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `AccountGroupSet` | AccountGroupSet |
| `CustomValues` | CustomValues |
| `MainGroup` | AccountGroup |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `accountgroups/{id}?action=audit` | query (required) |
| GET | `accountgroups?action=audit` | query (required) |

## JournalEntry — `journalentries`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `Description` | string | max 200 |
| `ExternalReference` | string |  |
| `ExternalSource` | string |  |
| `FinancialYearID` | integer (int32) |  |
| `ID` | integer (int32) |  |
| `IsExternal` | boolean |  |
| `JournalEntryAccrualID` | integer (int32) |  |
| `JournalEntryDraftGroup` | string |  |
| `JournalEntryNumber` | string | max 100 |
| `JournalEntryNumberNumeric` | integer (int32) |  |
| `NumberSeriesID` | integer (int32) |  |
| `NumberSeriesTaskID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `DraftLines` | JournalEntryLineDraft[] |
| `JournalEntryAccrual` | Accrual |
| `Lines` | JournalEntryLine[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `journalentries?action=audit` | query (required) |
| GET | `journalentries/{id}?action=audit` | query (required) |
| POST | `journalentries?action=book-journal-entries` | allowJournalingRegardlessOfLockedDates |
| POST | `journalentries?action=book-journal-entries-create-invoices` | generateKID |
| POST | `journalentries?action=book-journal-entry-against-payment` | journalEntryID (required), paymentID (required) |
| PUT | `journalentries?action=book-payment-against-customer` | customerID (required), paymentID (required), isBalanceKID |
| PUT | `journalentries?action=book-payment-against-main-account` | paymentID (required), accountID (required) |
| PUT | `journalentries?action=book-payment-against-supplier` | supplierID (required), paymentID (required) |
| POST | `journalentries?action=credit-and-book-journal-entry` | journalEntryID (required), creditDate |
| POST | `journalentries?action=credit-and-book-journalentry` | journalEntryID (required) |
| POST | `journalentries?action=credit-journal-entry` | journalEntryNumber (required), creditDate |
| POST | `journalentries?action=credit-journalentry` | journalEntryNumber (required) |
| DELETE | `journalentries?action=delete-journal-entry-draft-group` | journalEntryDraftGroup (required) |
| GET | `journalentries?action=get-journal-entry-data` | batchNumber, journalEntryID, supplierInvoiceID, journalEntryDraftGroup |
| GET | `journalentries?action=get-journal-entry-period-data` | accountID (required) |
| GET | `journalentries?action=get-or-create-financial-year` | current |
| POST | `journalentries?action=nextjournalentrynumber` |  |
| POST | `journalentries?action=save-journal-entries-as-draft` |  |
| PUT | `journalentries?action=update-external-reference` | journalEntryID (required), externalReference (required) |
| PUT | `journalentries?action=update-external-references` | externalReference (required) |

## JournalEntryLine — `journalentrylines`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountID` | integer (int32) | Nullable foreign key to a general ledger account. Employee/Supplier/Customer Accounts are subaccounts. Lines can be booked with a subaccount on AccountID, resulting in general ledger account on AccountID and Employee/Supplier/Customer on SubAccountID |
| `AccrualID` | integer (int32) | Nullable foreign key to Accrual. |
| `Amount` | number (double) | The total amount for the JournalEntryLine, given in the default company currency. Automatically set based on AmountCurrency when IsExternal = false and value is omitted. |
| `AmountCurrency` | number (double) | Total amount for the JournalEntryLine, given in the currency set on the JournalEntryLine. |
| `BatchNumber` | integer (int32) | Not much used; utility, e.g., GET on route journalentry?action=get-journal-entry-data accepts batchnumber as param to retrieve journalentry data |
| `CostAllocationID` | integer (int32) | Nullable foreign key to CostAllocation. |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CurrencyCodeID` | integer (int32) | Foreign key to currency used. Defines the currency of TaxBasisAmountCurrency & AmountCurrency. Value is automatically set to the same as CompanySettings.BaseCurrencyCodeID when omitted unless IsExternal=true. |
| `CurrencyExchangeRate` | number (double) | The exchange rate used to convert between JournalEntry currency and company currency. Default 1 if no foreign currency; is automatically set based on currencies, or fallback to result of calculation (Amount / AmountCurrency) unless IsExternal=true |
| `CustomerInvoiceID` | integer (int32) | Nullable foreign key for CustomerInvoice. Normally only set on debit lines of CustomerInvoice JournalEntryLines |
| `CustomerOrderID` | integer (int32) | Nullable foreignkey to a CustomerOrder. |
| `Deleted` | boolean |  |
| `Description` | string | An Optional line description with max length of 500 characters. Lines generated, such as VAT lines; will have autofilled descriptions along the lines of (© AccountUsed, VAT [...]); max 500 |
| `DimensionsID` | integer (int32) | Nullable foreign key to Dimensions. Dimensions allow for connecting multiple dimensions, e.g., Project, Department, Dimension5 to the journalentryline. If omitted on creation, a default empty dimension is set |
| `DocumentDate` | string (date) |  |
| `DueDate` | string (date) | Nullable. Represents the due date. |
| `FinancialDate` | string (date) | Required. The financial date for the JournalEntryLine. Used to check against CompanySettings.AccountingLockedDate to compare whether it can be booked or not. |
| `ID` | integer (int32) |  |
| `InvoiceNumber` | string | Invoice number reference, max length 100, should reference a CustomerInvoice/SupplierInvoice. Some actions, e.g., POST /journalentries?action=book-journal-entries, will try to match and create payments on existing CustomerInvoices if filled.; max 100 |
| `IsExternal` | boolean | Nullable bool. Marks the JournalEntryLine as external. If enabled, the JournalEntryLine BeforeSave handler will not perform validations (e.g., Vat Date/Period, Amount is not 0) and mutations (e.g., set VatPercent based on VatTypeID) |
| `ItemSourceID` | integer (int32) | Nullable foreign key to a ItemSource |
| `JournalEntryID` | integer (int32) | Relational key to JournalEntry. Required in cases where unit of work is not utilized to create the JournalEntryLine(s) |
| `JournalEntryLineDraftID` | integer (int32) | Nullable foreign key to JournalEntryLineDraft. If JournalEntryLine was created based on JournalEntryLineDraft; contains reference to the JournalEntryLineDraft of which it is based on. |
| `JournalEntryNumber` | string | The associated JournalEntry number e.g., 34-2024. Max length of 100 characters. For numeric representation, see JournalEntryNumberNumeric.; max 100 |
| `JournalEntryNumberNumeric` | integer (int32) | Nullable numeric representation of JournalEntryNumber. Unless IsExternal=true, value is automatically set from JournalEntryNumber by taking the first digits from the string value, e.g., 45-2025 becomes 45. |
| `JournalEntryTypeID` | integer (int32) | Nullable foreign key to JournalEntryTypeID. Defines a category for the current JournalEntry (only one JournalEntryTypeID may be set in a given journalEntry). e.g., SupplierInvoice = 6; All lines will contain JournalEntryTypeID = 6 |
| `NumberOfItems` | number (double) | The number of items related to the journal entry line. |
| `OriginalJournalEntryPost` | integer (int32) |  |
| `OriginalReferencePostID` | integer (int32) | Nullable. Foreign key for crediting; see also ReferenceCreditPostID which is the opposite of this property. When a line credits another line, the crediting line will contain a reference to the line which the current line credits. |
| `PaymentID` | string | The payment reference, also known as KID. Max length of 255.; max 255 |
| `PaymentInfoTypeID` | integer (int32) | Nullable reference to a PaymentInfoType, defines the payment type for the JournalEntryLine. e.g., regular, collection or balance. |
| `PaymentReferenceID` | integer (int32) | Nullable reference to a Payment. |
| `PeriodID` | integer (int32) | Nullable foreign key to the period this journalentryline is in. When omitted, API attempts to set the period based on FinancialDate unless IsExternal=true |
| `PostPostJournalEntryLineID` | integer (int32) | Nullable reference to another JournalEntryLine (typically a payment line)  which the current line is marked/closed against. |
| `ReferenceCreditPostID` | integer (int32) | Nullable. Foreign key for crediting; Lines that are credited, will contain a reference to the line which credits the current line |
| `ReferenceOriginalPostID` | integer (int32) | Unused self referencing foreign key. |
| `RegisteredDate` | string (date) | The date the line was registered in the system. Defaults to datetime now if omitted |
| `RestAmount` | number (double) | Nullable. The rest amount for the current JournalEntryLine. Value indicates how much of amount is paid, given in company default currency. Is set to the same value as Amount if omitted, unless IsExternal = true. |
| `RestAmountCurrency` | number (double) | Nullable. The rest amount for the current JournalEntryLine. Value indicates how much of AmountCurrency is paid, given in the currency which is set on the JournalEntryLine. Is set to the same value as AmountCurrency if omitted, unless IsExternal = true. |
| `Signature` | string | Unused. Max length of 255 characters; max 255 |
| `StatusCode` | integer (int32) | 31001 = Open, 31002 = PartlyMarked, 31003 = Marked, 31004 = Credited |
| `SubAccountID` | integer (int32) | Nullable foreign key to SubAccount. SubAccounts are used when the booked account references another account. See AccountID description |
| `SupplierInvoiceID` | integer (int32) | Nullable foreign key for SupplierInvoice. Normally set on the JournalEntryLine which defines the head of the SupplierInvoice |
| `TaxBasisAmount` | number (double) | The tax basis amount, given in the default company currency. For VAT lines. Contains the sum of which is the basis for the value in amount. |
| `TaxBasisAmountCurrency` | number (double) | The tax basis amount, given in the currency set on the JournalEntryLine. For VAT lines. Contains the sum of which is the basis for the value in AmountCurrency. |
| `UnitOfMeasureID` | integer (int32) | Nullable foreign key to UnitOfMeasure. |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VatDate` | string (date) | Date used for VAT operations; setting correct VAT period and VAT percent. When JournalEntry is not external; defaults to the same date as FinancialDate if omitted or specified by CompanySettings.UseFinancialDateToCalculateVatPercent |
| `VatDeductionPercent` | number (double) | Nullable. The percentage of which to deduct from the VAT amount when calculating VAT for the given line |
| `VatJournalEntryPostID` | integer (int32) | Nullable dynamic foreign key which is used on VAT lines. Points to another JournalEntryLine of which was the basis of the current line |
| `VatPercent` | number (double) | Defines the vat percentage for the selected VatType/VatTypeID. Value is automatically set based on VatType/VatTypeID when omitted unless isExternal=true. |
| `VatPeriodID` | integer (int32) | Nullable foreign key to the VAT period this journalentryline is in. When omitted, API attempts to set the period based on VatDate unless IsExternal=true |
| `VatPostKey` | string | For external use; a reference value for each basis line and VAT line pair, requires JournalEntry.External=true, when booking JournalEntry. Booking routine matches pairs, fills JournalEntryVatPostID relation. Lowest value of pair is interpreted as VAT |
| `VatReportID` | integer (int32) | Nullable foreign key to VAT report |
| `VatTypeID` | integer (int32) | Nullable foreign key to the VAT type for the journalentryline. |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `Accrual` | Accrual |
| `CostAllocation` | CostAllocation |
| `CustomValues` | CustomValues |
| `Dimensions` | Dimensions |
| `ItemSource` | ItemSource |
| `JournalEntry` | JournalEntry |
| `JournalEntryLineDraft` | JournalEntryLineDraft |
| `OriginalReferencePost` | JournalEntryLine |
| `ReferenceCreditPost` | JournalEntryLine |
| `ReferenceOriginalPost` | JournalEntryLine |
| `VatJournalEntryPost` | JournalEntryLine |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `journalentrylines/{id}?action=audit` | query (required) |
| GET | `journalentrylines?action=audit` | query (required) |
| GET | `journalentrylines?action=get-journal-entry-period-data` | odataFilter (required) |
| GET | `journalentrylines?action=get-journal-entry-postpost-data` | includeOpenPosts (required), includeMarkedPosts (required), customerID, supplierID, accountID, includePayments, includeDimensionsInfo, includeMarkings |
| POST | `journalentrylines/{id}?action=mark` |  |

## Supplier — `suppliers`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `BusinessRelationID` | integer (int32) |  |
| `CostAllocationID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CreditDays` | integer (int32) |  |
| `CurrencyCodeID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `DimensionsID` | integer (int32) |  |
| `GLN` | string | max 13 |
| `HasDirectDebit` | boolean |  |
| `ID` | integer (int32) |  |
| `Localization` | string | max 10 |
| `OrgNumber` | string | max 100 |
| `PeppolAddress` | string | max 50 |
| `PostingMethod` | integer (int32) | PostingMethod defines how ledger suggestions are handled for EHF SupplierInvoices using this supplier. Both CostAllocation and StandardCostAccount requires that you additionally fill in CostAllocationID or StandardCostAccountID - when setting the PostingMethod Default is 0 - MostUsedAccountByOrgno.; 0 = MostUsedAccountByOrgNumber, 1 = StandardCostAccount, 2 = CostAllocation, 3 = SplitByProduct |
| `PreventSupplierInvoicePayments` | boolean | Specifies whether invoices from this supplier should have `PreventPayment` set to true |
| `SelfEmployed` | boolean |  |
| `StandardCostAccountID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `SubAccountNumberSeriesID` | integer (int32) |  |
| `SupplierNumber` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `WebUrl` | string | max 255 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CostAllocation` | CostAllocation |
| `CustomValues` | CustomValues |
| `Dimensions` | Dimensions |
| `Info` | BusinessRelation |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| PUT | `suppliers?action=activate` | id (required) |
| GET | `suppliers/{id}?action=audit` | query (required) |
| GET | `suppliers?action=audit` | query (required) |
| PUT | `suppliers?action=block` | id (required) |
| PUT | `suppliers?action=bulk-save` |  |
| PUT | `suppliers?action=deactivate` | id (required) |
| PUT | `suppliers?action=delete` | id (required) |
| GET | `suppliers/{id}?action=next` |  |
| GET | `suppliers/{id}?action=previous` |  |
| PUT | `suppliers?action=unblock` | id (required) |

## SupplierInvoice — `supplierinvoices`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AmountRegards` | string | max 255 |
| `BankAccountID` | integer (int32) |  |
| `Comment` | string |  |
| `CostSupplierID` | integer (int32) | This only applies to SupplierInvoiceOriginType == 3 (Refund) This is normally the supplier that an employee paid |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CreditDays` | integer (int32) |  |
| `Credited` | boolean |  |
| `CreditedAmount` | number (double) |  |
| `CreditedAmountCurrency` | number (double) |  |
| `CurrencyCodeID` | integer (int32) |  |
| `CurrencyExchangeRate` | number (double) |  |
| `CustomerOrgNumber` | string | max 100 |
| `CustomerPerson` | string | max 255 |
| `DefaultDimensionsID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `DeliveryDate` | string (date) |  |
| `DeliveryMethod` | string | max 100 |
| `DeliveryName` | string | max 255 |
| `DeliveryTerm` | string | max 100 |
| `DeliveryTermsID` | integer (int32) |  |
| `FinancialDate` | string (date) |  |
| `FreeTxt` | string |  |
| `FromBankAccountID` | integer (int32) |  |
| `ID` | integer (int32) |  |
| `InternalNote` | string | max 500 |
| `InvoiceAddressLine1` | string | max 255 |
| `InvoiceAddressLine2` | string | max 255 |
| `InvoiceAddressLine3` | string | max 255 |
| `InvoiceCity` | string | max 100 |
| `InvoiceCountry` | string | max 100 |
| `InvoiceCountryCode` | string | max 100 |
| `InvoiceDate` | string (date) |  |
| `InvoiceNumber` | string | max 100 |
| `InvoiceOriginType` | integer (int32) | 1 = SupplierInvoice, 2 = Receipt, 3 = Refund |
| `InvoicePostalCode` | string | max 10 |
| `InvoiceReceiverName` | string | max 255 |
| `InvoiceReferenceID` | integer (int32) |  |
| `InvoiceType` | integer (int32) |  |
| `IsSentToPayment` | boolean |  |
| `JournalEntryID` | integer (int32) |  |
| `LastReinvoicedAt` | string (date-time) |  |
| `MarkedAsCompletedOnProject` | boolean |  |
| `OurReference` | string | max 255 |
| `PayableRoundingAmount` | number (double) | The rounding amount for this supplier invoice |
| `PayableRoundingCurrencyAmount` | number (double) | The rounding currency amount for this supplier invoice |
| `Payment` | string | max 255 |
| `PaymentDueDate` | string (date) |  |
| `PaymentID` | string | max 100 |
| `PaymentInformation` | string | max 255 |
| `PaymentMethodID` | integer (int32) |  |
| `PaymentStatus` | integer (int32) |  |
| `PaymentTerm` | string | max 100 |
| `PaymentTermsID` | integer (int32) |  |
| `PreventPayment` | boolean | Specifies whether a supplier invoice is blocked from being paid by the system |
| `PrintStatus` | integer (int32) |  |
| `ProjectID` | integer (int32) |  |
| `ReInvoiceID` | integer (int32) |  |
| `ReinvoicedStatusCode` | integer (int32) |  |
| `Requisition` | string | Invoice order reference. For EHF invoices the field is mapped from xpath `//cac:OrderReference/cbc:ID`. Image/pdf files require OCR and the value must be labeled with `Rekvisisjon` to be mapped; max 255 |
| `RestAmount` | number (double) |  |
| `RestAmountCurrency` | number (double) |  |
| `SalesPerson` | string | max 255 |
| `ShippingAddressLine1` | string | max 255 |
| `ShippingAddressLine2` | string | max 255 |
| `ShippingAddressLine3` | string | max 255 |
| `ShippingCity` | string | max 100 |
| `ShippingCountry` | string | max 100 |
| `ShippingCountryCode` | string | max 100 |
| `ShippingPostalCode` | string | max 10 |
| `StatusCode` | integer (int32) | 30101 = Draft, 30102 = ForApproval, 30103 = Approved, 30104 = Journaled, 30108 = Rejected |
| `SupplierID` | integer (int32) |  |
| `SupplierOrgNumber` | string | max 100 |
| `TaxExclusiveAmount` | number (double) |  |
| `TaxExclusiveAmountCurrency` | number (double) |  |
| `TaxInclusiveAmount` | number (double) |  |
| `TaxInclusiveAmountCurrency` | number (double) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VatTotalsAmount` | number (double) |  |
| `VatTotalsAmountCurrency` | number (double) |  |
| `YourReference` | string | max 255 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CostSupplier` | Supplier |
| `CustomValues` | CustomValues |
| `DefaultDimensions` | Dimensions |
| `Items` | SupplierInvoiceItem[] |
| `JournalEntry` | JournalEntry |
| `Payments` | Payment[] |
| `ReInvoice` | ReInvoice |
| `Supplier` | Supplier |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| POST | `supplierinvoices/{id}?action=approve` |  |
| POST | `supplierinvoices/{id}?action=assign` |  |
| POST | `supplierinvoices/{id}?action=assign-to` |  |
| GET | `supplierinvoices?action=audit` | query (required) |
| GET | `supplierinvoices/{id}?action=audit` | query (required) |
| POST | `supplierinvoices/{id}?action=cancelApprovement` |  |
| POST | `supplierinvoices?action=credit-supplierinvoice-journalentry` | supplierInvoiceId (required), keepData, creditPayment, keepPayment |
| POST | `supplierinvoices/{id}?action=finish` |  |
| GET | `supplierinvoices?action=get-invoice-payment-postpost-lines` | id (required) |
| GET | `supplierinvoices?action=get-selfemployed-payments` | year (required) |
| GET | `supplierinvoices?action=get-supplier-invoice-summary` | odataFilter (required) |
| GET | `supplierinvoices?action=get-supplierinvoices-details` | id (required), supplierID (required), fromDate (required), toDate (required) |
| POST | `supplierinvoices/{id}?action=journal` |  |
| PUT | `supplierinvoices?action=modify-booked-supplierinvoice` | supplierInvoiceId (required), creditPayment, keepPayment |
| POST | `supplierinvoices/{id}?action=notify-approval-tasks` | daysToDueDate (required), redirectUrl |
| POST | `supplierinvoices/{id}?action=pay` |  |
| PUT | `supplierinvoices?action=pay` | id (required) |
| PUT | `supplierinvoices/{id}?action=payInvoice` |  |
| POST | `supplierinvoices/{id}?action=reAssign` |  |
| POST | `supplierinvoices/{id}?action=reAssign-to` |  |
| PUT | `supplierinvoices/{id}?action=reject` |  |
| POST | `supplierinvoices/{id}?action=rejectAssignment` |  |
| POST | `supplierinvoices/{id}?action=rejectInvoice` |  |
| POST | `supplierinvoices/{id}?action=restore` |  |
| POST | `supplierinvoices/{id}?action=revertFinish` |  |
| PUT | `supplierinvoices?action=sendForPayment` | id (required) |
| POST | `supplierinvoices/{id}?action=sendForPayment` |  |
| POST | `supplierinvoices/{id}?action=sendForPaymentWithPaymentData` |  |
| PUT | `supplierinvoices/{id}?action=smartbooking` |  |
| PUT | `supplierinvoices/{id}?action=trigger-approval-rules` |  |
| POST | `supplierinvoices/{id}?action=try-auto-assign` |  |

## VatType — `vattypes`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Alias` | string | max 255 |
| `AvailableInModules` | boolean |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `DirectJournalEntryOnly` | boolean | Used to configure that the vat type can only be used for direct journalentry using the specified account for the vattype |
| `ID` | integer (int32) |  |
| `InUse` | boolean |  |
| `IncomingAccountID` | integer (int32) |  |
| `JournalAccountNumber` | integer (int32) |  |
| `Locked` | boolean |  |
| `Name` | string | max 255 |
| `OutgoingAccountID` | integer (int32) |  |
| `OutputVat` | boolean |  |
| `ReversedTaxDutyVat` | boolean |  |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VatCode` | string | max 255 |
| `VatCodeGroupID` | integer (int32) |  |
| `VatCodeGroupingValue` | integer (int32) | 1 = Costs, 2 = Invoice, 3 = Calculation, 4 = Income, 5 = NoTax, 6 = Special, … |
| `VatTypeSetupID` | integer (int32) |  |
| `Visible` | boolean |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `IncomingAccount` | Account |
| `OutgoingAccount` | Account |
| `VatCodeGroup` | VatCodeGroup |
| `VatReportReferences` | VatReportReference[] |
| `VatTypePercentages` | VatTypePercentage[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `vattypes/{id}?action=audit` | query (required) |
| GET | `vattypes?action=audit` | query (required) |
| PUT | `vattypes/{id}?action=hidden` |  |
| PUT | `vattypes/{id}?action=lock` |  |
| PUT | `vattypes?action=synchronize` |  |
| PUT | `vattypes/{id}?action=unlock` |  |
| GET | `vattypes?action=valid` |  |
| GET | `vattypes?action=valid-with-hidden` |  |
| GET | `vattypes/{id}?action=vatcode` |  |
| PUT | `vattypes/{id}?action=visible` |  |

## Accrual — `accruals`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccrualAmount` | number (double) |  |
| `AccrualJournalEntryMode` | integer (int32) |  |
| `BalanceAccountID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `ID` | integer (int32) |  |
| `JournalEntryLineDraftID` | integer (int32) |  |
| `ResultAccountID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `JournalEntryLineDraft` | JournalEntryLineDraft |
| `Periods` | AccrualPeriod[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `accruals/{id}?action=audit` | query (required) |
| GET | `accruals?action=audit` | query (required) |

## Dimensions — `dimensions`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AssetID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `DepartmentID` | integer (int32) |  |
| `Dimension10ID` | integer (int32) |  |
| `Dimension5ID` | integer (int32) |  |
| `Dimension6ID` | integer (int32) |  |
| `Dimension7ID` | integer (int32) |  |
| `Dimension8ID` | integer (int32) |  |
| `Dimension9ID` | integer (int32) |  |
| `ID` | integer (int32) |  |
| `ProjectID` | integer (int32) |  |
| `ProjectTaskID` | integer (int32) |  |
| `RegionID` | integer (int32) |  |
| `ResponsibleID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `dimensions/{id}?action=audit` | query (required) |
| GET | `dimensions?action=audit` | query (required) |
| GET | `dimensions?action=is-used` | dimensionType (required), dimensionID (required) |

## Project — `projects`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AGAZoneID` | integer (int32) |  |
| `Amount` | number (double) |  |
| `CostPrice` | number (double) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `Description` | string | max 500 |
| `DimensionsID` | integer (int32) |  |
| `EndDate` | string (date) |  |
| `ID` | integer (int32) |  |
| `Name` | string | max 255 |
| `PlannedEnddate` | string (date) |  |
| `PlannedStartdate` | string (date) |  |
| `Price` | number (double) |  |
| `ProjectApproverID` | integer (int32) |  |
| `ProjectCustomerID` | integer (int32) |  |
| `ProjectLeadName` | string | max 255 |
| `ProjectNumber` | string | max 255 |
| `ProjectNumberNumeric` | integer (int32) |  |
| `ProjectNumberSeriesID` | integer (int32) |  |
| `StartDate` | string (date) |  |
| `StatusCode` | integer (int32) | 42201 = Registered, 42202 = OfferPhase, 42203 = InProgress, 42204 = Completed, 42205 = Discarded |
| `Total` | number (double) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `Visible` | boolean |  |
| `WorkPlaceAddressID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `ProjectApprover` | User |
| `ProjectCustomer` | Customer |
| `ProjectResources` | ProjectResource[] |
| `ProjectTasks` | ProjectTask[] |
| `WorkPlaceAddress` | Address |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| POST | `projects/{id}?action=CompleteProject` | projectID (required) |
| POST | `projects/{id}?action=DiscardProject` | projectID (required) |
| POST | `projects/{id}?action=InitiateProject` | projectID (required) |
| POST | `projects/{id}?action=ReactivateProject` | projectID (required) |
| POST | `projects/{id}?action=StartProject` | projectID (required) |
| GET | `projects?action=all-with-isUsed-prop` |  |
| GET | `projects/{id}?action=audit` | query (required) |
| GET | `projects?action=audit` | query (required) |
| GET | `projects/{id}?action=is-used` |  |

## Department — `departments`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `DepartmentApproverID` | integer (int32) |  |
| `DepartmentManagerName` | string | max 100 |
| `DepartmentNumber` | string | max 255 |
| `DepartmentNumberNumeric` | integer (int32) |  |
| `DepartmentNumberSeriesID` | integer (int32) |  |
| `Description` | string | max 100 |
| `ID` | integer (int32) |  |
| `Name` | string | max 100 |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `Visible` | boolean |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `DepartmentApprover` | User |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `departments/{id}?action=audit` | query (required) |
| GET | `departments?action=audit` | query (required) |
| GET | `departments/{id}?action=is-used` |  |

## FinancialYear — `financialyears`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `ID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `ValidFrom` | string (date) |  |
| `ValidTo` | string (date) |  |
| `Year` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `financialyears/{id}?action=audit` | query (required) |
| GET | `financialyears?action=audit` | query (required) |
| GET | `financialyears?action=create-financial-year` | year (required) |
| GET | `financialyears?action=get-or-create-financial-year` | year (required) |
