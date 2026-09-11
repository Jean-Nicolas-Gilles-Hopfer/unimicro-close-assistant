# Banking and payments

Generated from the platform's OpenAPI document. Do not edit by hand — the next refresh overwrites it.

Field names are exact. A name that is not listed does not exist, however plausible it sounds — a query that filters on one returns unfiltered rows rather than an error.

These tables serve the statistics endpoint as well as the business API: the field names are what its `select`, `filter` and `orderby` accept, and the relation names are a starting point for its `expand`, which also takes a related model's own name. See the statistics reference for the query syntax they go into.

## Bank — `banks`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AddressID` | integer (int32) |  |
| `BIC` | string | max 255 |
| `BankCode` | string | max 20 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `EmailID` | integer (int32) |  |
| `ID` | integer (int32) |  |
| `InitialBIC` | string | max 11 |
| `Name` | string | max 255 |
| `PhoneID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `Web` | string | max 255 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `Address` | Address |
| `CustomValues` | CustomValues |
| `Email` | Email |
| `Phone` | Phone |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `banks/{id}?action=audit` | query (required) |
| GET | `banks?action=audit` | query (required) |
| GET | `banks?action=get-bank-from-accountnumber-lookup` | bankAccountNumber (required) |
| GET | `banks?action=get-iban-from-accountnumber-lookup` | bankAccountNumber (required) |
| GET | `banks?action=get-iban-upsert-bank` | bankAccountNumber (required) |
| GET | `banks?action=verify-iban` | iban (required) |
| GET | `banks?action=verify-iban-upsert-bank` | iban (required) |

## BankAccount — `bankaccounts`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountID` | integer (int32) |  |
| `AccountNumber` | string | max 100 |
| `BankAccountSettingsID` | integer (int32) |  |
| `BankAccountType` | string | max 100 |
| `BankID` | integer (int32) |  |
| `BusinessRelationID` | integer (int32) |  |
| `CompanySettingsID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `IBAN` | string | max 100 |
| `ID` | integer (int32) |  |
| `Label` | string | max 255 |
| `Locked` | boolean |  |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `BankAccountSettings` | BankAccountSettings |
| `CustomValues` | CustomValues |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| PUT | `bankaccounts/{id}?action=activate` |  |
| PUT | `bankaccounts/{id}?action=archive` |  |
| GET | `bankaccounts?action=audit` | query (required) |
| GET | `bankaccounts/{id}?action=audit` | query (required) |
| PUT | `bankaccounts/{id}?action=auto-update-bank-data` |  |
| POST | `bankaccounts?action=autoprovision` |  |
| GET | `bankaccounts/{id}?action=bank-balance` | force |
| POST | `bankaccounts?action=bank-balance` |  |
| PUT | `bankaccounts?action=change-start-balance` |  |
| POST | `bankaccounts?action=create-bankaccounts-from-bankservice-bankaccounts` |  |
| POST | `bankaccounts?action=create-company-bankaccount` |  |
| POST | `bankaccounts?action=create-company-bankaccounts` |  |
| PUT | `bankaccounts/{id}?action=deactivate` |  |
| GET | `bankaccounts?action=get-all-bank-balances` | forceUpdate |
| GET | `bankaccounts?action=get-bankservice-bankaccounts` |  |
| GET | `bankaccounts?action=get-connected-bankaccounts-to-account` | accountID (required), skipBankAccountID (required) |
| PUT | `bankaccounts/{id}?action=lock` |  |
| POST | `bankaccounts?action=set-missing-frombankaccounts-for-payments` | chunksize, bbanLookupLimit, ibanLookupLimit |
| PUT | `bankaccounts/{id}?action=summon-update` |  |
| PUT | `bankaccounts/{id}?action=unlock` |  |

## Payment — `payments`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Amount` | number (double) |  |
| `AmountCurrency` | number (double) |  |
| `AutoJournal` | boolean |  |
| `BankChargeAmount` | number (double) |  |
| `BusinessRelationID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CurrencyCodeID` | integer (int32) |  |
| `CurrencyExchangeRate` | number (double) |  |
| `CustomerInvoiceID` | integer (int32) |  |
| `CustomerInvoiceReminderID` | integer (int32) |  |
| `Debtor` | string | max 255 |
| `Deleted` | boolean |  |
| `Description` | string |  |
| `Domain` | string | max 100 |
| `DueDate` | string (date) |  |
| `ExternalBankAccountNumber` | string | max 35 |
| `FromBankAccountID` | integer (int32) |  |
| `ID` | integer (int32) |  |
| `InPaymentID` | string | max 36 |
| `InvoiceNumber` | string | max 100 |
| `IsCustomerPayment` | boolean | If true payments from customer else payments to supplier |
| `IsExternal` | boolean |  |
| `IsPaymentCancellationRequest` | boolean |  |
| `IsPaymentClaim` | boolean |  |
| `JournalEntryID` | integer (int32) |  |
| `OcrPaymentStrings` | string | max 500 |
| `PaymentBatchID` | integer (int32) |  |
| `PaymentCodeID` | integer (int32) |  |
| `PaymentDate` | string (date) |  |
| `PaymentID` | string | max 100 |
| `PaymentNotificationReportFileID` | integer (int32) |  |
| `PaymentStatusReportFileID` | integer (int32) |  |
| `Proprietary` | string | max 100 |
| `ReconcilePayment` | boolean |  |
| `SerialNumberOrAcctSvcrRef` | string | max 35 |
| `SigningBasketID` | integer (int32) |  |
| `StatusCode` | integer (int32) | 44000 = Unknown, 44001 = Created, 44002 = TransferredToBank, 44003 = RejectedByBank, 44004 = Completed, 44005 = PaymentFileGenerated, … |
| `StatusText` | string | max 500 |
| `SupplierInvoiceID` | integer (int32) |  |
| `ToBankAccountID` | integer (int32) |  |
| `TransactionID` | string |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VatReportID` | integer (int32) |  |
| `XmlTagEndToEndIdReference` | string | max 100 |
| `XmlTagPmtInfIdReference` | string | max 100 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `CustomerInvoice` | CustomerInvoice |
| `CustomerInvoiceReminder` | CustomerInvoiceReminder |
| `SupplierInvoice` | SupplierInvoice |
| `VatReport` | VatReport |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `payments?action=audit` | query (required) |
| GET | `payments/{id}?action=audit` | query (required) |
| PUT | `payments?action=batch-cancel-payment-claims` |  |
| PUT | `payments?action=batch-delete-and-credit` | credit |
| PUT | `payments?action=batch-delete-and-credit-all` | filter, hash, expand, credit |
| PUT | `payments?action=book-payments-from-file` | fileid (required), runasJob |
| POST | `payments?action=check-existing-customer-payback-payments` |  |
| POST | `payments?action=create-customer-payback-payments` |  |
| GET | `payments?action=create-hash-for-payments` | filter (required), expand (required) |
| POST | `payments?action=create-payment-batch` | isManual, hash, createPaymentFile, skipNegativePayeeValidation, skipNegativePayees |
| POST | `payments?action=create-payment-batch-for-all-payments` | isManual, hash, createFile, filter, expand, skipNegativePayees, skipNegativePayeeValidation |
| POST | `payments?action=create-payment-with-tracelink` | journalEntryID (required) |
| DELETE | `payments/{id}?action=delete-and-credit` |  |
| DELETE | `payments/{id}?action=force-delete` |  |
| DELETE | `payments/{id}?action=force-delete-and-credit` |  |
| POST | `payments?action=reset-all-payments` | filter, hash, expand, force |
| POST | `payments?action=reset-payment` | oldPaymentID (required) |
| POST | `payments?action=reset-payments` | force |
| PUT | `payments?action=update-payments-to-ignored` |  |

## PaymentBatch — `paymentbatches`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Camt054CMsgId` | string | max 255 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `HashValue` | string | max 100 |
| `ID` | integer (int32) |  |
| `IsCustomerPayment` | boolean |  |
| `NumberOfPayments` | integer (int32) |  |
| `OcrHeadingStrings` | string | max 500 |
| `OcrTransmissionNumber` | integer (int32) |  |
| `PaymentBatchTypeID` | integer (int32) |  |
| `PaymentFileID` | integer (int32) |  |
| `PaymentReferenceID` | string | max 200 |
| `PaymentStatusReportFileID` | integer (int32) |  |
| `PsuIpAddress` | string |  |
| `ReceiptDate` | string (date-time) |  |
| `ServiceID` | string |  |
| `StatusCode` | integer (int32) | 45000 = Ignore, 45001 = Pending, 45002 = PaymentFileGenerated, 45003 = PaymentFileTransferredBank, 45004 = ReceiptReceived, 45005 = ReceiptParsed, … |
| `TotalAmount` | number (double) |  |
| `TransferredDate` | string (date-time) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Payments` | Payment[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| POST | `paymentbatches/{id}?action=approve` |  |
| POST | `paymentbatches/{id}?action=assign` |  |
| POST | `paymentbatches/{id}?action=assignTo` |  |
| GET | `paymentbatches/{id}?action=audit` | query (required) |
| GET | `paymentbatches?action=audit` | query (required) |
| PUT | `paymentbatches?action=complete-customer-payment-registration` | ID (required) |
| POST | `paymentbatches/{id}?action=complete-customer-paymentbatch` |  |
| PUT | `paymentbatches?action=complete-registered-payments` | ID (required) |
| PUT | `paymentbatches?action=create-and-send-all-to-payment` |  |
| PUT | `paymentbatches?action=create-and-send-to-payment` |  |
| POST | `paymentbatches/{id}?action=dismiss` |  |
| PUT | `paymentbatches?action=generate-avtalegiro-batch-for-invoice-numbers` | isManual |
| PUT | `paymentbatches?action=generate-avtalegiro-batch-for-invoiceIDs` | isManual, isMergeable |
| PUT | `paymentbatches?action=generate-avtalegiro-batch-for-invoiceIDs-and-paymentIDs` | isManual, isMergeable |
| PUT | `paymentbatches?action=generate-avtalegiro-batch-for-payments` | isManual, isMergeable |
| PUT | `paymentbatches?action=generate-camt054C-string` |  |
| PUT | `paymentbatches?action=generate-ocr-giro-string` | fromBankAccountNumber, customEOLChar |
| PUT | `paymentbatches?action=generate-pain002-file` | status |
| PUT | `paymentbatches?action=generate-payment-file` | ID (required), skipNegativePayeeValidation |
| PUT | `paymentbatches?action=generate-receipt-file` |  |
| GET | `paymentbatches?action=get-bulk-batch-status` | batchID (required) |
| PUT | `paymentbatches?action=get-file-statuses-from-file-ids` |  |
| GET | `paymentbatches/{id}?action=get-remaining-approvals` |  |
| PUT | `paymentbatches?action=get-statuses-from-file-ids` |  |
| PUT | `paymentbatches?action=process-avtalegiro-receipt-file` | fileID (required) |
| PUT | `paymentbatches?action=process-avtalegiro-receipt-file-content` | filename (required) |
| POST | `paymentbatches/{id}?action=reassign` |  |
| POST | `paymentbatches/{id}?action=reassignTo` |  |
| PUT | `paymentbatches?action=register-and-complete-customer-payment` | fileID (required) |
| PUT | `paymentbatches?action=register-customer-payment-file` | fileID (required) |
| POST | `paymentbatches?action=register-payment-string` |  |
| PUT | `paymentbatches?action=register-receipt-file` | fileID (required) |
| PUT | `paymentbatches?action=register-receipt-file-camt054` | fileID (required) |
| PUT | `paymentbatches?action=register-receipt-file-pain002` | fileID (required) |
| POST | `paymentbatches/{id}?action=reject` |  |
| PUT | `paymentbatches?action=revert-payment-batch` | ID (required), recreatePayments, manual, runAsJob |
| PUT | `paymentbatches?action=send-batch-to-payment` | batchID (required) |
| PUT | `paymentbatches?action=update-all-payments-to-completed` | filter, hash, expand |
| PUT | `paymentbatches?action=update-all-payments-to-paid-and-journal-payments` | filter (required), hash (required), expand (required) |
| PUT | `paymentbatches?action=update-payments-to-completed` |  |
| PUT | `paymentbatches?action=update-payments-to-paid-and-journal-payments` |  |

## PaymentInfoType — `paymentinfotype`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Control` | integer (int32) | 10 = Modulus10 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `ID` | integer (int32) |  |
| `Length` | integer (int32) |  |
| `Locked` | boolean |  |
| `Name` | string | max 100 |
| `StatusCode` | integer (int32) | 42400 = Active, 42401 = Disabled |
| `Type` | integer (int32) | 1 = Regular, 2 = Balance, 3 = Collection, 4 = Special |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `PaymentInfoTypeParts` | PaymentInfoTypePart[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| PUT | `paymentinfotype?action=activate-paymentinfotype` | ID (required) |
| GET | `paymentinfotype/{id}?action=audit` | query (required) |
| GET | `paymentinfotype?action=audit` | query (required) |
| PUT | `paymentinfotype?action=deactivate-paymentinfotype` | ID (required) |
| GET | `paymentinfotype?action=get-paymentinfotype-parts-macros` |  |
| GET | `paymentinfotype?action=validate-get-paymentinfo` | customerInvoice (required), paymentInfoTypeID (required) |

## BankStatement — `bankstatements`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountID` | integer (int32) | Reference to a ledger-account |
| `Amount` | number (double) | Total amount for entire statement |
| `AmountCurrency` | number (double) |  |
| `ArchiveReference` | string | max 30 |
| `BankAccountID` | integer (int32) | Reference to a bank-account |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CurrencyCode` | string | max 10 |
| `Deleted` | boolean |  |
| `EndBalance` | number (double) | EndBalance defines the balance after the last entry in the statement |
| `FileID` | integer (int32) | Optional file-reference |
| `FromDate` | string (date) | Fromdate defines the first date of the period of the statement |
| `ID` | integer (int32) |  |
| `StartBalance` | number (double) | StartBalance defines the balance before the first entry in the statement |
| `StatementID` | string |  |
| `StatusCode` | integer (int32) | 48001 = Draft, 48002 = Completed |
| `ToDate` | string (date) | ToDate defines the last date of the period of the statement |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Entries` | BankStatementEntry[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `bankstatements?action=account-balance` | accountid (required), date |
| GET | `bankstatements?action=account-status` | accountid (required), fromdate, todate |
| GET | `bankstatements?action=account-status-monthly` | accountid (required), fromdate, todate |
| GET | `bankstatements?action=audit` | query (required) |
| GET | `bankstatements/{id}?action=audit` | query (required) |
| POST | `bankstatements/{id}?action=complete` |  |
| GET | `bankstatements?action=get-open-posts-count` | accountID, periodFrom, periodTo |
| POST | `bankstatements?action=import` | accountID (required), bankAccountID (required), fileID (required), maxLines |
| POST | `bankstatements?action=import-batch` | triggerAutomation |
| POST | `bankstatements?action=match-items` |  |
| POST | `bankstatements?action=preview` | accountid (required), fileID (required), maxLines |
| POST | `bankstatements/{id}?action=reopen` |  |
| POST | `bankstatements?action=save-statement-with-balance-history` |  |
| POST | `bankstatements?action=store-statements` | triggerAutomation |
| POST | `bankstatements?action=suggest-match` |  |
| POST | `bankstatements?action=sync-statements` | fromdate, forceSync, endDate, filterNonApiDuplicates |
| GET | `bankstatements?action=templates` |  |

## BankStatementEntry — `bankstatemententries`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Amount` | number (double) | Amount |
| `AmountCurrency` | number (double) |  |
| `ArchiveReference` | string | max 30 |
| `BankStatementID` | integer (int32) | Reference to "parent" bankstatement |
| `BookingDate` | string (date) | Date of booking in the bank |
| `CID` | string | Payment-reference / KID; max 30 |
| `Category` | string | Transaction-category; max 30 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CurrencyCode` | string | max 10 |
| `Deleted` | boolean |  |
| `Description` | string | Description; max 100 |
| `ID` | integer (int32) |  |
| `InvoiceNumber` | string | max 20 |
| `OpenAmount` | number (double) | OpenAmount (unmatched / remainder) |
| `OpenAmountCurrency` | number (double) |  |
| `ReceiverAccount` | string | Receiver bank-account; max 20 |
| `Receivername` | string | Receivername; max 80 |
| `SenderAccount` | string | Senders bank-account; max 20 |
| `SenderName` | string | Sendername; max 80 |
| `StatementID` | string |  |
| `StatusCode` | integer (int32) |  |
| `StructuredReference` | string | max 20 |
| `TransactionId` | string |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `ValueDate` | string (date) | Valuedate (could be later than bookingdate) |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `bankstatemententries/{id}?action=audit` | query (required) |
| GET | `bankstatemententries?action=audit` | query (required) |
| GET | `bankstatemententries?action=entries-for-account` | accountid (required), fromdate, todate |
| GET | `bankstatemententries?action=open-entries-report` | accountid (required), fromdate, todate |
| GET | `bankstatemententries?action=open-journalentries-report` | accountid (required), fromdate, todate, top |
