# Sales

Generated from the platform's OpenAPI document. Do not edit by hand — the next refresh overwrites it.

Field names are exact. A name that is not listed does not exist, however plausible it sounds — a query that filters on one returns unfiltered rows rather than an error.

These tables serve the statistics endpoint as well as the business API: the field names are what its `select`, `filter` and `orderby` accept, and the relation names are a starting point for its `expand`, which also takes a related model's own name. See the statistics reference for the query syntax they go into.

## Customer — `customers`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AcceptableDelta4CustomerPayment` | number (double) | Delta value that is acceptable between customer invoice and payment |
| `AcceptableDelta4CustomerPaymentAccountID` | integer (int32) | Account for acceptable delta between customer invoice and payment |
| `AvtaleGiro` | boolean |  |
| `AvtaleGiroNotification` | boolean |  |
| `BusinessRelationID` | integer (int32) |  |
| `CalculateInterestOnReminders` | boolean |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CreditDays` | integer (int32) |  |
| `CurrencyCodeID` | integer (int32) |  |
| `CustomerGroupID` | integer (int32) |  |
| `CustomerNumber` | integer (int32) |  |
| `CustomerNumberKidAlias` | string | max 255 |
| `DefaultCustomerInvoiceReportID` | integer (int32) |  |
| `DefaultCustomerOrderReportID` | integer (int32) |  |
| `DefaultCustomerQuoteReportID` | integer (int32) |  |
| `DefaultDistributionsID` | integer (int32) |  |
| `DefaultSellerID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `DeliveryTermsID` | integer (int32) |  |
| `DimensionsID` | integer (int32) |  |
| `DontSendReminders` | boolean |  |
| `DontUseFactoring` | boolean |  |
| `EInvoiceAgreementReference` | string | max 50 |
| `EfakturaIdentifier` | string | max 100 |
| `FactoringNumber` | integer (int32) |  |
| `GLN` | string | max 13 |
| `ID` | integer (int32) |  |
| `InvoiceChargeID` | integer (int32) |  |
| `IsPrivate` | boolean |  |
| `Localization` | string | max 10 |
| `OrgNumber` | string | max 100 |
| `PaymentTermsID` | integer (int32) |  |
| `PeppolAddress` | string | max 50 |
| `ReminderEmailAddress` | string | max 255 |
| `SocialSecurityNumber` | string | max 20 |
| `StatusCode` | integer (int32) |  |
| `SubAccountNumberSeriesID` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VatTypeID` | integer (int32) |  |
| `WebUrl` | string | max 255 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `Account` | Account |
| `Companies` | SubCompany[] |
| `CustomValues` | CustomValues |
| `CustomerGroup` | CustomerGroup |
| `CustomerInvoices` | CustomerInvoice[] |
| `CustomerOrders` | CustomerOrder[] |
| `CustomerQuotes` | CustomerQuote[] |
| `DefaultSeller` | Seller |
| `DeliveryTerms` | Terms |
| `Dimensions` | Dimensions |
| `Distributions` | Distributions |
| `Info` | BusinessRelation |
| `InvoiceCharge` | InvoiceCharge |
| `PaymentTerms` | Terms |
| `Sellers` | SellerLink[] |
| `VatType` | VatType |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| PUT | `customers?action=activate` | id (required) |
| GET | `customers/{id}?action=audit` | query (required) |
| GET | `customers?action=audit` | query (required) |
| PUT | `customers?action=block` | id (required) |
| PUT | `customers?action=bulk-save` |  |
| PUT | `customers?action=deactivate` | id (required) |
| GET | `customers/{id}?action=get-invoices-with-reminders` |  |
| GET | `customers/{id}?action=get-price-deals` |  |
| GET | `customers/{id}?action=next` |  |
| GET | `customers/{id}?action=previous` |  |
| GET | `customers?action=validate-customer-KID-Alias` | customerKidAlias (required) |

## BusinessRelation — `business-relations`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `DefaultBankAccountID` | integer (int32) |  |
| `DefaultContactID` | integer (int32) |  |
| `DefaultEmailID` | integer (int32) |  |
| `DefaultPhoneID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `ID` | integer (int32) |  |
| `InvoiceAddressID` | integer (int32) |  |
| `Name` | string | max 255 |
| `ShippingAddressID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `Addresses` | Address[] |
| `BankAccounts` | BankAccount[] |
| `Contacts` | Contact[] |
| `CustomValues` | CustomValues |
| `DefaultBankAccount` | BankAccount |
| `DefaultContact` | Contact |
| `DefaultEmail` | Email |
| `DefaultPhone` | Phone |
| `Emails` | Email[] |
| `InvoiceAddress` | Address |
| `Phones` | Phone[] |
| `ShippingAddress` | Address |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `business-relations/{id}?action=audit` | query (required) |
| GET | `business-relations?action=audit` | query (required) |
| GET | `business-relations?action=search-data-hotel` | searchText (required) |

## Contact — `contacts`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Comment` | string | max 500 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `ID` | integer (int32) |  |
| `InfoID` | integer (int32) |  |
| `ParentBusinessRelationID` | integer (int32) |  |
| `Role` | string | max 100 |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Info` | BusinessRelation |
| `ParentBusinessRelation` | BusinessRelation |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `contacts/{id}?action=audit` | query (required) |
| GET | `contacts?action=audit` | query (required) |

## Address — `contacts/{contactid}/addresses`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AddressLine1` | string | max 255 |
| `AddressLine2` | string | max 255 |
| `AddressLine3` | string | max 255 |
| `BusinessRelationID` | integer (int32) |  |
| `City` | string | max 100 |
| `Country` | string | max 100 |
| `CountryCode` | string | max 100 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `ID` | integer (int32) |  |
| `PostalCode` | string | max 100 |
| `Region` | string | max 100 |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `BusinessRelation` | BusinessRelation |
| `CustomValues` | CustomValues |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `contacts/{contactid}/addresses/{id}?action=audit` | query (required) |
| GET | `contacts/{contactid}/addresses?action=audit` | query (required) |

## CustomerInvoice — `invoices`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccrualID` | integer (int32) |  |
| `AmountRegards` | string | max 255 |
| `AssetID` | integer (int32) |  |
| `BankAccountID` | integer (int32) |  |
| `CollectorStatusCode` | integer (int32) |  |
| `Comment` | string | max 500 |
| `ContractDocumentReference` | string |  |
| `ContributionMarginAmount` | number (double) |  |
| `ContributionPercent` | number (double) |  |
| `CostPriceAmount` | number (double) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CreatedFromJournalEntry` | boolean |  |
| `CreditDays` | integer (int32) |  |
| `Credited` | boolean |  |
| `CreditedAmount` | number (double) |  |
| `CreditedAmountCurrency` | number (double) |  |
| `CurrencyCodeID` | integer (int32) |  |
| `CurrencyExchangeRate` | number (double) |  |
| `CustomerID` | integer (int32) |  |
| `CustomerName` | string | max 255 |
| `CustomerOrgNumber` | string | max 100 |
| `CustomerPerson` | string | max 255 |
| `DefaultDimensionsID` | integer (int32) |  |
| `DefaultSellerID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `DeliveryDate` | string (date) |  |
| `DeliveryMethod` | string | max 100 |
| `DeliveryName` | string | max 255 |
| `DeliveryTerm` | string | max 100 |
| `DeliveryTermsID` | integer (int32) |  |
| `DistributionPlanID` | integer (int32) |  |
| `DontSendReminders` | boolean |  |
| `DontUseFactoring` | boolean |  |
| `EmailAddress` | string | max 255 |
| `ExternalDebtCollectionNotes` | string | max 255 |
| `ExternalDebtCollectionReference` | string | max 50 |
| `ExternalDebtCollectionUrl` | string |  |
| `ExternalReference` | string | max 20 |
| `ExternalStatus` | integer (int32) |  |
| `FreeTxt` | string | max 500 |
| `ID` | integer (int32) |  |
| `InternalNote` | string | max 500 |
| `InvoiceAccrualDefinitionID` | integer (int32) |  |
| `InvoiceAddressLine1` | string | max 255 |
| `InvoiceAddressLine2` | string | max 255 |
| `InvoiceAddressLine3` | string | max 255 |
| `InvoiceCity` | string | max 100 |
| `InvoiceCountry` | string | max 100 |
| `InvoiceCountryCode` | string | max 100 |
| `InvoiceDate` | string (date) |  |
| `InvoiceNumber` | string | max 100 |
| `InvoiceNumberSeriesID` | integer (int32) |  |
| `InvoicePostalCode` | string | max 10 |
| `InvoiceReceiverName` | string | max 255 |
| `InvoiceReferenceID` | integer (int32) |  |
| `InvoiceType` | integer (int32) |  |
| `JournalEntryID` | integer (int32) |  |
| `LastPaymentDate` | string (date) |  |
| `MergeAttachments` | boolean |  |
| `OurReference` | string | max 255 |
| `PayableRoundingAmount` | number (double) | The rounding amount for this invoice |
| `PayableRoundingCurrencyAmount` | number (double) | The rounding currency amount for this invoice |
| `Payment` | string | max 100 |
| `PaymentDueDate` | string (date) |  |
| `PaymentID` | string | max 100 |
| `PaymentInfoTypeID` | integer (int32) |  |
| `PaymentInformation` | string | max 255 |
| `PaymentTerm` | string | max 100 |
| `PaymentTermsID` | integer (int32) |  |
| `PrintStatus` | integer (int32) |  |
| `Requisition` | string | max 255 |
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
| `StatusCode` | integer (int32) | 42001 = Draft, 42002 = Invoiced, 42003 = PartlyPaid, 42004 = Paid, 42005 = Sold, 42006 = Credited, … |
| `SupplierOrgNumber` | string | max 100 |
| `TaxExclusiveAmount` | number (double) |  |
| `TaxExclusiveAmountCurrency` | number (double) |  |
| `TaxInclusiveAmount` | number (double) |  |
| `TaxInclusiveAmountCurrency` | number (double) |  |
| `UpdateCurrencyAmountsOnDateChange` | boolean |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UseReportID` | integer (int32) |  |
| `VatTotalsAmount` | number (double) |  |
| `VatTotalsAmountCurrency` | number (double) |  |
| `VatTypeID` | integer (int32) |  |
| `WriteoffJournalEntryID` | integer (int32) |  |
| `WriteoffPaymentJournalEntryID` | integer (int32) |  |
| `YourReference` | string | max 255 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `Accrual` | Accrual |
| `Asset` | Asset |
| `CustomValues` | CustomValues |
| `CustomerInvoiceReminders` | CustomerInvoiceReminder[] |
| `DefaultDimensions` | Dimensions |
| `DefaultSeller` | Seller |
| `DeliveryTerms` | Terms |
| `DistributionPlan` | DistributionPlan |
| `InvoiceAccrualDefinition` | InvoiceAccrualDefinition |
| `Items` | CustomerInvoiceItem[] |
| `PaymentTerms` | Terms |
| `Payments` | Payment[] |
| `Sellers` | SellerLink[] |
| `VatType` | VatType |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `invoices?action=audit` | query (required) |
| GET | `invoices/{id}?action=audit` | query (required) |
| POST | `invoices?action=calculate-invoice-summary` |  |
| GET | `invoices/{id}?action=calculate-vat-summary` |  |
| GET | `invoices?action=calculate-vat-summary` | InvoiceNumber (required) |
| PUT | `invoices/{id}?action=create-credit-draft-invoice` |  |
| PUT | `invoices/{id}?action=create-invoice-journalentrydraft` |  |
| PUT | `invoices/{id}?action=factoring-accepted` | externalStatus, externalDebtCollectionReference, externalDebtCollectionNotes |
| PUT | `invoices/{id}?action=factoring-declined` | reason |
| GET | `invoices?action=get-barnepass-data` | year (required) |
| GET | `invoices?action=get-customer` | orgNumber (required), name |
| GET | `invoices?action=get-customer-invoice-summary` | odataFilter (required) |
| GET | `invoices?action=get-customers` | customersNrAndName (required) |
| GET | `invoices/{id}?action=get-merge-attachment` |  |
| GET | `invoices/{id}?action=get-payments` |  |
| POST | `invoices/{id}?action=invoice` |  |
| PUT | `invoices?action=match-invoices-manual` | paymentID (required) |
| GET | `invoices/{id}?action=next` |  |
| POST | `invoices/{id}?action=pay` |  |
| PUT | `invoices/{id}?action=pay-invoice-with-number-series-id` | numberSeriesID (required) |
| PUT | `invoices/{id}?action=payInvoice` |  |
| GET | `invoices/{id}?action=previous` |  |
| POST | `invoices?action=regular` |  |
| PUT | `invoices/{id}?action=remove-accrual` |  |
| PUT | `invoices/{id}?action=request-offer` |  |
| PUT | `invoices?action=reset-orderitems-from-creditnote` |  |
| PUT | `invoices/{id}?action=set-customer-invoice-printstatus` | ID (required), printStatus (required) |
| PUT | `invoices/{id}?action=toggle-reminder-stop` |  |
| PUT | `invoices/{id}?action=update-external-status` |  |
| GET | `invoices/{id}?action=validate-vipps-user` |  |

## CustomerInvoiceItem — `invoiceitems`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountID` | integer (int32) |  |
| `AccountingCost` | string | max 255 |
| `BuyersItemIdentification` | string |  |
| `CalculateGrossPriceBasedOnNetPrice` | boolean |  |
| `Comment` | string | max 500 |
| `ContributionMargin` | number (double) |  |
| `ContributionPercent` | number (double) |  |
| `CostPrice` | number (double) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CurrencyCodeID` | integer (int32) |  |
| `CurrencyExchangeRate` | number (double) |  |
| `CustomerInvoiceID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `DimensionsID` | integer (int32) |  |
| `Discount` | number (double) |  |
| `DiscountCurrency` | number (double) |  |
| `DiscountPercent` | number (double) |  |
| `ID` | integer (int32) |  |
| `InvoicePeriodEndDate` | string (date) |  |
| `InvoicePeriodStartDate` | string (date) |  |
| `ItemSourceID` | integer (int32) |  |
| `ItemText` | string | max 255 |
| `NumberOfItems` | number (double) |  |
| `OrderItemId` | integer (int32) |  |
| `OrderLineReference` | string |  |
| `PriceDealItemID` | integer (int32) |  |
| `PriceExVat` | number (double) |  |
| `PriceExVatCurrency` | number (double) |  |
| `PriceIncVat` | number (double) |  |
| `PriceSetByUser` | boolean |  |
| `ProductID` | integer (int32) |  |
| `SortIndex` | integer (int32) |  |
| `StatusCode` | integer (int32) | 41301 = Draft, 41302 = Invoiced |
| `SumCostPrice` | number (double) |  |
| `SumTotalExVat` | number (double) |  |
| `SumTotalExVatCurrency` | number (double) |  |
| `SumTotalIncVat` | number (double) |  |
| `SumTotalIncVatCurrency` | number (double) |  |
| `SumVat` | number (double) |  |
| `SumVatCurrency` | number (double) |  |
| `Unit` | string | max 100 |
| `UnitOfMeasureID` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VatPercent` | number (double) |  |
| `VatTypeID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Dimensions` | Dimensions |
| `ItemSource` | ItemSource |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `invoiceitems/{id}?action=audit` | query (required) |
| GET | `invoiceitems?action=audit` | query (required) |
| POST | `invoiceitems/{id}?action=invoice` |  |

## CustomerInvoiceReminder — `invoicereminders`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CreatedByReminderRuleID` | integer (int32) | The rule creating this reminder |
| `CurrencyCodeID` | integer (int32) | A reference to the currencyCode for this reminder |
| `CurrencyExchangeRate` | number (double) |  |
| `CustomerInvoiceID` | integer (int32) | A reference to the customer invoice object that generated this reminder |
| `DebtCollectionFee` | number (double) |  |
| `DebtCollectionFeeCurrency` | number (double) |  |
| `Deleted` | boolean |  |
| `Description` | string | Description is used in emails/documents. This may contain macros/references to models that are rendered into the text; max 1000 |
| `DimensionsID` | integer (int32) |  |
| `DueDate` | string (date) | The due date for this reminder |
| `EmailAddress` | string | max 255 |
| `ID` | integer (int32) |  |
| `InterestFee` | number (double) |  |
| `InterestFeeCurrency` | number (double) |  |
| `Notified` | boolean |  |
| `RemindedDate` | string (date) | The reminder date for this reminder, i.e. the date it was generated |
| `ReminderFee` | number (double) | The reminder fee for this reminder |
| `ReminderFeeCurrency` | number (double) |  |
| `ReminderNumber` | integer (int32) | The reminder number for this reminder |
| `ReminderRuleType` | integer (int32) | I.e. a reminder or debt collection notification |
| `RestAmount` | number (double) |  |
| `RestAmountCurrency` | number (double) |  |
| `RunNumber` | integer (int32) | The run number is a unique number for an execution that created one or several reminders |
| `StatusCode` | integer (int32) | 42101 = Registered, 42102 = Sent, 42103 = Paid, 42104 = Completed, 42105 = Failed, 42106 = SentToDebtCollection, … |
| `Title` | string | Title used in emails/documents when reminders are sent; max 100 |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Payments` | Payment[] |
| `Tracelinks` | Tracelink[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `invoicereminders?action=audit` | query (required) |
| GET | `invoicereminders/{id}?action=audit` | query (required) |
| PUT | `invoicereminders?action=can-distribute-reminders` |  |
| POST | `invoicereminders?action=create-customerinvoice-reminders-from-parameters` | remindAll, reminderSteps |
| POST | `invoicereminders?action=create-invoicereminders-for-invoicelist` |  |
| POST | `invoicereminders?action=create-invoicereminders-from-parameters` | getDueInvoicesOnly (required), compareWithDate, invoiceWithReminderStop, searchText, reminderNumber |
| POST | `invoicereminders?action=create-invoicereminders-from-reminder-rules` |  |
| POST | `invoicereminders?action=create-notification-ready-for-debt-collection` |  |
| PUT | `invoicereminders/{id}?action=credit-open-fee-and-interests` | invoiceID (required) |
| PUT | `invoicereminders?action=distribute-reminders` |  |
| GET | `invoicereminders?action=export-reminders-to-excel` | orderby, filter, reminderNumberFilter, returnActiveReminders |
| PUT | `invoicereminders?action=failed-to-send` |  |
| GET | `invoicereminders?action=get-customer-invoice-and-reminder-data` | getDueInvoicesOnly (required), compareWithDate, invoicesWithReminderStop, searchText, reminderNumber, invoiceId, top, skip, orderby, export |
| GET | `invoicereminders?action=get-customer-invoice-and-reminder-sums` |  |
| GET | `invoicereminders?action=get-customer-invoices-ready-for-debt-collection` | includeInvoiceWithReminderStop (required), top, skip |
| GET | `invoicereminders?action=get-customer-invoices-ready-for-reminding` | includeInvoiceWithReminderStop, top, skip, orderby, filter, reminderNumber |
| GET | `invoicereminders?action=get-customer-invoices-sent-to-debt-collection` |  |
| GET | `invoicereminders?action=get-invoice-and-reminder-count` |  |
| POST | `invoicereminders?action=get-invoicereminders-for-invoicelist` |  |
| POST | `invoicereminders?action=get-invoicereminders-from-reminder-rules` |  |
| GET | `invoicereminders?action=get-invoices-with-active-reminders` | top, skip, orderby, filter, reminderNumberFilter, returnNeedsAttention |
| GET | `invoicereminders?action=get-reminder-interest-fee-details` | invoiceID (required), reminderNumber (required), reminderFilter (required) |
| GET | `invoicereminders?action=get-sum-customer-invoices-ready-for-reminding` |  |
| GET | `invoicereminders?action=get-sum-reminders-to-debt-collection` |  |
| POST | `invoicereminders?action=prerun-invoicereminders-for-invoicelist` |  |
| POST | `invoicereminders?action=prerun-invoicereminders-from-parameters` | getDueInvoicesOnly (required), compareWithDate, invoiceWithReminderStop, searchText, reminderNumber |
| PUT | `invoicereminders?action=queue-for-debt-collection` |  |
| PUT | `invoicereminders/{id}?action=revert-last-reminder` |  |
| PUT | `invoicereminders?action=send` |  |
| POST | `invoicereminders/{id}?action=send` |  |
| PUT | `invoicereminders?action=send-invoice-print` |  |
| PUT | `invoicereminders?action=set-status-to-complete` |  |
| PUT | `invoicereminders?action=set-status-to-debt-collection` |  |
| PUT | `invoicereminders?action=set-status-to-sent` |  |
| PUT | `invoicereminders/{id}?action=transfer-fee-or-interest-to-invoice-or-order` | invoiceID (required), entity (required), entityID (required), productID (required) |

## CustomerOrder — `orders`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccrualID` | integer (int32) |  |
| `Comment` | string | max 500 |
| `ContractDocumentReference` | string |  |
| `ContributionMarginAmount` | number (double) |  |
| `ContributionPercent` | number (double) |  |
| `CostPriceAmount` | number (double) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CreditDays` | integer (int32) |  |
| `CurrencyCodeID` | integer (int32) |  |
| `CurrencyExchangeRate` | number (double) |  |
| `CustomerID` | integer (int32) |  |
| `CustomerName` | string | max 255 |
| `CustomerOrgNumber` | string | max 100 |
| `CustomerPerson` | string | max 255 |
| `DefaultDimensionsID` | integer (int32) |  |
| `DefaultSellerID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `DeliveryDate` | string (date) |  |
| `DeliveryMethod` | string | max 100 |
| `DeliveryName` | string | max 255 |
| `DeliveryTerm` | string | max 100 |
| `DeliveryTermsID` | integer (int32) |  |
| `DistributionPlanID` | integer (int32) |  |
| `EmailAddress` | string | max 255 |
| `FreeTxt` | string | max 500 |
| `ID` | integer (int32) |  |
| `InternalNote` | string | max 500 |
| `InvoiceAddressLine1` | string | max 255 |
| `InvoiceAddressLine2` | string | max 255 |
| `InvoiceAddressLine3` | string | max 255 |
| `InvoiceCity` | string | max 100 |
| `InvoiceCountry` | string | max 100 |
| `InvoiceCountryCode` | string | max 100 |
| `InvoicePostalCode` | string | max 10 |
| `InvoiceReceiverName` | string | max 255 |
| `OrderDate` | string (date) |  |
| `OrderNumber` | integer (int32) |  |
| `OrderNumberSeriesID` | integer (int32) |  |
| `OurReference` | string | max 255 |
| `PayableRoundingAmount` | number (double) | The rounding amount for this order |
| `PayableRoundingCurrencyAmount` | number (double) | The rounding currency amount for this order |
| `PaymentInfoTypeID` | integer (int32) |  |
| `PaymentTerm` | string | max 100 |
| `PaymentTermsID` | integer (int32) |  |
| `PrintStatus` | integer (int32) |  |
| `ReadyToInvoice` | boolean |  |
| `Requisition` | string | max 255 |
| `RestAmountCurrency` | number (double) |  |
| `RestExclusiveAmountCurrency` | number (double) |  |
| `SalesPerson` | string | max 255 |
| `ShippingAddressLine1` | string | max 255 |
| `ShippingAddressLine2` | string | max 255 |
| `ShippingAddressLine3` | string | max 255 |
| `ShippingCity` | string | max 100 |
| `ShippingCountry` | string | max 100 |
| `ShippingCountryCode` | string | max 100 |
| `ShippingPostalCode` | string | max 10 |
| `StatusCode` | integer (int32) | 41001 = Draft, 41002 = Registered, 41003 = PartlyTransferredToInvoice, 41004 = TransferredToInvoice, 41005 = Completed |
| `SupplierOrgNumber` | string | max 100 |
| `TaxExclusiveAmount` | number (double) |  |
| `TaxExclusiveAmountCurrency` | number (double) |  |
| `TaxInclusiveAmount` | number (double) |  |
| `TaxInclusiveAmountCurrency` | number (double) |  |
| `UpdateCurrencyAmountsOnDateChange` | boolean |  |
| `UpdateCurrencyOnToInvoice` | boolean |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UseReportID` | integer (int32) |  |
| `VatTotalsAmount` | number (double) |  |
| `VatTotalsAmountCurrency` | number (double) |  |
| `VatTypeID` | integer (int32) |  |
| `YourReference` | string | max 255 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `Accrual` | Accrual |
| `CustomValues` | CustomValues |
| `DefaultDimensions` | Dimensions |
| `DefaultSeller` | Seller |
| `DeliveryTerms` | Terms |
| `Items` | CustomerOrderItem[] |
| `PaymentTerms` | Terms |
| `ReferencePoints` | ReferencePoint[] |
| `Sellers` | SellerLink[] |
| `VatType` | VatType |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `orders/{id}?action=audit` | query (required) |
| GET | `orders?action=audit` | query (required) |
| POST | `orders?action=calculate-order-summary` |  |
| GET | `orders/{id}?action=calculate-vat-summary` |  |
| GET | `orders?action=calculate-vat-summary` | OrderNumber (required) |
| POST | `orders/{id}?action=complete` |  |
| GET | `orders/{id}?action=next` |  |
| POST | `orders/{id}?action=partlyTransferToInvoice` |  |
| GET | `orders/{id}?action=previous` |  |
| POST | `orders/{id}?action=register` |  |
| PUT | `orders/{id}?action=reset-order-and-items` |  |
| PUT | `orders/{id}?action=set-customer-order-printstatus` | ID (required), printStatus (required) |
| PUT | `orders/{id}?action=transfer-to-invoice` | copyFiles |
| POST | `orders/{id}?action=transferToInvoice` |  |

## CustomerOrderItem — `orderitems`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountID` | integer (int32) |  |
| `BuyersItemIdentification` | string |  |
| `CalculateGrossPriceBasedOnNetPrice` | boolean |  |
| `Comment` | string | max 500 |
| `ContributionMargin` | number (double) |  |
| `ContributionPercent` | number (double) |  |
| `CostPrice` | number (double) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CurrencyCodeID` | integer (int32) |  |
| `CurrencyExchangeRate` | number (double) |  |
| `CustomerOrderID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `DimensionsID` | integer (int32) |  |
| `Discount` | number (double) |  |
| `DiscountCurrency` | number (double) |  |
| `DiscountPercent` | number (double) |  |
| `ExternalReference` | string |  |
| `ID` | integer (int32) |  |
| `ItemSourceID` | integer (int32) |  |
| `ItemText` | string | max 255 |
| `NumberOfItems` | number (double) |  |
| `OrderLineReference` | string |  |
| `PriceDealItemID` | integer (int32) |  |
| `PriceExVat` | number (double) |  |
| `PriceExVatCurrency` | number (double) |  |
| `PriceIncVat` | number (double) |  |
| `PriceSetByUser` | boolean |  |
| `ProductID` | integer (int32) |  |
| `ReadyToInvoice` | boolean |  |
| `SortIndex` | integer (int32) |  |
| `StatusCode` | integer (int32) | 41101 = Draft, 41102 = Registered, 41103 = TransferredToInvoice, 41104 = Completed |
| `SumCostPrice` | number (double) |  |
| `SumTotalExVat` | number (double) |  |
| `SumTotalExVatCurrency` | number (double) |  |
| `SumTotalIncVat` | number (double) |  |
| `SumTotalIncVatCurrency` | number (double) |  |
| `SumVat` | number (double) |  |
| `SumVatCurrency` | number (double) |  |
| `Unit` | string | max 100 |
| `UnitOfMeasureID` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VatPercent` | number (double) |  |
| `VatTypeID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Dimensions` | Dimensions |
| `ItemSource` | ItemSource |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `orderitems/{id}?action=audit` | query (required) |
| GET | `orderitems?action=audit` | query (required) |
| POST | `orderitems/{id}?action=complete` |  |
| POST | `orderitems/{id}?action=register` |  |
| POST | `orderitems/{id}?action=toInvoice` |  |

## CustomerQuote — `quotes`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Comment` | string | max 500 |
| `ContractDocumentReference` | string |  |
| `ContributionMarginAmount` | number (double) |  |
| `ContributionPercent` | number (double) |  |
| `CostPriceAmount` | number (double) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CreditDays` | integer (int32) |  |
| `CurrencyCodeID` | integer (int32) |  |
| `CurrencyExchangeRate` | number (double) |  |
| `CustomerID` | integer (int32) |  |
| `CustomerName` | string | max 255 |
| `CustomerOrgNumber` | string | max 100 |
| `CustomerPerson` | string | max 255 |
| `DefaultDimensionsID` | integer (int32) |  |
| `DefaultSellerID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `DeliveryDate` | string (date) |  |
| `DeliveryMethod` | string | max 100 |
| `DeliveryName` | string | max 255 |
| `DeliveryTerm` | string | max 100 |
| `DeliveryTermsID` | integer (int32) |  |
| `DistributionPlanID` | integer (int32) |  |
| `EmailAddress` | string | max 255 |
| `FreeTxt` | string | max 500 |
| `ID` | integer (int32) |  |
| `InquiryReference` | integer (int32) |  |
| `InternalNote` | string | max 500 |
| `InvoiceAddressLine1` | string | max 255 |
| `InvoiceAddressLine2` | string | max 255 |
| `InvoiceAddressLine3` | string | max 255 |
| `InvoiceCity` | string | max 100 |
| `InvoiceCountry` | string | max 100 |
| `InvoiceCountryCode` | string | max 100 |
| `InvoicePostalCode` | string | max 10 |
| `InvoiceReceiverName` | string | max 255 |
| `OurReference` | string | max 255 |
| `PayableRoundingAmount` | number (double) | The rounding amount for this quote |
| `PayableRoundingCurrencyAmount` | number (double) | The rounding currency amount for this quote |
| `PaymentInfoTypeID` | integer (int32) |  |
| `PaymentTerm` | string | max 100 |
| `PaymentTermsID` | integer (int32) |  |
| `PrintStatus` | integer (int32) |  |
| `QuoteDate` | string (date) |  |
| `QuoteNumber` | integer (int32) |  |
| `QuoteNumberSeriesID` | integer (int32) |  |
| `Requisition` | string | max 255 |
| `SalesPerson` | string | max 255 |
| `ShippingAddressLine1` | string | max 255 |
| `ShippingAddressLine2` | string | max 255 |
| `ShippingAddressLine3` | string | max 255 |
| `ShippingCity` | string | max 100 |
| `ShippingCountry` | string | max 100 |
| `ShippingCountryCode` | string | max 100 |
| `ShippingPostalCode` | string | max 10 |
| `StatusCode` | integer (int32) | 40101 = Draft, 40102 = Registered, 40103 = ShippedToCustomer, 40104 = CustomerAccepted, 40105 = TransferredToOrder, 40106 = TransferredToInvoice, … |
| `SupplierOrgNumber` | string | max 100 |
| `TaxExclusiveAmount` | number (double) |  |
| `TaxExclusiveAmountCurrency` | number (double) |  |
| `TaxInclusiveAmount` | number (double) |  |
| `TaxInclusiveAmountCurrency` | number (double) |  |
| `UpdateCurrencyAmountsOnDateChange` | boolean |  |
| `UpdateCurrencyOnToInvoice` | boolean |  |
| `UpdateCurrencyOnToOrder` | boolean |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UseReportID` | integer (int32) |  |
| `ValidUntilDate` | string (date) |  |
| `VatTotalsAmount` | number (double) |  |
| `VatTotalsAmountCurrency` | number (double) |  |
| `VatTypeID` | integer (int32) |  |
| `YourReference` | string | max 255 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `DefaultDimensions` | Dimensions |
| `DefaultSeller` | Seller |
| `DeliveryTerms` | Terms |
| `Items` | CustomerQuoteItem[] |
| `PaymentTerms` | Terms |
| `Sellers` | SellerLink[] |
| `VatType` | VatType |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `quotes/{id}?action=audit` | query (required) |
| GET | `quotes?action=audit` | query (required) |
| POST | `quotes?action=calculate-quote-summary` |  |
| GET | `quotes/{id}?action=calculate-vat-summary` |  |
| GET | `quotes?action=calculate-vat-summary` | QuoteNumber (required) |
| POST | `quotes/{id}?action=complete` |  |
| POST | `quotes/{id}?action=customerAccept` |  |
| GET | `quotes/{id}?action=next` |  |
| GET | `quotes/{id}?action=previous` |  |
| POST | `quotes/{id}?action=register` |  |
| PUT | `quotes/{id}?action=set-customer-quote-printstatus` | ID (required), printStatus (required) |
| POST | `quotes/{id}?action=shipToCustomer` |  |
| POST | `quotes/{id}?action=toInvoice` |  |
| POST | `quotes/{id}?action=toOrder` |  |

## CustomerQuoteItem — `quoteitems`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountID` | integer (int32) |  |
| `BuyersItemIdentification` | string |  |
| `CalculateGrossPriceBasedOnNetPrice` | boolean |  |
| `Comment` | string | max 500 |
| `ContributionMargin` | number (double) |  |
| `ContributionPercent` | number (double) |  |
| `CostPrice` | number (double) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CurrencyCodeID` | integer (int32) |  |
| `CurrencyExchangeRate` | number (double) |  |
| `CustomerQuoteID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `DimensionsID` | integer (int32) |  |
| `Discount` | number (double) |  |
| `DiscountCurrency` | number (double) |  |
| `DiscountPercent` | number (double) |  |
| `ID` | integer (int32) |  |
| `ItemText` | string | max 255 |
| `NumberOfItems` | number (double) |  |
| `OrderLineReference` | string |  |
| `PriceDealItemID` | integer (int32) |  |
| `PriceExVat` | number (double) |  |
| `PriceExVatCurrency` | number (double) |  |
| `PriceIncVat` | number (double) |  |
| `PriceSetByUser` | boolean |  |
| `ProductID` | integer (int32) |  |
| `SortIndex` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `SumCostPrice` | number (double) |  |
| `SumTotalExVat` | number (double) |  |
| `SumTotalExVatCurrency` | number (double) |  |
| `SumTotalIncVat` | number (double) |  |
| `SumTotalIncVatCurrency` | number (double) |  |
| `SumVat` | number (double) |  |
| `SumVatCurrency` | number (double) |  |
| `Unit` | string | max 100 |
| `UnitOfMeasureID` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VatPercent` | number (double) |  |
| `VatTypeID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Dimensions` | Dimensions |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `quoteitems/{id}?action=audit` | query (required) |
| GET | `quoteitems?action=audit` | query (required) |

## Product — `products`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountID` | integer (int32) |  |
| `AverageCost` | number (double) |  |
| `CalculateGrossPriceBasedOnNetPrice` | boolean |  |
| `CostPrice` | number (double) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `DefaultProductCategoryID` | integer (int32) |  |
| `DefaultVatTypeAccountsID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `Description` | string | max 500 |
| `DimensionsID` | integer (int32) |  |
| `ExternalProductNumber` | string | max 50 |
| `ID` | integer (int32) |  |
| `ImageFileID` | integer (int32) |  |
| `ListPrice` | number (double) |  |
| `Name` | string | max 255 |
| `PartName` | string | max 255 |
| `PriceExVat` | number (double) |  |
| `PriceIncVat` | number (double) |  |
| `StatusCode` | integer (int32) | 35001 = Active, 35002 = Discarded, 35003 = Deleted |
| `Type` | integer (int32) | 1 = PStorage, 2 = PHour, 3 = POther, 4 = POrder |
| `Unit` | string | max 100 |
| `UnitOfMeasureID` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `VariansParentID` | integer (int32) |  |
| `VatTypeID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `DefaultVatTypeAccounts` | AccountVatType |
| `Dimensions` | Dimensions |
| `ProductCategoryLinks` | ProductCategoryLink[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| POST | `products/{id}?action=Delete` |  |
| POST | `products/{id}?action=Discard` |  |
| POST | `products/{id}?action=Reactivate` |  |
| GET | `products/{id}?action=audit` | query (required) |
| GET | `products?action=audit` | query (required) |
| PUT | `products?action=bulk-save` |  |
| POST | `products?action=calculateprice` |  |
| GET | `products/{id}?action=first` |  |
| GET | `products?action=get-barnepass-products` |  |
| GET | `products/{id}?action=get-best-price` | customerId (required), date |
| PUT | `products?action=get-best-price` | customerId (required), date |
| GET | `products?action=getnewpartname` |  |
| GET | `products/{id}?action=is-used` |  |
| GET | `products/{id}?action=last` |  |
| GET | `products/{id}?action=next` |  |
| GET | `products/{id}?action=previous` |  |
| PUT | `products?action=save-barnepass-products` |  |
| PUT | `products?action=syncronize-all-products-account` | newAccountID (required), vatTypeID (required) |
| PUT | `products?action=syncronize-all-products-account-with-vat` | newAccountID (required), vatTypeID (required), oldAccountID |
| PUT | `products?action=syncronize-products-account` | oldAccountID (required), newAccountID (required) |
| PUT | `products?action=syncronize-products-account-and-vat-to-standard` | oldAccountId (required) |
| PUT | `products?action=tax-mandatory-product-update` |  |
| GET | `products/{id}?action=transitions` |  |

## Seller — `sellers`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `DefaultDimensionsID` | integer (int32) |  |
| `DefaultOurReference` | boolean |  |
| `Deleted` | boolean |  |
| `EmployeeID` | integer (int32) |  |
| `ID` | integer (int32) |  |
| `Name` | string | max 30 |
| `StatusCode` | integer (int32) |  |
| `TeamID` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UserID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `DefaultDimensions` | Dimensions |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `sellers/{id}?action=audit` | query (required) |
| GET | `sellers?action=audit` | query (required) |
